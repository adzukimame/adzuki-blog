// @ts-check
import tseslint from 'typescript-eslint';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  {
    files: ['**/*.{js,mjs,ts,vue}'],
  },
  {
    files: ['**/*.vue', '**/*.ts'],
    ignores: ['tests/**/*.ts'],
    rules: {
      ...tseslint.configs.strictTypeChecked.find(config => config.name === 'typescript-eslint/strict-type-checked')?.rules,
      '@typescript-eslint/restrict-template-expressions': ['error', {
        allow: [{ name: ['Error', 'URL', 'URLSearchParams'], from: 'lib' }],
        allowAny: false,
        allowBoolean: false,
        allowNever: false,
        allowNullish: false,
        allowNumber: true,
        allowRegExp: false,
      }],
      '@typescript-eslint/no-confusing-void-expression': ['error', {
        ignoreArrowShorthand: true,
        ignoreVoidOperator: false,
        ignoreVoidReturningFunctions: false,
      }],
      '@typescript-eslint/no-floating-promises': ['error', {
        allowForKnownSafeCalls: [
          { from: 'package', package: 'vue', name: 'nextTick' },
        ],
        allowForKnownSafePromises: [],
        checkThenables: false,
        ignoreIIFE: false,
        ignoreVoid: true,
      }],
      '@typescript-eslint/consistent-type-assertions': ['error', {
        assertionStyle: 'never',
      }],
    },
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      'no-console': 'error',
    },
  },
  {
    rules: {
      '@stylistic/comma-dangle': ['error', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
        enums: 'always-multiline',
        generics: 'never',
        tuples: 'always-multiline',
      }],
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/require-v-for-key': 'error',
      'vue/no-use-v-if-with-v-for': 'error',
      'vue/html-closing-bracket-newline': [
        'error',
        {
          singleline: 'never',
          multiline: 'never',
          selfClosingTag: {
            singleline: 'never',
            multiline: 'never',
          },
        },
      ],
      'vue/first-attribute-linebreak': [
        'error',
        {
          singleline: 'beside',
          multiline: 'below',
        },
      ],
      'vue/attribute-hyphenation': 'error',
    },
  },
  {
    files: ['nuxt.config.ts'],
    rules: {
      'nuxt/nuxt-config-keys-order': 'off',
    },
  }
);
