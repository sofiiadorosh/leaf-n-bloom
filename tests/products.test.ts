import { CATEGORIES } from '../src/constants/categories';
import { LIGHT_LEVELS } from '../src/constants/light';
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

  it('has at least one size for every product', () => {
    PRODUCTS.forEach((product) => {
      expect(product.sizes.length).toBeGreaterThan(0);
    });
  });

  it('has positive integer inches for every size', () => {
    PRODUCTS.forEach((product) => {
      product.sizes.forEach(({ inches }) => {
        expect(Number.isInteger(inches)).toBe(true);
        expect(inches).toBeGreaterThan(0);
      });
    });
  });

  it('has a positive price with at most two decimals for every size', () => {
    PRODUCTS.forEach((product) => {
      product.sizes.forEach(({ price }) => {
        expect(price).toBeGreaterThan(0);
        expect(Math.round(price * 100) / 100).toBe(price);
      });
    });
  });

  it('lists sizes from smallest to largest with growing prices', () => {
    PRODUCTS.forEach((product) => {
      product.sizes.slice(1).forEach((size, index) => {
        const previous = product.sizes[index];

        expect(size.inches).toBeGreaterThan(previous.inches);
        expect(size.price).toBeGreaterThan(previous.price);
      });
    });
  });

  it('has a non-empty name, tag and description for every product', () => {
    PRODUCTS.forEach((product) => {
      expect(product.name.trim()).not.toBe('');
      expect(product.tag.trim()).not.toBe('');
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

  it('has known light needs and a pet safety flag for every plant', () => {
    const lightIds: readonly string[] = LIGHT_LEVELS.map(({ id }) => id);

    PRODUCTS.filter(({ category }) => category !== 'planters').forEach(
      (plant) => {
        expect(lightIds).toContain(plant.light);
        expect(typeof plant.petSafe).toBe('boolean');
      },
    );
  });

  it('has at least one pet-safe plant', () => {
    expect(PRODUCTS.some(({ petSafe }) => petSafe)).toBe(true);
  });
});
