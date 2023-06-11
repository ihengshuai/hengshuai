import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import dts from 'vite-plugin-dts';
import path from 'path';

const resolve = (r: string) => path.resolve(__dirname, r);

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'modules',
    minify: false,
    lib: {
      entry: resolve('src/index.ts'),
      formats: ['cjs', 'es'],
    },
    rollupOptions: {
      input: resolve('src/index.ts'),
      output: [
        {
          format: 'es',
          entryFileNames: '[name].js',
          //让打包目录和我们目录对应
          preserveModules: true,
          dir: 'dist/es',
        },
        {
          format: 'cjs',
          entryFileNames: '[name].js',
          preserveModules: true,
          dir: 'dist/cjs',
        },
      ],
      external: ['vue', /\.scss$/i],
    },
  },
  plugins: [vue(), vueJsx(), dts({ include: resolve('./src') })],
});
