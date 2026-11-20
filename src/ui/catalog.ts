import { BADGES } from '../constants/badges';
import { CATEGORIES } from '../constants/categories';
import {
  describeRating,
  formatProductCount,
  getFilledStars,
  getMinPrice,
  getProductMeta,
} from '../core/catalog';
import { formatPrice } from '../core/formatPrice';
import type { BadgeId, Product } from '../core/types';
import { createElement } from './createElement';
import { spriteHref } from './spriteHref';

const createBadge = (badgeId: BadgeId): HTMLSpanElement[] => {
  const badge = BADGES.find(({ id }) => id === badgeId);

  return badge
    ? [
        createElement('span', {
          className: `product-card__badge product-card__badge_${badge.id}`,
          text: badge.name,
        }),
      ]
    : [];
};

const STAR_COUNT = 5;

const createStar = (isFilled: boolean): SVGSVGElement =>
  createElement('svg', {
    className: isFilled
      ? 'product-card__star product-card__star_filled'
      : 'product-card__star',
    attributes: { width: 18, height: 18, 'aria-hidden': 'true' },
    children: [
      createElement('use', { attributes: { href: spriteHref('star') } }),
    ],
  });

const createRating = ({ rating }: Product): HTMLDivElement => {
  const filled = getFilledStars(rating, STAR_COUNT);

  return createElement('div', {
    className: 'product-card__rating',
    attributes: {
      role: 'img',
      'aria-label': describeRating(rating),
    },
    children: Array.from({ length: STAR_COUNT }, (_, index) =>
      createStar(index < filled),
    ),
  });
};

const createCatalogCard = (product: Product): HTMLLIElement =>
  createElement('li', {
    className: 'catalog__item',
    children: [
      createElement('article', {
        className: 'product-card product-card_catalog',
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
              ...(product.badge ? createBadge(product.badge) : []),
            ],
          }),
          createElement('div', {
            className: 'product-card__body',
            children: [
              createRating(product),
              createElement('h3', {
                className: 'product-card__name',
                text: product.name,
              }),
              createElement('p', {
                className: 'product-card__tag',
                text: getProductMeta(product, CATEGORIES),
              }),
              createElement('p', {
                className: 'product-card__price product-card__price_large',
                text: formatPrice(getMinPrice(product)),
              }),
              createElement('button', {
                className: 'button product-card__button',
                attributes: { type: 'button', 'data-product-id': product.id },
                children: [
                  createElement('svg', {
                    className: 'product-card__button-icon',
                    attributes: {
                      width: 18,
                      height: 18,
                      'aria-hidden': 'true',
                    },
                    children: [
                      createElement('use', {
                        attributes: { href: spriteHref('cart') },
                      }),
                    ],
                  }),
                  createElement('span', {
                    className: 'product-card__button-label',
                    text: 'Add to Cart',
                  }),
                  createElement('span', {
                    className: 'visually-hidden',
                    text: `: ${product.name}`,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

export const renderCatalog = (products: readonly Product[]): void => {
  const list = document.querySelector<HTMLUListElement>('.catalog');
  const count = document.querySelector<HTMLParagraphElement>('.shop__count');
  const empty = document.querySelector<HTMLParagraphElement>('.shop__empty');

  if (!list || !count || !empty) {
    return;
  }

  list.replaceChildren(...products.map(createCatalogCard));
  count.textContent = formatProductCount(products.length);
  empty.hidden = products.length > 0;
};
