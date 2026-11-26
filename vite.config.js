import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.js',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'react-slack-login.mjs' : 'react-slack-login.js')
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
      output: { exports: 'named' }
    }
  },
  test: {
    environment: 'jsdom'
  }
})
