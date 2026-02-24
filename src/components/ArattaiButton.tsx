'use client';

import React from 'react';

export const ArattaiButton: React.FC = () => {
    return (
        <a
            href="https://arattai.in/mysticpathwaysbyshilpi"
            target="_blank"
            rel="noopener noreferrer"
            style={{
                position: 'fixed',
                bottom: '6.5rem',
                right: '2rem',
                width: '60px',
                height: '60px',
                backgroundColor: '#de3d26', // Arattai brand color approx
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1000,
                transition: 'transform 0.3s ease',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '2rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            title="Chat on Arattai"
        >
            A
        </a>
    );
};
