import type { Category, PriceBounds, Product } from '../types';

export const getRandomBestSellers = (
  products: readonly Product[],
  count = 4,
  random: () => number = Math.random,
): Product[] => {
  const bestSellers = products.filter(({ badge }) => badge === 'bestseller');

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

  if (!prices.length) {
    return { min: 0, max: 0 };
  }

  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
};

export const getProductMeta = (
  product: Product,
  categories: readonly Category[],
): string => {
  const category = categories.find(({ id }) => id === product.category);

  return category ? `${category.name} · ${product.tag}` : product.tag;
};

export const formatProductCount = (count: number): string =>
  `${count} ${count === 1 ? 'product' : 'products'}`;

export const getStarFills = (rating: number, max = 5): number[] =>
  Array.from({ length: max }, (_, index) => {
    const fill = Math.min(Math.max(rating - index, 0), 1);

    return Math.round(fill * 100) / 100;
  });

export const formatRating = (rating: number): string => rating.toFixed(1);

export const describeRating = (rating: number): string =>
  `Rated ${formatRating(rating)} out of 5`;
