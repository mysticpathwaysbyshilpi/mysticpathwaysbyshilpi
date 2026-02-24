'use client';

import React, { use } from 'react';
import { useAppContext } from '../../../context/AppContext';
import { Header } from '../../../components/Header';
import Link from 'next/link';

export default function ServicePage({ params }: { params: Promise<{ service: string }> }) {
    const resolvedParams = use(params);
    const serviceKey = resolvedParams.service;
    const { t } = useAppContext();

    // Fetch data from translation keys
    const serviceData = t(`services_detail.${serviceKey}`) as any;

    if (!serviceData || typeof serviceData === 'string') {
        return (
            <main>
                <Header />
                <section style={{ padding: '8rem 0', textAlign: 'center' }}>
                    <div className="container">
                        <h1>Service Not Found</h1>
                        <p>The spiritual path you seek is currently unavailable.</p>
                        <Link href="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>Return Home</Link>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main>
            <Header />

            {/* Hero Section for Service */}
            <section className="bg-primary" style={{ padding: '8rem 0 4rem 0', position: 'relative' }}>
                <div className="container reveal">
                    <h1 style={{
                        fontSize: 'clamp(1.75rem, 5vw, 2.8rem)',
                        color: 'var(--accent-primary)',
                        marginBottom: '1rem',
                        fontFamily: 'var(--font-heading)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        {serviceData.title}
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: 'var(--fg-secondary)',
                        maxWidth: '800px',
                        lineHeight: '1.6'
                    }}>
                        {serviceData.subtitle}
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="desktop-only" style={{ position: 'absolute', top: '20%', right: '10%', opacity: 0.1, fontSize: '10rem' }}>
                    {serviceKey === 'reiki' ? '✨' : serviceKey === 'tarot' ? '🔮' : '🔢'}
                </div>
            </section>

            {/* Detailed Content */}
            <section className="bg-secondary" style={{ padding: '4rem 0 8rem 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gap: '4rem' }}>
                        {serviceData.sections.map((section: any, sIdx: number) => (
                            <div key={sIdx} className="reveal">
                                <h2 style={{
                                    marginBottom: '2.5rem',
                                    paddingBottom: '0.5rem',
                                    borderBottom: '2px solid var(--border-light)',
                                    display: 'inline-block',
                                    color: 'var(--fg-primary)'
                                }}>
                                    {section.title}
                                </h2>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
                                    gap: '2rem'
                                }}>
                                    {section.items.map((item: any, iIdx: number) => (
                                        <div key={iIdx} className="glass-panel" style={{
                                            padding: '2rem',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'transform 0.3s ease'
                                        }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            {/* Service Image */}
                                            <div style={{
                                                width: '100%',
                                                aspectRatio: '808/450',
                                                backgroundColor: 'rgba(var(--accent-primary-rgb), 0.05)',
                                                borderRadius: '12px',
                                                marginBottom: '1.5rem',
                                                overflow: 'hidden',
                                                border: '1px solid var(--border-light)'
                                            }}>
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'var(--fg-secondary)',
                                                        fontSize: '0.8rem'
                                                    }}>
                                                        🖼️ {item.name}
                                                    </div>
                                                )}
                                            </div>

                                            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>{item.name}</h3>
                                            <p style={{ color: 'var(--fg-secondary)', marginBottom: '1.5rem', flex: 1 }}>{item.desc}</p>

                                            {item.bullets && item.bullets.length > 0 && (
                                                <ul style={{
                                                    listStyle: 'none',
                                                    padding: 0,
                                                    margin: 0,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '0.5rem'
                                                }}>
                                                    {item.bullets.map((bullet: string, bIdx: number) => (
                                                        <li key={bIdx} style={{
                                                            fontSize: '0.9rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem'
                                                        }}>
                                                            <span style={{ color: 'var(--accent-secondary)' }}>•</span>
                                                            {bullet}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Final CTA */}
                    <div className="reveal" style={{
                        marginTop: '6rem',
                        padding: '4rem',
                        textAlign: 'center',
                        backgroundColor: 'var(--bg-primary)',
                        borderRadius: '32px',
                        border: '1px solid var(--border-light)',
                        boxShadow: 'var(--shadow-soft)'
                    }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Ready to Begin Your Journey?</h2>
                        <p style={{ color: 'var(--fg-secondary)', marginBottom: '2.5rem', maxWidth: '600px', marginInline: 'auto' }}>
                            Book a personalized session today and experience the transformative power of {serviceData.title}.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/book" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
                                Book a Session Now
                            </Link>
                            <Link href="/contact" className="btn btn-secondary" style={{ padding: '1rem 2.5rem' }}>
                                Ask a Question
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}
