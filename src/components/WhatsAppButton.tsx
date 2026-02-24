'use client';

import React from 'react';

export const WhatsAppButton: React.FC = () => {
    const phoneNumber = '+919152559833'; // Placeholder
    const message = 'Hello! I would like to inquire about your services.';

    return (
        <a
            href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                width: '60px',
                height: '60px',
                backgroundColor: '#25D366',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1000,
                transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <svg viewBox="0 0 24 24" width="30" height="30" fill="white">
                <path d="M12.031 6.172c-2.32 0-4.525.903-6.163 2.541-3.4 3.4-3.4 8.926 0 12.326l-1.093 3.991 4.089-1.073c1.01.551 2.146.843 3.32.843 3.778 0 6.85-3.072 6.85-6.85 0-1.838-.716-3.563-2.015-4.864-1.299-1.302-3.024-2.014-4.864-2.014L12.031 6.172zM12.031 18c-1.156 0-2.296-.282-3.303-.816l-.237-.126-2.434.638.65-2.368-.142-.224c-.588-.936-.9-2.029-.9-3.155 0-3.309 2.691-6 6-6 1.603 0 3.111.625 4.242 1.758 1.134 1.134 1.758 2.64 1.758 4.242 0 3.308-2.691 6-6 6zM15.547 13.911c-.191-.096-1.134-.559-1.31-.622-.176-.064-.304-.096-.432.096-.128.191-.497.622-.609.75-.112.128-.224.144-.416.048-.191-.096-.81-.299-1.543-.953-.57-.508-.954-1.136-1.066-1.328-.112-.191-.012-.295.084-.391.087-.087.191-.224.288-.336.096-.112.128-.191.191-.32.064-.128.032-.24-.016-.336-.048-.096-.432-1.04-.592-1.424-.156-.374-.313-.323-.432-.329-.111-.005-.239-.006-.367-.006-.128 0-.336.048-.512.24-.176.191-.672.656-.672 1.6 0 .944.688 1.856.784 1.984.096.128 1.355 2.069 3.28 2.903.458.199.815.318 1.094.406.46.146.879.125 1.209.076.368-.054 1.134-.464 1.294-.912.16-.448.16-.832.112-.912-.048-.08-.176-.128-.368-.224z" />
            </svg>
        </a>
    );
};
