import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";
import Header from "./_sections/Header";
import { paperlogy } from "./font";
import AuthProvider from "@/components/AuthProvider";
import RecentPosts from "./_components/RecentPosts";

export const metadata: Metadata = {
  title: "leejihyeon.dev | 이지현.개발",
  description: "프론트엔드 개발자 블로그",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${paperlogy.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bitcount+Prop+Single&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.boxicons.com/fonts/basic/boxicons.min.css"
          rel="stylesheet"
        />
        <link
          href="https://cdn.boxicons.com/fonts/brands/boxicons-brands.min.css"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="antialiased bg-neutral-50 dark:bg-neutral-900 transition-colors duration-150">
        <QueryProvider>
          <AuthProvider>
            <Header />
            {children}
            <RecentPosts />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
