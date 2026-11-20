import { DEFAULT_FILTERS } from '../../src/constants/filters/filters';
import {
  filtersFromParams,
  filtersToParams,
} from '../../src/core/catalog/filterParams';
import type { PriceBounds, ProductFilters } from '../../src/core/types';

const bounds: PriceBounds = { min: 7, max: 90 };

const toQuery = (filters: Partial<ProductFilters>): string =>
  filtersToParams({ ...DEFAULT_FILTERS, ...filters }, bounds).toString();

const fromQuery = (query: string): ProductFilters =>
  filtersFromParams(new URLSearchParams(query));

describe('filtersToParams', () => {
  it('returns an empty query for the default filters', () => {
    expect(toQuery({})).toBe('');
  });

  it('writes every changed filter', () => {
    expect(
      toQuery({
        search: 'aloe',
        category: 'succulents',
        light: ['bright', 'medium'],
        petSafe: true,
        priceMin: 10,
        priceMax: 40,
        sort: 'price-asc',
      }),
    ).toBe(
      'q=aloe&category=succulents&light=bright%2Cmedium&pet=1&min=10&max=40&sort=price-asc',
    );
  });

  it('trims the search and skips it when empty', () => {
    expect(toQuery({ search: '  fig ' })).toBe('q=fig');
    expect(toQuery({ search: '   ' })).toBe('');
  });

  it('skips prices that equal the catalog bounds', () => {
    expect(toQuery({ priceMin: 7, priceMax: 90 })).toBe('');
  });

  it('keeps a price that is inside the bounds', () => {
    expect(toQuery({ priceMin: 8 })).toBe('min=8');
    expect(toQuery({ priceMax: 89 })).toBe('max=89');
  });
});

describe('filtersFromParams', () => {
  it('returns the default filters for an empty query', () => {
    expect(fromQuery('')).toEqual(DEFAULT_FILTERS);
  });

  it('reads every filter', () => {
    expect(
      fromQuery(
        'q=aloe&category=succulents&light=bright,medium&pet=1&min=10&max=40&sort=price-desc',
      ),
    ).toEqual({
      search: 'aloe',
      category: 'succulents',
      light: ['bright', 'medium'],
      petSafe: true,
      priceMin: 10,
      priceMax: 40,
      sort: 'price-desc',
    });
  });

  it('ignores unknown and broken values', () => {
    expect(
      fromQuery('category=cacti&light=dark,,&pet=yes&min=abc&sort=name'),
    ).toEqual(DEFAULT_FILTERS);
  });

  it('keeps known light levels and drops duplicates', () => {
    expect(fromQuery('light=low,unknown,low').light).toEqual(['low']);
  });

  it('reads back what filtersToParams wrote', () => {
    const filters: ProductFilters = {
      search: 'snake',
      category: 'indoor',
      light: ['low'],
      petSafe: false,
      priceMin: 15,
      priceMax: 30,
      sort: 'price-asc',
    };

    expect(filtersFromParams(filtersToParams(filters, bounds))).toEqual(
      filters,
    );
  });
});
