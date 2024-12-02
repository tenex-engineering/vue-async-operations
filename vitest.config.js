import { defineConfig } from 'vitest/config'
import { mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      coverage: {
        include: ['src/*'],
      },
    },
  }),
)
