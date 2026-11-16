import { ROUTE_PATHS } from '../core/routing';
import { createAboutPage } from '../pages/about';
import { createCartPage } from '../pages/cart';
import { createNotFoundPage } from '../pages/notFound';
import { createShopPage } from '../pages/shop';
import { createElement } from './dom';
import { createHeader } from './header';
import { startRouter, type Route } from './router';

const APP_TITLE = 'Leaf & Bloom';

type AppRoute = Route & { label: string };

const routes: readonly AppRoute[] = [
  {
    path: ROUTE_PATHS.about,
    label: 'About',
    title: 'About us',
    render: createAboutPage,
  },
  {
    path: ROUTE_PATHS.shop,
    label: 'Shop',
    title: 'Shop',
    render: createShopPage,
  },
  {
    path: ROUTE_PATHS.cart,
    label: 'Cart',
    title: 'Cart',
    render: createCartPage,
  },
];

const notFound: Route = {
  path: ROUTE_PATHS.notFound,
  title: 'Page not found',
  render: createNotFoundPage,
};

export const startApp = (root: HTMLElement): void => {
  const header = createHeader(routes);
  const main = createElement('main', { className: 'main' });

  root.replaceChildren(header.element, main);

  startRouter({
    outlet: main,
    routes,
    notFound,
    appTitle: APP_TITLE,
    onNavigate: header.setActive,
  });
};
