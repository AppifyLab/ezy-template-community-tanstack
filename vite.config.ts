import {tanstackStart} from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig({
  // Start's plugin must come before React's.
  plugins: [tanstackStart(), viteReact()],
  server: {
    // The Preview reaches the dev server through an authenticated proxy on a
    // different host, so bind wide and accept the forwarded Host header.
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: true,
  },
});
