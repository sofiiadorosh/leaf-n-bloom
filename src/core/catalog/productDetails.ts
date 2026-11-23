import { MAX_QUANTITY, MIN_QUANTITY } from '../../constants/shared/quantity';
import type {
  CareDetail,
  Product,
  ProductFeature,
  ProductSize,
} from '../types';

export const isPlant = ({ category }: Product): boolean =>
  category !== 'planters';

export const formatSize = ({ inches }: ProductSize): string => `${inches} inch`;

export const getProductFeatures = (
  product: Product,
  features: readonly ProductFeature[],
): ProductFeature[] =>
  features.filter(({ id }) =>
    id === 'pet-safe'
      ? Boolean(product.petSafe)
      : (product.features ?? []).some((featureId) => featureId === id),
  );

export const getCareDetails = (
  product: Product,
  size: ProductSize,
  lightLevels: readonly { id: string; name: string }[],
): CareDetail[] => {
  const light = lightLevels.find(({ id }) => id === product.light);
  const details: (CareDetail | undefined)[] = [
    product.height
      ? { label: 'Plant Height', value: product.height }
      : undefined,
    { label: 'Pot Size', value: formatSize(size) },
    light ? { label: 'Light', value: light.name } : undefined,
    product.watering
      ? { label: 'Watering', value: product.watering }
      : undefined,
  ];

  return details.filter((detail) => detail !== undefined);
};

export const clampQuantity = (quantity: number): number =>
  Number.isFinite(quantity)
    ? Math.min(Math.max(Math.round(quantity), MIN_QUANTITY), MAX_QUANTITY)
    : MIN_QUANTITY;
