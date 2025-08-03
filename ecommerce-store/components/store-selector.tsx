"use client";

import { useState } from 'react';
import { useStore } from '@/contexts/store-context';
import { 
  ChevronsUpDown, 
  Check, 
  Store as StoreIcon,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

const StoreSelector = () => {
  const { selectedStore, stores, setSelectedStore, isLoading, error, refreshStores } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleStoreSelect = (store: any) => {
    setSelectedStore(store);
    setIsOpen(false);
  };

  const handleRefresh = async () => {
    await refreshStores();
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-neutral-500">
        <RefreshCw className="w-4 h-4 animate-spin" />
        Loading stores...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-500">
        <span>Error loading stores</span>
        <button 
          onClick={handleRefresh}
          className="text-blue-500 hover:text-blue-700"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-neutral-500">
        <StoreIcon className="w-4 h-4" />
        No stores available
      </div>
    );
  }

  // Don't render if there's only one store - no point in showing dropdown
  if (stores.length === 1) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-neutral-100 transition-colors w-full md:w-auto"
      >
        <StoreIcon className="w-4 h-4" />
        <span className="max-w-32 md:max-w-32 truncate flex-1 text-left">
          {selectedStore?.name || 'Select Store'}
        </span>
        <ChevronsUpDown className="w-4 h-4 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full md:w-64 bg-white border rounded-md shadow-lg z-50">
          <div className="p-2 border-b">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Select Store</span>
              <button
                onClick={handleRefresh}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => handleStoreSelect(store)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-neutral-100 transition-colors",
                  selectedStore?.id === store.id && "bg-neutral-100"
                )}
              >
                <StoreIcon className="w-4 h-4" />
                <div className="flex-1 text-left">
                  <div className="font-medium">{store.name}</div>
                </div>
                {selectedStore?.id === store.id && (
                  <Check className="w-4 h-4 text-green-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default StoreSelector;
