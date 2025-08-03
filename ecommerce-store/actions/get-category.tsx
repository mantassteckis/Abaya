import { Category } from "@/types";
import fetcher from "@/lib/fetcher";

const getCategory = async (id: string, storeId?: string): Promise<Category> => {
  try {
    console.log(`Fetching category with id: ${id}`);
    
    // Use provided storeId or fallback to environment variable
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/[^\/]+$/, '') || 'http://localhost:3000';
    const targetStoreId = storeId || process.env.NEXT_PUBLIC_STORE_ID;
    
    if (!targetStoreId) {
      console.error("No store ID available for fetching category");
      return { id: '', name: 'Category Not Found', billboard: { id: '', label: 'No Billboard', imageUrl: 'https://via.placeholder.com/1200x400' } };
    }
    
    const URL = `${baseUrl}/api/${targetStoreId}/categories`;
    console.log(`Fetching from: ${URL}/${id}`);
    
    const data = await fetcher<Category>(`${URL}/${id}`);
    console.log(`Successfully fetched category: ${data.name}`);
    return data;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    return { id: '', name: 'Category Not Found', billboard: { id: '', label: 'No Billboard', imageUrl: 'https://via.placeholder.com/1200x400' } };
  }
};

export default getCategory;
