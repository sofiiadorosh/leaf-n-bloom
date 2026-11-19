import type { Product } from './types';

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
