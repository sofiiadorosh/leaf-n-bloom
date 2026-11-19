import type { PriceBounds, Product } from './types';

export const getRandomBestSellers = (
  products: readonly Product[],
  count = 4,
  random: () => number = Math.random,
): Product[] => {
  const bestSellers = products.filter((product) => product.isBestSeller);

  for (let i = bestSellers.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [bestSellers[i], bestSellers[j]] = [bestSellers[j], bestSellers[i]];
  }

  return bestSellers.slice(0, count);
};

export const getMinPrice = (product: Product): number =>
  Math.min(...product.sizes.map(({ price }) => price));

export const getPriceBounds = (products: readonly Product[]): PriceBounds => {
  const prices = products.flatMap(({ sizes }) =>
    sizes.map(({ price }) => price),
  );

  if (prices.length === 0) {
    return { min: 0, max: 0 };
  }

  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
};
