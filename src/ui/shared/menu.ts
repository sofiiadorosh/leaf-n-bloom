import { TABLET_MEDIA_QUERY } from '../../constants/shared/breakpoints';
import { cartStore } from '../../core/cart/cartStore';
import { createElement } from './createElement';

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled])';

const renderCartCount = (navigation: HTMLElement): void => {
  const count = navigation.querySelector<HTMLElement>('.navigation__count');

  if (!count) {
    return;
  }

  cartStore.subscribe((cartItems) => {
    const totalQuantity = cartItems.reduce(
      (quantity, cartItem) => quantity + cartItem.quantity,
      0,
    );

    count.hidden = totalQuantity === 0;
    count.textContent = String(totalQuantity);
  });
};

export const renderMenu = (): void => {
  const button = document.querySelector<HTMLButtonElement>('.menu');
  const navigation = document.querySelector<HTMLElement>('.navigation');
  const header = document.querySelector<HTMLElement>('.header');

  if (!button || !navigation || !header) {
    return;
  }

  const overlay = createElement('div', {
    className: 'header__overlay',
    attributes: { 'aria-hidden': 'true' },
  });
  header.append(overlay);

  const tabletQuery = window.matchMedia(TABLET_MEDIA_QUERY);

  const isOpen = (): boolean =>
    navigation.classList.contains('navigation_open');

  const setOpen = (open: boolean): void => {
    if (open) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    navigation.classList.toggle('navigation_open', open);
    overlay.classList.toggle('header__overlay_visible', open);
    document.body.classList.toggle('scroll-locked', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');

    if (open) {
      navigation.querySelector<HTMLElement>('.navigation__link')?.focus();
    }
  };

  const close = (returnFocus = true): void => {
    if (!isOpen()) {
      return;
    }

    setOpen(false);

    if (returnFocus) {
      button.focus();
    }
  };

  const trapFocus = (event: KeyboardEvent): void => {
    const focusable = [
      button,
      ...header.querySelectorAll<HTMLElement>('.logo[href]'),
      ...navigation.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  button.addEventListener('click', () => {
    if (isOpen()) {
      close();
    } else {
      setOpen(true);
    }
  });

  overlay.addEventListener('click', () => close());

  navigation.addEventListener('click', (event) => {
    if (
      event.target instanceof Element &&
      event.target.closest('.navigation__link')
    ) {
      close(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!isOpen()) {
      return;
    }

    if (event.key === 'Escape') {
      close();
    } else if (event.key === 'Tab') {
      trapFocus(event);
    }
  });

  tabletQuery.addEventListener('change', (event) => {
    if (event.matches) {
      close(false);
    }
  });

  renderCartCount(navigation);
};
