import { getMinPrice, getRandomBestSellers } from '../src/core/catalog';
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
