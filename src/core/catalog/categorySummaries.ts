import type { Category, CategorySummary, Product } from '../types';

export const getCategorySummaries = (
  categories: readonly Category[],
  products: readonly Product[],
): CategorySummary[] =>
  categories.map((category) => {
    const categoryProducts = products.filter(
      (product) => product.category === category.id,
    );

    return {
      ...category,
      count: categoryProducts.length,
      image: categoryProducts[0]?.images[0],
    };
  });

export const formatVarieties = (count: number): string =>
  `${count} ${count === 1 ? 'variety' : 'varieties'}`;
