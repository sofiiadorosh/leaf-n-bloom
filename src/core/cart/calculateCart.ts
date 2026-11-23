import { PRODUCTS } from '../../constants/catalog/products';
import type { CartItem } from '../types';

const SALE10_PROMO = {
  code: 'SALE10',
  discountDivisor: 10,
} as const;

export type CartEntry = CartItem & {
  name: string;
  tag: string;
  image?: string;
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
  const lines = cartItems.flatMap<CartEntry>(
    ({ productId, size, quantity }) => {
      if (!Number.isSafeInteger(quantity) || quantity < 1) {
        return [];
      }

      const product = PRODUCTS.find(({ id }) => id === productId);
      const productSize = product?.sizes.find(({ inches }) => inches === size);
      if (!product || !productSize) {
        return [];
      }

      const unitPriceCents = Math.round(productSize.price * 100);
      return [
        {
          productId,
          size,
          quantity,
          name: product.name,
          tag: product.tag,
          image: product.images[0],
          unitPriceCents,
          entryTotalCents: unitPriceCents * quantity,
        },
      ];
    },
  );

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
