import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Budget Dashboard',
  description: 'Household budget tracking with receipt OCR and Google Sheets integration',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body>{children}</body>
    </html>
  );
}
