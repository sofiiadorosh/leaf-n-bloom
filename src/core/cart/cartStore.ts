import { calculateCart } from './calculateCart';
import { isSameCartLine } from './cartLine';
import type { CartItem, CartLine } from '../types';
import { readStoredCartItems, saveCartItems } from './cartLocalStorage';

type CartListener = (items: readonly CartItem[]) => void;

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
  hasCartSaveError = !saveCartItems(cartItems);

  notifyCartListeners();

  return true;
};

export const cartStore = {
  getItems,

  isSaved: (): boolean => !hasCartSaveError,

  add(line: CartLine, quantity = 1): boolean {
    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      return false;
    }

    const nextCartItems = getItems();

    const existingCartItem = nextCartItems.find((cartItem) =>
      isSameCartLine(cartItem, line),
    );

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      nextCartItems.push({ ...line, quantity });
    }
    return applyCartItems(nextCartItems);
  },

  changeQuantity(line: CartLine, quantity: number): boolean {
    const nextCartItems = getItems();

    const cartItem = nextCartItems.find((candidate) =>
      isSameCartLine(candidate, line),
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

  remove(line: CartLine): void {
    const previousCartItems = getItems();

    const nextCartItems = previousCartItems.filter(
      (cartItem) => !isSameCartLine(cartItem, line),
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
