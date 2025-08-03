import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    
    if (!orderId) {
      return new NextResponse("Order ID is required", { status: 400 });
    }

    // Update the order to mark it as paid
    const order = await prismadb.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
      },
      include: {
        orderItems: true,
      },
    });

    // Update stock levels
    const variantUpdates = order.orderItems.map(async (orderItem) => {
      const variant = await prismadb.variant.findUnique({
        where: { id: orderItem.variantId },
      });

      if (!variant) {
        throw new Error(`Variant with id ${orderItem.variantId} not found.`);
      }

      if (variant.inStock < orderItem.quantity) {
        throw new Error(`Not enough items in stock for variant id ${orderItem.variantId}.`);
      }

      const updatedVariant = await prismadb.variant.update({
        where: { id: variant.id },
        data: {
          inStock: variant.inStock - orderItem.quantity,
        },
      });

      return updatedVariant;
    });

    await Promise.all(variantUpdates);

    return NextResponse.json({ 
      message: "Order marked as paid successfully", 
      order: order 
    });
  } catch (error) {
    console.error("Error in test webhook:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
