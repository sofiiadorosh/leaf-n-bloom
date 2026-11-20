import { calculateCart } from './calculateCart';
import type { CartItem } from '../types';

const CART_STORAGE_KEY = 'leaf-n-bloom:cart:v1';
type CartListener = (items: readonly CartItem[]) => void;

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

const readStoredCartItems = (): CartItem[] | undefined => {
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

let cartItems: CartItem[] | undefined;
let hasCartSaveError = false;
const cartListeners = new Set<CartListener>();

const getItems = (): CartItem[] => {
  if (cartItems === undefined) {
    cartItems = readStoredCartItems() ?? [];
  }

  return cartItems.map((cartItem) => ({ ...cartItem }));
};

const notifyCartListeners = (): void => {
  cartListeners.forEach((listener) => listener(getItems()));
};

window.addEventListener('pageshow', (event) => {
  if (!event.persisted || hasCartSaveError) {
    return;
  }

  const restoredItems = readStoredCartItems();

  if (restoredItems !== undefined) {
    cartItems = restoredItems;
    notifyCartListeners();
  }
});

const applyCartItems = (nextCartItems: CartItem[]): boolean => {
  try {
    const { lines: validLines } = calculateCart(nextCartItems);

    if (validLines.length !== nextCartItems.length) {
      return false;
    }
  } catch (error) {
    if (error instanceof RangeError) {
      return false;
    }
    throw error;
  }

  cartItems = nextCartItems;
  try {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify({ items: cartItems }),
    );

    hasCartSaveError = false;
  } catch {
    hasCartSaveError = true;
  }

  notifyCartListeners();

  return true;
};

export const cartStore = {
  getItems,

  isSaved: (): boolean => !hasCartSaveError,

  add(productId: string): boolean {
    const nextCartItems = getItems();

    const existingCartItem = nextCartItems.find(
      (cartItem) => cartItem.productId === productId,
    );

    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      nextCartItems.push({ productId, quantity: 1 });
    }
    return applyCartItems(nextCartItems);
  },

  changeQuantity(productId: string, quantity: number): boolean {
    const nextCartItems = getItems();

    const cartItem = nextCartItems.find(
      (candidate) => candidate.productId === productId,
    );

    if (!cartItem) {
      return false;
    }

    if (cartItem.quantity === quantity) {
      return true;
    }

    cartItem.quantity = quantity;

    return applyCartItems(nextCartItems);
  },

  remove(productId: string): void {
    const previousCartItems = getItems();

    const nextCartItems = previousCartItems.filter(
      (cartItem) => cartItem.productId !== productId,
    );

    if (nextCartItems.length !== previousCartItems.length) {
      applyCartItems(nextCartItems);
    }
  },

  subscribe(listener: CartListener): () => void {
    cartListeners.add(listener);

    listener(getItems());

    return () => cartListeners.delete(listener);
  },
};
