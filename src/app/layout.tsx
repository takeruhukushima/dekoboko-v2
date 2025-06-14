import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navigation } from "@/components/ui/navbar";
import { Toaster } from "@/components/ui/toaster";

// フォントの設定
const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// ページメタデータ
export const metadata: Metadata = {
  title: "Dekoboko",
  description: "Dekoboko",
};

// ルートレイアウト
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        <main className="container mx-auto py-8">{children}</main>

        <footer className="bg-gray-800 text-white text-center p-4 w-screen fixed bottom-0">
          <p> 2025 Dekoboko App. All Rights Reserved.</p>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
