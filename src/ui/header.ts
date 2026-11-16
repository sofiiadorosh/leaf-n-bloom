import { ROUTE_PATHS, toHref, type RoutePath } from '../core/routing';
import { createElement } from './dom';

export type NavItem = {
  path: RoutePath;
  label: string;
};

export type Header = {
  element: HTMLElement;
  setActive: (path: RoutePath) => void;
};

export const createHeader = (items: readonly NavItem[]): Header => {
  const links = items.map((item) =>
    createElement('a', {
      className: 'nav__link',
      text: item.label,
      attrs: { href: toHref(item.path), 'data-path': item.path },
    }),
  );

  const logo = createElement('a', {
    className: 'logo',
    text: 'Leaf & Bloom',
    attrs: { href: toHref(ROUTE_PATHS.about) },
  });

  const nav = createElement('nav', {
    className: 'nav',
    attrs: { 'aria-label': 'Main navigation' },
    children: [
      createElement('ul', {
        className: 'nav__list',
        children: links.map((link) =>
          createElement('li', { className: 'nav__item', children: [link] }),
        ),
      }),
    ],
  });

  const element = createElement('header', {
    className: 'header',
    children: [
      createElement('div', {
        className: 'container header__container',
        children: [logo, nav],
      }),
    ],
  });

  const setActive = (path: RoutePath): void => {
    links.forEach((link) => {
      if (link.dataset.path === path) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  return { element, setActive };
};
