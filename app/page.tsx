'use client';

import React, { useEffect } from 'react';

export default function RootPage() {
  useEffect(() => {
    // Redirect to the ecommerce-store application
    const storeUrl = process.env.NEXT_PUBLIC_STORE_URL || 'https://your-store-domain.netlify.app';
    window.location.href = storeUrl;
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Welcome to E-Commerce Project
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
        Redirecting to the store frontend...
      </p>
      <div>Loading...</div>
    </div>
  );
} 