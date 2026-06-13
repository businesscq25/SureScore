import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Clarinq — Buy with Clarity',
  description:
    'AI-powered electronics buying assistant for India. No ads, no sponsored results. Zero bias. Ever.',
  keywords: ['electronics', 'buying guide', 'India', 'AI', 'no ads'],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
