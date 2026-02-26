import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from '../context/AppContext';
import { Header } from '../components/Header';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { ArattaiButton } from '../components/ArattaiButton';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: "Mystic Pathways by Shilpi | Reiki, Tarot & Numerology | Healings by Shilpi",
  description: "Experience spiritual clarity with professional Reiki healing, Tarot readings, and Numerology consultations. Holistic guidance for your unique journey.",
  keywords: ["Reiki", "Tarot", "Numerology", "Spiritual Healing", "Distance Reiki", "Numerologist", "Tarot Reader"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="pink">
      <body>
        <AppProvider>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
              {children}
            </div>
            <Footer />
          </div>
          <WhatsAppButton />
          <ArattaiButton />
        </AppProvider>
      </body>
    </html>
  );
}
