import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Canadian Satellite Viz",
  description:
    "Visualize Canadian satellites in orbit with real-time conjunction analysis",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
      <Analytics />
    </html>
  );
}
