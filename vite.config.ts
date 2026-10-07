import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/**
 * Preload the two fonts the hero headline needs (Inter Tight latin, Instrument Serif italic latin). The CSS that
 * references them is render-blocking, so without this the browser only discovers the fonts after parsing it.
 */
function preloadCriticalFonts(): Plugin {
  const critical = [/inter-tight-latin-wght-normal-[\w-]+\.woff2$/, /instrument-serif-latin-400-italic-[\w-]+\.woff2$/]
  return {
    name: 'preload-critical-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const files = Object.keys(ctx.bundle ?? {}).filter((f) => critical.some((r) => r.test(f)))
        return files.map((f) => ({
          tag: 'link',
          attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/${f}`, crossorigin: '' },
          injectTo: 'head-prepend' as const,
        }))
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), preloadCriticalFonts()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    // Fewer, larger shared chunks: lucide ships one module per icon and the app has several tiny shared
    // modules; left alone they become ~25 requests, which serialises loading on a high-latency connection.
    rolldownOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/ },
            { name: 'icons', test: /node_modules[\\/]lucide-react[\\/]/ },
            { name: 'app-shared', test: /[\\/]src[\\/](data|lib|hooks|components[\\/]ui)[\\/]/ },
          ],
        },
      },
    },
  },
})
