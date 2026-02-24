'use client';

import React, { useEffect, useState } from "react";
import { Header } from '../../components/Header';
import { useAppContext } from '../../context/AppContext';
import Cal, { getCalApi } from "@calcom/embed-react";

export default function Book() {
    const { t } = useAppContext();
    const [defaultLink, setDefaultLink] = useState<string | null>(null);
    const [meetingTypes, setMeetingTypes] = useState<{ id: string; label: string; link: string }[]>([]);
    const [selectedLink, setSelectedLink] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initCal = async () => {
            const cal = await getCalApi();
            cal("ui", {
                styles: { branding: { brandColor: "#000000" } },
                hideEventTypeDetails: false,
                layout: "month_view",
            });
        };
        initCal();

        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    setDefaultLink(data.calComLink);
                    setMeetingTypes(data.meetingTypes || []);
                    // If multiple types exist, don't set selectedLink yet to force choice
                    if (!data.meetingTypes || data.meetingTypes.length === 0) {
                        setSelectedLink(data.calComLink);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch booking settings:', err);
                setDefaultLink('shilpi-mystic-pathways/session');
                setSelectedLink('shilpi-mystic-pathways/session');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    return (
        <main>
            <Header />
            <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>{t('book.title')}</h1>

                {meetingTypes.length > 0 && !selectedLink ? (
                    <p style={{ fontSize: '1.2rem', color: 'var(--fg-secondary)', marginBottom: '3rem', maxWidth: '700px', margin: '0 auto 3rem' }}>
                        {t('book.subtitle1')}
                    </p>
                ) : (
                    <p style={{ fontSize: '1.2rem', color: 'var(--fg-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
                        {t('book.subtitle2')}
                    </p>
                )}

                {!loading && meetingTypes.length > 1 && (
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
                        {meetingTypes.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setSelectedLink(m.link)}
                                className={selectedLink === m.link ? "btn btn-primary" : "btn btn-secondary"}
                                style={{ minWidth: '220px', padding: '1.25rem' }}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className="glass-panel" style={{ padding: '2rem', overflow: 'hidden', minHeight: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {loading ? (
                        <div style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', fontWeight: 500 }}>
                            {t('book.loading')}
                        </div>
                    ) : selectedLink ? (
                        <div style={{ width: '100%', height: '100%' }}>
                            {meetingTypes.length > 1 && (
                                <button
                                    onClick={() => setSelectedLink(null)}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}
                                >
                                    {t('book.back')}
                                </button>
                            )}
                            <Cal
                                key={selectedLink} // Force rerender on link change
                                calLink={selectedLink}
                                style={{ width: "100%", height: "100%", minHeight: "600px" }}
                                config={{ layout: 'month_view' }}
                            />
                        </div>
                    ) : meetingTypes.length > 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem', animation: 'float 3s ease-in-out infinite' }}>✨</div>
                            <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1rem', fontSize: '2rem' }}>{t('book.emptyTitle')}</h3>
                            <p style={{ color: 'var(--fg-secondary)', maxWidth: '400px', margin: '0 auto', fontSize: '1.1rem' }}>
                                {t('book.emptyText')}
                            </p>
                        </div>
                    ) : defaultLink ? (
                        <Cal
                            calLink={defaultLink}
                            style={{ width: "100%", height: "100%", minHeight: "600px" }}
                            config={{ layout: 'month_view' }}
                        />
                    ) : (
                        <div style={{ color: '#f44336' }}>
                            {t('book.error')}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>
        </main>
    );
}
