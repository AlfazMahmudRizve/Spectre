import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SPECTRE | The Ultimate Mechanical Keyboard',
  description: 'Precision engineered. Gasket mounted. Zero-gravity acoustics. Experience the Spectre One.',
  keywords: ['mechanical keyboard', 'spectre', 'gaming', 'premium keyboard'],
  openGraph: {
    title: 'SPECTRE | The Ultimate Mechanical Keyboard',
    description: 'Precision engineered. Gasket mounted. Zero-gravity acoustics.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="no-scrollbar">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-inter bg-spectre-black text-white antialiased selection:bg-spectre-cyan selection:text-black`}>
        <SmoothScroll>
          <main className="min-h-screen flex flex-col justify-between">
            {children}
          </main>
        </SmoothScroll>
      </body>
    </html>
  );
}
