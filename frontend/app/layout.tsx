import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'G-Articles',
  description: 'Articles platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground">{children}</body>
    </html>
  );
}
