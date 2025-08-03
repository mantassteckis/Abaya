"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X, ChevronDown } from "lucide-react";
import { useStore } from "@/contexts/store-context";

interface FilterOption {
  id: string;
  name: string;
  value: string;
}

interface SearchFiltersProps {
  onFiltersChange?: (filters: any) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFiltersChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [colors, setColors] = useState<FilterOption[]>([]);
  const [sizes, setSizes] = useState<FilterOption[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedFilters, setSelectedFilters] = useState({
    categoryId: '',
    colorId: '',
    sizeId: '',
    minPrice: 0,
    maxPrice: 1000,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedStore } = useStore();

  // Load filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      if (!selectedStore) return;

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/[^\/]+$/, '') || 'http://localhost:3000';
        
        // Load categories
        const categoriesRes = await fetch(`${baseUrl}/api/${selectedStore.id}/categories`);
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData.filter((cat: any) => cat.isActive).map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            value: cat.id,
          })));
        }

        // Load colors
        const colorsRes = await fetch(`${baseUrl}/api/${selectedStore.id}/colors`);
        if (colorsRes.ok) {
          const colorsData = await colorsRes.json();
          setColors(colorsData.map((color: any) => ({
            id: color.id,
            name: color.name,
            value: color.id,
          })));
        }

        // Load sizes
        const sizesRes = await fetch(`${baseUrl}/api/${selectedStore.id}/sizes`);
        if (sizesRes.ok) {
          const sizesData = await sizesRes.json();
          setSizes(sizesData.map((size: any) => ({
            id: size.id,
            name: size.name,
            value: size.id,
          })));
        }
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };

    loadFilterOptions();
  }, [selectedStore]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    // Keep the search query
    const query = params.get('q');
    const newParams = new URLSearchParams();
    
    if (query) {
      newParams.set('q', query);
    }
    
    // Add filters to URL
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value && value !== '' && value !== 0) {
        newParams.set(key, value.toString());
      }
    });

    const newUrl = `/search?${newParams.toString()}`;
    router.push(newUrl, { scroll: false });
    
    // Notify parent component of filter changes
    onFiltersChange?.(selectedFilters);
  }, [selectedFilters, searchParams, router, onFiltersChange]);

  const handleFilterChange = (filterType: string, value: any) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      categoryId: '',
      colorId: '',
      sizeId: '',
      minPrice: 0,
      maxPrice: 1000,
    });
  };

  const hasActiveFilters = Object.values(selectedFilters).some(value => 
    value !== '' && value !== 0 && value !== 1000
  );

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Filter className="h-4 w-4" />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="bg-accent text-white text-xs rounded-full px-2 py-1">
            {Object.values(selectedFilters).filter(v => v !== '' && v !== 0 && v !== 1000).length}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Filters</h3>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Category Filter */}
            {categories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedFilters.categoryId}
                  onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.value}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Color Filter */}
            {colors.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <select
                  value={selectedFilters.colorId}
                  onChange={(e) => handleFilterChange('colorId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="">All Colors</option>
                  {colors.map((color) => (
                    <option key={color.id} value={color.value}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Size Filter */}
            {sizes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size
                </label>
                <select
                  value={selectedFilters.sizeId}
                  onChange={(e) => handleFilterChange('sizeId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="">All Sizes</option>
                  {sizes.map((size) => (
                    <option key={size.id} value={size.value}>
                      {size.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={selectedFilters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={selectedFilters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 1000)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
