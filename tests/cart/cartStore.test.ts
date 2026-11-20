import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CartItem } from '../../src/core/types';

const STORAGE_KEY = 'leaf-n-bloom:cart:v1';
const monstera: CartItem = { productId: 'monstera-deliciosa', quantity: 1 };
const aloe: CartItem = { productId: 'aloe-vera', quantity: 2 };

const setupStore = async (items: readonly CartItem[]) => {
  const browserWindow = new EventTarget();
  const storage = new Map([[STORAGE_KEY, JSON.stringify({ items })]]);
  vi.stubGlobal('window', browserWindow);
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  });

  vi.resetModules();
  const { cartStore } = await import('../../src/core/cart/cartStore');

  return {
    cartStore,
    restorePage: () =>
      browserWindow.dispatchEvent(
        Object.assign(new Event('pageshow'), { persisted: true }),
      ),
    writeCart: (items: readonly CartItem[]) =>
      storage.set(STORAGE_KEY, JSON.stringify({ items })),
    readCart: () => storage.get(STORAGE_KEY),
  };
};

describe('cartStore', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('refreshes a restored page before the next add can overwrite newer data', async () => {
    const { cartStore, restorePage, writeCart, readCart } = await setupStore([
      monstera,
    ]);

    const readSnapshot = vi.fn();
    cartStore.subscribe(readSnapshot);
    writeCart([{ ...monstera, quantity: 3 }]);
    restorePage();

    expect(readSnapshot).toHaveBeenLastCalledWith([
      { ...monstera, quantity: 3 },
    ]);
    cartStore.add(monstera.productId);
    expect(readCart()).toBe(
      JSON.stringify({ items: [{ ...monstera, quantity: 4 }] }),
    );
  });

  it('keeps valid saved items when another line cannot be priced safely', async () => {
    const { cartStore } = await setupStore([
      { ...monstera, quantity: Number.MAX_SAFE_INTEGER },
      aloe,
    ]);

    expect(cartStore.getItems()).toEqual([aloe]);
  });
});
