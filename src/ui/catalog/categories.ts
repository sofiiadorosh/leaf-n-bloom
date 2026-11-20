import { CATEGORIES } from '../../constants/catalog/categories';
import { PRODUCTS } from '../../constants/catalog/products';
import {
  formatVarieties,
  getCategorySummaries,
} from '../../core/catalog/categorySummaries';
import type { CategorySummary } from '../../core/types';
import { createElement } from '../shared/createElement';

const createCategoryImage = (image: string): HTMLImageElement =>
  createElement('img', {
    className: 'category-card__image',
    attributes: {
      src: `${import.meta.env.BASE_URL}${image}`,
      alt: '',
      width: 800,
      height: 800,
      loading: 'lazy',
    },
  });

const createCategoryCard = (summary: CategorySummary): HTMLLIElement =>
  createElement('li', {
    className: 'categories__item',
    children: [
      createElement('a', {
        className: 'category-card',
        attributes: {
          href: `./shop.html?category=${encodeURIComponent(summary.id)}`,
        },
        children: [
          createElement('div', {
            className: 'category-card__media',
            children: summary.image ? [createCategoryImage(summary.image)] : [],
          }),
          createElement('div', {
            className: 'category-card__body',
            children: [
              createElement('h3', {
                className: 'category-card__name',
                text: summary.name,
              }),
              createElement('p', {
                className: 'category-card__count',
                text: formatVarieties(summary.count),
              }),
            ],
          }),
        ],
      }),
    ],
  });

export const renderCategories = (): void => {
  const list = document.querySelector<HTMLUListElement>('.categories__list');

  if (!list) {
    return;
  }

  const cards = getCategorySummaries(CATEGORIES, PRODUCTS)
    .filter((summary) => summary.count > 0)
    .map(createCategoryCard);

  list.replaceChildren(...cards);
};
