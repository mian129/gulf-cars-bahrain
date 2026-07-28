import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Gulf Cars Bahrain - Buy & Sell Used and New Cars in Bahrain",
  description:
    "Bahrain's trusted marketplace for buying and selling quality used and new cars. Browse Toyota, Honda, BMW, Mercedes and more at best prices.",
  keywords:
    "used cars bahrain, new cars bahrain, buy car bahrain, sell car bahrain, toyota bahrain, honda bahrain, BMW bahrain",
  openGraph: {
    title: "Gulf Cars Bahrain",
    description: "Buy & Sell Used and New Cars in Bahrain",
    type: "website",
    locale: "en_BH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
