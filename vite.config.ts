import { defineConfig } from 'vite';

export default defineConfig({
  base: '/leaf-n-bloom/',
  build: {
    rollupOptions: {
      input: ['index.html', 'shop.html', 'cart.html', '404.html'],
    },
  },
});
