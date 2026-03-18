import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Layout } from "@/components/layout/Layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Aliento — Empowering Personal Health",
    template: "%s | Aliento Medical",
  },
  description:
    "Aliento provides personalised healthcare with cutting-edge technology and genuine compassion. Book your consultation today.",
  keywords: ["healthcare", "medical", "personalised medicine", "South Africa"],
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: "Aliento Medical",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
