import type { CATEGORIES } from '../constants/categories';

export type CategoryId = (typeof CATEGORIES)[number]['id'];

export type Category = {
  id: CategoryId;
  name: string;
};

export type ProductSize = {
  inches: number;
  price: number;
};

export type Product = {
  id: string;
  name: string;
  category: CategoryId;
  sizes: readonly ProductSize[];
  description: string;
  images: readonly string[];
  isBestSeller?: boolean;
};

export type CartItem = {
  productId: Product['id'];
  inches: ProductSize['inches'];
  quantity: number;
};
