import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ProjectProvider } from "@/context/ProjectContext";
import { KeyboardShortcut } from "@/components/KeyboardShortcut";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "anshul.space",
  description: "Personal portfolio dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased bg-bg-primary text-text-primary min-h-screen`}
      >
        <ProjectProvider>
          <KeyboardShortcut />
          {children}
        </ProjectProvider>
      </body>
    </html>
  );
}
