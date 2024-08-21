// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  {
    files: ['**/*.vue', '**/*.ts'],
    rules: {
      'no-console': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
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
        'warn',
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
        'warn',
        {
          singleline: 'beside',
          multiline: 'beside',
        },
      ],
    },
  },
);
