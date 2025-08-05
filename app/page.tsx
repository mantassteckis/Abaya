'use client';

import React, { useEffect } from 'react';

export default function RootPage() {
  useEffect(() => {
    // For now, just show the welcome message instead of redirecting
    // You can later set up proper routing or redirect to your store domain
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
        Welcome to Abaya E-Commerce
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
        Your e-commerce platform is running successfully!
      </p>
      <div style={{ fontSize: '1rem', color: '#666' }}>
        Environment: {process.env.NODE_ENV}
      </div>
    </div>
  );
} 