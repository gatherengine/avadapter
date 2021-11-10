import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

// import nodePolyfills from "rollup-plugin-polyfill-node";
import nodePolyfills from "@reputation.link/rollup-plugin-polyfill-node";
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

// See https://github.com/ashour/svelte-i18n-demo/blob/9b885b2310591bb7ef5f76f74808a6960d02697b/rollup.config.js#L17
const moduleContext = (id) => {
  const modulesNeedWindowThis = [
    "node_modules/twilio-video/es5/util/insightspublisher/index.js",
    "node_modules/twilio-video/es5/twilioconnection.js",
  ];

  const modulesNeedNullThis = ["node_modules/lodash/lodash.js"];

  const match = (modules) =>
    modules.some((id_) => id.trimRight().endsWith(id_));

  if (match(modulesNeedWindowThis)) {
    return "window";
  } else if (match(modulesNeedNullThis)) {
    return "null";
  }
};

export default [
  {
    input: "src/server.js",
    output: [
      { file: pkg.main, format: "cjs", sourcemap: true, exports: "auto", name },
    ],
    plugins: [resolve({ preferBuiltins: true }), commonjs(), json()],
    moduleContext,
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
    moduleContext,
    watch: {
      clearScreen: false,
    },
  },
];
