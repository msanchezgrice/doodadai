import * as React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RoastMyVideo - AI Video Commentary',
  description: 'Generate hilarious AI commentary for any video',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900 text-white">
        <main className="min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
} 