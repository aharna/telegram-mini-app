import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['f7ea-115-187-46-122.ngrok-free.app'],
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
      interval: 100
    }
  }
})

