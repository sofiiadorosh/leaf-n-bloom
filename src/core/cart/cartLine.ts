import { EXTRA_CARE } from '../../constants/catalog/extraCare';
import type { CartLine, ExtraCareId } from '../types';

const EXTRA_CARE_IDS: readonly string[] = EXTRA_CARE.map(({ id }) => id);

export const isExtraCareId = (value: unknown): value is ExtraCareId =>
  typeof value === 'string' && EXTRA_CARE_IDS.includes(value);

export const normalizeExtras = (
  extras: readonly ExtraCareId[],
): ExtraCareId[] =>
  EXTRA_CARE.map(({ id }) => id).filter((id) => extras.includes(id));

export const isSameCartLine = (a: CartLine, b: CartLine): boolean =>
  a.productId === b.productId &&
  a.size === b.size &&
  a.extras.length === b.extras.length &&
  a.extras.every((extra, index) => extra === b.extras[index]);

export const getCartLineKey = ({ productId, size, extras }: CartLine): string =>
  [productId, size, ...extras].join(':');
