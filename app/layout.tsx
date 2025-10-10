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
  themeColor: '#6D7E5F', // Your brand color
  colorScheme: 'light',
}

/* ---- SEO METADATA ---- */
export const metadata: Metadata = {
  title: {
    default: "Nazmi Boutique – Traditional & Western Wear for Women",
    template: "%s | Nazmi Boutique",
  },
  description:
    "Shop the latest trends in traditional and western wear for women at Nazmi Boutique. Discover sarees, kurtis, gowns, tops, skirts, and officewear – elegant fashion from Kerala with a modern twist.",
  keywords: [
    "Nazmi Boutique",
    "Kerala Boutique",
    "Women's Fashion",
    "Traditional Wear",
    "Western Wear",
    "Ethnic Wear",
    "Officewear",
    "Jeans",
    "Croptops",
    "Kurtis",
    "Tops",
    "Dresses",
    "Online Boutique India",
    "Affordable Fashion",
    "Kerala Fashion",
    "Indian Boutique",
    "Traditional Sarees",
    "Western Dresses",
  ],
  authors: [{ name: "Nazmi Boutique" }],
  creator: "Nazmi Boutique",
  publisher: "Nazmi Boutique",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nazmi.onrender.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Nazmi Boutique – Traditional & Western Wear for Women",
    description:
      "Discover elegant, minimal, and trendy outfits for every occasion. From sarees to skirts, explore Nazmi Boutique's traditional and western collections.",
    url: "https://nazmi.onrender.com",
    siteName: "Nazmi Boutique",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nazmi Boutique – Elegant Traditional & Western Wear",
      },
    ],
    locale: "en_IN",
    type: "website",
    emails: ["hello@nazmi.com"],
    phoneNumbers: ["+919995947709"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nazmi Boutique – Traditional & Western Wear for Women",
    description:
      "Shop minimal, elegant fashion from Nazmi Boutique — blending traditional and western styles with Kerala's unique touch.",
    images: ["/og-image.png"],
    creator: "@nazmiboutique",
    site: "@nazmiboutique",
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
  verification: {
    // Add when you have Google Search Console verification
    // google: 'your-google-verification-code',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest', // Add for PWA
};

/* ---- ROOT LAYOUT ---- */
export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html
      lang="en-IN" // Changed to en-IN for Indian audience
      className={`${poppins.variable} ${playfair.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ClothingStore",
              "name": "Nazmi Boutique",
              "description": "Minimal fashion from Kerala blending Traditional & Western styles with elegance",
              "url": "https://nazmi.onrender.com",
              "telephone": "+91-99959-47709",
              "email": "hello@nazmi.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Kerala",
                "addressCountry": "IN"
              },
              "openingHours": "Mo-Su 09:00-21:00",
              "priceRange": "₹799 - ₹3599",
              "currenciesAccepted": "INR",
              "paymentAccepted": "Cash, Credit Card, Debit Card, UPI",
              "sameAs": [
                "https://www.instagram.com/nazmiboutique_",
                "https://www.facebook.com/share/19oRd6Jgyu/",
                "https://youtube.com/@nazmiboutique-vl6id"
              ]
            })
          }}
        />
      </head>
      <body className="min-h-dvh flex flex-col bg-white text-neutral-900 font-sans antialiased selection:bg-[#6D7E5F]/20">
        {/* Global Header */}
        <Header />

        {/* Page Content with smooth loading */}
        <main className="flex-1 relative">
          {children}
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Floating WhatsApp Button */}
        <WhatsAppButton
          phone="+919995947709"
          preset="Hi Nazmi! I have a question about your boutique."
        />

        {/* Loading Spinner for route transitions */}
        <div id="loading-spinner" className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 opacity-0 pointer-events-none transition-opacity duration-300">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6D7E5F]"></div>
        </div>
      </body>
    </html>
  );
}