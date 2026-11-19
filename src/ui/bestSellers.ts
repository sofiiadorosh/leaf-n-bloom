import { PRODUCTS } from '../constants/products';
import { getMinPrice, getRandomBestSellers } from '../core/catalog';
import { formatPrice } from '../core/formatPrice';
import type { Product } from '../core/types';
import { createElement } from './createElement';

const cloneArrowIcon = (): Node[] => {
  const template =
    document.querySelector<HTMLTemplateElement>('#product-card-icon');

  return template ? [template.content.cloneNode(true)] : [];
};

const createProductCard = (product: Product): HTMLLIElement =>
  createElement('li', {
    className: 'best-sellers__item',
    children: [
      createElement('a', {
        className: 'product-card',
        attributes: {
          href: `./shop.html?category=${encodeURIComponent(product.category)}`,
        },
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
                text: product.name,
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
                  ...cloneArrowIcon(),
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
