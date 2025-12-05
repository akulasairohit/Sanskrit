import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Sanskrit",
  description: "AI-powered Sanskrit Agent with Vedic Knowledge Base. Translate, analyze grammar, and explore authentic Vedic texts.",
  keywords: ["Sanskrit", "Vedic", "Translation", "Grammar", "AI", "Upanishads", "Bhagavad Gita"],
  openGraph: {
    title: "Sanskrit",
    description: "AI-powered Sanskrit Agent with Vedic Knowledge Base",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanskrit",
    description: "AI-powered Sanskrit Agent with Vedic Knowledge Base",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
