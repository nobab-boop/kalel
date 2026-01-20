import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Prevents 'process is not defined' error in browser for existing code using process.env
    'process.env': {} 
  }
});