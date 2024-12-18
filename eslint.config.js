import eslintConfigPrettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import eslintConfigVueTs from '@vue/eslint-config-typescript'
// @ts-expect-error https://github.com/import-js/eslint-plugin-import/issues/3090
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginJs from '@eslint/js'
import eslintPluginStylistic from '@stylistic/eslint-plugin'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import eslintPluginVitest from '@vitest/eslint-plugin'
import eslintPluginVue from 'eslint-plugin-vue'
import eslintPluginX from '@txe/eslint-plugin-x'
import * as eslintToolingTs from 'typescript-eslint'
import globals from 'globals'

export default eslintToolingTs.config(
  {
    name: 'package/files-to-lint',
    files: ['**/*.{ts,vue}'],
  },

  {
    name: 'package/files-to-ignore',
    ignores: ['**/dist/**', '**/coverage/**'],
  },

  eslintPluginJs.configs.recommended,
  {
    rules: {
      'object-shorthand': ['warn', 'properties'],
      'no-restricted-syntax': [
        'warn',
        { selector: 'TSEnumDeclaration', message: 'Avoid enums' },
      ],
    },
  },

  ...eslintToolingTs.configs.strict,
  ...eslintToolingTs.configs.stylistic,
  {
    rules: {
      // https://github.com/typescript-eslint/typescript-eslint/issues/8113
      '@typescript-eslint/no-invalid-void-type': 'off',
      '@typescript-eslint/parameter-properties': 'warn',
    },
  },

  eslintPluginImport.flatConfigs.recommended,
  eslintPluginImport.flatConfigs.typescript,
  {
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
    rules: {
      'import/no-duplicates': 'off',
      // https://github.com/import-js/eslint-plugin-import/issues/3076
      'import/no-unresolved': 'off',

      'import/consistent-type-specifier-style': ['warn', 'prefer-top-level'],
      'import/no-empty-named-blocks': 'warn',
      'import/newline-after-import': 'warn',

      'import/first': 'error',
      'import/no-extraneous-dependencies': [
        'error',
        { devDependencies: ['*', 'src/**/*.spec.*'] },
      ],
    },
  },

  {
    languageOptions: {
      globals: globals.builtin,
    },
    plugins: {
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      'unicorn/prefer-node-protocol': 'warn',
    },
  },

  // @ts-expect-error somebody in the future, please
  eslintPluginStylistic.configs.customize({
    arrowParens: true,
    braceStyle: '1tbs',
  }),
  {
    plugins: {
      // https://github.com/eslint-stylistic/eslint-stylistic/issues/398
      '@stylistic': eslintPluginStylistic,
    },
    rules: {
      // conflicts with prettier
      '@stylistic/indent': ['off'],
      '@stylistic/indent-binary-ops': ['off'],
      //

      '@stylistic/padding-line-between-statements': [
        'warn',
        { blankLine: 'never', prev: 'import', next: 'import' },
        { blankLine: 'always', prev: '*', next: 'block-like' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'always', prev: ['case', 'default'], next: '*' },
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
    },
  },

  ...eslintPluginX.configs.recommended,
  ...eslintPluginVue.configs['flat/essential'],
  ...eslintConfigVueTs(),

  {
    ...eslintPluginVitest.configs.recommended,
    files: ['src/**/*.spec.*'],
  },

  eslintConfigPrettierSkipFormatting,
)
