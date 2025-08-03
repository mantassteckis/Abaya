"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/contexts/store-context";

import { Product } from "@/types";
import getProducts from "@/actions/get-products";

import EnhancedSearchInput from "@/components/ui/enhanced-search-input";
import SearchFilters from "@/components/ui/search-filters";
import ProductCard from "@/components/ui/product-card";
import NoResults from "@/components/ui/no-results";
import Container from "@/components/ui/container";
import { Loader } from "@/components/ui/loader";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const { selectedStore } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

  const searchQuery = searchParams?.get("q") || "";
  const categoryId = searchParams?.get("categoryId") || "";
  const colorId = searchParams?.get("colorId") || "";
  const sizeId = searchParams?.get("sizeId") || "";
  const minPrice = parseInt(searchParams?.get("minPrice") || "0");
  const maxPrice = parseInt(searchParams?.get("maxPrice") || "1000");

  // Fetch products based on search query and filters
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedStore) return;

      setIsLoading(true);
      setError(null);

      try {
        const query: any = {
          storeId: selectedStore.id,
        };

        // Add search query if provided
        if (searchQuery && searchQuery.length >= 2) {
          query.name = searchQuery;
        }

        // Add filters
        if (categoryId) query.categoryId = categoryId;
        if (colorId) query.colorId = colorId;
        if (sizeId) query.sizeId = sizeId;

        const results = await getProducts(query);
        
        // Filter by price range on client side
        const filteredResults = results.filter(product => 
          product.price >= minPrice && product.price <= maxPrice
        );

        setProducts(filteredResults);
        setTotalResults(filteredResults.length);

        // If no results and there's a search query, get suggested products
        if (filteredResults.length === 0 && searchQuery) {
          const suggestedQuery = {
            storeId: selectedStore.id,
            isFeatured: true,
          };
          const suggested = await getProducts(suggestedQuery);
          setSuggestedProducts(suggested.slice(0, 8));
        } else {
          setSuggestedProducts([]);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedStore, searchQuery, categoryId, colorId, sizeId, minPrice, maxPrice]);

  const handleFiltersChange = (filters: any) => {
    // Filters are handled by URL parameters, no need to do anything here
  };

  if (error) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accent/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Products</h1>
          <div className="max-w-2xl mx-auto">
            <EnhancedSearchInput 
              placeholder="Search products, categories..." 
              className="w-full"
              autoFocus
            />
          </div>
        </div>

        {/* Search Warning */}
        {searchQuery && searchQuery.length < 2 && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-yellow-800">Please enter at least 2 characters to search</p>
            </div>
          </div>
        )}

        {/* Filters and Results */}
        {(searchQuery.length >= 2 || categoryId || colorId || sizeId) && (
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <SearchFilters onFiltersChange={handleFiltersChange} />
                {searchQuery && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{totalResults}</span> results for 
                    <span className="font-medium text-gray-900"> "{searchQuery}"</span>
                  </div>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader />
                <span className="ml-2 text-gray-600">Searching...</span>
              </div>
            )}

            {/* Search Results */}
            {!isLoading && (
              <div>
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} data={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <NoResults />
                    
                    {/* Suggested Products */}
                    {suggestedProducts.length > 0 && (
                      <div className="mt-12">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">You might also like</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                          {suggestedProducts.map((product) => (
                            <ProductCard key={product.id} data={product} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Default State - No Search Query */}
        {!searchQuery && !categoryId && !colorId && !sizeId && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Start searching</h2>
                <p className="text-gray-600">Enter a product name, category, or use filters to find what you're looking for.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default SearchPage;
