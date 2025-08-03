import { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/contexts/store-context';

interface SearchSuggestion {
  id: string;
  name: string;
  type: 'product' | 'category';
  category?: string;
  price?: number;
  image?: string | null;
}

interface SearchSuggestions {
  products: SearchSuggestion[];
  categories: SearchSuggestion[];
}

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestions>({
    products: [],
    categories: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const { selectedStore } = useStore();

  // Load search history from localStorage on mount
  useEffect(() => {
    const history = localStorage.getItem('search-history');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery || searchQuery.length < 2 || !selectedStore) {
        setSuggestions({ products: [], categories: [] });
        setIsLoading(false);
        return;
      }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/[^\/]+$/, '') || 'http://localhost:3000';
        const response = await fetch(
          `${baseUrl}/api/${selectedStore.id}/search/suggestions?q=${encodeURIComponent(searchQuery)}`
        );

        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        }
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
        setSuggestions({ products: [], categories: [] });
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [selectedStore]
  );

  // Effect to trigger debounced search
  useEffect(() => {
    if (query) {
      setIsLoading(true);
      debouncedSearch(query);
    } else {
      setSuggestions({ products: [], categories: [] });
      setIsLoading(false);
    }
  }, [query, debouncedSearch]);

  // Function to add search to history
  const addToSearchHistory = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const newHistory = [searchQuery, ...searchHistory.filter(item => item !== searchQuery)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('search-history', JSON.stringify(newHistory));
  };

  // Function to clear search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('search-history');
  };

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    searchHistory,
    addToSearchHistory,
    clearSearchHistory,
  };
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}
