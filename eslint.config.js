import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist/', 'coverage/', 'docs/site/']),
  js.configs.recommended,
  tseslint.configs.strict,
  {
    rules: {
      'no-console': 'warn',
      'prefer-const': 'error',
      'prefer-template': 'error',
    },
  },
]);
