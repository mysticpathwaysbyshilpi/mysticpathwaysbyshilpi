'use client';

import React from 'react';
import { useAppContext } from '../context/AppContext';
import Link from 'next/link';

export const Header: React.FC = () => {
    const { t, theme, setTheme, language, setLanguage } = useAppContext();
    const [showThemes, setShowThemes] = React.useState(false);
    const [servicesDropdown, setServicesDropdown] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
    const themeRef = React.useRef<HTMLDivElement>(null);
    const servicesRef = React.useRef<HTMLDivElement>(null);

    const themes = [
        { id: 'pink', name: 'Pink', color: '#d489ad' },
        { id: 'gold', name: 'Gold', color: '#d4af37' },
        { id: 'dark', name: 'Dark', color: '#1a1a1a' },
        { id: 'mint', name: 'Mint', color: '#6ab098' },
    ];

    const navLinks = [
        { href: '/', label: t('common.home') },
        { href: '/about', label: t('common.about') },
        { href: '/contact', label: t('common.contact') },
    ];

    // Close dropdowns on click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
                setShowThemes(false);
            }
            if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
                setServicesDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDarkMode = () => {
        if (theme === 'dark') {
            setTheme('pink');
        } else {
            setTheme('dark');
        }
    };

    const serviceItems = [
        { href: '/services/reiki', label: t('common.reiki') },
        { href: '/services/tarot', label: t('common.tarot') },
        { href: '/services/numerology', label: t('common.numerology') },
    ];

    return (
        <header className="glass-header">
            <div className="container" style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link href="/" prefetch={false} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', zIndex: 101 }}>
                        <div style={{
                            width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: 'var(--shadow-soft)', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#fff'
                        }}>
                            <img src="/images/logo.png?v=2.01" alt="Mystic Pathways" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', fontFamily: 'var(--font-heading)', color: 'var(--accent-primary)' }}>
                            Mystic Pathways
                        </span>
                    </Link>
                    <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                        <Link href="/" prefetch={false}>{t('common.home')}</Link>
                        <Link href="/about" prefetch={false}>{t('common.about')}</Link>

                        {/* Services Dropdown */}
                        <div
                            ref={servicesRef}
                            style={{ position: 'relative' }}
                            onMouseEnter={() => setServicesDropdown(true)}
                            onMouseLeave={() => setServicesDropdown(false)}
                        >
                            <Link
                                href="#"
                                prefetch={false}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                            >
                                {t('common.services')}
                                <span style={{ fontSize: '0.6rem', transition: 'transform 0.3s ease', transform: servicesDropdown ? 'rotate(180deg)' : 'none' }}>▼</span>
                            </Link>

                            {servicesDropdown && (
                                <div className="glass-panel" style={{
                                    position: 'absolute', top: '100%', left: '0', padding: '0.75rem',
                                    display: 'flex', flexDirection: 'column', gap: '0.25rem', zIndex: 200,
                                    minWidth: '200px', transformOrigin: 'top center',
                                    animation: 'fadeIn 0.2s ease forwards'
                                }}>
                                    {serviceItems.map(item => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            prefetch={false}
                                            style={{
                                                padding: '0.6rem 1rem',
                                                borderRadius: '8px',
                                                transition: 'var(--transition-smooth)',
                                                color: 'var(--fg-primary)'
                                            }}
                                            className="nav-dropdown-link"
                                            onClick={() => setServicesDropdown(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link href="/contact" prefetch={false}>{t('common.contact')}</Link>
                    </nav>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Desktop Social & Lang Switcher */}
                    <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--fg-secondary)', fontSize: '1.1rem' }}>
                            <a href="https://instagram.com/mystic_pathways_by_shilpi" target="_blank" rel="noreferrer" title="Instagram" style={{ filter: 'grayscale(1)' }}>📸</a>
                            <a href="https://youtube.com/@shilpiaggrawal" target="_blank" rel="noreferrer" title="YouTube" style={{ filter: 'grayscale(1)' }}>🎥</a>
                            <a href="https://facebook.com/mysticpathwaysbyshilpi" target="_blank" rel="noreferrer" title="Facebook" style={{ filter: 'grayscale(1)' }}>👥</a>
                            <a href="https://www.linkedin.com/in/mystic-pathways-by-shilpi-4643593b0/" target="_blank" rel="noreferrer" title="Linkedin" style={{ filter: 'grayscale(1)', display: 'flex', alignItems: 'center' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
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

                    <Link href="/book" prefetch={false} className="btn btn-primary desktop-only" style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem' }}>
                        {t('common.bookNow')}
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-only"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '0.5rem', zIndex: 101, display: 'flex', alignItems: 'center'
                        }}
                    >
                        <div style={{ width: '24px', height: '18px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <span style={{ width: '100%', height: '2px', backgroundColor: 'var(--fg-primary)', borderRadius: '2px', transition: 'var(--transition-smooth)', transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none' }}></span>
                            <span style={{ width: '100%', height: '2px', backgroundColor: 'var(--fg-primary)', borderRadius: '2px', transition: 'var(--transition-smooth)', opacity: mobileMenuOpen ? 0 : 1 }}></span>
                            <span style={{ width: '100%', height: '2px', backgroundColor: 'var(--fg-primary)', borderRadius: '2px', transition: 'var(--transition-smooth)', transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none' }}></span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            {mobileMenuOpen && (
                <div className="glass-panel" style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh',
                    zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', gap: '2rem', padding: '2rem', overflowY: 'auto'
                }}>
                    <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', fontSize: '1.25rem', fontWeight: '600', width: '100%' }}>
                        <Link href="/" prefetch={false} onClick={() => setMobileMenuOpen(false)}>{t('common.home')}</Link>
                        <Link href="/about" prefetch={false} onClick={() => setMobileMenuOpen(false)}>{t('common.about')}</Link>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
                            <span style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>{t('common.services')}</span>
                            {serviceItems.map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    prefetch={false}
                                    onClick={() => setMobileMenuOpen(false)}
                                    style={{ fontSize: '1rem', opacity: 0.8 }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        <Link href="/contact" prefetch={false} onClick={() => setMobileMenuOpen(false)}>{t('common.contact')}</Link>

                        <Link
                            href="/book"
                            prefetch={false}
                            className="btn btn-primary"
                            style={{ marginTop: '1rem', padding: '1rem 2.5rem' }}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {t('common.bookNow')}
                        </Link>
                    </nav>

                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem' }}>
                        <div style={{ display: 'flex', gap: '0.25rem', border: '1px solid var(--border-light)', padding: '2px', borderRadius: '20px' }}>
                            <button
                                onClick={() => setLanguage('en')}
                                style={{
                                    padding: '8px 16px', borderRadius: '16px', border: 'none', cursor: 'pointer',
                                    backgroundColor: language === 'en' ? 'var(--accent-primary)' : 'transparent',
                                    color: language === 'en' ? '#fff' : 'var(--fg-primary)',
                                    fontSize: '0.875rem', fontWeight: 'bold'
                                }}
                            >EN</button>
                            <button
                                onClick={() => setLanguage('hi')}
                                style={{
                                    padding: '8px 16px', borderRadius: '16px', border: 'none', cursor: 'pointer',
                                    backgroundColor: language === 'hi' ? 'var(--accent-primary)' : 'transparent',
                                    color: language === 'hi' ? '#fff' : 'var(--fg-primary)',
                                    fontSize: '0.875rem', fontWeight: 'bold'
                                }}
                            >HI</button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
