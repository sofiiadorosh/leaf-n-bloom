import { createElement } from '../ui/dom';
import { createPage } from '../ui/page';

export const createCartPage = (): HTMLElement =>
  createPage('Cart', [
    createElement('p', { text: 'Your cart is coming soon.' }),
  ]);
