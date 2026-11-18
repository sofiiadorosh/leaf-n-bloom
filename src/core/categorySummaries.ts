import type { Category, Product } from './types';

export type CategorySummary = Category & {
  count: number;
  image?: string;
};

export const getCategorySummaries = (
  categories: readonly Category[],
  products: readonly Product[],
): CategorySummary[] =>
  categories.map((category) => {
    const items = products.filter(
      (product) => product.category === category.id,
    );

    return {
      ...category,
      count: items.length,
      image: items[0]?.images[0],
    };
  });

export const formatVarieties = (count: number): string =>
  `${count} ${count === 1 ? 'variety' : 'varieties'}`;
