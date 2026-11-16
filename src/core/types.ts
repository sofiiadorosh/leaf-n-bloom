import type { CATEGORIES } from '../data/categories';

export type CategoryId = (typeof CATEGORIES)[number]['id'];

export type Category = {
  id: CategoryId;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  description: string;
  image?: string;
  isBestSeller?: boolean;
};

export type CartItem = {
  productId: Product['id'];
  quantity: number;
};
