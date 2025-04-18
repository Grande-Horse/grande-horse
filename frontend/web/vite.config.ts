import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  define: {
    global: 'window',
  },
  server: {
    port: 3000,
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'localhost+2-key.pem')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'localhost+2.pem')),
    // },
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  preview: {
    port: 4173,
    allowedHosts: ['70.12.246.244', 'j12a606.p.ssafy.io'],
  },
});
