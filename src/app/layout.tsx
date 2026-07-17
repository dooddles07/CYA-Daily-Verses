import type { Metadata, Viewport } from "next";
import { Lora, Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { Footer } from "@/components/footer";
import { BottomNav } from "@/components/bottom-nav";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  // TODO: change to the real production domain before deploying
  metadataBase: new URL("https://cya-daily-verse.vercel.app"),
  title: {
    default: "CYA Daily Verse — God's Word, Every Morning",
    template: "%s · CYA Daily Verse",
  },
  description:
    "Christ's Youth in Action. Build a daily habit of reading God's Word with beautiful daily verses, devotionals, reading plans, and a praying community. Kay Kristo Buong Buhay, Habambuhay!",
  applicationName: "CYA Daily Verse",
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "CYA Daily Verse — God's Word, Every Morning",
    description:
      "Daily verses, devotionals, reading plans, and a praying youth community.",
    type: "website",
    siteName: "CYA Daily Verse",
    images: ["/media/cya-logo.png"],
  },
  twitter: {
    card: "summary",
    title: "CYA Daily Verse",
    description: "God's Word, every morning.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0095ff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${lora.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white"
        >
          Skip to content
        </a>
        <Providers>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
