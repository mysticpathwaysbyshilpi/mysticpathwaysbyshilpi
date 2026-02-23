'use client';

import { Header } from '@/components/Header';

export default function Legal() {
    return (
        <main>
            <Header />
            <div className="container" style={{ padding: '6rem 2rem', maxWidth: '900px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Legal Terms & Policies</h1>

                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>Disclaimer</h2>
                    <p style={{ color: 'var(--fg-secondary)', lineHeight: '1.8' }}>
                        The Reiki, Tarot, and Numerology services provided on this website are for holistic, spiritual, and entertainment purposes only. They are not a substitute for professional medical, legal, or financial advice. Always seek the advice of your physician or other qualified health providers with any questions you may have regarding a medical condition.
                    </p>
                </section>

                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>Cancellation & Rescheduling Policy</h2>
                    <p style={{ color: 'var(--fg-secondary)', lineHeight: '1.8' }}>
                        Your appointments are very important to us. They are reserved especially for you. We understand that sometimes schedule adjustments are necessary; therefore, we respectfully request at least 24 hours notice for cancellations or rescheduling.
                    </p>
                    <ul style={{ color: 'var(--fg-secondary)', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <li>• Full pre-payment is required to confirm your booking.</li>
                        <li>• Cancellations or rescheduling with less than 24 hours notice will result in a 100% service charge.</li>
                        <li>• Late arrivals may result in shortened session times to ensure our practitioners stay on schedule.</li>
                    </ul>
                </section>
            </div>
        </main>
    );
}
