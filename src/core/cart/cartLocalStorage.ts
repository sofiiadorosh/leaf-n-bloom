import { PRODUCTS } from '../../constants/catalog/products';
import { calculateCart } from './calculateCart';
import { getCartLineKey } from './cartLine';
import type { CartItem } from '../types';

const CART_STORAGE_KEY = 'leaf-n-bloom:cart:v1';

type StoredCartItem = Omit<CartItem, 'size'> & { size?: unknown };

const isStoredCartItem = (
  storedValue: unknown,
): storedValue is StoredCartItem =>
  typeof storedValue === 'object' &&
  storedValue !== null &&
  'productId' in storedValue &&
  typeof storedValue.productId === 'string' &&
  'quantity' in storedValue &&
  typeof storedValue.quantity === 'number' &&
  Number.isSafeInteger(storedValue.quantity) &&
  storedValue.quantity > 0;

const getDefaultSize = (productId: string): number | undefined =>
  PRODUCTS.find(({ id }) => id === productId)?.sizes[0].inches;

const toCartItem = ({
  productId,
  size,
  quantity,
}: StoredCartItem): CartItem | undefined => {
  const cartItemSize = size === undefined ? getDefaultSize(productId) : size;

  return typeof cartItemSize === 'number'
    ? { productId, size: cartItemSize, quantity }
    : undefined;
};

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

    const itemsByLine = new Map<string, CartItem>();

    storedCart.items.filter(isStoredCartItem).forEach((storedItem) => {
      const cartItem = toCartItem(storedItem);

      if (!cartItem) {
        return;
      }

      const key = getCartLineKey(cartItem);
      const previousQuantity = itemsByLine.get(key)?.quantity ?? 0;

      itemsByLine.set(key, {
        ...cartItem,
        quantity: previousQuantity + cartItem.quantity,
      });
    });

    return filterValidCartItems(itemsByLine.values());
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
