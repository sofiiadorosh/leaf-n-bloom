import type { CartItem } from '../src/core/types';

const STORAGE_KEY = 'leaf-n-bloom:cart:v1';
const monstera: CartItem = { productId: 'monstera-deliciosa', quantity: 1 };
const aloe: CartItem = { productId: 'aloe-vera', quantity: 2 };

const setupStore = (items: readonly CartItem[]) => {
  const browserWindow = new EventTarget();
  const storage = new Map([[STORAGE_KEY, JSON.stringify({ items })]]);
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const originalStorage = Object.getOwnPropertyDescriptor(
    globalThis,
    'localStorage',
  );

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: browserWindow,
  });
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    },
  });

  jest.resetModules();
  const { cartStore } = jest.requireActual<
    typeof import('../src/storage/cartStore')
  >('../src/storage/cartStore');

  return {
    cartStore,
    restorePage: () =>
      browserWindow.dispatchEvent(
        Object.assign(new Event('pageshow'), { persisted: true }),
      ),
    writeCart: (items: readonly CartItem[]) =>
      storage.set(STORAGE_KEY, JSON.stringify({ items })),
    readCart: () => storage.get(STORAGE_KEY),
    cleanup: () => {
      if (originalWindow) {
        Object.defineProperty(globalThis, 'window', originalWindow);
      } else {
        Reflect.deleteProperty(globalThis, 'window');
      }
      if (originalStorage) {
        Object.defineProperty(globalThis, 'localStorage', originalStorage);
      } else {
        Reflect.deleteProperty(globalThis, 'localStorage');
      }
    },
  };
};

describe('cartStore', () => {
  it('refreshes a restored page before the next add can overwrite newer data', () => {
    const { cartStore, restorePage, writeCart, readCart, cleanup } = setupStore(
      [monstera],
    );

    try {
      const readSnapshot = jest.fn();
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
    } finally {
      cleanup();
    }
  });

  it('keeps valid saved items when another line cannot be priced safely', () => {
    const { cartStore, cleanup } = setupStore([
      { ...monstera, quantity: Number.MAX_SAFE_INTEGER },
      aloe,
    ]);

    try {
      expect(cartStore.getItems()).toEqual([aloe]);
    } finally {
      cleanup();
    }
  });
});
