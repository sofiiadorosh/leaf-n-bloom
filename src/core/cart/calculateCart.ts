import { EXTRA_CARE } from '../../constants/catalog/extraCare';
import { PRODUCTS } from '../../constants/catalog/products';
import { isPlant } from '../catalog/productDetails';
import type { CartItem, ExtraCareItem } from '../types';

const toCents = (price: number): number => Math.round(price * 100);

const SALE10_PROMO = {
  code: 'SALE10',
  discountDivisor: 10,
} as const;

export type CartEntry = CartItem & {
  name: string;
  tag: string;
  image?: string;
  extraItems: ExtraCareItem[];
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
    ({ productId, size, extras, quantity }) => {
      if (!Number.isSafeInteger(quantity) || quantity < 1) {
        return [];
      }

      const product = PRODUCTS.find(({ id }) => id === productId);
      const productSize = product?.sizes.find(({ inches }) => inches === size);
      if (!product || !productSize) {
        return [];
      }

      const extraItems = EXTRA_CARE.filter(({ id }) => extras.includes(id));
      const hasValidExtras =
        extraItems.length === extras.length &&
        extraItems.every(({ id }, index) => id === extras[index]) &&
        (extras.length === 0 || isPlant(product));
      if (!hasValidExtras) {
        return [];
      }

      const unitPriceCents = extraItems.reduce(
        (priceCents, { price }) => priceCents + toCents(price),
        toCents(productSize.price),
      );
      return [
        {
          productId,
          size,
          extras,
          quantity,
          name: product.name,
          tag: product.tag,
          image: product.images[0],
          extraItems,
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
