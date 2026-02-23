'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { useAppContext } from '@/context/AppContext';

export default function Contact() {
    const { t } = useAppContext();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'validation-error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [countryCodes, setCountryCodes] = useState([
        { code: '+91', name: 'India' },
        { code: '+1', name: 'USA/Canada' },
        { code: '+44', name: 'UK' },
        { code: '+971', name: 'UAE' },
        { code: '+61', name: 'Australia' },
        { code: '+65', name: 'Singapore' },
    ]);
    const [selectedCountryCode, setSelectedCountryCode] = useState('+91');

    useEffect(() => {
        const detectCountry = async () => {
            try {
                const res = await fetch('https://ipapi.co/json/');
                if (res.ok) {
                    const data = await res.json();
                    if (data.country_calling_code) {
                        const code = data.country_calling_code;
                        if (!countryCodes.find(c => c.code === code)) {
                            setCountryCodes(prev => [{ code, name: data.country_name }, ...prev]);
                        }
                        setSelectedCountryCode(code);
                    }
                }
            } catch (error) {
                console.warn('Celestial geolocation unreachable, defaulting to India.');
            }
        };
        detectCountry();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg('');

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const countryCode = formData.get('countryCode') as string;
        const message = formData.get('message') as string;

        // Validation
        if (!email && !phone) {
            setStatus('validation-error');
            setErrorMsg('Please provide either an email address or a phone number.');
            return;
        }

        if (phone && phone.length !== 10) {
            setStatus('validation-error');
            setErrorMsg('Phone number must be exactly 10 digits.');
            return;
        }

        const data = { name, email, phone, countryCode, message };
        setStatus('loading');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setStatus('success');
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <main>
            <Header />
            <div className="container" style={{ padding: '8rem 2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>Connect With Us</h1>
                        <p style={{ color: 'var(--fg-secondary)', marginBottom: '3rem', fontSize: '1.1rem', lineHeight: '1.8' }}>
                            Have a question or want to discuss a custom package? Reach out via the form or through our direct channels. We are here to support your journey.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Direct Reach</h4>
                                <p>📧 shilpi@mysticpathways.com</p>
                                <p>📞 +91 99XXXXXXX</p>
                            </div>
                            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Our Sanctuary</h4>
                                <p>📍 Navi Mumbai, Maharashtra, India</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--fg-secondary)', marginTop: '0.5rem' }}>Visits by appointment only.</p>

                                <div style={{ marginTop: '1.5rem', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-light)', height: '300px' }}>
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
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: 500 }}>Name</label>
                            <input name="name" type="text" required style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)', color: 'var(--fg-primary)', outline: 'none' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: 500 }}>Email Address</label>
                            <input name="email" type="email" placeholder="email@example.com" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)', color: 'var(--fg-primary)', outline: 'none' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ fontWeight: 500 }}>Phone Number</label>
                                <span style={{ fontSize: '0.7rem', color: '#4caf50', backgroundColor: 'rgba(76, 175, 80, 0.1)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: 600 }}>✨ Smart Detected</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input type="hidden" name="countryCode" value={selectedCountryCode} />
                                <select
                                    disabled
                                    value={selectedCountryCode}
                                    style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--fg-primary)', outline: 'none', width: '90px', cursor: 'not-allowed', appearance: 'none' }}
                                >
                                    {countryCodes.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                                </select>
                                <input
                                    name="phone"
                                    type="tel"
                                    placeholder="10-digit number"
                                    maxLength={10}
                                    onInput={(e) => {
                                        const target = e.target as HTMLInputElement;
                                        target.value = target.value.replace(/[^0-9]/g, '');
                                    }}
                                    style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)', color: 'var(--fg-primary)', outline: 'none' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontWeight: 500 }}>Message</label>
                            <textarea name="message" rows={5} required style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-primary)', color: 'var(--fg-primary)', outline: 'none', resize: 'vertical' }}></textarea>
                        </div>

                        <button type="submit" disabled={status === 'loading'} className="btn btn-primary">
                            {status === 'loading' ? 'Sending...' : 'Send Message'}
                        </button>

                        {status === 'success' && <p style={{ color: '#4caf50', textAlign: 'center', fontWeight: 500 }}>✨ Message sent successfully!</p>}
                        {status === 'error' && <p style={{ color: '#f44336', textAlign: 'center', fontWeight: 500 }}>❌ Error sending message. Please try again.</p>}
                        {status === 'validation-error' && <p style={{ color: '#ff9800', textAlign: 'center', fontWeight: 500 }}>⚠️ {errorMsg}</p>}
                    </form>
                </div>
            </div>
        </main>
    );
}
