import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "F3 Bible Study",
  description: "Simple mobile-first discussion board and Bible study for F3 men",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "F3 Study",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased selection:bg-black selection:text-white">
        <AuthGuard>
          <div className="min-h-screen pb-16">
            {children}
          </div>
          <BottomNav />
        </AuthGuard>
      </body>
    </html>
  );
}