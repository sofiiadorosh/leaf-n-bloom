import { DEFAULT_FILTERS } from '../src/constants/filters';
import { filterProducts, parseFilters } from '../src/core/filterProducts';
import type { Product, ProductFilters } from '../src/core/types';

const makeProduct = (
  id: string,
  overrides: Partial<Product> & { price?: number } = {},
): Product => {
  const { price = 10, ...rest } = overrides;

  return {
    id,
    name: id,
    tag: 'test',
    rating: 5,
    category: 'indoor',
    sizes: [{ inches: 6, price }],
    description: 'test',
    images: [`images/products/${id}/1.webp`],
    ...rest,
  };
};

const products: Product[] = [
  makeProduct('Monstera', { price: 29.99, light: 'medium', petSafe: false }),
  makeProduct('Snake Plant', { price: 19.99, light: 'low', petSafe: false }),
  makeProduct('Orchid', {
    category: 'flowering',
    price: 27.99,
    light: 'medium',
    petSafe: true,
  }),
  makeProduct('Echeveria', {
    category: 'succulents',
    price: 8.99,
    light: 'bright',
    petSafe: true,
  }),
  makeProduct('Ceramic Planter', { category: 'planters', price: 14.99 }),
];

const names = (list: readonly Product[]): string[] =>
  list.map(({ name }) => name);

const filter = (filters: Partial<ProductFilters>): string[] =>
  names(filterProducts(products, { ...DEFAULT_FILTERS, ...filters }));

describe('filterProducts', () => {
  it('returns every product with the default filters', () => {
    expect(filter({})).toEqual(names(products));
  });

  describe('search', () => {
    it('finds products by part of the name', () => {
      expect(filter({ search: 'plant' })).toEqual([
        'Snake Plant',
        'Ceramic Planter',
      ]);
    });

    it('ignores letter case', () => {
      expect(filter({ search: 'ORCH' })).toEqual(['Orchid']);
    });

    it('ignores spaces around the query', () => {
      expect(filter({ search: '  orchid  ' })).toEqual(['Orchid']);
    });

    it('shows everything for a query made of spaces', () => {
      expect(filter({ search: '   ' })).toHaveLength(products.length);
    });
  });

  describe('category', () => {
    it('keeps only the selected category', () => {
      expect(filter({ category: 'succulents' })).toEqual(['Echeveria']);
    });

    it('keeps every category for "all"', () => {
      expect(filter({ category: 'all' })).toHaveLength(products.length);
    });
  });

  describe('light needs', () => {
    it('keeps products with the selected light level', () => {
      expect(filter({ light: ['medium'] })).toEqual(['Monstera', 'Orchid']);
    });

    it('keeps products matching any of several light levels', () => {
      expect(filter({ light: ['low', 'bright'] })).toEqual([
        'Snake Plant',
        'Echeveria',
      ]);
    });

    it('drops products without light needs once a level is selected', () => {
      expect(filter({ light: ['low', 'medium', 'bright'] })).not.toContain(
        'Ceramic Planter',
      );
    });
  });

  describe('pet safe', () => {
    it('keeps only pet-safe products when enabled', () => {
      expect(filter({ petSafe: true })).toEqual(['Orchid', 'Echeveria']);
    });

    it('keeps every product when disabled', () => {
      expect(filter({ petSafe: false })).toHaveLength(products.length);
    });
  });

  describe('price', () => {
    it('includes products priced exactly at both bounds', () => {
      expect(filter({ priceMin: 14.99, priceMax: 27.99 })).toEqual([
        'Snake Plant',
        'Orchid',
        'Ceramic Planter',
      ]);
    });

    it('applies only the lower bound when the upper one is empty', () => {
      expect(filter({ priceMin: 20 })).toEqual(['Monstera', 'Orchid']);
    });

    it('applies only the upper bound when the lower one is empty', () => {
      expect(filter({ priceMax: 10 })).toEqual(['Echeveria']);
    });

    it('compares the lowest price of a product', () => {
      const product = makeProduct('Fig', {
        sizes: [
          { inches: 6, price: 15 },
          { inches: 10, price: 60 },
        ],
      });
      const result = filterProducts([product], {
        ...DEFAULT_FILTERS,
        priceMax: 20,
      });

      expect(names(result)).toEqual(['Fig']);
    });
  });

  it('applies all filters together', () => {
    expect(
      filter({
        search: 'o',
        light: ['medium', 'bright'],
        petSafe: true,
        priceMax: 20,
      }),
    ).toEqual([]);
    expect(filter({ search: 'e', petSafe: true, priceMin: 5 })).toEqual([
      'Echeveria',
    ]);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filter({ search: 'cactus' })).toEqual([]);
  });

  describe('sorting', () => {
    it('keeps the catalog order by default', () => {
      expect(filter({ sort: 'default' })).toEqual(names(products));
    });

    it('sorts by price from low to high', () => {
      expect(filter({ sort: 'price-asc' })).toEqual([
        'Echeveria',
        'Ceramic Planter',
        'Snake Plant',
        'Orchid',
        'Monstera',
      ]);
    });

    it('sorts by price from high to low', () => {
      expect(filter({ sort: 'price-desc' })).toEqual([
        'Monstera',
        'Orchid',
        'Snake Plant',
        'Ceramic Planter',
        'Echeveria',
      ]);
    });

    it('sorts only the filtered products', () => {
      expect(filter({ petSafe: true, sort: 'price-asc' })).toEqual([
        'Echeveria',
        'Orchid',
      ]);
    });
  });

  it('does not change the original list', () => {
    filterProducts(products, { ...DEFAULT_FILTERS, sort: 'price-asc' });

    expect(names(products)[0]).toBe('Monstera');
  });
});

describe('parseFilters', () => {
  const makeData = (entries: [string, string][]): FormData => {
    const data = new FormData();
    entries.forEach(([key, value]) => data.append(key, value));

    return data;
  };

  it('reads every field of the form', () => {
    const data = makeData([
      ['search', 'aloe'],
      ['category', 'succulents'],
      ['light', 'bright'],
      ['light', 'medium'],
      ['petSafe', 'on'],
      ['priceMin', '7'],
      ['priceMax', '40'],
      ['sort', 'price-desc'],
    ]);

    expect(parseFilters(data)).toEqual({
      search: 'aloe',
      category: 'succulents',
      light: ['bright', 'medium'],
      petSafe: true,
      priceMin: 7,
      priceMax: 40,
      sort: 'price-desc',
    });
  });

  it('falls back to the defaults for an empty form', () => {
    expect(parseFilters(new FormData())).toEqual(DEFAULT_FILTERS);
  });

  it('ignores unknown values', () => {
    const data = makeData([
      ['category', 'cacti'],
      ['light', 'darkness'],
      ['sort', 'name'],
      ['priceMin', 'abc'],
    ]);

    expect(parseFilters(data)).toEqual(DEFAULT_FILTERS);
  });
});
