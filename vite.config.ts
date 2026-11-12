import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { sendEnquiryMail } from './server/sendEnquiryMail.mjs';

function enquiryApiPlugin(): Plugin {
  return {
    name: 'enquiry-api',
    configureServer(server) {
      server.middlewares.use('/api/enquiry', (req, res, next) => {
        if (req.method !== 'POST') return next();
        let raw = '';
        req.on('data', (chunk) => {
          raw += chunk;
        });
        req.on('end', async () => {
          try {
            const payload = JSON.parse(raw || '{}');
            await sendEnquiryMail(payload);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true }));
          } catch (err) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: err instanceof Error ? err.message : 'Failed to send' }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), enquiryApiPlugin()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: { motion: ['framer-motion'], react: ['react', 'react-dom'] },
      },
    },
  },
});
