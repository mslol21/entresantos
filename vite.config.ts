import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'favicon.svg', 'logo.png', 'og-image.png'],
      manifest: {
        name: 'Ateliê Entre Santos',
        short_name: 'Entre Santos',
        description: 'Artesanato Católico & Presentes de Fé',
        theme_color: '#0B284C',
        background_color: '#F7F4EB',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'favicon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'og-image.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
