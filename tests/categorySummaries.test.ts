import {
  formatVarieties,
  getCategorySummaries,
} from '../src/core/categorySummaries';
import type { Category, Product } from '../src/core/types';

const makeProduct = (id: string, category: Product['category']): Product => ({
  id,
  name: id,
  category,
  sizes: [{ inches: 6, price: 10 }],
  description: 'test',
  images: [`images/products/${id}/1.webp`],
});

const categories: Category[] = [
  { id: 'indoor', name: 'Indoor Plants' },
  { id: 'succulents', name: 'Succulents' },
  { id: 'planters', name: 'Planters & Pots' },
];

describe('getCategorySummaries', () => {
  it('counts products in each category', () => {
    const products = [
      makeProduct('monstera', 'indoor'),
      makeProduct('aloe', 'succulents'),
      makeProduct('zz-plant', 'indoor'),
    ];

    const counts = getCategorySummaries(categories, products).map(
      ({ id, count }) => [id, count],
    );

    expect(counts).toEqual([
      ['indoor', 2],
      ['succulents', 1],
      ['planters', 0],
    ]);
  });

  it('keeps the order of categories', () => {
    const ids = getCategorySummaries(categories, []).map(({ id }) => id);

    expect(ids).toEqual(['indoor', 'succulents', 'planters']);
  });

  it('uses the main image of the first product in the category', () => {
    const products = [
      makeProduct('monstera', 'indoor'),
      makeProduct('zz-plant', 'indoor'),
    ];

    const [indoor] = getCategorySummaries(categories, products);

    expect(indoor.image).toBe('images/products/monstera/1.webp');
  });

  it('has no image for an empty category', () => {
    const [indoor] = getCategorySummaries(categories, []);

    expect(indoor.count).toBe(0);
    expect(indoor.image).toBeUndefined();
  });
});

describe('formatVarieties', () => {
  it.each([
    [0, '0 varieties'],
    [1, '1 variety'],
    [4, '4 varieties'],
  ])('formats %i as "%s"', (count, expected) => {
    expect(formatVarieties(count)).toBe(expected);
  });
});
