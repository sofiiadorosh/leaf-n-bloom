import { createElement } from '../ui/dom';
import { createPage } from '../ui/page';

export const createAboutPage = (): HTMLElement =>
  createPage('About us', [
    createElement('p', {
      text: 'Leaf & Bloom is a small online store of houseplants. The about page with the team is coming soon.',
    }),
  ]);
