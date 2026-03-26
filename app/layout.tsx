import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "AllPanel - Best Online Betting Exchange",
  description: "Cricket, Football, Tennis Live Betting",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "Arial, Helvetica, sans-serif",
          background: "#f1f5f9",
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
