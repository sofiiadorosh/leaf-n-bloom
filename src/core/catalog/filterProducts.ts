import { DEFAULT_FILTERS } from '../../constants/filters/filters';
import { getMinPrice } from './catalog';
import {
  isCategoryId,
  isLightLevel,
  isSortOrder,
  parsePrice,
} from './filterGuards';
import type { Product, ProductFilters, SortOrder } from '../types';

const getString = (formData: FormData, key: string): string | null => {
  const fieldValue = formData.get(key);

  return typeof fieldValue === 'string' ? fieldValue : null;
};

export const parseFilters = (formData: FormData): ProductFilters => {
  const category = String(formData.get('category') ?? '');
  const sort = String(formData.get('sort') ?? '');

  return {
    search: String(formData.get('search') ?? ''),
    category: isCategoryId(category) ? category : DEFAULT_FILTERS.category,
    light: formData.getAll('light').map(String).filter(isLightLevel),
    petSafe: formData.has('petSafe'),
    priceMin: parsePrice(getString(formData, 'priceMin')),
    priceMax: parsePrice(getString(formData, 'priceMax')),
    sort: isSortOrder(sort) ? sort : DEFAULT_FILTERS.sort,
  };
};

const matchesFilters = (
  product: Product,
  { search, category, light, petSafe, priceMin, priceMax }: ProductFilters,
): boolean => {
  const normalizedSearch = search.trim().toLowerCase();
  const productPrice = getMinPrice(product);

  return (
    (!normalizedSearch ||
      product.name.toLowerCase().includes(normalizedSearch)) &&
    (category === 'all' || product.category === category) &&
    (!light.length ||
      (product.light !== undefined && light.includes(product.light))) &&
    (!petSafe || product.petSafe === true) &&
    (priceMin === null || productPrice >= priceMin) &&
    (priceMax === null || productPrice <= priceMax)
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
