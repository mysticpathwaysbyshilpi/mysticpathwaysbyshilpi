'use client';

import React from 'react';
import Link from 'next/link';
import { useAppContext } from '../context/AppContext';

export const Footer: React.FC = () => {
    const { t } = useAppContext();

    return (
        <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-light)', paddingTop: '4rem', paddingBottom: '2rem' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
                    {/* Brand Column */}
                    <div className="flex-col" style={{ gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: 'var(--shadow-soft)', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#fff'
                            }}>
                                <img src="/images/logo.png?v=2.01" alt="Logo" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                            </div>
                            <h3 style={{ color: 'var(--accent-primary)', fontSize: '1.5rem', margin: 0 }}>Mystic Pathways</h3>
                        </div>
                        <p style={{ color: 'var(--fg-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            {t('footer.tagline')}
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '1.5rem' }}>
                            <a href="https://instagram.com/mystic_pathways_by_shilpi" target="_blank" rel="noreferrer" title="Instagram" style={{ filter: 'grayscale(1)' }}>📸</a>
                            <a href="https://youtube.com/@shilpiaggrawal" target="_blank" rel="noreferrer" title="YouTube" style={{ filter: 'grayscale(1)' }}>🎥</a>
                            <a href="https://facebook.com/mysticpathwaysbyshilpi" target="_blank" rel="noreferrer" title="Facebook" style={{ filter: 'grayscale(1)' }}>👥</a>
                            <a href="https://www.linkedin.com/in/mystic-pathways-by-shilpi-4643593b0/" target="_blank" rel="noreferrer" title="Linkedin" style={{ filter: 'grayscale(1)', display: 'flex', alignItems: 'center' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex-col" style={{ gap: '1rem' }}>
                        <h4 style={{ fontWeight: '600' }}>{t('footer.usefulLinks')}</h4>
                        <Link href="/about" prefetch={false} style={{ color: 'var(--fg-secondary)' }}>{t('common.about')}</Link>
                        <Link href="/services/reiki" prefetch={false} style={{ color: 'var(--fg-secondary)' }}>{t('common.reiki')}</Link>
                        <Link href="/services/tarot" prefetch={false} style={{ color: 'var(--fg-secondary)' }}>{t('common.tarot')}</Link>
                        <Link href="/services/numerology" prefetch={false} style={{ color: 'var(--fg-secondary)' }}>{t('common.numerology')}</Link>
                        <Link href="/book" prefetch={false} style={{ color: 'var(--fg-secondary)' }}>{t('common.bookNow')}</Link>
                        <Link href="/legal" prefetch={false} style={{ color: 'var(--fg-secondary)' }}>{t('footer.privacyLegal')}</Link>
                    </div>

                    {/* Contact Info */}
                    <div className="flex-col" style={{ gap: '1rem' }}>
                        <h4 style={{ fontWeight: '600' }}>{t('footer.contact')}</h4>
                        <p style={{ color: 'var(--fg-secondary)' }}>📧 help@healingwithshilpi.com</p>
                        <p style={{ color: 'var(--fg-secondary)' }}>📞 +91 9152559833</p>
                        <p style={{ color: 'var(--fg-secondary)' }}>📍 {t('footer.addressVal')}</p>
                    </div>

                    {/* Map Integration */}
                    <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-light)', height: '220px', position: 'relative' }}>
                        <iframe
                            src="https://maps.google.com/maps?q=Mystic+Pathways+by+Shilpi@19.03374206996705,73.07700368644616&z=12&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Healing With Shilpi"
                        ></iframe>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '2rem', textAlign: 'center', color: 'var(--fg-secondary)', fontSize: '0.8rem' }}>
                    © {new Date().getFullYear()} Mystic Pathways by Shilpi. {t('footer.copyright')}
                    <div style={{ marginTop: '0.5rem', opacity: 0.5 }}>Celestial Version 2.0.1</div>
                </div>
            </div>
        </footer>
    );
};
