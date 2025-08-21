import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MultiModelLab — MVP',
  description: 'Ask once, compare answers from multiple AIs side-by-side.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
