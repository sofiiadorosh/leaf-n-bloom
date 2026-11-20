import { calculateCart } from '../../src/core/cart/calculateCart';
import type { CartItem } from '../../src/core/types';

const cartItem: CartItem = {
  productId: 'monstera-deliciosa',
  quantity: 1,
};

describe('calculateCart', () => {
  it('uses the displayed catalog price and multiplies by quantity', () => {
    expect(
      calculateCart([
        { ...cartItem, quantity: 2 },
        { productId: 'aloe-vera', quantity: 1 },
      ]),
    ).toEqual({
      lines: [
        {
          ...cartItem,
          name: 'Monstera Deliciosa',
          quantity: 2,
          unitPriceCents: 2999,
          lineTotalCents: 5998,
        },
        {
          productId: 'aloe-vera',
          name: 'Aloe Vera',
          quantity: 1,
          unitPriceCents: 1499,
          lineTotalCents: 1499,
        },
      ],
      subtotalCents: 7497,
      discountCents: 0,
      totalCents: 7497,
    });
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
