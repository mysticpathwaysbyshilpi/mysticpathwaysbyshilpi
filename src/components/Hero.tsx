'use client';

import React from 'react';
import { useAppContext } from '../context/AppContext';
import Link from 'next/link';

export const Hero: React.FC = () => {
    const { t } = useAppContext();

    const scrollToServices = () => {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="hero-grad" style={{
            padding: '12rem 0 8rem',
            position: 'relative',
            overflow: 'hidden',
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/images/hero_background.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#fff',
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center'
        }}>
            {/* Dark Overlay for Readability */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(3px)',
                zIndex: 0
            }}></div>

            {/* Decorative Orbs */}
            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', background: 'var(--accent-primary)', opacity: '0.2', borderRadius: '50%', filter: 'blur(100px)', zIndex: 0 }}></div>
            <div style={{ position: 'absolute', bottom: '0', left: '-5%', width: '300px', height: '300px', background: 'var(--accent-primary)', opacity: '0.2', borderRadius: '50%', filter: 'blur(80px)', zIndex: 0 }}></div>

            <div className="container flex-center flex-col" style={{ textAlign: 'center', zIndex: 1, position: 'relative' }}>
                <h1 className="reveal" style={{
                    lineHeight: '1.2',
                    marginBottom: '2rem',
                    maxWidth: '900px',
                    color: '#ffffff',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    fontSize: 'clamp(2.5rem, 8vw, 4.5rem)'
                }}>
                    {t('hero.title')}
                </h1>
                <p className="reveal" style={{
                    fontSize: 'clamp(1rem, 4vw, 1.25rem)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    maxWidth: '650px',
                    marginBottom: '3rem',
                    fontWeight: '400',
                    animationDelay: '0.2s',
                    lineHeight: '1.6'
                }}>
                    {t('hero.subtitle')}
                </p>
                <div className="reveal flex-center" style={{ gap: '1rem', animationDelay: '0.4s', flexWrap: 'wrap' }}>
                    <Link href="/book" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                        {t('hero.cta')}
                    </Link>
                    <button
                        onClick={scrollToServices}
                        className="btn glass-panel"
                        style={{
                            padding: '1rem 2rem',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: '#ffffff',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        {t('common.exploreMore')}
                    </button>
                </div>
            </div>
        </section>
    );
};
