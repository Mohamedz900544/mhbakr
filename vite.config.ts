
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    define: {
      // Prevents "process is not defined" in browser by replacing it with a valid object literal string
      'process.env': JSON.stringify({
        API_KEY: env.API_KEY,
        VITE_API_URL: env.VITE_API_URL,
        REACT_APP_SUPABASE_URL: env.REACT_APP_SUPABASE_URL,
        REACT_APP_SUPABASE_ANON_KEY: env.REACT_APP_SUPABASE_ANON_KEY,
        NODE_ENV: mode,
      }),
      // Explicit replacements for direct access
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
    }
  };
});
