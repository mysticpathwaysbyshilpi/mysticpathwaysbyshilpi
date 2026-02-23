'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

interface ContactRequest {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    countryCode?: string;
    message: string;
    date: string;
    notes?: string;
    isArchived?: boolean;
}

interface Subscriber {
    _id: string;
    email: string;
    subscribedAt: string;
}

interface Booking {
    _id: string;
    clientName: string;
    clientEmail: string;
    sessionType: string;
    startTime: string;
    endTime: string;
    status: string;
    paymentStatus: string;
    meetingLink?: string;
}

export default function AdminDashboard() {
    const { t } = useAppContext();
    const router = useRouter();
    const [contacts, setContacts] = useState<ContactRequest[]>([]);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [view, setView] = useState<'active' | 'archived' | 'newsletter' | 'bookings'>('active');
    const [counts, setCounts] = useState({ active: 0, archived: 0, bookings: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortField, setSortField] = useState('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [readingMessage, setReadingMessage] = useState<string | null>(null);
    const [newsletterTotal, setNewsletterTotal] = useState(0);

    // Change Password States
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [passwordStatus, setPasswordStatus] = useState({ loading: false, error: '', success: '' });
    const [showActionMenu, setShowActionMenu] = useState(false);

    // Settings States
    const [calComLink, setCalComLink] = useState('');
    const [meetingTypes, setMeetingTypes] = useState<{ id: string; label: string; link: string }[]>([]);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [settingsStatus, setSettingsStatus] = useState({ loading: false, error: '', success: '' });

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordStatus({ loading: true, error: '', success: '' });

        if (passwordData.new !== passwordData.confirm) {
            setPasswordStatus({ loading: false, error: 'New passwords do not match', success: '' });
            return;
        }

        try {
            const res = await fetch('/api/admin/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.current,
                    newPassword: passwordData.new
                }),
            });
            const result = await res.json();
            if (res.ok) {
                setPasswordStatus({ loading: false, error: '', success: 'Sacred password updated successfully!' });
                setPasswordData({ current: '', new: '', confirm: '' });
                setTimeout(() => setShowPasswordModal(false), 2000);
            } else {
                setPasswordStatus({ loading: false, error: result.error || 'Failed to update password', success: '' });
            }
        } catch (err) {
            setPasswordStatus({ loading: false, error: 'Connection error', success: '' });
        }
    };

    const handleUpdateSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setSettingsStatus({ loading: true, error: '', success: '' });

        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ calComLink, meetingTypes }),
            });
            const result = await res.json();
            if (res.ok) {
                setSettingsStatus({ loading: false, error: '', success: 'Divine settings updated successfully!' });
                setTimeout(() => setShowSettingsModal(false), 2000);
            } else {
                setSettingsStatus({ loading: false, error: result.error || 'Failed to update settings', success: '' });
            }
        } catch (err) {
            setSettingsStatus({ loading: false, error: 'Connection error', success: '' });
        }
    };

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            if (res.ok) {
                const data = await res.json();
                setCalComLink(data.calComLink);
                setMeetingTypes(data.meetingTypes || []);
            }
        } catch (err) {
            console.error('Failed to fetch settings:', err);
        }
    };

    const addMeetingType = () => {
        setMeetingTypes(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), label: '', link: '' }]);
    };

    const removeMeetingType = (id: string) => {
        setMeetingTypes(prev => prev.filter(m => m.id !== id));
    };

    const updateMeetingType = (id: string, field: 'label' | 'link', value: string) => {
        setMeetingTypes(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 300); // Small debounce
        return () => clearTimeout(timer);
    }, [view, currentPage, sortField, sortOrder, searchQuery]);

    const fetchData = async () => {
        setLoading(true);
        setSelectedIds([]);
        try {
            if (view === 'newsletter') {
                const res = await fetch(`/api/admin/newsletter?page=${currentPage}&limit=50`);
                if (res.ok) {
                    const result = await res.json();
                    setSubscribers(result.data);
                    setTotalPages(result.pagination.pages);
                    setNewsletterTotal(result.pagination.total);
                }
            } else if (view === 'bookings') {
                const res = await fetch(`/api/admin/bookings?page=${currentPage}&limit=20`);
                if (res.ok) {
                    const result = await res.json();
                    setBookings(result.data);
                    setTotalPages(result.pagination.pages);
                    setCounts(prev => ({ ...prev, bookings: result.pagination.total }));
                }
            } else {
                const res = await fetch(`/api/admin/contacts?page=${currentPage}&limit=20&archived=${view === 'archived'}&sortField=${sortField}&sortOrder=${sortOrder}&search=${searchQuery}`);
                if (res.ok) {
                    const result = await res.json();
                    setContacts(result.data);
                    setTotalPages(result.pagination.pages);
                    setCounts(result.counts);
                } else if (res.status === 401) {
                    router.push('/admin/login');
                } else {
                    setError('Failed to fetch sacred requests.');
                }
            }
        } catch (err) {
            setError('Connection error.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewChange = (newView: 'active' | 'archived' | 'newsletter' | 'bookings') => {
        setView(newView);
        setCurrentPage(1);
        setSearchQuery('');
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
        setCurrentPage(1);
    };

    const handleBulkAction = async (action: 'archive' | 'delete' | 'restore') => {
        if (selectedIds.length === 0) return;

        let confirmMsg = `Are you sure you want to ${action} ${selectedIds.length} items?`;
        if (action === 'delete') confirmMsg = `WARNING: Permanent delete of ${selectedIds.length} items. Continue?`;
        if (!confirm(confirmMsg)) return;

        try {
            const endpoint = view === 'newsletter' ? '/api/admin/newsletter' : '/api/admin/contacts/bulk';
            const method = view === 'newsletter' ? 'DELETE' : 'POST';
            const body = view === 'newsletter' ? { ids: selectedIds } : { ids: selectedIds, action };

            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                fetchData();
            } else {
                alert('Action failed. Please try again.');
            }
        } catch (err) {
            alert('Connection error.');
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    const handleExport = async () => {
        if (selectedIds.length === 0) return;

        setLoading(true);
        try {
            const endpoint = view === 'newsletter' ? '/api/admin/newsletter' : '/api/admin/contacts';
            const res = await fetch(`${endpoint}?limit=5000`);
            if (res.ok) {
                const result = await res.json();
                const allData = result.data;
                const selectedData = allData.filter((item: any) => selectedIds.includes(item._id));

                let csvContent = "";
                if (view === 'newsletter') {
                    csvContent = "Date,Email\n" +
                        selectedData.map((s: Subscriber) => `"${new Date(s.subscribedAt).toLocaleString()}","${s.email}"`).join("\n");
                } else {
                    csvContent = "Date,Name,Email,Country Code,Phone,Message,Status,Notes\n" +
                        selectedData.map((c: ContactRequest) =>
                            `"${new Date(c.date).toLocaleString()}","${c.name}","${c.email}","${c.countryCode || ''}","${c.phone || ''}","${c.message.replace(/"/g, '""')}","${c.isArchived ? 'Archived' : 'Active'}","${(c.notes || '').replace(/"/g, '""')}"`
                        ).join("\n");
                }

                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", `divine_${view}_export_${new Date().toISOString().split('T')[0]}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (err) {
            alert('Export failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleSelectAll = async () => {
        const totalInView = view === 'newsletter' ? newsletterTotal : (view === 'active' ? counts.active : counts.archived);

        if (selectedIds.length === totalInView && totalInView > 0) {
            setSelectedIds([]);
            return;
        }

        setLoading(true);
        try {
            const endpoint = view === 'newsletter' ? '/api/admin/newsletter' : '/api/admin/contacts';
            const params = view === 'newsletter' ? 'limit=5000' : `limit=5000&archived=${view === 'archived'}&search=${searchQuery}`;
            const res = await fetch(`${endpoint}?${params}`);
            if (res.ok) {
                const result = await res.json();
                setSelectedIds(result.data.map((item: any) => item._id));
            }
        } catch (err) {
            alert('Failed to select all items.');
        } finally {
            setLoading(false);
        }
    };

    const [updateTimer, setUpdateTimer] = useState<NodeJS.Timeout | null>(null);

    const handleNoteUpdate = (id: string, newNotes: string) => {
        setContacts(prev => prev.map(c => c._id === id ? { ...c, notes: newNotes } : c));
        if (updateTimer) clearTimeout(updateTimer);
        const timer = setTimeout(async () => {
            try {
                await fetch('/api/admin/contacts/update', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, notes: newNotes }),
                });
            } catch (err) {
                console.error('Failed to auto-save note:', err);
            }
        }, 1000);
        setUpdateTimer(timer);
    };

    const SortIndicator = ({ field }: { field: string }) => {
        if (sortField !== field) return <span style={{ opacity: 0.3, marginLeft: '0.5rem' }}>↕</span>;
        return <span style={{ marginLeft: '0.5rem' }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>;
    };

    return (
        <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
            <Header />
            <div className="container" style={{ padding: '8rem 2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ color: 'var(--accent-primary)', fontSize: '2.5rem' }}>Divine Dashboard</h1>
                        <p style={{ color: 'var(--fg-secondary)' }}>Manage your incoming spiritual requests.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="btn btn-secondary"
                            style={{ gap: '0.5rem' }}
                        >
                            🔑 Change Password
                        </button>
                        <button
                            onClick={() => setShowSettingsModal(true)}
                            className="btn btn-secondary"
                            style={{ gap: '0.5rem' }}
                        >
                            ⚙️ Settings
                        </button>
                        <button onClick={handleLogout} className="btn btn-secondary">
                            Secure Logout
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div className="glass-panel" style={{ display: 'inline-flex', padding: '0.25rem', borderRadius: '12px' }}>
                        <button
                            onClick={() => handleViewChange('active')}
                            style={{
                                padding: '0.75rem 1.5rem', borderRadius: '10px', border: 'none',
                                backgroundColor: view === 'active' ? 'var(--accent-primary)' : 'transparent',
                                color: view === 'active' ? 'white' : 'var(--fg-primary)',
                                cursor: 'pointer', transition: '0.2s', fontWeight: 600,
                                display: 'flex', alignItems: 'center', gap: '0.75rem'
                            }}
                        >
                            Active Messages
                            <span style={{ backgroundColor: view === 'active' ? 'rgba(255,255,255,0.2)' : 'var(--border-light)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>
                                {counts.active}
                            </span>
                        </button>
                        <button
                            onClick={() => handleViewChange('archived')}
                            style={{
                                padding: '0.75rem 1.5rem', borderRadius: '10px', border: 'none',
                                backgroundColor: view === 'archived' ? 'var(--accent-primary)' : 'transparent',
                                color: view === 'archived' ? 'white' : 'var(--fg-primary)',
                                cursor: 'pointer', transition: '0.2s', fontWeight: 600,
                                display: 'flex', alignItems: 'center', gap: '0.75rem'
                            }}
                        >
                            Archived
                            <span style={{ backgroundColor: view === 'archived' ? 'rgba(255,255,255,0.2)' : 'var(--border-light)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>
                                {counts.archived}
                            </span>
                        </button>
                        <button
                            onClick={() => handleViewChange('newsletter')}
                            style={{
                                padding: '0.75rem 1.5rem', borderRadius: '10px', border: 'none',
                                backgroundColor: view === 'newsletter' ? 'var(--accent-primary)' : 'transparent',
                                color: view === 'newsletter' ? 'white' : 'var(--fg-primary)',
                                cursor: 'pointer', transition: '0.2s', fontWeight: 600,
                                display: 'flex', alignItems: 'center', gap: '0.75rem'
                            }}
                        >
                            Newsletter Circle 📧
                        </button>
                        <button
                            onClick={() => handleViewChange('bookings')}
                            style={{
                                padding: '0.75rem 1.5rem', borderRadius: '10px', border: 'none',
                                backgroundColor: view === 'bookings' ? 'var(--accent-primary)' : 'transparent',
                                color: view === 'bookings' ? 'white' : 'var(--fg-primary)',
                                cursor: 'pointer', transition: '0.2s', fontWeight: 600,
                                display: 'flex', alignItems: 'center', gap: '0.75rem'
                            }}
                        >
                            Divine Bookings ✨
                            <span style={{ backgroundColor: view === 'bookings' ? 'rgba(255,255,255,0.2)' : 'var(--border-light)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>
                                {counts.bookings}
                            </span>
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1, justifyContent: 'flex-end', minWidth: '300px' }}>
                        {view !== 'newsletter' && (
                            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or message..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem 0.75rem 2.5rem',
                                        borderRadius: '12px',
                                        border: '1px solid var(--border-light)',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        color: 'var(--fg-primary)',
                                        outline: 'none',
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </div>
                        )}

                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowActionMenu(!showActionMenu)}
                                disabled={selectedIds.length === 0}
                                style={{
                                    width: '46px', height: '46px', borderRadius: '12px', border: '1px solid var(--border-light)',
                                    backgroundColor: showActionMenu ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                                    color: selectedIds.length === 0 ? 'var(--fg-secondary)' : (showActionMenu ? 'white' : 'var(--accent-primary)'),
                                    fontSize: '1.2rem', cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer',
                                    transition: '0.2s', opacity: selectedIds.length === 0 ? 0.4 : 1,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                                title={selectedIds.length === 0 ? "Select items to take action" : "Bulk Actions"}
                            >
                                ⋮
                            </button>

                            {showActionMenu && selectedIds.length > 0 && (
                                <>
                                    <div
                                        style={{ position: 'fixed', inset: 0, zIndex: 900 }}
                                        onClick={() => setShowActionMenu(false)}
                                    />
                                    <div className="glass-panel" style={{
                                        position: 'absolute', top: '120%', right: 0, width: '260px',
                                        padding: '0.75rem', zIndex: 901, borderRadius: '12px',
                                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                                        animation: 'fadeIn 0.2s ease-out',
                                        display: 'flex', flexDirection: 'column', gap: '0.25rem'
                                    }}>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--fg-secondary)', padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-light)' }}>
                                            {selectedIds.length} celestial items selected
                                        </p>

                                        {view === 'newsletter' ? (
                                            <button
                                                onClick={() => { handleBulkAction('delete'); setShowActionMenu(false); }}
                                                className="btn btn-secondary"
                                                style={{ width: '100%', textAlign: 'left', color: '#f44336', justifyContent: 'flex-start', border: '1px solid rgba(244,67,54,0.1)', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}
                                            >
                                                🗑️ Remove Selected
                                            </button>
                                        ) : (
                                            <>
                                                {view === 'active' ? (
                                                    <button
                                                        onClick={() => { handleBulkAction('archive'); setShowActionMenu(false); }}
                                                        className="btn btn-secondary"
                                                        style={{ width: '100%', textAlign: 'left', justifyContent: 'flex-start', border: '1px solid var(--border-light)', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: 'var(--fg-primary)' }}
                                                    >
                                                        📦 Archive Selected
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => { handleBulkAction('restore'); setShowActionMenu(false); }}
                                                        className="btn btn-secondary"
                                                        style={{ width: '100%', textAlign: 'left', justifyContent: 'flex-start', border: '1px solid var(--border-light)', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: 'var(--fg-primary)' }}
                                                    >
                                                        🔙 Restore Selected
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => { handleBulkAction('delete'); setShowActionMenu(false); }}
                                                    className="btn btn-secondary"
                                                    style={{ width: '100%', textAlign: 'left', color: '#f44336', justifyContent: 'flex-start', border: '1px solid rgba(244,67,54,0.1)', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}
                                                >
                                                    🗑️ Delete Permanently
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => { handleExport(); setShowActionMenu(false); }}
                                            className="btn btn-secondary"
                                            style={{ width: '100%', textAlign: 'left', color: 'var(--accent-primary)', justifyContent: 'flex-start', border: '1px solid var(--accent-primary)', padding: '0.75rem', backgroundColor: 'rgba(var(--accent-primary-rgb), 0.05)', borderRadius: '8px', marginTop: '0.5rem' }}
                                        >
                                            📊 Export to Excel
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex-center" style={{ height: '300px' }}>
                        <p style={{ color: 'var(--fg-secondary)' }}>Gathering insights...</p>
                    </div>
                ) : error ? (
                    <div className="glass-panel flex-center" style={{ padding: '3rem', color: '#f44336' }}>
                        <p>⚠️ {error}</p>
                    </div>
                ) : (view === 'newsletter' && subscribers.length === 0) || (view !== 'newsletter' && contacts.length === 0) ? (
                    <div className="glass-panel flex-center" style={{ padding: '5rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--fg-secondary)', fontSize: '1.2rem' }}>No {view} data in the sanctuary.</p>
                    </div>
                ) : view === 'bookings' ? (
                    <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem', borderRadius: '16px' }}>
                        <table style={{ width: '100%', minWidth: '1000px', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: 'rgba(var(--accent-primary-rgb), 0.08)', borderBottom: '2px solid var(--accent-primary)' }}>
                                    <th style={{ padding: '1.2rem 1rem', color: 'var(--accent-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Date & Time</th>
                                    <th style={{ padding: '1.2rem 1rem', color: 'var(--accent-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Seeker</th>
                                    <th style={{ padding: '1.2rem 1rem', color: 'var(--accent-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Session Variant</th>
                                    <th style={{ padding: '1.2rem 1rem', color: 'var(--accent-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
                                    <th style={{ padding: '1.2rem 1rem', color: 'var(--accent-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Payment</th>
                                    <th style={{ padding: '1.2rem 1rem', color: 'var(--accent-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking, index) => (
                                    <tr key={booking._id} style={{ borderBottom: '1px solid var(--glass-border)', transition: '0.2s', backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(var(--accent-primary-rgb), 0.02)' }}>
                                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                                            <div style={{ fontWeight: 600, color: 'var(--fg-primary)' }}>
                                                {new Date(booking.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </div>
                                            <div style={{ color: 'var(--fg-secondary)', fontSize: '0.8rem' }}>
                                                {new Date(booking.startTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} - {new Date(booking.endTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 600 }}>{booking.clientName}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)' }}>{booking.clientEmail}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)' }}>
                                                {booking.sessionType}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600,
                                                backgroundColor: booking.status === 'BOOKED' ? 'rgba(76, 175, 80, 0.1)' : booking.status === 'RESCHEDULED' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                                color: booking.status === 'BOOKED' ? '#4caf50' : booking.status === 'RESCHEDULED' ? '#ff9800' : '#f44336'
                                            }}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600,
                                                backgroundColor: booking.paymentStatus === 'PAID' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                                                color: booking.paymentStatus === 'PAID' ? '#4caf50' : '#ffc107'
                                            }}>
                                                {booking.paymentStatus}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {booking.meetingLink && (
                                                <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}>
                                                    Join Meeting
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {bookings.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--fg-secondary)' }}>
                                            No bookings recorded in the scrolls yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <>
                        <div className="glass-panel desktop-only" style={{ overflowX: 'auto', padding: '1rem', borderRadius: '16px' }}>
                            <table style={{ width: '100%', minWidth: '1100px', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ backgroundColor: 'rgba(var(--accent-primary-rgb), 0.08)', borderBottom: '2px solid var(--accent-primary)' }}>
                                        <th style={{ padding: '1.2rem 1rem', width: '40px' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.length === (view === 'active' ? counts.active : counts.archived) && (view === 'active' ? counts.active : counts.archived) > 0}
                                                onChange={toggleSelectAll}
                                                style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                                            />
                                        </th>
                                        <th onClick={() => handleSort('date')} style={{ padding: '1.2rem 1rem', color: 'var(--accent-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>
                                            Date <SortIndicator field="date" />
                                        </th>
                                        <th onClick={() => handleSort('name')} style={{ padding: '1.2rem 1rem', color: 'var(--accent-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>
                                            Visitor <SortIndicator field="name" />
                                        </th>
                                        <th style={{ padding: '1.2rem 1rem', color: 'var(--accent-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Connectivity</th>
                                        <th style={{ padding: '1.2rem 1rem', color: 'var(--accent-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Message From Soul</th>
                                        <th style={{ padding: '1.2rem 1rem', color: 'var(--accent-primary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Notes (Auto-save)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contacts.map((contact, index) => (
                                        <tr
                                            key={contact._id}
                                            style={{
                                                borderBottom: '1px solid var(--glass-border)',
                                                backgroundColor: selectedIds.includes(contact._id)
                                                    ? 'rgba(var(--accent-primary-rgb), 0.12)'
                                                    : index % 2 === 0 ? 'transparent' : 'rgba(var(--accent-primary-rgb), 0.02)',
                                                transition: '0.2s'
                                            }}
                                        >
                                            <td style={{ padding: '1rem' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(contact._id)}
                                                    onChange={() => toggleSelect(contact._id)}
                                                    style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                                                />
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--fg-secondary)', whiteSpace: 'nowrap' }}>
                                                {new Date(contact.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td style={{ padding: '1rem', fontWeight: 600 }}>{contact.name}</td>
                                            <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                                                {contact.email && <div style={{ color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>📧 {contact.email}</div>}
                                                {contact.phone && <div style={{ color: 'var(--accent-primary)', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>📞 {contact.countryCode} {contact.phone}</div>}
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--fg-secondary)', minWidth: '200px', maxWidth: '300px', lineHeight: '1.5' }}>
                                                <div
                                                    onClick={() => setReadingMessage(contact.message)}
                                                    style={{
                                                        cursor: 'pointer',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        transition: '0.2s'
                                                    }}
                                                    title="Click to read full message"
                                                    className="message-preview"
                                                >
                                                    {contact.message}
                                                </div>
                                                {contact.message.length > 60 && (
                                                    <button
                                                        onClick={() => setReadingMessage(contact.message)}
                                                        style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.75rem', padding: 0, marginTop: '0.25rem', cursor: 'pointer', fontWeight: 600 }}
                                                    >
                                                        Read Full Message →
                                                    </button>
                                                )}
                                            </td>
                                            <td style={{ padding: '1rem', minWidth: '250px' }}>
                                                <textarea
                                                    value={contact.notes || ''}
                                                    onChange={(e) => handleNoteUpdate(contact._id, e.target.value)}
                                                    placeholder="Add internal notes here..."
                                                    style={{
                                                        width: '100%',
                                                        height: '42px',
                                                        minHeight: '42px',
                                                        padding: '0.6rem 0.75rem',
                                                        borderRadius: '8px',
                                                        border: '1px solid var(--border-light)',
                                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                        color: 'var(--fg-primary)',
                                                        fontSize: '0.85rem',
                                                        outline: 'none',
                                                        resize: 'vertical',
                                                        transition: '0.2s',
                                                        lineHeight: '1.4'
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {contacts.map((contact) => (
                                <div
                                    key={contact._id}
                                    className="glass-panel"
                                    style={{
                                        padding: '1.5rem',
                                        border: selectedIds.includes(contact._id) ? '2px solid var(--accent-primary)' : '1px solid var(--glass-border)',
                                        backgroundColor: selectedIds.includes(contact._id) ? 'rgba(var(--accent-primary-rgb), 0.05)' : 'var(--glass-bg)'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(contact._id)}
                                                    onChange={() => toggleSelect(contact._id)}
                                                    style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                                                />
                                                <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', margin: 0 }}>{contact.name}</h3>
                                            </div>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--fg-secondary)' }}>
                                                {new Date(contact.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                                        {contact.email && <div style={{ color: 'var(--accent-secondary)', marginBottom: '0.25rem' }}>📧 {contact.email}</div>}
                                        {contact.phone && <div style={{ color: 'var(--accent-primary)' }}>📞 {contact.countryCode} {contact.phone}</div>}
                                    </div>

                                    <div style={{ backgroundColor: 'rgba(var(--accent-primary-rgb), 0.03)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--fg-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>Message From Soul:</p>
                                        <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>{contact.message}</p>
                                    </div>

                                    <div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--fg-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>Admin Notes:</p>
                                        <textarea
                                            value={contact.notes || ''}
                                            onChange={(e) => handleNoteUpdate(contact._id, e.target.value)}
                                            placeholder="Add internal notes..."
                                            style={{
                                                width: '100%',
                                                minHeight: '60px',
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: '1px solid var(--border-light)',
                                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                color: 'var(--fg-primary)',
                                                fontSize: '0.85rem',
                                                outline: 'none',
                                                resize: 'vertical'
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', padding: '1rem', borderTop: '1px solid var(--border-light)', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--fg-secondary)' }}>
                        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="btn btn-secondary"
                            style={{ padding: '0.5rem 1.2rem', opacity: currentPage === 1 ? 0.5 : 1, borderRadius: '8px' }}
                        >
                            Previous
                        </button>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="btn btn-secondary"
                            style={{ padding: '0.5rem 1.2rem', opacity: currentPage === totalPages ? 0.5 : 1, borderRadius: '8px' }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
            {/* Reading Message Modal */}
            {readingMessage && (
                <div className="modal-overlay flex-center" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, padding: '2rem' }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '3rem', position: 'relative', animation: 'fadeIn 0.3s ease-out' }}>
                        <button
                            onClick={() => setReadingMessage(null)}
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--fg-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}
                        >
                            ✕
                        </button>
                        <h2 style={{ color: 'var(--accent-primary)', marginBottom: '2rem', fontSize: '1.8rem' }}>Divine Message</h2>
                        <div style={{ color: 'var(--fg-primary)', lineHeight: '1.8', fontSize: '1.1rem', whiteSpace: 'pre-wrap', maxHeight: '60vh', overflowY: 'auto', paddingRight: '1rem' }}>
                            {readingMessage}
                        </div>
                        <div style={{ marginTop: '3rem', textAlign: 'right' }}>
                            <button onClick={() => setReadingMessage(null)} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                                Acknowledge
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="modal-overlay flex-center" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, padding: '2rem' }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '3rem', position: 'relative', animation: 'fadeIn 0.3s ease-out' }}>
                        <button
                            onClick={() => setShowPasswordModal(false)}
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--fg-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}
                        >
                            ✕
                        </button>
                        <h2 style={{ color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>Sacred Password</h2>
                        <p style={{ color: 'var(--fg-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Update your access credentials for the divine sanctuary.</p>

                        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--fg-secondary)' }}>Current Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.current}
                                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--fg-secondary)' }}>New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.new}
                                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--fg-secondary)' }}>Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordData.confirm}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                />
                            </div>

                            {passwordStatus.error && <p style={{ color: '#f44336', fontSize: '0.9rem' }}>{passwordStatus.error}</p>}
                            {passwordStatus.success && <p style={{ color: '#4caf50', fontSize: '0.9rem' }}>{passwordStatus.success}</p>}

                            <button type="submit" className="btn btn-primary" disabled={passwordStatus.loading} style={{ marginTop: '1rem', padding: '1rem' }}>
                                {passwordStatus.loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {showSettingsModal && (
                <div className="modal-overlay flex-center" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, padding: '2rem' }}>
                    <div className="glass-panel" style={{ width: '100%', maxWidth: '700px', padding: '3rem', position: 'relative', animation: 'fadeIn 0.3s ease-out' }}>
                        <button
                            onClick={() => setShowSettingsModal(false)}
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--fg-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}
                        >
                            ✕
                        </button>
                        <h2 style={{ color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>Divine Settings</h2>
                        <p style={{ color: 'var(--fg-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>Configure your Cal.com link and session variants.</p>

                        <form onSubmit={handleUpdateSettings}>
                            <div className="form-group" style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--fg-secondary)', fontWeight: 600 }}>Default Cal.com Link</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. shilpi/reiki-session"
                                    value={calComLink}
                                    onChange={(e) => setCalComLink(e.target.value)}
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white' }}
                                />
                                <p style={{ fontSize: '0.75rem', color: 'var(--fg-secondary)', marginTop: '0.5rem' }}>Enter just the link portion from Cal.com.</p>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <label style={{ fontSize: '0.9rem', color: 'var(--fg-secondary)', fontWeight: 600 }}>Session Variants</label>
                                    <button type="button" onClick={addMeetingType} className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>+ Add Variant</button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                                    {meetingTypes.map((m) => (
                                        <div key={m.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                                            <div style={{ flex: 1 }}>
                                                <input
                                                    type="text"
                                                    placeholder="Label (e.g. 60 min Reiki)"
                                                    value={m.label}
                                                    onChange={(e) => updateMeetingType(m.id, 'label', e.target.value)}
                                                    style={{ width: '100%', padding: '0.6rem', marginBottom: '0.5rem' }}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Link (e.g. shilpi/reiki-60)"
                                                    value={m.link}
                                                    onChange={(e) => updateMeetingType(m.id, 'link', e.target.value)}
                                                    style={{ width: '100%', padding: '0.6rem' }}
                                                />
                                            </div>
                                            <button type="button" onClick={() => removeMeetingType(m.id)} style={{ padding: '0.5rem', background: 'rgba(244,67,54,0.1)', border: 'none', color: '#f44336', borderRadius: '8px', cursor: 'pointer' }}>🗑️</button>
                                        </div>
                                    ))}
                                    {meetingTypes.length === 0 && (
                                        <p style={{ fontSize: '0.85rem', color: 'var(--fg-secondary)', textAlign: 'center', padding: '1rem', fontStyle: 'italic' }}>No variants added. The default link will be used.</p>
                                    )}
                                </div>
                            </div>

                            {settingsStatus.error && <p style={{ color: '#f44336', fontSize: '0.9rem', marginBottom: '1rem' }}>{settingsStatus.error}</p>}
                            {settingsStatus.success && <p style={{ color: '#4caf50', fontSize: '0.9rem', marginBottom: '1rem' }}>{settingsStatus.success}</p>}

                            <button type="submit" className="btn btn-primary" disabled={settingsStatus.loading} style={{ width: '100%', padding: '1rem' }}>
                                {settingsStatus.loading ? 'Updating Sanctuary...' : 'Save Divine Settings'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
