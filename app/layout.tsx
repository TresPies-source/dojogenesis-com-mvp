import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dojo Genesis - Think by Collecting Perspectives",
  description: "Dojo Genesis helps you think by collecting perspectives before solutions. Bring a real situation. Add 3 lenses. Get a clean next move.",
  keywords: ["perspectives", "decision making", "thinking tools", "AI assistant", "ChatKit"],
  authors: [{ name: "Dojo Genesis" }],
  openGraph: {
    title: "Dojo Genesis - Think by Collecting Perspectives",
    description: "Dojo Genesis helps you think by collecting perspectives before solutions. Bring a real situation. Add 3 lenses. Get a clean next move.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
