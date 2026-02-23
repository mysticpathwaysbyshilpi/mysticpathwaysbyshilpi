'use client';

import { Header } from '@/components/Header';
import { ServiceSection } from '@/components/ServiceSection';
import { Newsletter } from '@/components/Newsletter';

export default function Services() {
    return (
        <main>
            <Header />
            <div style={{ paddingTop: '80px' }}>
                <ServiceSection id="reiki" />
                <ServiceSection id="tarot" reversed />
                <ServiceSection id="numerology" />
            </div>
            <Newsletter />
        </main>
    );
}
