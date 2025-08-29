// app/providers.tsx
"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (        
    <SessionProvider>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <Toaster />
    </SessionProvider>
  );
}