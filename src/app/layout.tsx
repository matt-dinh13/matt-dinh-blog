import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import CookieConsentBanner from '@/components/CookieConsentBanner'

// Force dynamic rendering to prevent static generation issues with Supabase
export const dynamic = 'force-dynamic'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Matt Dinh Blog",
  description: "Personal blog sharing insights about life, work, and knowledge. Portfolio showcasing IT projects and career highlights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo-square.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo-square.jpg" type="image/jpeg" />
        {/* hreflang tags for SEO */}
        <link rel="alternate" href="https://mattdinh.com/vi" hrefLang="vi" />
        <link rel="alternate" href="https://mattdinh.com/en" hrefLang="en" />
        <link rel="alternate" href="https://mattdinh.com" hrefLang="x-default" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <div className="flex flex-col min-h-screen">
          <LanguageProvider>
            <AuthProvider>
              {children}
              <CookieConsentBanner />
            </AuthProvider>
          </LanguageProvider>
        </div>
      </body>
    </html>
  );
}
