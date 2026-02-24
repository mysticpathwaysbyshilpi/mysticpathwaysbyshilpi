'use client';

import React from 'react';
import { useAppContext } from '../context/AppContext';

interface ServiceSectionProps {
    id: 'reiki' | 'tarot' | 'numerology';
    reversed?: boolean;
}

export const ServiceSection: React.FC<ServiceSectionProps> = ({ id, reversed }) => {
    const { t } = useAppContext();
    const service = (t(`services.${id}`) as any);

    return (
        <section style={{ padding: '6rem 0' }} className={reversed ? 'bg-secondary' : 'bg-primary'}>
            <div className="container" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
                gap: '4rem',
                alignItems: 'center'
            }}>
                <div style={{ order: reversed ? 2 : 1 }} className="reveal">
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>{service.title}</h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--fg-secondary)', marginBottom: '2.5rem', lineHeight: '1.8' }}>
                        {service.description}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {service.areas.map((area: any, idx: number) => (
                            <div key={idx} className="glass-panel" style={{ padding: '1.5rem', transition: 'var(--transition-smooth)' }}>
                                <h4 style={{ marginBottom: '0.5rem', fontWeight: '600' }}>{area.name}</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--fg-secondary)' }}>{area.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ order: reversed ? 1 : 2, position: 'relative' }} className="reveal">
                    {/* Image Container */}
                    <div style={{
                        aspectRatio: '4/5', borderRadius: '32px', backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-soft)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        textAlign: 'center', overflow: 'hidden', position: 'relative'
                    }}>
                        {id === 'reiki' ? (
                            <img
                                src="/images/reiki_healing.png"
                                alt="Reiki Healing Session"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : id === 'tarot' ? (
                            <img
                                src="/images/tarrot_guidance.png"
                                alt="Tarot Guidance Session"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <img
                                src="/images/numerology.png"
                                alt="Numerology Analysis Session"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        )}
                    </div>

                    {/* Floating Decorative Sparkles */}
                    <div className="desktop-only" style={{ position: 'absolute', top: '-15px', right: '-15px', pointerEvents: 'none' }}>
                        <div style={{ fontSize: '1.5rem', transform: 'rotate(15deg)', animation: 'fadeIn 2s infinite alternate' }}>✨</div>
                        <div style={{ fontSize: '0.8rem', position: 'absolute', top: '20px', left: '-10px', opacity: '0.6', animation: 'fadeIn 3s infinite alternate 1s' }}>✨</div>
                        <div style={{ fontSize: '1rem', position: 'absolute', top: '-5px', left: '25px', opacity: '0.4', animation: 'fadeIn 2.5s infinite alternate 0.5s' }}>✨</div>
                    </div>

                    {/* Icon Placeholder (Top Left) */}
                    <div style={{
                        position: 'absolute', top: '-10px', left: '-10px', width: '40px', height: '40px',
                        backgroundColor: '#fff', border: '1px solid var(--border-light)',
                        borderRadius: '20px', boxShadow: 'var(--shadow-soft)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', zIndex: 5, overflow: 'hidden'
                    }}>
                        <img src="/images/logo.png?v=2.01" alt="Icon" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                    </div>
                </div>
            </div>
        </section>
    );
};
