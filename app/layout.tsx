import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MYCELIUM",
  description: "Spread underground. Influence the surface. An idle game of fungal domination.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
