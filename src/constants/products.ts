import type { Product } from '../core/types';

export const PRODUCTS: readonly Product[] = [
  {
    id: 'monstera-deliciosa',
    name: 'Monstera Deliciosa',
    tag: 'Indoor Favorite',
    category: 'indoor',
    sizes: [
      { inches: 6, price: 29.99 },
      { inches: 8, price: 44.99 },
      { inches: 10, price: 69.99 },
    ],
    images: [
      'images/products/monstera-deliciosa/1.webp',
      'images/products/monstera-deliciosa/2.webp',
      'images/products/monstera-deliciosa/3.webp',
      'images/products/monstera-deliciosa/4.webp',
    ],
    description:
      'A tropical favourite with large, glossy split leaves. Easy to care for and great for bright rooms.',
    isBestSeller: true,
  },
  {
    id: 'snake-plant',
    name: 'Snake Plant',
    tag: 'Low Maintenance',
    category: 'indoor',
    sizes: [
      { inches: 6, price: 19.99 },
      { inches: 8, price: 29.99 },
      { inches: 10, price: 44.99 },
    ],
    images: [
      'images/products/snake-plant/1.webp',
      'images/products/snake-plant/2.webp',
      'images/products/snake-plant/3.webp',
      'images/products/snake-plant/4.webp',
    ],
    description:
      'Upright, sword-like leaves that purify the air. Tolerates low light and irregular watering.',
    isBestSeller: true,
  },
  {
    id: 'peace-lily',
    name: 'Peace Lily',
    tag: 'Air Purifying',
    category: 'flowering',
    sizes: [
      { inches: 6, price: 24.99 },
      { inches: 8, price: 34.99 },
      { inches: 10, price: 49.99 },
    ],
    images: [
      'images/products/peace-lily/1.webp',
      'images/products/peace-lily/2.webp',
      'images/products/peace-lily/3.webp',
      'images/products/peace-lily/4.webp',
    ],
    description:
      'Elegant white blooms and dark green leaves. Tells you when it needs water by drooping slightly.',
    isBestSeller: true,
  },
  {
    id: 'fiddle-leaf-fig',
    name: 'Fiddle Leaf Fig',
    tag: 'Statement Plant',
    category: 'indoor',
    sizes: [
      { inches: 6, price: 39.99 },
      { inches: 8, price: 59.99 },
      { inches: 10, price: 89.99 },
    ],
    images: [
      'images/products/fiddle-leaf-fig/1.webp',
      'images/products/fiddle-leaf-fig/2.webp',
      'images/products/fiddle-leaf-fig/3.webp',
      'images/products/fiddle-leaf-fig/4.webp',
    ],
    description:
      'A statement plant with big violin-shaped leaves. Loves bright, indirect light and a stable spot.',
  },
  {
    id: 'zz-plant',
    name: 'ZZ Plant',
    tag: 'Thrives in Low Light',
    category: 'indoor',
    sizes: [
      { inches: 6, price: 22.99 },
      { inches: 8, price: 32.99 },
      { inches: 10, price: 47.99 },
    ],
    images: [
      'images/products/zz-plant/1.webp',
      'images/products/zz-plant/2.webp',
      'images/products/zz-plant/3.webp',
      'images/products/zz-plant/4.webp',
    ],
    description:
      'Waxy, glossy leaves on graceful stems. One of the most forgiving plants for beginners.',
  },
  {
    id: 'orchid-phalaenopsis',
    name: 'Phalaenopsis Orchid',
    tag: 'Long Blooming',
    category: 'flowering',
    sizes: [
      { inches: 4, price: 27.99 },
      { inches: 5, price: 34.99 },
      { inches: 6, price: 44.99 },
    ],
    images: [
      'images/products/orchid-phalaenopsis/1.webp',
      'images/products/orchid-phalaenopsis/2.webp',
      'images/products/orchid-phalaenopsis/3.webp',
      'images/products/orchid-phalaenopsis/4.webp',
    ],
    description:
      'Long-lasting blooms that can stay for months. Prefers bright, indirect light and weekly watering.',
  },
  {
    id: 'anthurium',
    name: 'Anthurium',
    tag: 'Year-Round Blooms',
    category: 'flowering',
    sizes: [
      { inches: 5, price: 24.99 },
      { inches: 6, price: 29.99 },
      { inches: 8, price: 42.99 },
    ],
    images: [
      'images/products/anthurium/1.webp',
      'images/products/anthurium/2.webp',
      'images/products/anthurium/3.webp',
      'images/products/anthurium/4.webp',
    ],
    description:
      'Bright red heart-shaped flowers all year round. Enjoys warmth and humidity.',
  },
  {
    id: 'aloe-vera',
    name: 'Aloe Vera',
    tag: 'Medicinal',
    category: 'succulents',
    sizes: [
      { inches: 4, price: 14.99 },
      { inches: 6, price: 22.99 },
      { inches: 8, price: 32.99 },
    ],
    images: [
      'images/products/aloe-vera/1.webp',
      'images/products/aloe-vera/2.webp',
      'images/products/aloe-vera/3.webp',
      'images/products/aloe-vera/4.webp',
    ],
    description:
      'A soothing succulent with thick, fleshy leaves. Needs plenty of sun and very little water.',
    isBestSeller: true,
  },
  {
    id: 'echeveria',
    name: 'Echeveria',
    tag: 'Sun Lover',
    category: 'succulents',
    sizes: [
      { inches: 3, price: 8.99 },
      { inches: 4, price: 11.99 },
      { inches: 5, price: 15.99 },
    ],
    images: [
      'images/products/echeveria/1.webp',
      'images/products/echeveria/2.webp',
      'images/products/echeveria/3.webp',
      'images/products/echeveria/4.webp',
    ],
    description:
      'A compact rosette succulent in soft blue-green tones. Perfect for sunny windowsills.',
  },
  {
    id: 'haworthia',
    name: 'Haworthia Zebra',
    tag: 'Compact Size',
    category: 'succulents',
    sizes: [
      { inches: 3, price: 7.99 },
      { inches: 4, price: 10.99 },
      { inches: 5, price: 14.99 },
    ],
    images: [
      'images/products/haworthia/1.webp',
      'images/products/haworthia/2.webp',
      'images/products/haworthia/3.webp',
      'images/products/haworthia/4.webp',
    ],
    description:
      'Small striped succulent that is happy in partial shade. Ideal for desks and shelves.',
  },
  {
    id: 'ceramic-planter',
    name: 'Ceramic Planter',
    tag: 'Matte Finish',
    category: 'planters',
    sizes: [
      { inches: 6, price: 14.99 },
      { inches: 8, price: 19.99 },
      { inches: 10, price: 29.99 },
    ],
    images: [
      'images/products/ceramic-planter/1.webp',
      'images/products/ceramic-planter/2.webp',
      'images/products/ceramic-planter/3.webp',
      'images/products/ceramic-planter/4.webp',
    ],
    description:
      'A speckled white ceramic pot with a drainage hole. Fits plants up to 15 cm in diameter.',
  },
  {
    id: 'wooden-plant-stand',
    name: 'Wooden Plant Stand',
    tag: 'Natural Wood',
    category: 'planters',
    sizes: [
      { inches: 8, price: 24.99 },
      { inches: 10, price: 29.99 },
      { inches: 12, price: 34.99 },
    ],
    images: [
      'images/products/wooden-plant-stand/1.webp',
      'images/products/wooden-plant-stand/2.webp',
      'images/products/wooden-plant-stand/3.webp',
      'images/products/wooden-plant-stand/4.webp',
    ],
    description:
      'A natural wood stand that lifts your plant off the floor and brings it closer to the light.',
  },
];
