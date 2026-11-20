import { PRODUCTS } from '../../constants/catalog/products';
import { calculateCart } from '../../core/cart/calculateCart';
import type { CartEntry } from '../../core/cart/calculateCart';
import { formatPrice } from '../../core/formatPrice';
import { cartStore } from '../../core/cart/cartStore';
import { createElement } from '../shared/createElement';
import { spriteHref } from '../shared/spriteHref';

const formatCentsToUsd = (cents: number): string => formatPrice(cents / 100);

const actionButton = (
  action: string,
  content: string | SVGSVGElement,
  label: string,
): HTMLButtonElement =>
  createElement('button', {
    children: [content],
    attributes: { type: 'button', 'data-action': action, 'aria-label': label },
  });

const createCartEntry = (
  entry: CartEntry,
  entryIndex: number,
): HTMLLIElement => {
  const productImage = PRODUCTS.find(({ id }) => id === entry.productId)
    ?.images[0];
  const { name } = entry;
  const decrease = actionButton(
    'decrease',
    '−',
    `Decrease quantity of ${name}`,
  );
  decrease.disabled = entry.quantity === 1;

  return createElement('li', {
    className: 'shopping-cart__item',
    attributes: { 'data-index': entryIndex },
    children: [
      ...(productImage
        ? [
            createElement('img', {
              className: 'shopping-cart__image',
              attributes: {
                src: `${import.meta.env.BASE_URL}${productImage}`,
                alt: '',
                width: 96,
                height: 96,
              },
            }),
          ]
        : []),
      createElement('div', {
        className: 'shopping-cart__details',
        children: [
          createElement('h3', { text: entry.name }),
          createElement('p', {
            text: `${formatCentsToUsd(entry.unitPriceCents)} each`,
          }),
        ],
      }),
      createElement('div', {
        className: 'shopping-cart__line-actions',
        children: [
          createElement('div', {
            className: 'shopping-cart__quantity',
            attributes: {
              role: 'group',
              'aria-label': `Quantity of ${name}`,
            },
            children: [
              decrease,
              createElement('span', { text: String(entry.quantity) }),
              actionButton('increase', '+', `Increase quantity of ${name}`),
            ],
          }),
          createElement('div', {
            className: 'shopping-cart__line-total',
            children: [
              createElement('strong', {
                text: formatCentsToUsd(entry.entryTotalCents),
              }),
              actionButton(
                'remove',
                createElement('svg', {
                  attributes: { width: 20, height: 20, 'aria-hidden': 'true' },
                  children: [
                    createElement('use', {
                      attributes: { href: spriteHref('trash') },
                    }),
                  ],
                }),
                `Remove ${name}`,
              ),
            ],
          }),
        ],
      }),
    ],
  });
};

export const renderCart = (): void => {
  const cartItemsList = document.querySelector('#cart-items');
  const empty = document.querySelector<HTMLElement>('#cart-empty');
  const promoForm = document.querySelector<HTMLFormElement>('#cart-promo');
  const promoCodeInput =
    document.querySelector<HTMLInputElement>('#promo-code');
  const promoMessage = document.querySelector('#promo-message');
  const cartMessage = document.querySelector('#cart-message');
  const subtotal = document.querySelector('#cart-subtotal');
  const discount = document.querySelector('#cart-discount');
  const total = document.querySelector('#cart-total');

  if (
    !cartItemsList ||
    !empty ||
    !promoForm ||
    !promoCodeInput ||
    !promoMessage ||
    !cartMessage ||
    !subtotal ||
    !discount ||
    !total
  ) {
    return;
  }

  let promoCode = '';
  const renderTotals = (cartTotals: ReturnType<typeof calculateCart>): void => {
    subtotal.textContent = formatCentsToUsd(cartTotals.subtotalCents);
    discount.textContent = cartTotals.discountCents
      ? `−${formatCentsToUsd(cartTotals.discountCents)}`
      : formatCentsToUsd(0);
    total.textContent = formatCentsToUsd(cartTotals.totalCents);
  };

  const render = (): void => {
    const cartTotals = calculateCart(cartStore.getItems(), promoCode);
    const hasCartEntries = cartTotals.lines.length > 0;
    cartItemsList.replaceChildren(...cartTotals.lines.map(createCartEntry));
    empty.hidden = hasCartEntries;
    promoForm.hidden = !hasCartEntries;
    renderTotals(cartTotals);
    cartMessage.textContent = cartStore.isSaved()
      ? ''
      : 'Cart changes may be lost when you leave.';
  };

  promoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    promoCode = promoCodeInput.value.trim().toUpperCase();
    const cartTotals = calculateCart(cartStore.getItems(), promoCode);
    renderTotals(cartTotals);
    const hasDiscount = cartTotals.discountCents > 0;
    const isPromoCodeInvalid = promoCode !== '' && !hasDiscount;
    promoCodeInput.setAttribute('aria-invalid', String(isPromoCodeInvalid));
    promoMessage.textContent = hasDiscount
      ? '10% discount applied.'
      : isPromoCodeInvalid
        ? 'This promo code is not valid.'
        : '';
  });

  cartItemsList.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }
    const button = event.target.closest<HTMLButtonElement>(
      'button[data-action]',
    );
    const row = button?.closest<HTMLElement>('[data-index]');
    if (!button || !row) {
      return;
    }

    const entryIndex = Number(row.dataset.index);
    const cartItems = cartStore.getItems();
    const cartItem = cartItems[entryIndex];
    if (!cartItem) {
      return;
    }
    const { productId, quantity } = cartItem;
    const cartAction = button.dataset.action;

    if (cartAction === 'remove') {
      cartStore.remove(productId);
    } else if (
      !cartStore.changeQuantity(
        productId,
        quantity + (cartAction === 'increase' ? 1 : -1),
      )
    ) {
      cartMessage.textContent = 'This quantity exceeds the cart limit.';
      return;
    }

    const nextRow =
      cartItemsList.children[
        Math.min(entryIndex, cartItemsList.children.length - 1)
      ];
    const focusAction =
      cartAction === 'decrease' && quantity === 2 ? 'increase' : cartAction;
    if (nextRow) {
      nextRow
        .querySelector<HTMLButtonElement>(`[data-action="${focusAction}"]`)
        ?.focus({ preventScroll: true });
    } else {
      empty.querySelector('a')?.focus();
    }
  });

  cartStore.subscribe(render);
};
