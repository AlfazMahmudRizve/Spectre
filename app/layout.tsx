import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import { SoundProvider } from '@/components/SoundManager';
import CartDrawer from '@/components/CartDrawer';
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
  title: 'SPECTRE | The Ultimate Mechanical Keyboard',
  description: 'Precision engineered. Gasket mounted. Zero-gravity acoustics. Experience the Spectre One.',
  keywords: ['mechanical keyboard', 'spectre', 'gaming', 'premium keyboard'],
  openGraph: {
    title: 'SPECTRE | The Ultimate Mechanical Keyboard',
    description: 'Precision engineered. Gasket mounted. Zero-gravity acoustics.',
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
}: Readonly<{ // Changed type definition for children
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
            <CartDrawer />
            <SmoothScroll>
              {children}
            </SmoothScroll>
          </SoundProvider>
        </Providers>
      </body>
    </html>
  );
}
