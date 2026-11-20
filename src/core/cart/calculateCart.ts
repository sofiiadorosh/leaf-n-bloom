import { PRODUCTS } from '../../constants/catalog/products';
import { getMinPrice } from '../catalog/catalog';
import type { CartItem } from '../types';

const SALE10_PROMO = {
  code: 'SALE10',
  discountDivisor: 10,
} as const;

export type CartEntry = CartItem & {
  name: string;
  unitPriceCents: number;
  entryTotalCents: number;
};

export type CartTotals = {
  lines: CartEntry[];
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
};

export const calculateCart = (
  cartItems: readonly CartItem[],
  promoCode = '',
): CartTotals => {
  const lines = cartItems.flatMap<CartEntry>(({ productId, quantity }) => {
    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      return [];
    }

    const product = PRODUCTS.find(({ id }) => id === productId);
    if (!product) {
      return [];
    }

    const unitPriceCents = Math.round(getMinPrice(product) * 100);
    return [
      {
        productId,
        quantity,
        name: product.name,
        unitPriceCents,
        entryTotalCents: unitPriceCents * quantity,
      },
    ];
  });

  const subtotalCents = lines.reduce(
    (subtotalCents, cartEntry) => subtotalCents + cartEntry.entryTotalCents,
    0,
  );
  if (!Number.isSafeInteger(subtotalCents)) {
    throw new RangeError('Cart subtotal exceeds the safe integer range');
  }

  const discountCents =
    promoCode === SALE10_PROMO.code
      ? Math.round(subtotalCents / SALE10_PROMO.discountDivisor)
      : 0;

  return {
    lines,
    subtotalCents,
    discountCents,
    totalCents: subtotalCents - discountCents,
  };
};
