import type { BADGES } from '../constants/catalog/badges';
import type { CATEGORIES } from '../constants/catalog/categories';
import type { LIGHT_LEVELS } from '../constants/filters/light';
import type { SORT_ORDERS } from '../constants/filters/sort';

export type CategoryId = (typeof CATEGORIES)[number]['id'];

export type BadgeId = (typeof BADGES)[number]['id'];

export type LightLevel = (typeof LIGHT_LEVELS)[number]['id'];

export type SortOrder = (typeof SORT_ORDERS)[number];

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
  rating: number;
  category: CategoryId;
  sizes: readonly [ProductSize, ...ProductSize[]];
  description: string;
  images: readonly string[];
  light?: LightLevel;
  petSafe?: boolean;
  badge?: BadgeId;
};

export type PriceBounds = {
  min: number;
  max: number;
};

export type ProductFilters = {
  search: string;
  category: CategoryId | 'all';
  light: readonly LightLevel[];
  petSafe: boolean;
  priceMin: number | null;
  priceMax: number | null;
  sort: SortOrder;
};

export type ElementTagNameMap = HTMLElementTagNameMap &
  Pick<SVGElementTagNameMap, 'svg' | 'use'>;

export type ElementOptions = {
  className?: string;
  text?: string;
  attributes?: Record<string, string | number>;
  children?: readonly (Node | string)[];
};

export type CartItem = {
  productId: Product['id'];
  quantity: number;
};
