import '../globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import Providers from '../providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
});
const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['100','200','300','400', '500', '600', '700'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: 'TECH-NEST | Cybersecurity & AI Ethics',
  description: 'Leading organization in cybersecurity consulting and AI ethics training',
  icons: {
    icon: '/logo.png',
  },
};

export default function FrontendRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${poppins.variable} ${inter.className}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
