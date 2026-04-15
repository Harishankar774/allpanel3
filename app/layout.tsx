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
       <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0b0e14" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "system-ui, Arial, Helvetica, sans-serif",
          background: "#0b0e14",
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
