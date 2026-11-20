import { cartStore } from '../storage/cartStore';
import { createElement } from './createElement';

const BADGE_POP_DURATION_MS = 280;
const BADGE_HIGHLIGHT_DURATION_MS = 1200;

export const renderCartBadge = (): void => {
  const cart = document.querySelector('.header .cart');
  const label = cart?.querySelector('.visually-hidden');

  if (!cart || !label) {
    return;
  }

  const badge = createElement('span', {
    className: 'cart__badge',
    attributes: { 'aria-hidden': 'true' },
  });
  cart.append(badge);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let previousQuantity: number | undefined;
  let highlightTimer: number | undefined;
  let pop: Animation | undefined;
  cartStore.subscribe((items) => {
    const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const quantityText = String(quantity);

    badge.hidden = quantity === 0;
    badge.textContent = quantityText;
    badge.dataset.quantity = quantityText;
    label.textContent = `Cart, ${quantity} ${quantity === 1 ? 'item' : 'items'}`;

    if (previousQuantity !== undefined && quantity > previousQuantity) {
      window.clearTimeout(highlightTimer);
      badge.classList.add('cart__badge_highlighted');
      pop?.cancel();
      if (!reducedMotion.matches) {
        pop = badge.animate(
          [
            { transform: 'scale(1)' },
            { transform: 'scale(1.2)', offset: 0.4 },
            { transform: 'scale(1)' },
          ],
          { duration: BADGE_POP_DURATION_MS, easing: 'ease-out' },
        );
      }
      highlightTimer = window.setTimeout(() => {
        badge.classList.remove('cart__badge_highlighted');
      }, BADGE_HIGHLIGHT_DURATION_MS);
    }

    previousQuantity = quantity;
  });
};
