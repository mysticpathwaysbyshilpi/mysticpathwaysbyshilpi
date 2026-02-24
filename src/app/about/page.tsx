'use client';

import { Header } from '../../components/Header';
import { useAppContext } from '../../context/AppContext';

export const dynamic = 'force-static';

export default function About() {
    const { t } = useAppContext();

    return (
        <main>
            <Header />
            <div className="container" style={{ padding: '6rem 2rem' }}>
                <h1 style={{ marginBottom: '2rem' }}>{t('about.title')}</h1>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '4rem',
                    alignItems: 'center'
                }}>
                    <div>
                        <p style={{ fontSize: '1.1rem', color: 'var(--fg-secondary)', marginBottom: '1.5rem', lineHeight: '1.8' }}>
                            {t('about.p1')}
                        </p>
                        <p style={{ fontSize: '1.1rem', color: 'var(--fg-secondary)', marginBottom: '1.5rem', lineHeight: '1.8' }}>
                            {t('about.p2')}
                        </p>
                    </div>
                    <div style={{
                        aspectRatio: '1', borderRadius: '24px', overflow: 'hidden',
                        border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-soft)',
                    }}>
                        <img
                            src="/images/about_shilpi.jpg"
                            alt={t('about.imageAlt')}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
