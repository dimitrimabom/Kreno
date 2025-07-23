import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { EdgeStoreProvider } from "../lib/edgestore";

export const metadata: Metadata = {
  title: "Kreno",
  description: "La réservation, en toute simplicité",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body className={`antialiased`}>
        <EdgeStoreProvider>{children}</EdgeStoreProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
