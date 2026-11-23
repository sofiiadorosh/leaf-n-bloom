import type { CartLine } from '../types';

export const isSameCartLine = (a: CartLine, b: CartLine): boolean =>
  a.productId === b.productId && a.size === b.size;

export const getCartLineKey = ({ productId, size }: CartLine): string =>
  `${productId}:${size}`;
