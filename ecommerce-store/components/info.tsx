"use client";
import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";

import { Product } from "@/types";
import Currency from "@/components/ui/currency";
import Button from "@/components/ui/button";
import FavoriteButton from "@/components/ui/favorite-button";
import useCart from "@/hooks/use-cart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import SizeTable from "./size-table";

interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [filteredSizeOptions, setFilteredSizeOptions] = useState<string[]>([]);
  // Since we have color and size data in variants, we don't need external fetching
  // unless variants don't have the expanded data

  const colorOptions = Array.from(
    new Set(data.variants.map((variant) => variant.colorId))
  );

  // Get color name from color ID
  const getColorName = (colorId: string) => {
    const variant = data.variants.find(v => v.colorId === colorId);
    if (variant && variant.color) {
      return variant.color.name;
    }
    return colorId; // Fallback to ID if no color name found
  };

  // Get color value from color ID
  const getColorValue = (colorId: string) => {
    const variant = data.variants.find(v => v.colorId === colorId);
    if (variant && variant.color) {
      return variant.color.value;
    }
    return '#000000'; // Fallback to black if no color value found
  };

  // Get size name from size ID
  const getSizeName = (sizeId: string) => {
    const variant = data.variants.find(v => v.sizeId === sizeId);
    if (variant && variant.size) {
      return variant.size.name;
    }
    return sizeId; // Fallback to ID if no size name found
  };

  const onColorSelect = (color: string) => {
    setSelectedColor(color);
    const relatedVariants = data.variants.filter(
      (variant) => variant.colorId === color
    );
    const relatedSizes = Array.from(
      new Set(
        relatedVariants.map((variant) => variant.sizeId)
      )
    );
    setFilteredSizeOptions(relatedSizes);
  };

  const onAddToCart = () => {
    const variantToAdd = data.variants.find(
      (variant) =>
        variant.colorId === selectedColor &&
        variant.sizeId === selectedSize
    );

    if (variantToAdd) {
      cart.addItem(data, variantToAdd);
    }
  };


  return (
    <nav>
      {/* Name and Favorite Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">
          {data.name}
        </h1>
        <FavoriteButton 
          productId={data.id} 
          size="default" 
          variant="outline"
          className="ml-2"
        />
      </div>

      {/* Price */}
      <section className="flex items-end justify-between mt-3">
        <p className="text-2xl text-foreground">
          <Currency value={data.price} />
        </p>
      </section>
      <hr className="my-4" />

      {/* Size and Color */}
      <section className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">
            Color:
          </h3>
          {colorOptions.map((colorId, index) => (
            <Button
              key={index}
              onClick={() => onColorSelect(colorId)}
              className={`border-2 p-3 text-xs ${
                selectedColor === colorId
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground"
              }`}
              style={{
                backgroundColor: getColorValue(colorId),
                color: getColorValue(colorId) === '#ffffff' || getColorValue(colorId).toLowerCase() === 'white' || getColorValue(colorId) === '#ffff00' || getColorValue(colorId).toLowerCase() === 'yellow' ? '#000' : '#fff',
                border: selectedColor === colorId ? '2px solid #000' : '2px solid #ccc'
              }}
            >
              {getColorName(colorId)}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">
            Size:
          </h3>
          {filteredSizeOptions.map((sizeId, index) => (
            <Button
              key={index}
              onClick={() => setSelectedSize(sizeId)}
              className={`border-2 p-3 text-xs ${
                selectedSize === sizeId
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground"
              }`}
            >
              {getSizeName(sizeId)}
            </Button>
          ))}
        </div>

        {/* Description */}
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Description</AccordionTrigger>
            <AccordionContent>
              {data?.description}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Description */}
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Size table</AccordionTrigger>
            <AccordionContent>
              <SizeTable />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Add to cart */}
        <div className="flex items-center mt-4 gap-x-3">
          <Button
            onClick={onAddToCart}
            className="flex items-center gap-x-2 bg-primary text-primary-foreground"
            disabled={!selectedColor || !selectedSize}
          >
            Add To Cart
            <ShoppingCart size={20} />
          </Button>
        </div>
      </section>
    </nav>
  );
};

export default Info;
