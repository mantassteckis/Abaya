"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Clock, Trash2, Loader2 } from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import { MountedCheck } from "@/lib/mounted-check";

interface EnhancedSearchInputProps {
  placeholder?: string;
  onClose?: () => void;
  autoFocus?: boolean;
  className?: string;
}

const EnhancedSearchInput: React.FC<EnhancedSearchInputProps> = ({
  placeholder = "Search products, categories...",
  onClose,
  autoFocus = false,
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const {
    query,
    setQuery,
    suggestions,
    isLoading,
    searchHistory,
    addToSearchHistory,
    clearSearchHistory,
  } = useSearch();

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    addToSearchHistory(searchQuery);
    setIsFocused(false);
    onClose?.();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSuggestionClick = (suggestion: any) => {
    if (suggestion.type === 'product') {
      router.push(`/product/${suggestion.id}`);
    } else if (suggestion.type === 'category') {
      router.push(`/category/${suggestion.id}`);
    }
    setIsFocused(false);
    onClose?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allSuggestions = [
      ...suggestions.products,
      ...suggestions.categories,
      ...searchHistory.map(item => ({ id: item, name: item, type: 'history' as const })),
    ];

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < allSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && allSuggestions[selectedIndex]) {
        const selected = allSuggestions[selectedIndex];
        if (selected.type === 'history') {
          setQuery(selected.name);
          handleSearch(selected.name);
        } else {
          handleSuggestionClick(selected);
        }
      } else {
        handleSearch(query);
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      onClose?.();
    }
  };

  const showSuggestions = isFocused && (
    suggestions.products.length > 0 || 
    suggestions.categories.length > 0 || 
    searchHistory.length > 0
  );

  return (
    <MountedCheck>
      <div className={`relative w-full ${className}`}>
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                // Delay hiding suggestions to allow click events
                setTimeout(() => setIsFocused(false), 200);
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Searching...</span>
              </div>
            )}

            {!isLoading && (
              <>
                {/* Search History */}
                {searchHistory.length > 0 && query.length === 0 && (
                  <div className="p-2 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500 uppercase">Recent Searches</span>
                      <button
                        onClick={clearSearchHistory}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                    {searchHistory.map((item, index) => (
                      <button
                        key={item}
                        onClick={() => {
                          setQuery(item);
                          handleSearch(item);
                        }}
                        className="flex items-center w-full px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded"
                      >
                        <Clock className="h-3 w-3 mr-2 text-gray-400" />
                        {item}
                      </button>
                    ))}
                  </div>
                )}

                {/* Product Suggestions */}
                {suggestions.products.length > 0 && (
                  <div className="p-2 border-b border-gray-100">
                    <span className="text-xs font-medium text-gray-500 uppercase mb-2 block">Products</span>
                    {suggestions.products.map((product, index) => (
                      <button
                        key={product.id}
                        onClick={() => handleSuggestionClick(product)}
                        className="flex items-center w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                      >
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-8 h-8 object-cover rounded mr-3"
                          />
                        )}
                        <div className="flex-1 text-left">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.category}</div>
                        </div>
                        {product.price && (
                          <div className="text-sm font-medium text-accent">
                            ${product.price}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Category Suggestions */}
                {suggestions.categories.length > 0 && (
                  <div className="p-2">
                    <span className="text-xs font-medium text-gray-500 uppercase mb-2 block">Categories</span>
                    {suggestions.categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleSuggestionClick(category)}
                        className="flex items-center w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                      >
                        {category.image && (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-8 h-8 object-cover rounded mr-3"
                          />
                        )}
                        <div className="flex-1 text-left">
                          <div className="font-medium">{category.name}</div>
                          <div className="text-xs text-gray-500">Category</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </MountedCheck>
  );
};

export default EnhancedSearchInput;
