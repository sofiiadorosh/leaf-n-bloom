import { describe, expect, it } from 'vitest';
import { calculateCart } from '../../../src/core/cart/calculateCart';
import type { CartItem } from '../../../src/core/types';

const cartItem: CartItem = {
  productId: 'monstera-deliciosa',
  size: 6,
  extras: [],
  quantity: 1,
};

describe('calculateCart', () => {
  it('uses the displayed catalog price and multiplies by quantity', () => {
    expect(
      calculateCart([
        { ...cartItem, quantity: 2 },
        { productId: 'aloe-vera', size: 4, extras: [], quantity: 1 },
      ]),
    ).toEqual({
      lines: [
        {
          ...cartItem,
          name: 'Monstera Deliciosa',
          tag: 'Indoor Favorite',
          image: 'images/products/monstera-deliciosa/1.webp',
          extraItems: [],
          quantity: 2,
          unitPriceCents: 2999,
          entryTotalCents: 5998,
        },
        {
          productId: 'aloe-vera',
          size: 4,
          extras: [],
          extraItems: [],
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

  it('adds the extra care prices to each plant in the line', () => {
    expect(
      calculateCart([
        { ...cartItem, extras: ['neem-oil', 'plant-food'], quantity: 2 },
      ]),
    ).toMatchObject({
      lines: [
        {
          extraItems: [
            { id: 'neem-oil', price: 6.99 },
            { id: 'plant-food', price: 8.99 },
          ],
          unitPriceCents: 4597,
          entryTotalCents: 9194,
        },
      ],
      subtotalCents: 9194,
    });
  });

  it('skips lines with unknown, repeated or unsorted extras', () => {
    expect(
      calculateCart([
        { ...cartItem, extras: ['unknown' as 'neem-oil'] },
        { ...cartItem, extras: ['neem-oil', 'neem-oil'] },
        { ...cartItem, extras: ['plant-food', 'neem-oil'] },
      ]).lines,
    ).toEqual([]);
  });

  it('skips extras on planters', () => {
    expect(
      calculateCart([
        {
          productId: 'ceramic-planter',
          size: 6,
          extras: ['neem-oil'],
          quantity: 1,
        },
      ]).lines,
    ).toEqual([]);
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
