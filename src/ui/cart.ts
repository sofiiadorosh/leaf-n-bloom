import { PRODUCTS } from '../constants/products';
import { calculateCart, type CartLine } from '../core/calculateCart';
import { formatPrice } from '../core/formatPrice';
import { cartStore } from '../storage/cartStore';
import { createElement } from './createElement';
import { spriteHref } from './spriteHref';

const money = (cents: number): string => formatPrice(cents / 100);

const actionButton = (
  action: string,
  content: string | SVGSVGElement,
  label: string,
): HTMLButtonElement =>
  createElement('button', {
    children: [content],
    attributes: { type: 'button', 'data-action': action, 'aria-label': label },
  });

const createLine = (line: CartLine, index: number): HTMLLIElement => {
  const image = PRODUCTS.find(({ id }) => id === line.productId)?.images[0];
  const { name } = line;
  const decrease = actionButton(
    'decrease',
    '−',
    `Decrease quantity of ${name}`,
  );
  decrease.disabled = line.quantity === 1;

  return createElement('li', {
    className: 'shopping-cart__item',
    attributes: { 'data-index': index },
    children: [
      ...(image
        ? [
            createElement('img', {
              className: 'shopping-cart__image',
              attributes: {
                src: `${import.meta.env.BASE_URL}${image}`,
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
          createElement('h3', { text: line.name }),
          createElement('p', {
            text: `${money(line.unitPriceCents)} each`,
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
              createElement('span', { text: String(line.quantity) }),
              actionButton('increase', '+', `Increase quantity of ${name}`),
            ],
          }),
          createElement('div', {
            className: 'shopping-cart__line-total',
            children: [
              createElement('strong', { text: money(line.lineTotalCents) }),
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
  const list = document.querySelector('#cart-items');
  const empty = document.querySelector<HTMLElement>('#cart-empty');
  const form = document.querySelector<HTMLFormElement>('#cart-promo');
  const input = document.querySelector<HTMLInputElement>('#promo-code');
  const promoMessage = document.querySelector('#promo-message');
  const message = document.querySelector('#cart-message');
  const subtotal = document.querySelector('#cart-subtotal');
  const discount = document.querySelector('#cart-discount');
  const total = document.querySelector('#cart-total');

  if (
    !list ||
    !empty ||
    !form ||
    !input ||
    !promoMessage ||
    !message ||
    !subtotal ||
    !discount ||
    !total
  ) {
    return;
  }

  let promoCode = '';
  const renderTotals = (cart: ReturnType<typeof calculateCart>): void => {
    subtotal.textContent = money(cart.subtotalCents);
    discount.textContent = cart.discountCents
      ? `−${money(cart.discountCents)}`
      : money(0);
    total.textContent = money(cart.totalCents);
  };

  const render = (): void => {
    const cart = calculateCart(cartStore.getItems(), promoCode);
    const hasItems = cart.lines.length > 0;
    list.replaceChildren(...cart.lines.map(createLine));
    empty.hidden = hasItems;
    form.hidden = !hasItems;
    renderTotals(cart);
    message.textContent = cartStore.isSaved()
      ? ''
      : 'Cart changes may be lost when you leave.';
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    promoCode = input.value.trim().toUpperCase();
    const cart = calculateCart(cartStore.getItems(), promoCode);
    renderTotals(cart);
    const hasDiscount = cart.discountCents > 0;
    const isPromoCodeInvalid = promoCode !== '' && !hasDiscount;
    input.setAttribute('aria-invalid', String(isPromoCodeInvalid));
    promoMessage.textContent = hasDiscount
      ? '10% discount applied.'
      : isPromoCodeInvalid
        ? 'This promo code is not valid.'
        : '';
  });

  list.addEventListener('click', (event) => {
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

    const index = Number(row.dataset.index);
    const current = cartStore.getItems();
    const line = current[index];
    if (!line) {
      return;
    }
    const { productId, quantity } = line;
    const action = button.dataset.action;

    if (action === 'remove') {
      cartStore.remove(productId);
    } else if (
      !cartStore.changeQuantity(
        productId,
        quantity + (action === 'increase' ? 1 : -1),
      )
    ) {
      message.textContent = 'This quantity exceeds the cart limit.';
      return;
    }

    const nextRow = list.children[Math.min(index, list.children.length - 1)];
    const nextButton =
      action === 'decrease' && quantity === 2 ? 'increase' : action;
    if (nextRow) {
      nextRow
        .querySelector<HTMLButtonElement>(`[data-action="${nextButton}"]`)
        ?.focus({ preventScroll: true });
    } else {
      empty.querySelector('a')?.focus();
    }
  });

  cartStore.subscribe(render);
};
