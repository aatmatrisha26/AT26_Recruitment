import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AT'26 Recruitments — Aatmatrisha 2026",
  description: "Join the Aatmatrisha 2026 team. Apply to domains, get interviewed, and be part of something legendary.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#0F0F11" />
      </head>
      <body className="antialiased min-h-screen noise-overlay">
        {children}
      </body>
    </html>
  );
}
