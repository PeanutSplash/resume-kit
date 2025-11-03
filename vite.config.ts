import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MagicResumeComponents',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: (id) => {
        // Externalize all lit imports (including subpaths like lit/directives/*)
        if (id === 'lit' || id.startsWith('lit/')) {
          return true;
        }
        // Externalize other dependencies
        return ['@resume-kit', 'lucide'].includes(id);
      },
      output: {
        globals: {
          lit: 'Lit'
        }
      }
    },
    sourcemap: true,
    emptyOutDir: true
  }
})

