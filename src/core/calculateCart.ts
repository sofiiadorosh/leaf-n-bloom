import { PRODUCTS } from '../constants/products';
import { getMinPrice } from './catalog';
import type { CartItem } from './types';

const SALE10_PROMO = {
  code: 'SALE10',
  discountDivisor: 10,
} as const;

export type CartLine = CartItem & {
  name: string;
  unitPriceCents: number;
  lineTotalCents: number;
};

export type CartTotals = {
  lines: CartLine[];
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
};

export const calculateCart = (
  items: readonly CartItem[],
  promoCode = '',
): CartTotals => {
  const lines = items.flatMap<CartLine>(({ productId, quantity }) => {
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
        lineTotalCents: unitPriceCents * quantity,
      },
    ];
  });

  const subtotalCents = lines.reduce(
    (sum, line) => sum + line.lineTotalCents,
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
