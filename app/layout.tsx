import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dojo Genesis - Think by Collecting Perspectives",
  description: "Dojo Genesis helps you think by collecting perspectives before solutions. Bring a real situation. Add 3 lenses. Get a clean next move.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
