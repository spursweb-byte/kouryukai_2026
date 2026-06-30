import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SES交流会・名刺交換会 | Spurs株式会社主催",
  description: "Spurs株式会社が主催する、SES営業向けの名刺交換会（交流会）の特設エントリーページです。2026年7月27日(月) 13:30より渋谷にて開催いたします。",
  keywords: ["SES", "SES交流会", "名刺交換会", "IT営業", "Spurs株式会社", "エンジニア採用", "ビジネスパートナー開発"],
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

