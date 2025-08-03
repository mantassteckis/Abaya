import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Trash2 } from "lucide-react";

import IconButton from "@/components/ui/icon-button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { CartItem, Color, Size } from "@/types";
import { useStore } from "@/contexts/store-context";

interface CartItemProps {
  data: CartItem;
}

const CartItemDialog: React.FC<CartItemProps> = ({ data }) => {
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

  const onRemove = () => {
    cart.removeItem(data.product.id, data.variant.id);
  };

  return (
    <li className="flex items-center py-4 border-b group hover:bg-gray-50 transition-colors">
      <Link href={`/product/${data.product.id}`} className="relative w-20 h-20 overflow-hidden rounded-md cursor-pointer hover:opacity-80 transition-opacity">
        <Image
          fill
          src={data.product.images[0]!.url}
          alt={data.product.name}
          className="object-cover object-center"
          sizes="80px"
        />
      </Link>
      <div className="relative flex flex-col justify-between flex-1 ml-4 ">
        <div className="absolute right-0 z-10 top-6">
          <IconButton onClick={onRemove} icon={<Trash2 size={15} />} />
        </div>
        <div className="relative pr-9 ">
          <div className="flex justify-between">
            <Link href={`/product/${data.product.id}`} className="hover:underline">
              <p className="text-lg font-semibold text-black cursor-pointer">
                {data.product.name}
              </p>
            </Link>
          </div>

          <div className="flex mt-1 text-sm items-center">
            <p className="text-gray-500">Color:</p>
            {!isLoading && (
              <>
                <div 
                  className="w-3 h-3 rounded-full border border-gray-300 ml-2 mr-1"
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
            <p className="pl-4 ml-4 text-gray-500 border-l border-gray-200">
              Size:
            </p>
            <p className="font-semibold">
              &nbsp;{isLoading ? '...' : getSizeName(data.variant.sizeId)}
            </p>
          </div>
          <div className="flex mb-2 text-sm">
            <p className="text-gray-500">Quantity</p>
            <p className="font-semibold">&nbsp;{data.quantity}</p>
          </div>
          <Currency value={data.product.price * data.quantity} />
        </div>
      </div>
    </li>
  );
};

export default CartItemDialog;
