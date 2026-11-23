import type { BADGES } from '../constants/catalog/badges';
import type { CATEGORIES } from '../constants/catalog/categories';
import type { EXTRA_CARE } from '../constants/catalog/extraCare';
import type { PRODUCT_FEATURES } from '../constants/catalog/features';
import type { LIGHT_LEVELS } from '../constants/filters/light';
import type { SORT_ORDERS } from '../constants/filters/sort';

export type CategoryId = (typeof CATEGORIES)[number]['id'];

export type BadgeId = (typeof BADGES)[number]['id'];

export type LightLevel = (typeof LIGHT_LEVELS)[number]['id'];

export type ProductFeature = (typeof PRODUCT_FEATURES)[number];

export type ProductFeatureId = ProductFeature['id'];

export type ExtraCareItem = (typeof EXTRA_CARE)[number];

export type ExtraCareId = ExtraCareItem['id'];

export type CareDetail = {
  label: string;
  value: string;
};

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
  height?: string;
  watering?: string;
  features?: readonly Exclude<ProductFeatureId, 'pet-safe'>[];
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

export type CartLine = {
  productId: Product['id'];
  size: ProductSize['inches'];
  extras: readonly ExtraCareId[];
};

export type CartItem = CartLine & {
  quantity: number;
};
