import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import content from "@/content.json";
import "./globals.css";

export const metadata: Metadata = {
  title: `${content.profile.name} · ${content.profile.role}`,
  description: content.profile.headline,
  applicationName: content.profile.name,
  authors: [{ name: content.profile.name }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1a" },
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
  ],
};

// Applies a stored theme choice before first paint (inline, no network).
const themeInit = `(function(){try{var t=localStorage.getItem('hk-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="./icon.svg" type="image/svg+xml" />
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
