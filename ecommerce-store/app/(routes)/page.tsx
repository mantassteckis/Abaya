"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/contexts/store-context";
import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import Billboard from "@/components/billboard";
import ProductList from "@/components/product-list";
import Container from "@/components/ui/container";
import NoResults from "@/components/ui/no-results";

const HomePage = () => {
  const { selectedStore } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [billboard, setBillboard] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedStore) {
        setProducts([]);
        setBillboard(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("Loading data for store:", selectedStore.name);
        
        const [fetchedProducts, fetchedBillboard] = await Promise.all([
          getProducts({ isFeatured: true, storeId: selectedStore.id }),
          getBillboard("", selectedStore.id)
        ]);
        
        setProducts(fetchedProducts);
        setBillboard(fetchedBillboard);
        console.log("Data loaded - Products:", fetchedProducts.length);
      } catch (error) {
        console.error("Error loading data:", error);
        setProducts([]);
        setBillboard(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedStore]);

  if (isLoading) {
    return (
      <div className="bg-background">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-neutral-500">Loading store data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedStore) {
    return (
      <div className="bg-background">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-neutral-500">Please select a store from the navbar</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="m-0 space-y-10">
        {billboard && (
          <Billboard
            data={billboard}
            rounded=""
            additionalProps="transition aspect-[3.3/1] p-0 rounded-none"
          />
        )}
      </div>
      <Container>
        <div className="flex flex-col px-8 pb-8 gap-y-8 sm:px-6 lg:px-8">
          {products.length > 0 ? (
            <ProductList
              title="Featured Products"
              items={products}
            />
          ) : (
            <div className="mt-6">
              <NoResults />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
