import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechNest",
  description: "TechNest is a platform for tech enthusiasts to learn and share their knowledge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="fixed inset-0 bg-primaryGrey -z-20" />
        <div className="fixed inset-0 h-1/3 bg-primaryBlue -z-10" />
        <div className="min-h-screen p-7">
          <div className="flex gap-7 relative">
            <Sidebar />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </div>
        {/* <div className="flex mx-auto p-7 relative bg-primaryGrey">
          <Sidebar/>
          {children}
        </div> */}
        {/* <div className="absolute h-full top-0 w-full bg-primaryGrey -z-30"></div>
        <div className="absolute h-1/3 top-0 w-full bg-primaryBlue -z-10"></div> */}
        
      </body>
    </html>
  );
}
