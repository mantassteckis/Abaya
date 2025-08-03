import { Billboard } from "@/types";

const getBillboard = async (id: string, storeId?: string): Promise<Billboard> => {
  try {
    console.log(`Fetching billboard with ID: ${id}`);
    
    // Use provided storeId or fallback to environment variable
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/[^\/]+$/, '') || 'http://localhost:3000';
    const targetStoreId = storeId || process.env.NEXT_PUBLIC_STORE_ID;
    
    if (!targetStoreId) {
      console.error("No store ID available for fetching billboard");
      return { id: '', label: 'No Store Selected', imageUrl: 'https://via.placeholder.com/1200x400' };
    }
    
    const URL = `${baseUrl}/api/${targetStoreId}/billboards`;
    
    // Try to fetch specific billboard
    if (id) {
      const res = await fetch(`${URL}/${id}`, { 
        cache: 'no-store',
        next: { revalidate: 0 } 
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log("Successfully loaded specific billboard from API");
        return data;
      }
    }
    
    // If no specific billboard or fetch failed, get first available
    console.log("Attempting to fetch all billboards from API");
    const allRes = await fetch(URL, { 
      cache: 'no-store',
      next: { revalidate: 0 } 
    });
    
    if (!allRes.ok) {
      console.error(`Failed to fetch all billboards from API: ${allRes.status} ${allRes.statusText}`);
      return { id: '', label: 'No Billboards Available', imageUrl: 'https://via.placeholder.com/1200x400' };
    }
    
    const billboards = await allRes.json();
    console.log(`Loaded ${billboards.length} billboards from API`);
    
    // Return the first billboard if available
    if (billboards && billboards.length > 0) {
      console.log("Using first billboard from API as fallback");
      return billboards[0];
    }
    
    // Return empty billboard as fallback
    console.log("No billboards found in API, using fallback");
    return { id: '', label: 'No Billboards Available', imageUrl: 'https://via.placeholder.com/1200x400' };
  } catch (error) {
    console.error('Error fetching billboard:', error);
    // Return empty billboard as fallback
    return { id: '', label: 'Failed to load content', imageUrl: 'https://via.placeholder.com/1200x400' };
  }
};

export default getBillboard;
