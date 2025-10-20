// app/layout.tsx
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/layout/whatsAppButton";
import type { Metadata, Viewport } from "next";
import { Poppins, Playfair_Display } from "next/font/google";

/* ---- GOOGLE FONTS ---- */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-playfair",
  preload: true,
});

/* ---- VIEWPORT CONFIG ---- */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111827",
  colorScheme: "light",
};

/* ---- SEO METADATA ---- */
export const metadata: Metadata = {
  title: {
    default: "Nazmi Boutique | Premium Traditional & Western Wear",
    template: "%s | Nazmi Boutique",
  },
  description:
    "Discover elegant fashion blending traditional Kerala craftsmanship with contemporary western styles. Premium quality sarees, kurtis, dresses, and officewear for the modern woman.",
  keywords: [
    "Nazmi Boutique",
    "Premium Fashion",
    "Traditional Wear",
    "Western Wear",
    "Kerala Boutique",
    "Women's Clothing",
    "Ethnic Fashion",
    "Designer Wear",
    "Sarees",
    "Kurtis",
    "Dresses",
    "Officewear"
  ],
  authors: [{ name: "Nazmi Boutique" }],
  creator: "Nazmi Boutique",
  publisher: "Nazmi Boutique",
  metadataBase: new URL("https://nazmiboutique.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Nazmi Boutique | Elegant Traditional & Western Fashion",
    description:
      "Premium quality clothing blending Kerala's traditional artistry with contemporary western designs for the modern woman.",
    url: "https://nazmiboutique.com",
    siteName: "Nazmi Boutique",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nazmi Boutique - Premium Fashion Collection",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nazmi Boutique | Premium Fashion",
    description: "Elegant traditional and western wear for the modern woman.",
    images: ["/og-image.jpg"],
    creator: "@nazmiboutique",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
};

/* ---- ROOT LAYOUT ---- */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      className={`${poppins.variable} ${playfair.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link 
          rel="preconnect" 
          href="https://fonts.gstatic.com" 
          crossOrigin="anonymous" 
        />
        
        {/* Enhanced Structured Data for E-commerce */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ClothingStore",
              name: "Nazmi Boutique",
              description: "Premium traditional and western wear blending Kerala craftsmanship with contemporary designs",
              url: "https://nazmiboutique.com",
              telephone: "+91-99959-47709",
              email: "nazmiboutique1@gmail.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Kerala",
                addressCountry: "IN",
              },
              openingHours: "Mo-Su 09:00-21:00",
              priceRange: "₹799 - ₹5,999",
              currenciesAccepted: "INR",
              sameAs: [
                "https://www.instagram.com/nazmiboutique/",
                "https://www.facebook.com/nazmiboutique/"
              ]
            }),
          }}
        />
      </head>

      <body className="min-h-screen flex flex-col bg-white text-gray-900 font-sans antialiased">
        {/* Header - No announcement bar */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 w-full">
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* WhatsApp Button */}
        <WhatsAppButton
          phone="+919995947709"
          preset="Hello Nazmi Boutique! I'm interested in your collections and would like to know more."
        />
      </body>
    </html>
  );
}