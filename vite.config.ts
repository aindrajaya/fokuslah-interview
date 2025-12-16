import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Optimize chunk splitting for better caching and parallel loading
        rollupOptions: {
          output: {
            manualChunks: {
              // Split vendor code into separate chunks
              'react-vendor': ['react', 'react-dom'],
              'katex-vendor': ['react-katex'],
              'icons-vendor': ['lucide-react'],
            },
          },
        },
        // Enable minification for smaller bundles
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true, // Remove console.logs in production
            drop_debugger: true,
          },
        },
        // Increase chunk size warning limit
        chunkSizeWarningLimit: 600,
      },
    };
});
