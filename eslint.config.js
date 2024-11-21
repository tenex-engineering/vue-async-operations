// @ts-check

import eslintConfigPrettier from 'eslint-config-prettier'
// @ts-expect-error https://github.com/import-js/eslint-plugin-import/issues/3090
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginJs from '@eslint/js'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import eslintPluginX from '@txe/eslint-plugin-x'
import eslintStylisticJs from '@stylistic/eslint-plugin-js'
import eslintToolingTs from 'typescript-eslint'
import { fileURLToPath } from 'node:url'
import globals from 'globals'
import { includeIgnoreFile } from '@eslint/compat'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigArray} */
export default [
  includeIgnoreFile(gitignorePath),

  eslintPluginJs.configs.recommended,
  {
    rules: {
      'object-shorthand': ['warn', 'properties'],
      'no-useless-rename': ['warn'],
    },
  },

  // eslint-disable-next-line import/no-named-as-default-member
  ...eslintToolingTs.configs.strict,
  // eslint-disable-next-line import/no-named-as-default-member
  ...eslintToolingTs.configs.stylistic,
  {
    rules: {
      'no-restricted-syntax': [
        'error',
        { selector: 'TSEnumDeclaration', message: 'Avoid enums' },
      ],
      '@typescript-eslint/parameter-properties': 'error',
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

  {
    plugins: {
      x: eslintPluginX,
    },
    rules: {
      'x/organize-imports': 'warn',
    },
  },

  eslintPluginImport.flatConfigs.recommended,
  eslintPluginImport.flatConfigs.typescript,
  {
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      'import/no-duplicates': 'off',
      'import/no-empty-named-blocks': 'warn',
      'import/consistent-type-specifier-style': ['warn', 'prefer-top-level'],
    },
  },

  {
    plugins: {
      '@stylistic/js': eslintStylisticJs,
    },
    rules: {
      '@stylistic/js/padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: 'block-like' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'always', prev: ['case', 'default'], next: '*' },
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
    },
  },

  eslintConfigPrettier,
]
