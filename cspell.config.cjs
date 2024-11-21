'use strict'

/** @type { import("@cspell/cspell-types").CSpellUserSettings } */
// eslint-disable-next-line no-undef
module.exports = {
  version: '0.2',
  language: 'en',
  dictionaryDefinitions: [
    {
      name: 'words',
      path: './words.txt',
      addWords: true,
    },
  ],
  dictionaries: ['words'],
  ignorePaths: ['pnpm-lock.yaml'],
}
