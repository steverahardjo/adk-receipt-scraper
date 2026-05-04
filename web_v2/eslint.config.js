//  @ts-check
import unusedImports from 'eslint-plugin-unused-imports'
import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    // FIX: plugins must be an object, not an array
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // Unused imports logic
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      // Your other custom rule overrides
      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',
    },
  },
  {
    ignores: ['eslint.config.js', 'prettier.config.js'],
  },
]
