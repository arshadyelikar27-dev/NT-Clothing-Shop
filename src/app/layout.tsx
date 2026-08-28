import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { StoreLayoutWrapper } from "@/components/layout/StoreLayoutWrapper";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NOBLE TEXTILE — Quality Fabrics & Clothing | Latur, Maharashtra",
  description:
    "Shop quality fabrics, sarees, dress materials, kurtis, and menswear at NOBLE TEXTILE, Hatte Nagar, Latur, Maharashtra. Carefully selected textiles for every occasion.",
  keywords:
    "noble textile, latur, clothing store, fabrics, sarees, dress materials, kurtis, menswear, Maharashtra, Indian textiles",
  openGraph: {
    title: "NOBLE TEXTILE — Quality Fabrics & Clothing",
    description:
      "Carefully selected fabrics and clothing for every occasion. Visit our store in Hatte Nagar, Latur or shop online.",
    type: "website",
    locale: "en_IN",
    siteName: "NOBLE TEXTILE",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body>
        <StoreLayoutWrapper>{children}</StoreLayoutWrapper>
      </body>
    </html>
  );
}

