import type { Metadata } from "next";
import "./globals.css";
import { Layout } from "@/components/layout/Layout";

export const metadata: Metadata = {
  metadataBase: new URL('https://aliento-nextjs.vercel.app'),
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
    url: "https://aliento-nextjs.vercel.app",
    siteName: "Aliento Medical",
    title: "Aliento — Empowering Personal Health",
    description: "Personalised healthcare with cutting-edge technology and genuine compassion.",
    images: [
      {
        url: "/api/og?title=Aliento%20%E2%80%94%20Empowering%20Personal%20Health&description=Personalised%20healthcare%20with%20cutting-edge%20technology%20and%20genuine%20compassion.",
        width: 1200,
        height: 630,
        alt: "Aliento Medical",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aliento — Empowering Personal Health",
    description: "Personalised healthcare with cutting-edge technology and genuine compassion.",
    images: ["/api/og?title=Aliento%20%E2%80%94%20Empowering%20Personal%20Health&description=Personalised%20healthcare%20with%20cutting-edge%20technology%20and%20genuine%20compassion."],
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
