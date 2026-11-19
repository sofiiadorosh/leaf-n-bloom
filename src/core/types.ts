import type { CATEGORIES } from '../constants/categories';
import type { LIGHT_LEVELS } from '../constants/light';

export type CategoryId = (typeof CATEGORIES)[number]['id'];

export type LightLevel = (typeof LIGHT_LEVELS)[number]['id'];

export type Category = {
  id: CategoryId;
  name: string;
};

export type CategorySummary = Category & {
  count: number;
  image?: string;
};

export type ProductSize = {
  inches: number;
  price: number;
};

export type Product = {
  id: string;
  name: string;
  tag: string;
  category: CategoryId;
  sizes: readonly [ProductSize, ...ProductSize[]];
  description: string;
  images: readonly string[];
  light?: LightLevel;
  petSafe?: boolean;
  isBestSeller?: boolean;
};

export type PriceBounds = {
  min: number;
  max: number;
};

export type ElementOptions = {
  className?: string;
  text?: string;
  attributes?: Record<string, string | number>;
  children?: readonly (Node | string)[];
};

export type CartItem = {
  productId: Product['id'];
  inches: ProductSize['inches'];
  quantity: number;
};
