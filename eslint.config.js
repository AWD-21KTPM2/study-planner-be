import pluginJs from '@eslint/js';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import requireExplicitGenerics from 'eslint-plugin-require-explicit-generics';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  {
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  prettier,
  {
    plugins: {
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSortPlugin,
      'require-explicit-generics': requireExplicitGenerics,
    },
    rules: {
      'prettier/prettier': ['warn', { singleQuote: true }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': 'off',
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      'react/no-unused-prop-types': 'warn',
      'require-explicit-generics/require-explicit-generics': [
        'error',
        [
          'useState',
          'useReducer',
          'useContext',
          'useRef',
          'useMemo',
          'useCallback',
          'useImperativeHandle',
          'useForm',
          'useWatch',
          // useEffect and useLayoutEffect do not take generics, so they are not included
        ],
      ],
    },
  },
];
