import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// パスワード検証用の共通ヘルパー
function verifyPassword(request: Request): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || 'spr1232';
  const requestPassword = request.headers.get('x-admin-password');
  return requestPassword === adminPassword;
}

// 1. 管理画面データ（一覧と集計）の取得
export async function GET(request: Request) {
  if (!verifyPassword(request)) {
    return NextResponse.json({ error: '認証エラー: パスワードが正しくありません。' }, { status: 401 });
  }

  try {
    // 参加者一覧の取得（ID順）
    const registrations = await prisma.registration.findMany({
      orderBy: { id: 'asc' },
    });

    // 各ステータスの集計
    const totalRegistrations = await prisma.registration.count({
      where: { status: { in: ['CONFIRMED', 'WAITLIST'] } }, // キャンセルを除く申込数
    });

    const attendedCount = await prisma.registration.count({
      where: { attended: true, status: { in: ['CONFIRMED', 'WAITLIST'] } }, // 来場数
    });

    const confirmedCount = await prisma.registration.count({
      where: { status: 'CONFIRMED' }, // 参加予定人数
    });

    const waitlistCount = await prisma.registration.count({
      where: { status: 'WAITLIST' }, // キャンセル待ち数
    });

    return NextResponse.json({
      success: true,
      data: {
        registrations,
        stats: {
          totalRegistrations,
          attendedCount,
          confirmedCount,
          waitlistCount,
        },
      },
    });
  } catch (error) {
    console.error('Admin GET error:', error);
    return NextResponse.json({ error: 'データ取得中にエラーが発生しました。' }, { status: 500 });
  }
}

// 2. 来場トグル、ステータス変更、およびテストデータ削除
export async function POST(request: Request) {
  if (!verifyPassword(request)) {
    return NextResponse.json({ error: '認証エラー: パスワードが正しくありません。' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    // A. 来場確認トグル
    if (action === 'toggle-attendance') {
      const { id, attended } = body;
      if (id === undefined || attended === undefined) {
        return NextResponse.json({ error: 'パラメータが不足しています。' }, { status: 400 });
      }

      const updated = await prisma.registration.update({
        where: { id: Number(id) },
        data: { attended: Boolean(attended) },
      });

      return NextResponse.json({ success: true, data: updated });
    }

    // B. ステータス変更（確定 / キャンセル待ち / キャンセル）
    if (action === 'update-status') {
      const { id, status } = body;
      if (id === undefined || !status) {
        return NextResponse.json({ error: 'パラメータが不足しています。' }, { status: 400 });
      }

      const updated = await prisma.registration.update({
        where: { id: Number(id) },
        data: { status: String(status) },
      });

      // キャンセルされた場合は、来場フラグもオフにする
      if (status === 'CANCELLED' && updated.attended) {
        await prisma.registration.update({
          where: { id: Number(id) },
          data: { attended: false },
        });
      }

      return NextResponse.json({ success: true, data: updated });
    }

    // C. テストデータ一括削除
    if (action === 'delete-test-data') {
      // 登録データをすべて削除
      const deleteResult = await prisma.registration.deleteMany();

      // 自動インクリメントカウンター（シーケンス）をリセットする
      try {
        // SQLite用のリセット処理
        await prisma.$executeRawUnsafe(`DELETE FROM sqlite_sequence WHERE name = 'Registration'`);
      } catch (sqliteErr) {
        try {
          // PostgreSQL用のリセット処理 (本番Vercel環境用)
          await prisma.$executeRawUnsafe(`ALTER SEQUENCE "Registration_id_seq" RESTART WITH 1`);
        } catch (pgErr) {
          console.error('Failed to reset sequence:', pgErr);
        }
      }

      return NextResponse.json({
        success: true,
        message: `テストデータを一括削除し、エントリーNo.を初期化しました。(${deleteResult.count}件のレコードが削除されました)`,
      });
    }

    return NextResponse.json({ error: '無効なアクションです。' }, { status: 400 });

  } catch (error) {
    console.error('Admin POST error:', error);
    return NextResponse.json({ error: 'リクエストの処理中にエラーが発生しました。' }, { status: 500 });
  }
}
