"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  X,
} from "lucide-react";

import IconButton from "@/components/ui/icon-button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { CartItem, Color, Size } from "@/types";
import { useStore } from "@/contexts/store-context";

interface CartItemProps {
  data: CartItem;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();
  const { selectedStore } = useStore();
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Get color value from color ID
  const getColorValue = (colorId: string) => {
    const color = colors.find(c => c.id === colorId);
    return color ? color.value : '#000000';
  };

  // Get size name from size ID
  const getSizeName = (sizeId: string) => {
    const size = sizes.find(s => s.id === sizeId);
    return size ? size.name : sizeId;
  };

  return (
    <li className="flex py-6 border-b">
      {/* Product info - Image -> Name -> Color -> Size */}
      <Link href={`/product/${data.product.id}`} className="relative w-24 h-24 overflow-hidden rounded-md sm:h-48 sm:w-48 cursor-pointer hover:opacity-80 transition-opacity">
        <Image
          fill
          src={data.product.images[0].url}
          alt={data.product.name}
          className="object-cover object-center"
          sizes="(max-width: 640px) 96px, 192px"
        />
      </Link>
      <div className="relative flex flex-col justify-between flex-1 ml-4 sm:ml-6">
        <div className="flex items-start justify-between">
          <div>
            <Link href={`/product/${data.product.id}`} className="hover:underline">
              <p className="text-lg font-semibold text-black cursor-pointer">
                {data.product.name}
              </p>
            </Link>
            <div className="mt-1 mb-2 text-sm ">
              <div className="flex flex-row items-center">
                <p className="text-gray-500">Color: </p>
                {!isLoading && (
                  <>
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300 ml-2 mr-1"
                      style={{
                        backgroundColor: getColorValue(data.variant.colorId)
                      }}
                    />
                    <p className="font-semibold">
                      {getColorName(data.variant.colorId)}
                    </p>
                  </>
                )}
                {isLoading && <p className="font-semibold ml-2">...</p>}
              </div>
              <div className="flex flex-row">
                <p className="text-gray-500 ">Size:</p>
                <p className="font-semibold">
                  &nbsp;{isLoading ? '...' : getSizeName(data.variant.sizeId)}
                </p>{" "}
              </div>
            </div>
          </div>
          <div>
            {/* Action buttons -> Delete Decrease Add */}
            <div className="flex items-center gap-x-2">
              <IconButton
                onClick={() =>
                  cart.removeItem(
                    data.product.id,
                    data.variant.id
                  )
                }
                icon={<Trash2 size={15} />}
                aria-label="Remove item"
                className="ml-4"
              />
            </div>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-x-2">
            <IconButton
              onClick={() =>
                cart.decreaseItem(
                  data.product.id,
                  data.variant.id
                )
              }
              icon={<ChevronDown size={15} />}
              aria-label="Decrease quantity"
            />
            <p className="mx-2">{data.quantity}</p>

            <IconButton
              onClick={() =>
                cart.addItem(data.product, data.variant)
              }
              icon={<ChevronUp size={15} />}
              aria-label="Increase quantity"
            />
          </div>
          <Currency
            value={data.product.price * data.quantity}
            aria-label="Checkout"
          />
        </div>
      </div>
    </li>
  );
};

export default CartItem;
