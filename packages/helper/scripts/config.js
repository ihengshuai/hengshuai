import path from 'path';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import pkg from '../package.json';
import { cwd } from 'process';

const resolvePath = (...dir) => path.resolve(__dirname, '../', ...dir);
const scheme = pkg.name.replace(/(?:^|-|\.)(.)/g, ($0, $1) => $1.toUpperCase());

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * (c) 2014-${new Date().getFullYear()} ${pkg.author.name}
 * Released under the MIT License.
 */`;

export const builds = {
  es: {
    input: resolvePath('src/index.ts'),
    dest: resolvePath('dist/index.es.js'),
    format: 'es',
    banner,
    name: scheme,
  },
  umd: {
    input: resolvePath('src/index.ts'),
    dest: resolvePath('dist/index.umd.js'),
    format: 'umd',
    banner,
    name: scheme,
  },
  cjs: {
    input: resolvePath('src/index.ts'),
    dest: resolvePath('dist/index.cjs.js'),
    format: 'commonjs',
    banner,
    name: scheme,
  },
};

export function getConfig(name) {
  const opts = builds[name];
  const config = {
    input: opts.input,
    external: opts.external,
    plugins: [
      alias({
        entries: [{ find: '@', replacement: path.join(cwd(), '/src') }],
      }),
      replace({
        __VERSION__: pkg.version,
        __isBrowser__: true,
        __isDev__: process.env.NODE_ENV !== 'production',
      }),
      json(),
      commonjs(),
      nodeResolve({
        extensions: ['.js', '.ts'],
      }),
      typescript({
        exclude: 'node_modules/**',
      }),
    ],
    output: {
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: opts.name,
      exports: 'named',
    },
  };
  return config;
}

let config;

if (process.env.TARGET) {
  config = getConfig(process.env.TARGET);
}

export default config;
