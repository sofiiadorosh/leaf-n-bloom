import { calculateCart } from './calculateCart';
import type { CartItem } from '../types';

const CART_STORAGE_KEY = 'leaf-n-bloom:cart:v1';

const isCartItem = (storedValue: unknown): storedValue is CartItem =>
  typeof storedValue === 'object' &&
  storedValue !== null &&
  'productId' in storedValue &&
  typeof storedValue.productId === 'string' &&
  'quantity' in storedValue &&
  typeof storedValue.quantity === 'number' &&
  Number.isSafeInteger(storedValue.quantity) &&
  storedValue.quantity > 0;

const filterValidCartItems = (storedItems: Iterable<CartItem>): CartItem[] => {
  const validItems: CartItem[] = [];
  let subtotalCents = 0;

  Array.from(storedItems).forEach((cartItem) => {
    try {
      const { lines, subtotalCents: cartEntrySubtotalCents } = calculateCart([
        cartItem,
      ]);
      const updatedSubtotalCents = subtotalCents + cartEntrySubtotalCents;

      if (lines.length > 0 && Number.isSafeInteger(updatedSubtotalCents)) {
        validItems.push(cartItem);
        subtotalCents = updatedSubtotalCents;
      }
    } catch (error) {
      if (!(error instanceof RangeError)) {
        throw error;
      }
    }
  });

  return validItems;
};

export const readStoredCartItems = (): CartItem[] | undefined => {
  let storedCartJson: string | null;

  try {
    storedCartJson = localStorage.getItem(CART_STORAGE_KEY);
  } catch {
    return undefined;
  }

  if (storedCartJson === null) {
    return [];
  }

  try {
    const storedCart: unknown = JSON.parse(storedCartJson);

    if (
      typeof storedCart !== 'object' ||
      storedCart === null ||
      !('items' in storedCart) ||
      !Array.isArray(storedCart.items)
    ) {
      return [];
    }

    const itemsByProductId = new Map<string, CartItem>();

    storedCart.items.filter(isCartItem).forEach(({ productId, quantity }) => {
      const previousQuantity = itemsByProductId.get(productId)?.quantity ?? 0;

      itemsByProductId.set(productId, {
        productId,
        quantity: previousQuantity + quantity,
      });
    });

    return filterValidCartItems(itemsByProductId.values());
  } catch {
    return [];
  }
};

export const saveCartItems = (items: readonly CartItem[]): boolean => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items }));
    return true;
  } catch {
    return false;
  }
};
