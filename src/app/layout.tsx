import type { Metadata } from "next";
import { CartProvider } from '@/context/cartcontext';
import { CartDrawerGlobal } from '@/components/CartDrawerGlobal';
import { Geist, Geist_Mono } from "next/font/google";
import { Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Kronik.Streetwear",
  description: 'Koleksi streetwear dengan bahan tebal, potongan longgar, dan produksi terbatas'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <CartProvider>
          {children}
          <CartDrawerGlobal />
        </CartProvider>
      </body>
    </html>
  );
}

