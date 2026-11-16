import { createElement } from '../ui/dom';
import { createPage } from '../ui/page';

export const createShopPage = (): HTMLElement =>
  createPage('Shop', [
    createElement('p', { text: 'The plant catalog is coming soon.' }),
  ]);
