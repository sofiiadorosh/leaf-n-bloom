import { calculateCart } from './calculateCart';
import type { CartItem } from '../types';
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
