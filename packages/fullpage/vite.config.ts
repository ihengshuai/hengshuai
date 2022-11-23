import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  root: 'example',
  resolve: {
    alias: {
      '@hengshuai/fullpage': path.resolve(__dirname),
    },
    mainFields: ['module', 'jsnext:main', 'jsnext'],
  },
});
