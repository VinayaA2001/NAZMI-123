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
  width: 'device-width',
  initialScale: 1,
  themeColor: '#8B4513', // Rich brown for luxury feel
  colorScheme: 'light',
}

/* ---- SEO METADATA ---- */
export const metadata: Metadata = {
  title: {
    default: "Nazmi Boutique | Premium Traditional & Western Wear",
    template: "%s | Nazmi Boutique",
  },
  description: "Discover elegant fashion blending traditional Kerala craftsmanship with contemporary western styles. Premium quality sarees, kurtis, dresses, and officewear for the modern woman.",
  keywords: ["Nazmi Boutique", "Premium Fashion", "Traditional Wear", "Western Wear", "Kerala Boutique", "Women's Clothing", "Ethnic Fashion", "Designer Wear"],
  authors: [{ name: "Nazmi Boutique" }],
  creator: "Nazmi Boutique",
  publisher: "Nazmi Boutique",
  metadataBase: new URL('https://nazmiboutique.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Nazmi Boutique | Elegant Traditional & Western Fashion",
    description: "Premium quality clothing blending Kerala's traditional artistry with contemporary western designs for the modern woman.",
    url: "https://nazmiboutique.com",
    siteName: "Nazmi Boutique",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nazmi Boutique - Premium Fashion",
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
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
};

/* ---- ROOT LAYOUT ---- */
export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html
      lang="en-IN"
      className={`${poppins.variable} ${playfair.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Enhanced Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FashionBoutique",
              "name": "Nazmi Boutique",
              "description": "Premium traditional and western wear blending Kerala craftsmanship with contemporary designs",
              "url": "https://nazmiboutique.com",
              "telephone": "+91-99959-47709",
              "email": "nazmiboutique1@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Kerala",
                "addressCountry": "IN"
              },
              "openingHours": "Mo-Su 09:00-21:00",
              "priceRange": "₹799 - ₹5,999",
              "currenciesAccepted": "INR",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Fashion Collections",
                "itemListElement": [
                  {
                    "@type": "OfferCatalog",
                    "name": "Traditional Wear",
                    "itemListElement": [
                      {"@type": "Offer", "itemOffered": {"@type": "Product", "name": "Festive Wear"}},
                      {"@type": "Offer", "itemOffered": {"@type": "Product", "name": "Kurtis"}},
                      {"@type": "Offer", "itemOffered": {"@type": "Product", "name": "Ethnic Sets"}}
                    ]
                  },
                  {
                    "@type": "OfferCatalog",
                    "name": "Western Wear",
                    "itemListElement": [
                      {"@type": "Offer", "itemOffered": {"@type": "Product", "name": "Dresses"}},
                      {"@type": "Offer", "itemOffered": {"@type": "Product", "name": "Tops"}},
                      {"@type": "Offer", "itemOffered": {"@type": "Product", "name": "Officewear"}}
                    ]
                  }
                ]
              }
            })
          }}
        />
      </head>
      <body className="min-h-dvh flex flex-col bg-white text-gray-900 font-sans antialiased selection:bg-amber-900/20">
        {/* Enhanced Header */}
        <Header />

        {/* Smooth Main Content */}
        <main className="flex-1 w-full overflow-hidden">
          {children}
        </main>

        {/* Enhanced Footer */}
        <Footer />

        {/* Premium WhatsApp Button - Fixed */}
        <div className="fixed bottom-6 right-6 z-40">
          <WhatsAppButton
            phone="+919995947709"
            preset="Hello Nazmi Boutique! I'd like to know more about your collections."
          />
        </div>

        {/* Enhanced Loading Spinner */}
        <div id="loading-spinner" className="fixed inset-0 bg-white/90 backdrop-blur-md flex items-center justify-center z-50 opacity-0 pointer-events-none transition-opacity duration-500">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-900/20 border-t-amber-900 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading Nazmi Boutique...</p>
          </div>
        </div>
      </body>
    </html>
  );
}