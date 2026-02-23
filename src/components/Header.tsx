'use client';

import React from 'react';
import { useAppContext } from '../context/AppContext';
import Link from 'next/link';

export const Header: React.FC = () => {
    const { t, theme, setTheme, language, setLanguage } = useAppContext();
    const [showThemes, setShowThemes] = React.useState(false);
    const themeRef = React.useRef<HTMLDivElement>(null);

    const themes = [
        { id: 'pink', name: 'Pink', color: '#d489ad' },
        { id: 'gold', name: 'Gold', color: '#d4af37' },
        { id: 'dark', name: 'Dark', color: '#1a1a1a' },
        { id: 'mint', name: 'Mint', color: '#6ab098' },
    ];

    // Close theme selector on click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
                setShowThemes(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDarkMode = () => {
        if (theme === 'dark') {
            setTheme('pink'); // Default back to pink if current is dark
        } else {
            setTheme('dark');
        }
    };

    return (
        <header className="glass-header">
            <div className="container" style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                        <div style={{
                            width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: 'var(--shadow-soft)', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#fff'
                        }}>
                            <img src="/images/logo.png" alt="Mystic Pathways" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                        </div>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'var(--font-heading)', color: 'var(--accent-primary)' }}>
                            Mystic Pathways
                        </span>
                    </Link>
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                        <Link href="/">{t('common.home')}</Link>
                        <Link href="/about">{t('common.about')}</Link>
                        <Link href="/services">{t('common.services')}</Link>
                        <Link href="/contact">{t('common.contact')}</Link>
                    </nav>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {/* Social Icons Placeholder */}
                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--fg-secondary)', fontSize: '1.1rem' }}>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram" style={{ filter: 'grayscale(1)' }}>📸</a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer" title="YouTube" style={{ filter: 'grayscale(1)' }}>🎥</a>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" title="Facebook" style={{ filter: 'grayscale(1)' }}>👥</a>
                    </div>

                    <div style={{ display: 'flex', gap: '0.25rem', border: '1px solid var(--border-light)', padding: '2px', borderRadius: '20px' }}>
                        <button
                            onClick={() => setLanguage('en')}
                            style={{
                                padding: '4px 10px', borderRadius: '16px', border: 'none', cursor: 'pointer',
                                backgroundColor: language === 'en' ? 'var(--accent-primary)' : 'transparent',
                                color: language === 'en' ? '#fff' : 'var(--fg-primary)',
                                fontSize: '0.75rem', fontWeight: 'bold'
                            }}
                        >EN</button>
                        <button
                            onClick={() => setLanguage('hi')}
                            style={{
                                padding: '4px 10px', borderRadius: '16px', border: 'none', cursor: 'pointer',
                                backgroundColor: language === 'hi' ? 'var(--accent-primary)' : 'transparent',
                                color: language === 'hi' ? '#fff' : 'var(--fg-primary)',
                                fontSize: '0.75rem', fontWeight: 'bold'
                            }}
                        >HI</button>
                    </div>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        style={{
                            background: 'none', cursor: 'pointer', fontSize: '1.1rem',
                            color: 'var(--fg-primary)', display: 'flex', alignItems: 'center',
                            padding: '0.5rem', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border-light)', transition: 'var(--transition-smooth)'
                        }}
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>

                    {/* Theme Selector */}
                    <div ref={themeRef} style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowThemes(!showThemes)}
                            style={{
                                background: 'none', cursor: 'pointer', fontSize: '1.1rem',
                                color: 'var(--fg-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.5rem', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)',
                                border: '1px solid var(--border-light)'
                            }}
                            title="Change Theme Palette"
                        >
                            🎨
                        </button>
                        {showThemes && (
                            <div className="glass-panel" style={{
                                position: 'absolute', top: '120%', right: '0', padding: '1rem',
                                display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 200,
                                minWidth: '120px'
                            }}>
                                {themes.map((t_item) => (
                                    <button
                                        key={t_item.id}
                                        onClick={() => { setTheme(t_item.id as any); setShowThemes(false); }}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.8rem',
                                            border: 'none', background: 'none', cursor: 'pointer', width: '100%',
                                            textAlign: 'left', borderRadius: '12px', transition: 'var(--transition-smooth)',
                                            backgroundColor: theme === t_item.id ? 'var(--bg-primary)' : 'transparent',
                                            color: 'var(--fg-primary)'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (theme !== t_item.id) e.currentTarget.style.backgroundColor = 'rgba(var(--accent-primary-rgb), 0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (theme !== t_item.id) e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: t_item.color, border: '1px solid var(--border-light)' }}></div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: theme === t_item.id ? '600' : '400' }}>{t_item.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link href="/book" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem' }}>
                        {t('common.bookNow')}
                    </Link>
                </div>
            </div>
        </header>
    );
};
