import { createElement } from './dom';

export const createPage = (
  title: string,
  children: readonly (Node | string)[] = [],
): HTMLElement =>
  createElement('section', {
    className: 'page',
    children: [
      createElement('div', {
        className: 'container page__container',
        children: [
          createElement('h1', {
            className: 'page__title',
            text: title,
            attrs: { tabindex: '-1' },
          }),
          ...children,
        ],
      }),
    ],
  });
