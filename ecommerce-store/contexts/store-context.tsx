"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs';

interface Store {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface StoreContextType {
  selectedStore: Store | null;
  stores: Store[];
  setSelectedStore: (store: Store) => void;
  isLoading: boolean;
  error: string | null;
  refreshStores: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const { getToken, isLoaded, userId } = useAuth();
  const [selectedStore, setSelectedStoreState] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get admin API URL (without store ID)
  const getAdminApiUrl = () => {
    const currentApiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    // Remove the store ID from the URL to get base admin URL
    const baseUrl = currentApiUrl.replace(/\/api\/[^\/]+$/, '');
    return baseUrl || 'http://localhost:3000';
  };

  const fetchStores = async (): Promise<Store[]> => {
    try {
      if (!isLoaded || !userId) {
        throw new Error('User not authenticated');
      }
      
      console.log('Fetching stores from admin API...');
      const adminUrl = getAdminApiUrl();
      const token = await getToken();
      
      const response = await fetch(`${adminUrl}/api/stores`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stores: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched stores:', data);
      return data;
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw error;
    }
  };

  const refreshStores = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedStores = await fetchStores();
      setStores(fetchedStores);
      
      // If no store is selected, select the first one
      if (!selectedStore && fetchedStores.length > 0) {
        setSelectedStoreState(fetchedStores[0]);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load stores');
    } finally {
      setIsLoading(false);
    }
  };

  const setSelectedStore = (store: Store) => {
    setSelectedStoreState(store);
    // Store the selected store in localStorage
    localStorage.setItem('selectedStore', JSON.stringify(store));
  };

  useEffect(() => {
    // Only run when auth is loaded
    if (!isLoaded) return;
    
    // Load selected store from localStorage on mount
    const savedStore = localStorage.getItem('selectedStore');
    if (savedStore) {
      try {
        const parsed = JSON.parse(savedStore);
        setSelectedStoreState(parsed);
      } catch (error) {
        console.error('Error parsing saved store:', error);
      }
    }
    
    // Fetch available stores if user is authenticated
    if (userId) {
      refreshStores();
    } else {
      setIsLoading(false);
    }
  }, [isLoaded, userId]);

  const value: StoreContextType = {
    selectedStore,
    stores,
    setSelectedStore,
    isLoading,
    error,
    refreshStores,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
