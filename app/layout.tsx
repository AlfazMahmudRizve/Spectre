import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import { SoundProvider } from '@/components/SoundManager';
import CartSidebar from '@/components/CartSidebar';
import Providers from '@/components/Providers';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SPECTRE | High-Performance Commerce Interface',
  description: 'A cinematic e-commerce experience built with Agentic AI. Precision-engineered product sequences, immersive scrolling, and a command-center admin dashboard.',
  keywords: ['spectre', 'mechanical keyboard', 'headset', 'gaming', 'premium', 'agentic ai', 'alfaz mahmud rizve'],
  openGraph: {
    title: 'SPECTRE | High-Performance Commerce Interface',
    description: 'Precision-engineered. Scroll-driven cinema. Zero-gravity acoustics.',
    type: 'website',
  },
  authors: [{ name: 'Alfaz Mahmud Rizve', url: 'https://whoisalfaz.me' }],
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} font-inter bg-black text-white antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <Providers>
          <SoundProvider>
            <CartSidebar />
            <SmoothScroll>
              {children}
            </SmoothScroll>
          </SoundProvider>
        </Providers>
      </body>
    </html>
  );
}
