import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GitReadme | AI-Powered README Generator",
  description: "Transform your GitHub repositories into professional, comprehensive documentation with AI. Generate stunning README files in seconds.",
  keywords: ["readme generator", "github", "documentation", "ai", "markdown", "developer tools"],
  authors: [{ name: "GitReadme" }],
  openGraph: {
    title: "GitReadme | AI-Powered README Generator",
    description: "Transform your GitHub repositories into professional, comprehensive documentation with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
