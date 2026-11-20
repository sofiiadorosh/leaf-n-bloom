import { DEFAULT_FILTERS } from '../../constants/filters/filters';
import { getMinPrice } from './catalog';
import {
  isCategoryId,
  isLightLevel,
  isSortOrder,
  parsePrice,
} from './filterGuards';
import type { Product, ProductFilters, SortOrder } from '../types';

const getString = (data: FormData, key: string): string | null => {
  const value = data.get(key);

  return typeof value === 'string' ? value : null;
};

export const parseFilters = (data: FormData): ProductFilters => {
  const category = String(data.get('category') ?? '');
  const sort = String(data.get('sort') ?? '');

  return {
    search: String(data.get('search') ?? ''),
    category: isCategoryId(category) ? category : DEFAULT_FILTERS.category,
    light: data.getAll('light').map(String).filter(isLightLevel),
    petSafe: data.has('petSafe'),
    priceMin: parsePrice(getString(data, 'priceMin')),
    priceMax: parsePrice(getString(data, 'priceMax')),
    sort: isSortOrder(sort) ? sort : DEFAULT_FILTERS.sort,
  };
};

const matchesFilters = (
  product: Product,
  { search, category, light, petSafe, priceMin, priceMax }: ProductFilters,
): boolean => {
  const query = search.trim().toLowerCase();
  const price = getMinPrice(product);

  return (
    (!query || product.name.toLowerCase().includes(query)) &&
    (category === 'all' || product.category === category) &&
    (!light.length ||
      (product.light !== undefined && light.includes(product.light))) &&
    (!petSafe || product.petSafe === true) &&
    (priceMin === null || price >= priceMin) &&
    (priceMax === null || price <= priceMax)
  );
};

const sortProducts = (products: Product[], sort: SortOrder): Product[] => {
  if (sort === 'default') {
    return products;
  }

  const direction = sort === 'price-asc' ? 1 : -1;

  return products.sort((a, b) => (getMinPrice(a) - getMinPrice(b)) * direction);
};

export const filterProducts = (
  products: readonly Product[],
  filters: ProductFilters,
): Product[] =>
  sortProducts(
    products.filter((product) => matchesFilters(product, filters)),
    filters.sort,
  );
