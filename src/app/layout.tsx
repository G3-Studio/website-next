'use client';
import './globals.css';
import 'prismjs/themes/prism-tomorrow.css';
import { Oxygen, Montserrat, Roboto_Mono } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className={`${montserrat.variable} ${roboto_mono.variable}`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
