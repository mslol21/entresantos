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
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Ateliê Entre Santos',
        short_name: 'Entre Santos',
        description: 'Artesanato Católico & Presentes de Fé',
        theme_color: '#050B18',
        background_color: '#050B18',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
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
