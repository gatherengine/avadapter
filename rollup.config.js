import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

import nodePolyfills from "rollup-plugin-node-polyfills";
// import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

const name = pkg.name
  .replace(/^\w/, (m) => m.toUpperCase())
  .replace(/-\w/g, (m) => m[1].toUpperCase());

const plugins = [
  // Need this to polyfill `EventEmitter`
  nodePolyfills(),

  alias({
    entries: [{ find: "debug", replacement: "debug-ts" }],
  }),

  resolve({
    browser: true,
  }),
  typescript({
    sourceMap: true,
    inlineSources: false,
  }),
  commonjs(),
  json(),

  // terser(),
];

export default [
  {
    input: "src/server.ts",
    output: [
      { file: pkg.main, format: "cjs", sourcemap: true, name },
    ],
    plugins,
    watch: {
      clearScreen: false,
    },
  },
  {
    input: "src/client.ts",
    output: [
      { file: pkg.module, format: "es", sourcemap: true },
      { file: pkg.browser, format: "umd", sourcemap: true, name },
    ],
    plugins,
    watch: {
      clearScreen: false,
    },
  },
];
