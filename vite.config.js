import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Usa caminhos relativos para os assets funcionarem em qualquer subdiretorio.
  base: './',
  plugins: [react()],
})
