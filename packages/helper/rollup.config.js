const path = require("path")
const replace = require("rollup-plugin-replace")
const commonjs = require("rollup-plugin-commonjs")
const nodeResolve = require("rollup-plugin-node-resolve")
const typescript = require("rollup-plugin-typescript2")
const serve = require("rollup-plugin-serve")
const resolvePath = (...dir) => path.resolve(__dirname, ...dir)
const pkg = require("./package.json")

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * (c) 2014-${new Date().getFullYear()} Peachick
 * Released under the MIT License.
 */
`

export default {
  input: resolvePath('src/index.ts'),
  plugins: [
    commonjs(),
    nodeResolve({
      extensions: ['.js', '.ts'],
    }),
    typescript({
        exclude: "node_modules/**",
    }),
    serve({
      open: true,
      openPage: '/example/index.html',
      port: 8989,
      contentBase: ''
    })
  ],
  output: {
    file: resolvePath(`dist/hjaha.es.js`),
    format: "es",
    banner,
    exports: "named"
  }
}
