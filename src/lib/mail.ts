import nodemailer from 'nodemailer';

interface MailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendMail(options: MailOptions): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true';
  const from = process.env.FROM_EMAIL || 'support@spurs-inc.com';

  console.log(`[Mail Send Request] to: ${options.to}, subject: ${options.subject}`);

  // SMTP情報が不足している場合は、開発環境とみなしてコンソールに出力する
  if (!host || !user || !pass) {
    console.warn('⚠️ SMTP environment variables (SMTP_HOST, SMTP_USER, SMTP_PASS) are not fully configured. Email was not sent via SMTP.');
    console.log('----- EMAIL CONTENT START -----');
    console.log(`From: ${from}`);
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body (Text):\n${options.text}`);
    if (options.html) {
      console.log(`Body (HTML):\n${options.html}`);
    }
    console.log('----- EMAIL CONTENT END -----');
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from: `"Spurs株式会社 交流会運営事務局" <${from}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log(`✅ Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send email via nodemailer:', error);
    // メール送信の成否でアプリケーションのメイン処理（DB登録など）がロールバックしないよう、
    // ここではエラーをスローせず false を返します。
    return false;
  }
}

/**
 * 登録完了メールを送信する
 */
export async function sendConfirmationEmail(data: {
  email: string;
  salesName: string;
  companyName: string;
  entryNo: string;
  status: 'CONFIRMED' | 'WAITLIST';
}): Promise<boolean> {
  const from = process.env.FROM_EMAIL || 'support@spurs-inc.com';
  const isConfirmed = data.status === 'CONFIRMED';
  
  const subject = isConfirmed 
    ? `【受付完了】SES交流会（名刺交換会）のエントリーNo.送付（No.${data.entryNo}）`
    : `【キャンセル待ち受付完了】SES交流会（名刺交換会）エントリーのお知らせ`;

  const statusText = isConfirmed 
    ? `お申し込みが完了し、参加確定（定員内）となりました。\n当日はエントリーNo.「${data.entryNo}」を受付にてご提示ください。`
    : `現在、定員（65名）に達しているため「キャンセル待ち」として受付いたしました。\nキャンセルが発生し、繰り上げ参加が可能となりましたら、改めてメールにてご連絡いたします。`;

  const text = `${data.companyName}\n${data.salesName} 様\n\nこの度は、Spurs株式会社主催の「SES交流会（名刺交換会）」にお申し込みいただき誠にありがとうございます。\n\n${statusText}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n■ 開催概要\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n【日時】2026年7月27日（月）\n　　　　13:15 開場 / 受付開始\n　　　　13:30 開始\n　　　　14:45 終了\n\n【会場】\n　〒150-0002\n　東京都渋谷区渋谷2-22-6 幸和ビル4階\n\n【持ち物】\n　・名刺 60枚程度（受付にて1枚ご提出いただきます）\n\n【参加費】\n　無料\n\n【エントリーNo】\n　${data.entryNo}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n■ 主催企業情報\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSpurs株式会社\n公式サイト: https://spurs-inc.com/\nお問い合わせ先: support@spurs-inc.com\n\n※当日のキャンセルや遅刻などのご連絡は、本メールへの返信または上記アドレスまでお願いいたします。\n皆様のご来場を心よりお待ちしております。\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

  const html = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(135deg, #1b3a4b 0%, #2e6f40 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 1px;">SES交流会（名刺交換会）</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">Spurs株式会社 主催</p>
      </div>
      <div style="padding: 30px; background-color: #ffffff;">
        <p style="font-size: 16px; font-weight: bold; margin-bottom: 20px;">${data.companyName}<br>${data.salesName} 様</p>
        <p>この度は、Spurs株式会社主催の「SES交流会（名刺交換会）」にお申し込みいただき、誠にありがとうございます。</p>
        
        <div style="margin: 25px 0; padding: 20px; background-color: ${isConfirmed ? '#eef9f0' : '#fff9eb'}; border-left: 4px solid ${isConfirmed ? '#2e6f40' : '#f5a623'}; border-radius: 4px;">
          <p style="margin: 0; font-weight: bold; color: ${isConfirmed ? '#2e6f40' : '#d28000'}; font-size: 16px;">
            ${isConfirmed ? '🎉 参加が確定いたしました' : '⏳ キャンセル待ちとして受付いたしました'}
          </p>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #555;">
            ${statusText.replace(/\n/g, '<br>')}
          </p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 25px; font-size: 14px;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold; color: #666; width: 120px;">エントリーNo</td>
            <td style="padding: 10px 0; font-weight: bold; font-size: 16px; color: #1b3a4b;">${data.entryNo}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold; color: #666;">日時</td>
            <td style="padding: 10px 0;">2026年7月27日（月） 13:30〜14:45 <span style="font-size: 12px; color: #888;">(13:15開場)</span></td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold; color: #666;">会場</td>
            <td style="padding: 10px 0;">
              〒150-0002 東京都渋谷区渋谷2-22-6 幸和ビル4階<br>
              <a href="https://maps.google.com/?q=東京都渋谷区渋谷2-22-6+幸和ビル" target="_blank" style="color: #2e6f40; text-decoration: none; font-size: 12px;">🗺️ Googleマップで開く</a>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold; color: #666;">持ち物</td>
            <td style="padding: 10px 0;">名刺 60枚程度 <span style="font-size: 12px; color: #888;">(受付にて1枚ご提出いただきます)</span></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #666;">参加費</td>
            <td style="padding: 10px 0; color: #2e6f40; font-weight: bold;">無料</td>
          </tr>
        </table>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 13px; color: #777;">
          <p style="margin: 0 0 5px 0; font-weight: bold; color: #333;">主催：Spurs株式会社</p>
          <p style="margin: 0 0 5px 0;">公式サイト: <a href="https://spurs-inc.com/" target="_blank" style="color: #1b3a4b; text-decoration: none;">https://spurs-inc.com/</a></p>
          <p style="margin: 0;">お問い合わせ: <a href="mailto:${from}" style="color: #1b3a4b; text-decoration: none;">${from}</a></p>
        </div>
      </div>
      <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee;">
        ※本メールは送信専用です。当日のキャンセル・遅刻等は、上記お問い合わせ先まで直接ご連絡ください。
      </div>
    </div>
  `;

  return sendMail({
    to: data.email,
    subject,
    text,
    html,
  });
}
