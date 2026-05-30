import { defineConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  resolve: {
    dedupe: ["react", "react-dom", "react-is"],
    alias: [
      // Avoid broken CJS optimizeDeps output from `es-toolkit/compat/*` by routing
      // Recharts' default imports through local ESM shims.
      {
        find: "es-toolkit/compat/get",
        replacement: path.resolve(rootDir, "src/vite-shims/es-toolkit/compat/get.js"),
      },
      {
        find: "es-toolkit/compat/uniqBy",
        replacement: path.resolve(rootDir, "src/vite-shims/es-toolkit/compat/uniqBy.js"),
      },
      {
        find: "es-toolkit/compat/range",
        replacement: path.resolve(rootDir, "src/vite-shims/es-toolkit/compat/range.js"),
      },
      {
        find: "es-toolkit/compat/omit",
        replacement: path.resolve(rootDir, "src/vite-shims/es-toolkit/compat/omit.js"),
      },
      {
        find: "es-toolkit/compat/maxBy",
        replacement: path.resolve(rootDir, "src/vite-shims/es-toolkit/compat/maxBy.js"),
      },
      {
        find: "es-toolkit/compat/minBy",
        replacement: path.resolve(rootDir, "src/vite-shims/es-toolkit/compat/minBy.js"),
      },
      {
        find: "es-toolkit/compat/sumBy",
        replacement: path.resolve(rootDir, "src/vite-shims/es-toolkit/compat/sumBy.js"),
      },
      {
        find: "es-toolkit/compat/sortBy",
        replacement: path.resolve(rootDir, "src/vite-shims/es-toolkit/compat/sortBy.js"),
      },
      {
        find: "es-toolkit/compat/throttle",
        replacement: path.resolve(rootDir, "src/vite-shims/es-toolkit/compat/throttle.js"),
      },
      {
        find: "es-toolkit/compat/last",
        replacement: path.resolve(rootDir, "src/vite-shims/es-toolkit/compat/last.js"),
      },
      {
        find: "es-toolkit/compat/isPlainObject",
        replacement: path.resolve(
          rootDir,
          "src/vite-shims/es-toolkit/compat/isPlainObject.js",
        ),
      },
    ],
  },
  optimizeDeps: {
    // Recharts itself can produce a broken optimizeDeps bundle in some setups
    // (e.g. `require_isUnsafeProperty is not a function`). Exclude Recharts from
    // pre-bundling, but still pre-bundle CJS entrypoints that Recharts imports.
    include: [
      "react-is",
      "react-redux",
      "use-sync-external-store",
      "decimal.js-light",
      "decimal.js-light/decimal.js",
      "eventemitter3",
      // Recharts -> react-redux -> use-sync-external-store (CJS shims)
      "use-sync-external-store/shim",
      "use-sync-external-store/shim/with-selector",
      "use-sync-external-store/with-selector",
    ],
    exclude: ["recharts"],
    needsInterop: [
      "use-sync-external-store",
      "use-sync-external-store/with-selector",
      "use-sync-external-store/shim",
      "use-sync-external-store/shim/with-selector",
      "decimal.js-light",
      "decimal.js-light/decimal.js",
      "eventemitter3",
    ],
    // Help Vite/esbuild pre-bundle CommonJS wrappers that branch on NODE_ENV
    // so it can resolve the correct file and extract named exports.
    esbuildOptions: {
      // Work around broken minified optimizeDeps output seen with some CJS deps
      // (e.g. `require_isUnsafeProperty is not a function` from es-toolkit).
      minify: false,
      define: {
        "process.env.NODE_ENV": JSON.stringify(
          mode === "production" ? "production" : "development",
        ),
      },
    },
  },
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
}))
