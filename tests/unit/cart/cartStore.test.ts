import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CartItem } from '../../../src/core/types';

const STORAGE_KEY = 'leaf-n-bloom:cart:v1';
const monstera: CartItem = {
  productId: 'monstera-deliciosa',
  size: 6,
  quantity: 1,
};
const aloe: CartItem = { productId: 'aloe-vera', size: 4, quantity: 2 };

const setupStore = async (items: readonly unknown[]) => {
  const browserWindow = new EventTarget();
  const storage = new Map([[STORAGE_KEY, JSON.stringify({ items })]]);
  vi.stubGlobal('window', browserWindow);
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  });

  vi.resetModules();
  const { cartStore } = await import('../../../src/core/cart/cartStore');

  return {
    cartStore,
    restorePage: () =>
      browserWindow.dispatchEvent(
        Object.assign(new Event('pageshow'), { persisted: true }),
      ),
    writeCart: (items: readonly unknown[]) =>
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
    cartStore.add(monstera);
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

  it('keeps two sizes of one plant as separate lines', async () => {
    const { cartStore } = await setupStore([]);

    cartStore.add(monstera);
    cartStore.add({ ...monstera, size: 8 }, 2);
    cartStore.add(monstera);

    expect(cartStore.getItems()).toEqual([
      { ...monstera, quantity: 2 },
      { ...monstera, size: 8, quantity: 2 },
    ]);
  });

  it('adds the chosen quantity in one call', async () => {
    const { cartStore, readCart } = await setupStore([]);
    const listener = vi.fn();
    cartStore.subscribe(listener);
    listener.mockClear();

    expect(cartStore.add({ ...monstera, size: 10 }, 3)).toBe(true);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(readCart()).toBe(
      JSON.stringify({ items: [{ ...monstera, size: 10, quantity: 3 }] }),
    );
  });

  it('rejects a size the product does not have and an invalid quantity', async () => {
    const { cartStore } = await setupStore([]);

    expect(cartStore.add({ ...monstera, size: 12 })).toBe(false);
    expect(cartStore.add(monstera, 0)).toBe(false);
    expect(cartStore.getItems()).toEqual([]);
  });

  it('changes and removes only the matching size', async () => {
    const monsteraLarge = { ...monstera, size: 8 };
    const { cartStore } = await setupStore([monstera, monsteraLarge]);

    cartStore.changeQuantity(monsteraLarge, 4);
    expect(cartStore.getItems()).toEqual([
      monstera,
      { ...monsteraLarge, quantity: 4 },
    ]);

    cartStore.remove(monstera);
    expect(cartStore.getItems()).toEqual([{ ...monsteraLarge, quantity: 4 }]);
  });

  it('gives items saved without a size the default size', async () => {
    const { cartStore } = await setupStore([
      { productId: 'monstera-deliciosa', quantity: 2 },
      { productId: 'monstera-deliciosa', size: 6, quantity: 1 },
      { productId: 'aloe-vera', quantity: 1 },
    ]);

    expect(cartStore.getItems()).toEqual([
      { ...monstera, quantity: 3 },
      { ...aloe, quantity: 1 },
    ]);
  });

  it('drops saved items with an unknown product or size', async () => {
    const { cartStore } = await setupStore([
      { productId: 'unknown-plant', quantity: 1 },
      { ...monstera, size: 12 },
      { ...monstera, size: '8' },
      aloe,
    ]);

    expect(cartStore.getItems()).toEqual([aloe]);
  });
});
