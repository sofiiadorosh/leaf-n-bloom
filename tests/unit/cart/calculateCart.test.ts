import { describe, expect, it } from 'vitest';
import { calculateCart } from '../../../src/core/cart/calculateCart';
import type { CartItem } from '../../../src/core/types';

const cartItem: CartItem = {
  productId: 'monstera-deliciosa',
  size: 6,
  quantity: 1,
};

describe('calculateCart', () => {
  it('uses the displayed catalog price and multiplies by quantity', () => {
    expect(
      calculateCart([
        { ...cartItem, quantity: 2 },
        { productId: 'aloe-vera', size: 4, quantity: 1 },
      ]),
    ).toEqual({
      lines: [
        {
          ...cartItem,
          name: 'Monstera Deliciosa',
          tag: 'Indoor Favorite',
          image: 'images/products/monstera-deliciosa/1.webp',
          quantity: 2,
          unitPriceCents: 2999,
          entryTotalCents: 5998,
        },
        {
          productId: 'aloe-vera',
          size: 4,
          name: 'Aloe Vera',
          tag: 'Medicinal',
          image: 'images/products/aloe-vera/1.webp',
          quantity: 1,
          unitPriceCents: 1499,
          entryTotalCents: 1499,
        },
      ],
      subtotalCents: 7497,
      discountCents: 0,
      totalCents: 7497,
    });
  });

  it('uses the price of the selected size', () => {
    expect(
      calculateCart([
        { ...cartItem, quantity: 1 },
        { ...cartItem, size: 8, quantity: 2 },
      ]),
    ).toMatchObject({
      lines: [
        { size: 6, unitPriceCents: 2999, entryTotalCents: 2999 },
        { size: 8, unitPriceCents: 4499, entryTotalCents: 8998 },
      ],
      subtotalCents: 11997,
    });
  });

  it('skips a size the product does not have', () => {
    expect(calculateCart([{ ...cartItem, size: 12 }]).lines).toEqual([]);
  });

  it('rounds SALE10 once on the full subtotal', () => {
    expect(
      calculateCart([{ ...cartItem, quantity: 6 }], 'SALE10'),
    ).toMatchObject({
      subtotalCents: 17994,
      discountCents: 1799,
      totalCents: 16195,
    });
  });
});
