"use client";

import { useStore } from '@/contexts/store-context';

export const useStoreApi = () => {
  const { selectedStore } = useStore();

  const getStoreApiUrl = () => {
    if (!selectedStore) {
      // Fallback to environment variable or default
      return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/default';
    }
    
    // Get base admin URL
    const currentApiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const baseUrl = currentApiUrl.replace(/\/api\/[^\/]+$/, '') || 'http://localhost:3000';
    
    return `${baseUrl}/api/${selectedStore.id}`;
  };

  return {
    storeApiUrl: getStoreApiUrl(),
    selectedStore,
    storeId: selectedStore?.id || null,
  };
};
