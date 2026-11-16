import { ROUTE_PATHS, toHref } from '../core/routing';
import { createElement } from '../ui/dom';
import { createPage } from '../ui/page';

export const createNotFoundPage = (): HTMLElement =>
  createPage('Page not found', [
    createElement('p', { text: 'We could not find this page.' }),
    createElement('a', {
      className: 'button',
      text: 'Back to About us',
      attrs: { href: toHref(ROUTE_PATHS.about) },
    }),
  ]);
