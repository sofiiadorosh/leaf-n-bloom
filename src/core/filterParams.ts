import { DEFAULT_FILTERS } from '../constants/filters';
import {
  isCategoryId,
  isLightLevel,
  isSortOrder,
  parsePrice,
} from './filterGuards';
import type { PriceBounds, ProductFilters } from './types';

export const filtersToParams = (
  filters: ProductFilters,
  bounds: PriceBounds,
): URLSearchParams => {
  const params = new URLSearchParams();
  const search = filters.search.trim();

  if (search) {
    params.set('q', search);
  }

  if (filters.category !== DEFAULT_FILTERS.category) {
    params.set('category', filters.category);
  }

  if (filters.light.length) {
    params.set('light', filters.light.join(','));
  }

  if (filters.petSafe) {
    params.set('pet', '1');
  }

  if (filters.priceMin !== null && filters.priceMin > bounds.min) {
    params.set('min', String(filters.priceMin));
  }

  if (filters.priceMax !== null && filters.priceMax < bounds.max) {
    params.set('max', String(filters.priceMax));
  }

  if (filters.sort !== DEFAULT_FILTERS.sort) {
    params.set('sort', filters.sort);
  }

  return params;
};

export const filtersFromParams = (params: URLSearchParams): ProductFilters => {
  const category = params.get('category') ?? '';
  const sort = params.get('sort') ?? '';
  const light = (params.get('light') ?? '').split(',').filter(isLightLevel);

  return {
    search: params.get('q') ?? DEFAULT_FILTERS.search,
    category: isCategoryId(category) ? category : DEFAULT_FILTERS.category,
    light: [...new Set(light)],
    petSafe: params.get('pet') === '1',
    priceMin: parsePrice(params.get('min')),
    priceMax: parsePrice(params.get('max')),
    sort: isSortOrder(sort) ? sort : DEFAULT_FILTERS.sort,
  };
};
