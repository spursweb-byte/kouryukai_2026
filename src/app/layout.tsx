import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "【第6回】完全無料 SES交流会 | 共同主催：㈱Purgatoria / Spurs㈱",
  description: "共同主催：㈱Purgatoria / Spurs㈱による、SES営業向けの名刺交換会（交流会）の特設エントリーページです。2026年12月14日(月) 13:00より渋谷にて開催いたします。",
  keywords: ["SES", "SES交流会", "名刺交換会", "IT営業", "Spurs株式会社", "株式会社PURGATORIA", "エンジニア採用", "ビジネスパートナー開発"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}

