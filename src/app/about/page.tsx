import { Header } from '@/components/Header';
import { useAppContext } from '@/context/AppContext';

export const dynamic = 'force-static';

export default function About() {
    const { t } = useAppContext();

    return (
        <main>
            <Header />
            <div className="container" style={{ padding: '6rem 2rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>About Mystic Pathways</h1>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                    <div>
                        <p style={{ fontSize: '1.1rem', color: 'var(--fg-secondary)', marginBottom: '1.5rem' }}>
                            Welcome to Mystic Pathways, a sacred space dedicated to your spiritual growth and holistic well-being. Founded by Shilpi, we specialize in Reiki healing, Tarot readings, and Numerology consultations.
                        </p>
                        <p style={{ fontSize: '1.1rem', color: 'var(--fg-secondary)', marginBottom: '1.5rem' }}>
                            Our mission is to empower individuals to find clarity, balance, and harmony in their lives through these ancient and profound practices. Whether you are seeking physical healing, emotional support, or guidance on your life's path, we are here to support you.
                        </p>
                    </div>
                    <div style={{
                        aspectRatio: '1', borderRadius: '24px', overflow: 'hidden',
                        border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-soft)',
                    }}>
                        <img
                            src="/images/about_shilpi.jpg"
                            alt="Shilpi - Spiritual Guide"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
