import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'server/dist']),

  // Shared base. The repo holds two very different programs — a browser React
  // app in src/ and a NestJS server in server/ — so the rules that depend on
  // the runtime are set per directory below.
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [js.configs.recommended],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // tsc already reports undefined identifiers, and the core rule cannot
      // see type-only names (or decorator metadata), so it is pure noise here.
      'no-undef': 'off',
      // The TypeScript-aware version understands constructor parameter
      // properties and declaration-only signatures; the core one does not.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },

  // The React app.
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // The API, plus the build tooling that runs on Node.
  {
    files: ['server/**/*.{js,ts}', '*.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
])
