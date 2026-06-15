import type { Metadata } from "next";
import { Syne, Space_Mono, Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import { ProjectProvider } from "@/context/ProjectContext";
import { KeyboardShortcut } from "@/components/KeyboardShortcut";
import Navbar from "@/components/Navbar";
import { CustomCursor } from "@/components/CustomCursor";
import "./globals.css";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-serif",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "anshul.space",
  description: "Creative portfolio of Anshul - films, music, and software.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${syne.variable} ${spaceMono.variable} ${newsreader.variable} ${jakarta.variable} font-sans antialiased bg-bg-primary text-text-primary min-h-screen`}
      >
        <ProjectProvider>
          <CustomCursor />
          <KeyboardShortcut />
          <Navbar />
          {children}
        </ProjectProvider>
      </body>
    </html>
  );
}
