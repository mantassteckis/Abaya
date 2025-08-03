import { Category } from "@/types";
import fetcher from "@/lib/fetcher";

const getCategories = async (storeId?: string): Promise<Category[]> => {
  try {
    // Use provided storeId or fallback to environment variable
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/[^\/]+$/, '') || 'http://localhost:3000';
    const targetStoreId = storeId || process.env.NEXT_PUBLIC_STORE_ID;
    
    if (!targetStoreId) {
      console.error("No store ID available for fetching categories");
      return [];
    }
    
    const URL = `${baseUrl}/api/${targetStoreId}/categories`;
    console.log("Fetching categories from API:", URL);
    
    const data = await fetcher<Category[]>(URL);
    // Filter to only show active categories on the store front
    const activeCategories = data.filter(category => category.isActive);
    console.log(`Successfully fetched ${activeCategories.length} active categories from API`);
    return activeCategories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export default getCategories;
