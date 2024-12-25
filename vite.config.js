import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',  // Proxy requests to /childs to your backend
      // You can add more proxies for other endpoints here if needed
    },
  },
})
