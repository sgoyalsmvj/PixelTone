import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Creative Studio',
  description: 'Generate art and music through natural language',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}