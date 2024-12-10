import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  sourcemap: true, // Enable sourcemaps for debugging
  build: {
    outDir: 'dist', // Ensure the output directory is 'dist' (default for Vite)
    sourcemap: true, // Include sourcemaps in the build output
  },
  server: {
    port: 3000, // Optional: Set the development server port
  },
  base: './', // Set base to './' for relative paths (useful for Render deployments)
});
