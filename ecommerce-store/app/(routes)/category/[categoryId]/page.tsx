"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/contexts/store-context";
import getCategory from "@/actions/get-category";
import getProducts from "@/actions/get-products";

import Container from "@/components/ui/container";
import ProductCard from "@/components/ui/product-card";
import NoResults from "@/components/ui/no-results";

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
  searchParams: {
    colorId?: string;
    sizeId?: string;
  };
}

const CategoryPage: React.FC<CategoryPageProps> = ({
  params,
  searchParams,
}) => {
  const { selectedStore } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      if (!selectedStore) {
        setProducts([]);
        setCategory(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('Loading category page data for store:', selectedStore.name);
        
        const [fetchedProducts, fetchedCategory] = await Promise.all([
          getProducts({
            categoryId: params.categoryId,
            colorId: searchParams.colorId,
            sizeId: searchParams.sizeId,
            storeId: selectedStore.id,
          }),
          getCategory(params.categoryId, selectedStore.id),
        ]);
        
        setProducts(fetchedProducts);
        setCategory(fetchedCategory);
      } catch (error) {
        console.error('Error loading category page data:', error);
        setProducts([]);
        setCategory({
          id: '',
          name: 'Category Not Found',
          billboard: {
            id: '',
            label: 'No Billboard Available',
            imageUrl: 'https://via.placeholder.com/1200x400',
          },
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [selectedStore, params.categoryId, searchParams.colorId, searchParams.sizeId]);

  return (
    <div className="bg-background">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          {/* Category title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black">
              {category?.name || 'Category'}
            </h1>
            <p className="text-neutral-500 text-sm mt-2">
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </p>
          </div>
          
          {/* Products */}
          <div className="mt-6">
            {products.length === 0 && <NoResults />}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((item) => (
                <ProductCard key={item.id} data={item} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CategoryPage;
