export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
  labelColorType?: string;
  labelSolidColor?: string;
  labelGradientStart?: string;
  labelGradientEnd?: string;
  labelGradientDirection?: string;
}

export interface Category {
  id: string;
  name: string;
  billboard: Billboard;
  isActive: boolean;
}

export interface CartItem {
  product: Product;
  variant: Variant;
  quantity: number;
}
export interface Variant {
  id: string;
  colorId: string;
  sizeId: string;
  inStock: number;
  color?: Color;
  size?: Size;
}

export interface Product {
  id: string;
  category: Category;
  name: string;
  price: number;
  isFeatured: boolean;
  images: Image[];
  description: string;
  variants: Variant[];
}

export interface Size {
  id: string;
  name: string;
  value: string;
}

export interface Color {
  id: string;
  name: string;
  value: string;
}

export interface Image {
  id: string;
  url: string;
}
