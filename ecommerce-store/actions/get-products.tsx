import qs from "query-string";
import { Product } from "@/types";

interface Query {
  name?: string;
  categoryId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
  storeId?: string;
}

const getProducts = async (query: Query): Promise<Product[]> => {
  try {
    console.log("Fetching products with query:", query);
    
    // Use provided storeId or fallback to environment variable
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/[^\/]+$/, '') || 'http://localhost:3000';
    const targetStoreId = query.storeId || process.env.NEXT_PUBLIC_STORE_ID;
    
    if (!targetStoreId) {
      console.error("No store ID available for fetching products");
      return [];
    }
    
    const URL = `${baseUrl}/api/${targetStoreId}/products`;
    
    const url = qs.stringifyUrl({
      url: URL,
      query: {
        name: query.name,
        colorId: query.colorId,
        sizeId: query.sizeId,
        categoryId: query.categoryId,
        isFeatured: query.isFeatured,
      },
    });
    
    console.log("Fetching products from API:", url);
    const res = await fetch(url, { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!res.ok) {
      console.error(`Error fetching products from API: ${res.status} ${res.statusText}`);
      return [];
    }
    
    const data = await res.json();
    console.log(`Successfully loaded ${data.length} products from API`);
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export default getProducts;
