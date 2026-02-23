import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ServiceSection } from '@/components/ServiceSection';
import { Newsletter } from '@/components/Newsletter';

export const dynamic = 'force-static';
export const revalidate = 3600; // Refresh once per hour

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />

      <div id="services">
        <ServiceSection id="reiki" />
        <ServiceSection id="tarot" reversed />
        <ServiceSection id="numerology" />
      </div>

      <Newsletter />
    </main>
  );
}
