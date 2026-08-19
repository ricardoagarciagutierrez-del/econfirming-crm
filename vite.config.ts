import { defineConfig } from 'vite'

// Load @vitejs/plugin-react as an ESM dynamic import to avoid CJS/require issues
export default defineConfig(async () => {
  const reactPlugin = (await import('@vitejs/plugin-react')).default
  return {
    plugins: [reactPlugin()],
  }
})
