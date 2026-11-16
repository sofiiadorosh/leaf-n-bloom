import { CATEGORIES } from '../src/constants/categories';
import { PRODUCTS } from '../src/constants/products';

describe('PRODUCTS data', () => {
  it('has between 8 and 12 products', () => {
    expect(PRODUCTS.length).toBeGreaterThanOrEqual(8);
    expect(PRODUCTS.length).toBeLessThanOrEqual(12);
  });

  it('has unique ids', () => {
    const ids = PRODUCTS.map((product) => product.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('uses only known categories', () => {
    const categoryIds: readonly string[] = CATEGORIES.map(
      (category) => category.id,
    );

    PRODUCTS.forEach((product) => {
      expect(categoryIds).toContain(product.category);
    });
  });

  it('has products in at least two categories', () => {
    const usedCategories = new Set(PRODUCTS.map((product) => product.category));

    expect(usedCategories.size).toBeGreaterThanOrEqual(2);
  });

  it('has a positive integer price for every product', () => {
    PRODUCTS.forEach((product) => {
      expect(Number.isInteger(product.price)).toBe(true);
      expect(product.price).toBeGreaterThan(0);
    });
  });

  it('has a non-empty name and description for every product', () => {
    PRODUCTS.forEach((product) => {
      expect(product.name.trim()).not.toBe('');
      expect(product.description.trim()).not.toBe('');
    });
  });

  it('has at least one image for every product', () => {
    PRODUCTS.forEach((product) => {
      expect(product.images.length).toBeGreaterThan(0);
    });
  });

  it('keeps product images in the product folder', () => {
    PRODUCTS.forEach((product) => {
      product.images.forEach((image) => {
        expect(image.startsWith(`images/products/${product.id}/`)).toBe(true);
      });
    });
  });

  it('uses 1.webp as the main image', () => {
    PRODUCTS.forEach((product) => {
      expect(product.images[0]).toBe(`images/products/${product.id}/1.webp`);
    });
  });
});
