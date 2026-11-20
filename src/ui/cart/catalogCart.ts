import type { Product } from '../../core/types';
import { cartStore } from '../../core/cart/cartStore';
import { animateCartFlight } from './cartFlight';

const CART_CONFIRMATION_DURATION_MS = 1500;
const CART_WARNING_DURATION_MS = 6000;

export const initCatalogCart = (products: readonly Product[]): void => {
  const list = document.querySelector('.catalog');
  const status = document.querySelector('#shop-cart-status');

  if (!list || !status) {
    return;
  }

  const cartIcon = document.querySelector('.header .cart__icon');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let dismissTimer: number | undefined;
  let activeFlight: Animation | undefined;
  const labelTimers = new WeakMap<HTMLSpanElement, number>();

  const showStatus = (message: string, isErrorMessage = false): void => {
    window.clearTimeout(dismissTimer);
    status.classList.toggle('visually-hidden', !isErrorMessage);
    status.textContent = message;

    dismissTimer = window.setTimeout(
      () => {
        status.textContent = '';
        status.classList.add('visually-hidden');
      },
      isErrorMessage ? CART_WARNING_DURATION_MS : CART_CONFIRMATION_DURATION_MS,
    );
  };

  const showAddedLabel = (button: HTMLButtonElement): void => {
    const label = button.querySelector<HTMLSpanElement>(
      '.product-card__button-label',
    );

    if (!label) {
      return;
    }

    window.clearTimeout(labelTimers.get(label));
    label.textContent = 'Added';

    const resetTimer = window.setTimeout(() => {
      label.textContent = 'Add to Cart';
      labelTimers.delete(label);
    }, CART_CONFIRMATION_DURATION_MS);

    labelTimers.set(label, resetTimer);
  };

  list.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const button = event.target.closest<HTMLButtonElement>('[data-product-id]');

    if (!button) {
      return;
    }

    const product = products.find(({ id }) => id === button.dataset.productId);

    if (!product) {
      return;
    }

    if (!cartStore.add(product.id)) {
      showStatus('This quantity exceeds the cart limit.', true);
      return;
    }

    if (!cartStore.isSaved()) {
      showStatus('Cart changes may be lost when you leave.', true);
      return;
    }

    activeFlight?.cancel();
    activeFlight = undefined;

    if (cartIcon && !reducedMotion.matches) {
      activeFlight = animateCartFlight(button, cartIcon);
    }

    showStatus(`${product.name} added to cart.`);

    if (!activeFlight) {
      showAddedLabel(button);
    }
  });
};
