import type { Metadata } from "next";
import { Kumbh_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Header from "./components/header-section/Header";
import { ViewProvider } from "@/contexts/ViewContext";
import BlobityProvider from "./components/BlobityProvider";
import StructuredData from "./components/StructuredData";

const kumbhSans = Kumbh_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shourya Mishra | Software Developer",
  description:
    "Software Developer specializing in Java backend systems, GenAI integrations, and AWS cloud solutions. Experienced in building scalable APIs, AI-powered automation, and intelligent backend applications.",
  keywords: [
    "Shourya Mishra",
    "software developer",
    "java developer",
    "backend developer",
    "spring boot",
    "genai",
    "llm integration",
    "ai backend",
    "aws developer",
    "cloud native applications",
    "rest api",
    "java portfolio",
    "software engineer portfolio",
  ],
  authors: [{ name: "Shourya Mishra" }],
  creator: "Shourya Mishra",
  metadataBase: new URL("https://shouryamishra.site"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Shourya Mishra | Software Developer",
    description:
      "Software Developer focused on Java backend engineering, GenAI-powered systems, and AWS-based cloud infrastructure. Building scalable, intelligent, production-ready applications.",
    url: "https://shouryamishra.site",
    siteName: "Shourya Mishra Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Shourya Mishra | Software Developer",
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shourya Mishra | Software Developer",
    description:
      "Java-focused Software Developer working on GenAI integrations and AWS-powered backend systems.",
    images: ["/og-image.png"],
    creator: "@shauryamishra_",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  category: "technology",
  verification: {
    google: "your-google-verification-code", // Add this after Google Search Console setup
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body className={`${kumbhSans.className}`}>
        <ViewProvider>
          <BlobityProvider>
            <Header />
            <div className="max-w-[90%] xl:max-w-[1223px] w-full mx-auto">
              {children}
            </div>
          </BlobityProvider>
        </ViewProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
