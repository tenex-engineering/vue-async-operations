import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        include: ['src/*'],
        exclude: ['src/index.ts', 'src/fixtures/**/*', 'src/**/*.spec.*'],
      },
    },
  }),
)
