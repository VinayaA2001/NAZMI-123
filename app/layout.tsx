// app/layout.tsx
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppButton from "@/components/layout/whatsAppButton";
import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";

/* ---- GOOGLE FONTS ---- */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-poppins",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  variable: "--font-playfair",
});

/* ---- SEO METADATA ---- */
export const metadata: Metadata = {
  title: {
    default: "Nazmi Boutique – Traditional & Western Wear for Women",
    template: "%s • Nazmi Boutique",
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
  ],
  openGraph: {
    title: "Nazmi Boutique – Traditional & Western Wear for Women",
    description:
      "Discover elegant, minimal, and trendy outfits for every occasion. From sarees to skirts, explore Nazmi Boutique’s traditional and western collections.",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Nazmi Boutique – Traditional & Western Wear for Women",
    description:
      "Shop minimal, elegant fashion from Nazmi Boutique — blending traditional and western styles with Kerala’s unique touch.",
    images: ["/og-image.png"],
  },
};

/* ---- ROOT LAYOUT ---- */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${playfair.variable} scroll-smooth`}
    >
      <body className="min-h-dvh flex flex-col bg-white text-neutral-900 font-sans antialiased">
        {/* Global Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1">{children}</main>

        {/* Global Footer */}
        <Footer />

        {/* Floating WhatsApp Button */}
        <WhatsAppButton
          phone="+919995947709"
          preset="Hi Nazmi! I have a question about this page."
        />
      </body>
    </html>
  );
}
