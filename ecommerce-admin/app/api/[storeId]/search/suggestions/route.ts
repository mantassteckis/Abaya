import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!query || query.length < 2) {
      return NextResponse.json([], { headers: corsHeaders });
    }

    // Get product name suggestions
    const productSuggestions = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        isArchived: false,
        category: {
          isActive: true,
        },
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
        category: {
          select: {
            name: true,
          },
        },
        price: true,
      },
      take: 5,
      orderBy: {
        isFeatured: 'desc',
      },
    });

    // Get category suggestions
    const categorySuggestions = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
        isActive: true,
        name: { contains: query, mode: 'insensitive' },
      },
      select: {
        id: true,
        name: true,
        billboard: {
          select: {
            imageUrl: true,
          },
        },
      },
      take: 3,
    });

    // Combine suggestions
    const suggestions = {
      products: productSuggestions.map(product => ({
        id: product.id,
        name: product.name,
        type: 'product',
        category: product.category.name,
        price: product.price,
        image: product.images[0]?.url || null,
      })),
      categories: categorySuggestions.map(category => ({
        id: category.id,
        name: category.name,
        type: 'category',
        image: category.billboard?.imageUrl || null,
      })),
    };

    return NextResponse.json(suggestions, { headers: corsHeaders });
  } catch (error) {
    console.log("[SEARCH_SUGGESTIONS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
