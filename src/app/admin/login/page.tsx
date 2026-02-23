'use client';

import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { useAppContext } from '../../context/AppContext';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const { t } = useAppContext();
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push('/admin/dashboard');
            } else {
                const data = await res.json();
                setErrorMsg(data.error || 'Divine key rejected.');
                setStatus('error');
            }
        } catch (error: any) {
            setErrorMsg(error.message || 'Connection failure.');
            setStatus('error');
        }
    };

    return (
        <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
            <Header />
            <div className="container flex-center" style={{ minHeight: '80vh', padding: '2rem' }}>
                <form
                    onSubmit={handleLogin}
                    className="glass-panel"
                    style={{
                        padding: '3rem',
                        width: '100%',
                        maxWidth: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem',
                        textAlign: 'center'
                    }}
                >
                    <div>
                        <h2 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Admin Sanctuary</h2>
                        <p style={{ fontSize: '0.9rem', color: 'var(--fg-secondary)' }}>Please enter the sacred key to proceed.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                        <label style={{ fontWeight: 500, fontSize: '0.9rem' }}>Access Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            style={{
                                padding: '1rem',
                                borderRadius: '12px',
                                border: '1px solid var(--border-light)',
                                backgroundColor: 'var(--bg-secondary)',
                                color: 'var(--fg-primary)',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <button type="submit" disabled={status === 'loading'} className="btn btn-primary" style={{ width: '100%' }}>
                        {status === 'loading' ? 'Opening...' : 'Login to Dashboard'}
                    </button>

                    {status === 'error' && (
                        <p style={{ color: '#f44336', fontSize: '0.85rem', fontWeight: 500 }}>
                            ⚠️ {errorMsg}
                        </p>
                    )}
                </form>
            </div>
        </main>
    );
}
