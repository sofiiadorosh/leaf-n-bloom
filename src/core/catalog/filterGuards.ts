import { CATEGORIES } from '../../constants/catalog/categories';
import { LIGHT_LEVELS } from '../../constants/filters/light';
import { SORT_ORDERS } from '../../constants/filters/sort';
import type { CategoryId, LightLevel, SortOrder } from '../types';

export const isCategoryId = (categoryId: string): categoryId is CategoryId =>
  CATEGORIES.some(({ id }) => id === categoryId);

export const isLightLevel = (lightLevel: string): lightLevel is LightLevel =>
  LIGHT_LEVELS.some(({ id }) => id === lightLevel);

export const isSortOrder = (sortOrder: string): sortOrder is SortOrder =>
  (SORT_ORDERS as readonly string[]).includes(sortOrder);

export const parsePrice = (priceValue: string | null): number | null => {
  if (!priceValue?.trim()) {
    return null;
  }

  const price = Number(priceValue);

  return Number.isFinite(price) ? price : null;
};
