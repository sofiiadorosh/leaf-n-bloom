import {
  findRoute,
  normalizeHashPath,
  ROUTE_PATHS,
  toHref,
} from '../src/core/routing';

describe('normalizeHashPath', () => {
  it.each(['', '#', '#/', '/'])('returns home path for "%s"', (hash) => {
    expect(normalizeHashPath(hash)).toBe(ROUTE_PATHS.about);
  });

  it('removes the leading hash', () => {
    expect(normalizeHashPath('#/shop')).toBe('/shop');
  });

  it('adds a leading slash when it is missing', () => {
    expect(normalizeHashPath('#cart')).toBe('/cart');
  });

  it('removes trailing slashes', () => {
    expect(normalizeHashPath('#/shop//')).toBe('/shop');
  });

  it('ignores the query string', () => {
    expect(normalizeHashPath('#/shop?category=succulents')).toBe('/shop');
  });

  it('is case-insensitive', () => {
    expect(normalizeHashPath('#/Cart')).toBe('/cart');
  });
});

describe('findRoute', () => {
  const routes = [
    { path: ROUTE_PATHS.about },
    { path: ROUTE_PATHS.shop },
    { path: ROUTE_PATHS.cart },
  ];

  it('returns the route with a matching path', () => {
    expect(findRoute(routes, ROUTE_PATHS.shop)).toBe(routes[1]);
  });

  it('returns undefined for an unknown path', () => {
    expect(findRoute(routes, '/unknown')).toBeUndefined();
  });
});

describe('toHref', () => {
  it('builds a hash link from a route path', () => {
    expect(toHref(ROUTE_PATHS.shop)).toBe('#/shop');
  });
});
