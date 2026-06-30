import baseConfig from '../../eslint.config.mjs';

import tsPlugin from '@typescript-eslint/eslint-plugin';

const pl = [
  {
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // Вимикає правило для стандартних функцій та функцій TypeScript
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
];

export default [...baseConfig, ...pl];
