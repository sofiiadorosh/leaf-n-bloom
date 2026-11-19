import {
  getMinPrice,
  getPriceBounds,
  getRandomBestSellers,
} from '../src/core/catalog';
import type { Product } from '../src/core/types';

const makeProduct = (
  id: string,
  {
    isBestSeller = true,
    sizes = [{ inches: 6, price: 10 }],
  }: Partial<Pick<Product, 'isBestSeller' | 'sizes'>> = {},
): Product => ({
  id,
  name: id,
  tag: 'test',
  category: 'indoor',
  sizes,
  description: 'test',
  images: [`images/products/${id}/1.webp`],
  isBestSeller,
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
      makeProduct('regular', { isBestSeller: false }),
      makeProduct('hit'),
      makeProduct('no-flag'),
    ];
    delete products[2].isBestSeller;

    expect(ids(getRandomBestSellers(products))).toEqual(['hit']);
  });

  it('returns an empty list when there are no best sellers', () => {
    const products = [makeProduct('a', { isBestSeller: false })];

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
