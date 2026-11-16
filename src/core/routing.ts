export const ROUTE_PATHS = {
  about: '/',
  shop: '/shop',
  cart: '/cart',
  notFound: '/404',
} as const;

export type RouteName = keyof typeof ROUTE_PATHS;
export type RoutePath = (typeof ROUTE_PATHS)[RouteName];

export type RouteDefinition = {
  path: RoutePath;
};

export const toHref = (path: RoutePath): string => `#${path}`;

export const normalizeHashPath = (hash: string): string => {
  const path = hash.replace(/^#/, '').split('?')[0].trim();

  if (path === '' || path === '/') {
    return ROUTE_PATHS.about;
  }

  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;

  return withLeadingSlash.replace(/\/+$/, '').toLowerCase();
};

export const findRoute = <T extends RouteDefinition>(
  routes: readonly T[],
  path: string,
): T | undefined => routes.find((route) => route.path === path);
