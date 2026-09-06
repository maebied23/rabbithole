import type { Metadata } from "next";
import "@xyflow/react/dist/style.css";
import "./globals.css";
export const metadata: Metadata = {
  title: "RabbitHole — Follow your curiosity",
  description:
    "Explore black holes, spacetime, and the ideas that connect them. A source-backed journey, no prompt needed.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
