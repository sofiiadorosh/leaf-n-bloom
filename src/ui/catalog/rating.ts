import { describeRating, getFilledStars } from '../../core/catalog/catalog';
import { createElement } from '../shared/createElement';
import { spriteHref } from '../shared/spriteHref';

const STAR_COUNT = 5;

const createStar = (block: string, isFilled: boolean): SVGSVGElement =>
  createElement('svg', {
    className: isFilled
      ? `${block}__star ${block}__star_filled`
      : `${block}__star`,
    attributes: { width: 18, height: 18, 'aria-hidden': 'true' },
    children: [
      createElement('use', { attributes: { href: spriteHref('star') } }),
    ],
  });

export const createRating = (rating: number, block: string): HTMLDivElement => {
  const filled = getFilledStars(rating, STAR_COUNT);

  return createElement('div', {
    className: `${block}__rating`,
    attributes: {
      role: 'img',
      'aria-label': describeRating(rating),
    },
    children: Array.from({ length: STAR_COUNT }, (_, index) =>
      createStar(block, index < filled),
    ),
  });
};
