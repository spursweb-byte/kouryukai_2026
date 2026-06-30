import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendConfirmationEmail } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, salesName, email, deliveryEmail, resourceStatus, note } = body;

    // 必須入力のバリデーション (deliveryEmailは任意に変更)
    if (!companyName || !salesName || !email || !resourceStatus) {
      return NextResponse.json(
        { error: '必須項目が入力されていません。' },
        { status: 400 }
      );
    }

    const trimmedCompanyName = companyName.trim();
    const trimmedSalesName = salesName.trim();

    // 無断キャンセルブラックリストの定義
    const BLACKLIST_COMPANIES = [
      'アポロ株式会社',
      '株式会社FunClouck',
      'ネクストフィールド株式会社',
      'ジャパン株式会社',
      '株式会社エル・フィールド',
      '株式会社GCJ',
      '株式会社ジェイテック'
    ];

    const BLACKLIST_SALES = [
      'あべ松優人'
    ];

    // ブラックリストに合致した場合は丁重にお断りする
    if (
      BLACKLIST_COMPANIES.includes(trimmedCompanyName) ||
      BLACKLIST_SALES.includes(trimmedSalesName)
    ) {
      return NextResponse.json(
        { 
          error: '誠に恐れ入りますが、以前開催した交流会で無断キャンセルとなっていたため交流会の参加をお断りしております。参加予定の営業様が異なる場合は「support@spurs-inc.com」へ直接ご連絡いただきますようお願いします。', 
          code: 'BLACKLISTED' 
        },
        { status: 403 }
      );
    }

    // データベースのトランザクション処理
    const registration = await prisma.$transaction(async (tx) => {
      // 1. 同一会社名のエントリーが既に存在するかチェック（キャンセル済みを除く）
      const existing = await tx.registration.findFirst({
        where: {
          companyName: {
            equals: trimmedCompanyName,
          },
          status: {
            in: ['CONFIRMED', 'WAITLIST'],
          },
        },
      });

      if (existing) {
        throw new Error('DUPLICATE_COMPANY');
      }

      // 2. 現在の確定（CONFIRMED）人数をカウント
      const confirmedCount = await tx.registration.count({
        where: { status: 'CONFIRMED' },
      });

      // 65名未満なら参加確定、65名以上ならキャンセル待ち
      const status = confirmedCount < 65 ? 'CONFIRMED' : 'WAITLIST';

      // 3. 一旦ダミーのエントリーNoで登録を作成してIDを確保（同時アクセス時の重複回避）
      const tempReg = await tx.registration.create({
        data: {
          entryNo: `TEMP-${Date.now()}-${Math.random()}`,
          companyName: trimmedCompanyName,
          salesName: trimmedSalesName,
          email,
          deliveryEmail: deliveryEmail || '', // 未入力時は空文字で保存
          resourceStatus,
          note: note || null,
          status,
          attended: false,
        },
      });

      // 4. 自動生成された一意の id をもとに、重複しないエントリーNoを生成
      const entryNo = `SES-${String(tempReg.id).padStart(3, '0')}`;

      // 5. 正式なエントリーNoに更新
      return await tx.registration.update({
        where: { id: tempReg.id },
        data: { entryNo },
      });
    });

    // Vercel(サーバーレス)環境ではレスポンス返却後にプロセスが一時停止するため、
    // 確実にメール送信を待ってからレスポンスを返すように await を追加します。
    await sendConfirmationEmail({
      email: registration.email,
      salesName: registration.salesName,
      companyName: registration.companyName,
      entryNo: registration.entryNo,
      status: registration.status as 'CONFIRMED' | 'WAITLIST',
    }).catch((err) => {
      console.error('Failed to send confirmation email:', err);
    });

    return NextResponse.json({
      success: true,
      data: {
        entryNo: registration.entryNo,
        status: registration.status,
        companyName: registration.companyName,
        salesName: registration.salesName,
      },
    });

  } catch (error: any) {
    if (error.message === 'DUPLICATE_COMPANY') {
      return NextResponse.json(
        { error: 'ご入力いただいた会社名はすでにエントリー済みです。\n一社につき1エントリー制となっております。', code: 'DUPLICATE_COMPANY' },
        { status: 409 }
      );
    }
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: 'お申し込み処理中にエラーが発生しました。時間をおいて再度お試しください。' },
      { status: 500 }
    );
  }
}
