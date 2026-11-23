import { describe, expect, it } from 'vitest';
import {
  describeRating,
  formatProductCount,
  formatRating,
  getStarFills,
  getMinPrice,
  getPriceBounds,
  getProductMeta,
  getRandomBestSellers,
} from '../../../src/core/catalog/catalog';
import type { Category, Product } from '../../../src/core/types';

const makeProduct = (
  id: string,
  {
    badge = 'bestseller',
    sizes = [{ inches: 6, price: 10 }],
  }: Partial<Pick<Product, 'badge' | 'sizes'>> = {},
): Product => ({
  id,
  name: id,
  tag: 'test',
  rating: 5,
  category: 'indoor',
  sizes,
  description: 'test',
  images: [`images/products/${id}/1.webp`],
  badge,
});

const ids = (products: readonly Product[]): string[] =>
  products.map(({ id }) => id);

const bestSellers = ['a', 'b', 'c', 'd', 'e'].map((id) => makeProduct(id));

describe('getRandomBestSellers', () => {
  it('returns 4 products by default', () => {
    expect(getRandomBestSellers(bestSellers)).toHaveLength(4);
  });

  it('respects a custom count', () => {
    expect(getRandomBestSellers(bestSellers, 2)).toHaveLength(2);
  });

  it('returns all best sellers when there are fewer than requested', () => {
    expect(getRandomBestSellers(bestSellers.slice(0, 3))).toHaveLength(3);
  });

  it('returns only best sellers', () => {
    const products = [
      makeProduct('regular', { badge: 'new' }),
      makeProduct('hit'),
      makeProduct('no-flag'),
    ];
    delete products[2].badge;

    expect(ids(getRandomBestSellers(products))).toEqual(['hit']);
  });

  it('returns an empty list when there are no best sellers', () => {
    const products = [makeProduct('a', { badge: 'trending' })];

    expect(getRandomBestSellers(products)).toEqual([]);
  });

  it('returns unique products from the catalog', () => {
    const result = ids(getRandomBestSellers(bestSellers));

    expect(new Set(result).size).toBe(result.length);
    result.forEach((id) => expect(ids(bestSellers)).toContain(id));
  });

  it('shuffles using the given random function', () => {
    expect(ids(getRandomBestSellers(bestSellers, 4, () => 0))).toEqual([
      'b',
      'c',
      'd',
      'e',
    ]);
    expect(ids(getRandomBestSellers(bestSellers, 4, () => 0.999))).toEqual([
      'a',
      'b',
      'c',
      'd',
    ]);
  });

  it('does not change the original catalog', () => {
    getRandomBestSellers(bestSellers, 4, () => 0);

    expect(ids(bestSellers)).toEqual(['a', 'b', 'c', 'd', 'e']);
  });
});

describe('getMinPrice', () => {
  it('returns the price of the only size', () => {
    const product = makeProduct('a', { sizes: [{ inches: 6, price: 19.99 }] });

    expect(getMinPrice(product)).toBe(19.99);
  });

  it('returns the lowest price when sizes are not sorted', () => {
    const product = makeProduct('a', {
      sizes: [
        { inches: 10, price: 44.99 },
        { inches: 6, price: 24.99 },
        { inches: 8, price: 34.99 },
      ],
    });

    expect(getMinPrice(product)).toBe(24.99);
  });
});

describe('getPriceBounds', () => {
  it('rounds the lowest price down and the highest price up', () => {
    const products = [
      makeProduct('a', {
        sizes: [
          { inches: 4, price: 7.99 },
          { inches: 6, price: 12.5 },
        ],
      }),
      makeProduct('b', { sizes: [{ inches: 10, price: 89.99 }] }),
    ];

    expect(getPriceBounds(products)).toEqual({ min: 7, max: 90 });
  });

  it('keeps whole prices as they are', () => {
    const products = [
      makeProduct('a', { sizes: [{ inches: 6, price: 10 }] }),
      makeProduct('b', { sizes: [{ inches: 8, price: 40 }] }),
    ];

    expect(getPriceBounds(products)).toEqual({ min: 10, max: 40 });
  });

  it('uses every size, not only the first one', () => {
    const product = makeProduct('a', {
      sizes: [
        { inches: 8, price: 30 },
        { inches: 4, price: 5 },
        { inches: 12, price: 60 },
      ],
    });

    expect(getPriceBounds([product])).toEqual({ min: 5, max: 60 });
  });

  it('returns zeros for an empty catalog', () => {
    expect(getPriceBounds([])).toEqual({ min: 0, max: 0 });
  });
});

describe('getProductMeta', () => {
  const categories: Category[] = [
    { id: 'indoor', name: 'Indoor Plants' },
    { id: 'succulents', name: 'Succulents' },
  ];

  it('joins the category name and the tag', () => {
    const product = { ...makeProduct('a'), tag: 'Air Purifying' };

    expect(getProductMeta(product, categories)).toBe(
      'Indoor Plants · Air Purifying',
    );
  });

  it('shows only the tag when the category is unknown', () => {
    const product = { ...makeProduct('a'), tag: 'Natural Wood' };

    expect(getProductMeta(product, [])).toBe('Natural Wood');
  });
});

describe('formatProductCount', () => {
  it.each([
    [0, '0 products'],
    [1, '1 product'],
    [12, '12 products'],
  ])('formats %i as "%s"', (count, expected) => {
    expect(formatProductCount(count)).toBe(expected);
  });
});

describe('getStarFills', () => {
  it.each([
    [4.9, [1, 1, 1, 1, 0.9]],
    [4.5, [1, 1, 1, 1, 0.5]],
    [3, [1, 1, 1, 0, 0]],
    [0, [0, 0, 0, 0, 0]],
  ])('fills the stars for a rating of %d', (rating, expected) => {
    expect(getStarFills(rating)).toEqual(expected);
  });

  it('never fills more stars than the maximum', () => {
    expect(getStarFills(7)).toEqual([1, 1, 1, 1, 1]);
  });

  it('never fills a star below zero', () => {
    expect(getStarFills(-2)).toEqual([0, 0, 0, 0, 0]);
  });
});

describe('formatRating', () => {
  it.each([
    [4.9, '4.9'],
    [4.5, '4.5'],
    [5, '5.0'],
  ])('formats %d as "%s"', (rating, expected) => {
    expect(formatRating(rating)).toBe(expected);
  });
});

describe('describeRating', () => {
  it('describes the rating for screen readers', () => {
    expect(describeRating(4.8)).toBe('Rated 4.8 out of 5');
  });

  it('always shows one decimal', () => {
    expect(describeRating(5)).toBe('Rated 5.0 out of 5');
  });
});
