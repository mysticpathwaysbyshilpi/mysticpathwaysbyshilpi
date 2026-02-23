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
                                <img src="/images/logo.png" alt="Logo" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                            </div>
                            <h3 style={{ color: 'var(--accent-primary)', fontSize: '1.5rem', margin: 0 }}>Mystic Pathways</h3>
                        </div>
                        <p style={{ color: 'var(--fg-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            {t('footer.tagline')}
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '1.5rem' }}>
                            <a href="#" style={{ filter: 'grayscale(1)' }}>📸</a>
                            <a href="#" style={{ filter: 'grayscale(1)' }}>🎥</a>
                            <a href="#" style={{ filter: 'grayscale(1)' }}>👥</a>
                            <a href="#" style={{ filter: 'grayscale(1)' }}>𝕏</a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex-col" style={{ gap: '1rem' }}>
                        <h4 style={{ fontWeight: '600' }}>Useful Links</h4>
                        <Link href="/about" style={{ color: 'var(--fg-secondary)' }}>{t('common.about')}</Link>
                        <Link href="/services" style={{ color: 'var(--fg-secondary)' }}>{t('common.services')}</Link>
                        <Link href="/book" style={{ color: 'var(--fg-secondary)' }}>{t('common.bookNow')}</Link>
                        <Link href="/legal" style={{ color: 'var(--fg-secondary)' }}>Privacy & Legal</Link>
                    </div>

                    {/* Contact Info */}
                    <div className="flex-col" style={{ gap: '1rem' }}>
                        <h4 style={{ fontWeight: '600' }}>{t('footer.contact')}</h4>
                        <p style={{ color: 'var(--fg-secondary)' }}>📧 shilpi@mysticpathways.com</p>
                        <p style={{ color: 'var(--fg-secondary)' }}>📞 +91 99XXXXXXX</p>
                        <p style={{ color: 'var(--fg-secondary)' }}>📍 123 Spiritual Lane, Holistic City</p>
                    </div>

                    {/* Map Integration */}
                    <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-light)', height: '220px', position: 'relative' }}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120682.04940026214!2d72.9364966779435!3d19.03680710609657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c3dad03e7335%3A0x671f11da52e3e580!2sNavi%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Navi Mumbai Location"
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
