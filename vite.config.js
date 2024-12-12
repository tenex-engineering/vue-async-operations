import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '#package': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
