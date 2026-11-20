import { CATEGORIES } from '../../constants/catalog/categories';
import { LIGHT_LEVELS } from '../../constants/filters/light';
import { SORT_ORDERS } from '../../constants/filters/sort';
import type { CategoryId, LightLevel, SortOrder } from '../types';

export const isCategoryId = (value: string): value is CategoryId =>
  CATEGORIES.some(({ id }) => id === value);

export const isLightLevel = (value: string): value is LightLevel =>
  LIGHT_LEVELS.some(({ id }) => id === value);

export const isSortOrder = (value: string): value is SortOrder =>
  (SORT_ORDERS as readonly string[]).includes(value);

export const parsePrice = (value: string | null): number | null => {
  if (!value?.trim()) {
    return null;
  }

  const price = Number(value);

  return Number.isFinite(price) ? price : null;
};
