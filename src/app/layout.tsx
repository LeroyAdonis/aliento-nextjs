import type { Metadata } from "next";
import "./globals.css";
import { Layout } from "@/components/layout/Layout";

export const metadata: Metadata = {
  title: {
    default: "Aliento — Empowering Personal Health",
    template: "%s | Aliento Medical",
  },
  description:
    "Aliento provides personalised healthcare with cutting-edge technology and genuine compassion. Book your consultation today.",
  keywords: ["healthcare", "medical", "personalised medicine", "South Africa"],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: "Aliento Medical",
    title: "Aliento — Empowering Personal Health",
    description: "Personalised healthcare with cutting-edge technology and genuine compassion.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
