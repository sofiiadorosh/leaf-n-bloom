import { PRODUCTS } from '../../constants/catalog/products';
import { getMinPrice, getRandomBestSellers } from '../../core/catalog/catalog';
import { formatPrice } from '../../core/formatPrice';
import type { Product } from '../../core/types';
import { createElement } from '../shared/createElement';
import { spriteHref } from '../shared/spriteHref';
import { createOpenProductButton } from './openProductButton';

const createProductCard = (product: Product): HTMLLIElement =>
  createElement('li', {
    className: 'best-sellers__item',
    children: [
      createElement('article', {
        className: 'product-card',
        children: [
          createElement('div', {
            className: 'product-card__media',
            children: [
              createElement('img', {
                className: 'product-card__image',
                attributes: {
                  src: `${import.meta.env.BASE_URL}${product.images[0]}`,
                  alt: product.name,
                  width: 800,
                  height: 800,
                  loading: 'lazy',
                },
              }),
            ],
          }),
          createElement('div', {
            className: 'product-card__body',
            children: [
              createElement('h3', {
                className: 'product-card__name',
                children: [createOpenProductButton(product)],
              }),
              createElement('p', {
                className: 'product-card__tag',
                text: product.tag,
              }),
              createElement('div', {
                className: 'product-card__footer',
                children: [
                  createElement('p', {
                    className: 'product-card__price',
                    text: formatPrice(getMinPrice(product)),
                  }),
                  createElement('svg', {
                    className: 'product-card__icon',
                    attributes: {
                      width: 16,
                      height: 16,
                      'aria-hidden': 'true',
                    },
                    children: [
                      createElement('use', {
                        attributes: { href: spriteHref('arrow-right') },
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

export const renderBestSellers = (): void => {
  const list = document.querySelector<HTMLUListElement>('.best-sellers__list');

  if (!list) {
    return;
  }

  list.replaceChildren(
    ...getRandomBestSellers(PRODUCTS).map(createProductCard),
  );
};
