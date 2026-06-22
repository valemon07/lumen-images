import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
//import "@mantine/core/styles.css";
import "./ui/globals.css";

// import {
//   ColorSchemeScript,
//   MantineProvider,
//   mantineHtmlProps,
// } from "@mantine/core";
import { cn } from "@/lib/utils";

import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumen",
  description: "A photo collection app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
      // {...mantineHtmlProps}
    >
      <head>{/*<ColorSchemeScript />*/}</head>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/*<MantineProvider>{children}</MantineProvider>*/}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
