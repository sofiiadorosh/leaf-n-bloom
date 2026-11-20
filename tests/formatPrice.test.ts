import { describe, expect, it } from 'vitest';
import { formatPrice } from '../src/core/formatPrice';

describe('formatPrice', () => {
  it('formats dollars with two decimals', () => {
    expect(formatPrice(29.99)).toBe('$29.99');
  });

  it('adds trailing zeros to whole dollars', () => {
    expect(formatPrice(15)).toBe('$15.00');
  });

  it('formats prices under one dollar', () => {
    expect(formatPrice(0.99)).toBe('$0.99');
  });

  it('adds a thousands separator', () => {
    expect(formatPrice(1499.99)).toBe('$1,499.99');
  });

  it('rounds to cents', () => {
    expect(formatPrice(29.99 * 3)).toBe('$89.97');
  });

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });
});
