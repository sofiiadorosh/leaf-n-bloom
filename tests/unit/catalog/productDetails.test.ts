import { describe, expect, it } from 'vitest';
import { PRODUCT_FEATURES } from '../../../src/constants/catalog/features';
import { PRODUCTS } from '../../../src/constants/catalog/products';
import { LIGHT_LEVELS } from '../../../src/constants/filters/light';
import {
  clampQuantity,
  formatSize,
  getCareDetails,
  getProductFeatures,
  isPlant,
} from '../../../src/core/catalog/productDetails';
import type { Product } from '../../../src/core/types';

const plant: Product = {
  id: 'test-plant',
  name: 'Test Plant',
  tag: 'test',
  rating: 5,
  category: 'indoor',
  sizes: [
    { inches: 6, price: 10 },
    { inches: 8, price: 20 },
  ],
  description: 'test',
  images: ['images/products/test-plant/1.webp'],
  light: 'bright',
  petSafe: true,
  height: '20–30 cm',
  watering: 'Once a week',
  features: ['fast-growing', 'air-purifying'],
};

const planter: Product = {
  ...plant,
  id: 'test-planter',
  category: 'planters',
  light: undefined,
  petSafe: undefined,
  height: undefined,
  watering: undefined,
  features: undefined,
};

describe('isPlant', () => {
  it('treats every category except planters as a plant', () => {
    expect(isPlant(plant)).toBe(true);
    expect(isPlant(planter)).toBe(false);
  });
});

describe('formatSize', () => {
  it('shows the pot size in inches', () => {
    expect(formatSize({ inches: 8 })).toBe('8 inch');
  });
});

describe('getProductFeatures', () => {
  it('keeps the feature list order and adds Pet Safe from the flag', () => {
    expect(
      getProductFeatures(plant, PRODUCT_FEATURES).map(({ id }) => id),
    ).toEqual(['air-purifying', 'fast-growing', 'pet-safe']);
  });

  it('returns no features for a product without them', () => {
    expect(getProductFeatures(planter, PRODUCT_FEATURES)).toEqual([]);
  });
});

describe('getCareDetails', () => {
  it('lists height, the selected pot size, light and watering for a plant', () => {
    expect(getCareDetails(plant, plant.sizes[1], LIGHT_LEVELS)).toEqual([
      { label: 'Plant Height', value: '20–30 cm' },
      { label: 'Pot Size', value: '8 inch' },
      { label: 'Light', value: 'Bright Light' },
      { label: 'Watering', value: 'Once a week' },
    ]);
  });

  it('lists only the pot size for a planter', () => {
    expect(getCareDetails(planter, planter.sizes[0], LIGHT_LEVELS)).toEqual([
      { label: 'Pot Size', value: '6 inch' },
    ]);
  });
});

describe('clampQuantity', () => {
  it('keeps the quantity between 1 and 99', () => {
    expect(clampQuantity(0)).toBe(1);
    expect(clampQuantity(5)).toBe(5);
    expect(clampQuantity(120)).toBe(99);
    expect(clampQuantity(Number.NaN)).toBe(1);
  });
});

describe('PRODUCTS care data', () => {
  it('has height, watering and known features for every plant', () => {
    const featureIds: readonly string[] = PRODUCT_FEATURES.map(({ id }) => id);

    PRODUCTS.filter(isPlant).forEach((product) => {
      expect(product.height?.trim()).toBeTruthy();
      expect(product.watering?.trim()).toBeTruthy();
      (product.features ?? []).forEach((featureId) => {
        expect(featureIds).toContain(featureId);
      });
    });
  });
});
