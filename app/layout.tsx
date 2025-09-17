import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/app/theme-provider';
import { AppHeader } from '@/components/app/app-header';
import { AppFooter } from '@/components/app/app-footer';
import { Toaster } from '@/components/ui/sonner';

import '@/app/globals.css';
import '@/app/highlight.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'R7 CODE',
  description: 'to promote u code skill!',
  openGraph: {
    title: 'R7 CODE',
    description: 'to promote u code skill',
    images: 'https://i.ytimg.com/vi/WmjDT_EA3zE/maxresdefault.jpg',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
        `}
      >
        <ThemeProvider
          defaultTheme="dark"
          attribute="class"
        >
          <div className="flex w-svw flex-1 flex-col">
            <AppHeader />
            <div className="mt-16 flex min-h-svh flex-col">
              {children}
              <Toaster />
            </div>
            <AppFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
