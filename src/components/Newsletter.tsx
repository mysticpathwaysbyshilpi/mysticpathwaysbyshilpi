'use client';

import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export const Newsletter: React.FC = () => {
    const { t } = useAppContext();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: t('newsletter.loading') });

        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (res.ok) {
                setStatus({ type: 'success', message: t('newsletter.success') });
                setEmail('');
            } else {
                setStatus({ type: 'error', message: data.error || t('newsletter.error') });
            }
        } catch (err) {
            setStatus({ type: 'error', message: t('newsletter.error') });
        }
    };

    return (
        <section style={{ backgroundColor: 'var(--bg-secondary)', padding: '5rem 0', borderTop: '1px solid var(--border-light)' }}>
            <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t('newsletter.title')}</h2>
                <p style={{ color: 'var(--fg-secondary)', marginBottom: '2rem' }}>
                    {t('newsletter.subtitle')}
                </p>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="email"
                            placeholder={t('newsletter.placeholder')}
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                flex: 1, padding: '0.75rem 1rem', borderRadius: '8px',
                                border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)',
                                color: 'var(--fg-primary)', outline: 'none'
                            }}
                        />
                        <button type="submit" className="btn btn-primary">{t('newsletter.button')}</button>
                    </div>
                    {status.message && (
                        <p style={{
                            fontSize: '0.85rem',
                            marginTop: '0.5rem',
                            color: status.type === 'error' ? '#f44336' : status.type === 'success' ? '#4caf50' : 'var(--accent-primary)'
                        }}>
                            {status.message}
                        </p>
                    )}
                </form>
            </div>
        </section>
    );
};
