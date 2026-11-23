import {
  describeRating,
  formatRating,
  getStarFills,
} from '../../core/catalog/catalog';
import { createElement } from '../shared/createElement';
import { spriteHref } from '../shared/spriteHref';

const STAR_SIZE = 18;

const createStarIcon = (): SVGSVGElement =>
  createElement('svg', {
    className: 'rating__icon',
    attributes: { width: STAR_SIZE, height: STAR_SIZE, 'aria-hidden': 'true' },
    children: [
      createElement('use', { attributes: { href: spriteHref('star') } }),
    ],
  });

const createStar = (fill: number): HTMLSpanElement =>
  createElement('span', {
    className: 'rating__star',
    children: [
      createStarIcon(),
      createElement('span', {
        className: 'rating__fill',
        attributes: { style: `width: ${fill * 100}%` },
        children: [createStarIcon()],
      }),
    ],
  });

export const createRating = (rating: number, block: string): HTMLDivElement =>
  createElement('div', {
    className: `rating ${block}__rating`,
    attributes: {
      role: 'img',
      'aria-label': describeRating(rating),
    },
    children: [
      createElement('span', {
        className: 'rating__stars',
        children: getStarFills(rating).map(createStar),
      }),
      createElement('span', {
        className: 'rating__value',
        text: formatRating(rating),
      }),
    ],
  });
