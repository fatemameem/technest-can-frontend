import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { MobileMenuProvider } from "@/common/MobileMenuContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechNest Canada",
  description: "TechNest is a platform for tech enthusiasts to learn and share their knowledge.",
  viewport: "width=device-width, initial-scale=1",
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
        <MobileMenuProvider>
          <div className="fixed inset-0 bg-primaryGrey -z-20" />
          <div className="fixed inset-0 h-1/3 bg-primaryBlue -z-10" />
          <div className="min-h-screen p-1.5 sm:p-2 md:p-3 lg:p-4">
            <div className="flex flex-col lg:flex-row gap-2 lg:gap-3 xl:gap-4 relative">
              <Sidebar />
              <main className="flex-1 w-full md:px-4 lg:px-6">
                {children}
              </main>
            </div>
          </div>
        </MobileMenuProvider>
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
