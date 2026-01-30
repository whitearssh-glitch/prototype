import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SELFit - 스피킹 학습",
  description: "초등학생용 스피킹 학습 앱 SELFit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-[#FFF5F7] antialiased">
        {children}
      </body>
    </html>
  );
}
