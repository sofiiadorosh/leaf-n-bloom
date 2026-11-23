import type { Product } from '../../core/types';
import { createElement } from '../shared/createElement';

export const createOpenProductButton = ({
  id,
  name,
}: Product): HTMLButtonElement =>
  createElement('button', {
    className: 'product-card__open',
    text: name,
    attributes: {
      type: 'button',
      'data-open-product': id,
      'aria-haspopup': 'dialog',
    },
  });
