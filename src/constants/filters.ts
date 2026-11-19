import type { ProductFilters } from '../core/types';

export const DEFAULT_FILTERS: ProductFilters = {
  search: '',
  category: 'all',
  light: [],
  petSafe: false,
  priceMin: null,
  priceMax: null,
  sort: 'default',
};
