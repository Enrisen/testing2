import type { Metadata } from 'next';
// Removed: import { GeistSans } from 'geist/font/sans';
// Removed: import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

// Removed: const geistSans = GeistSans;
// Removed: const geistMono = GeistMono;

export const metadata: Metadata = {
  title: 'FileSage',
  description: 'A simple file manager with folder and file display capabilities.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
