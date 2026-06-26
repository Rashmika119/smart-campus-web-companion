import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/smart-campus-web-companion/',
  plugins: [react()],
})