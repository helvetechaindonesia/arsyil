import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toast } from "@/components/ui/Toast";
import { EscapeHandler } from "@/components/ui/EscapeHandler";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ARSYIL | Minimalist Luxury Collection",
  description: "Defining the future of minimalist luxury. Discover our premium essentials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
        <Footer />
        <Toast />
        <EscapeHandler />
      </body>
    </html>
  );
}
