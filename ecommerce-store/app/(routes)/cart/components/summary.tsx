"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Color, Size } from "@/types";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { useStore } from "@/contexts/store-context";

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  const { selectedStore } = useStore();
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed.");
      removeAll();
    }

    if (searchParams.get("canceled")) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, removeAll]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedStore) {
        setIsLoading(false);
        return;
      }
      
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const baseUrl = apiUrl.replace(/\/api\/[^\/]+$/, '') || 'http://localhost:3000';

        // Fetch colors
        const colorsResponse = await fetch(`${baseUrl}/api/${selectedStore.id}/colors`);
        const colorsData = await colorsResponse.json();
        setColors(colorsData);

        // Fetch sizes
        const sizesResponse = await fetch(`${baseUrl}/api/${selectedStore.id}/sizes`);
        const sizesData = await sizesResponse.json();
        setSizes(sizesData);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching color and size data:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedStore]);

  // Get color name from color ID
  const getColorName = (colorId: string) => {
    const color = colors.find(c => c.id === colorId);
    return color ? color.name : colorId;
  };

  // Get size name from size ID
  const getSizeName = (sizeId: string) => {
    const size = sizes.find(s => s.id === sizeId);
    return size ? size.name : sizeId;
  };

  const totalPrice = items.reduce((total, item) => {
    return (
      total + Number(item.product.price) * item.quantity
    );
  }, 0);

  /* Checkout API to backend */
  const onCheckout = async () => {
    if (!selectedStore) {
      toast.error("Please select a store first");
      return;
    }
    
    try {
      // Use the store context to get the correct base URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const baseUrl = apiUrl.replace(/\/api\/[^\/]+$/, '') || 'http://localhost:3000';
      const checkoutUrl = `${baseUrl}/api/${selectedStore.id}/checkout`;
      
      const payload = {
        productVariants: items.map((item) => ({
          productId: item.product.id,
          variantId: item.variant.id,
        })),
        quantities: items.map((item) => item.quantity),
      };
      
      console.log('🚀 Checkout Request:', {
        url: checkoutUrl,
        payload: payload,
        itemsCount: items.length,
        selectedStore: selectedStore.name
      });
      
      const response = await axios.post(checkoutUrl, payload);

      console.log('✅ Checkout Response:', response);
      window.location = response.data.url;
    } catch (error: any) {
      console.error('❌ Checkout Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      toast.error(
        error?.response?.data?.error || error.message
      );
    }
  };

  return (
    <div className="px-4 py-6 mt-16 rounded-lg bg-gray-50 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      {/* Order summary */}
      <h2 className="text-lg font-medium text-gray-900">
        Order summary
      </h2>
      <div className="mt-6 ">
        {items.map((item) => (
          <div
            className="flex items-center justify-between py-2 border-t border-gray-200"
            key={item.product.id}
          >
            <div className="flex flex-col text-sm font-light titems-center">
              <span className="font-semibold">
                {item.product.name}
              </span>
              <div className="text-xs">
                {isLoading ? '...' : getColorName(item.variant.colorId)} |{" "}
                {isLoading ? '...' : getSizeName(item.variant.sizeId)} (x{item.quantity})
              </div>
            </div>

            <Currency
              className={["font-light", "text-sm"]}
              value={item.product.price * item.quantity}
            />
          </div>
        ))}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-base font-medium text-gray-900">
            Order total
          </div>
          <Currency value={totalPrice} />
        </div>
      </div>
      <Button
        onClick={onCheckout}
        disabled={items.length === 0}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </div>
  );
};

export default Summary;
