import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Higher Image Hair Studio — Dashboard',
  description: 'Owner portal for Higher Image Hair Studio',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-zinc-950">{children}</body>
    </html>
  );
}
