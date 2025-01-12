import { defineConfig, loadEnv } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDevMode = env.VITE_DEV_MODE === 'true';

  return {
    base: isDevMode ? '/' : '/bolt-faq-youtube/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      base: '/',
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          commands: path.resolve(__dirname, 'commands.html'),
          contact: path.resolve(__dirname, 'contact.html'),
        },
      },
    },
  };
});
