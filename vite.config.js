import path from 'path';
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Definir __dirname
const __dirname = path.resolve();

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Aquí defines el alias '@' para apuntar a la carpeta 'src'
    },
  }
})
