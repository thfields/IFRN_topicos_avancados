import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Porta do Vite (frontend)
    proxy: {
      '/api': { // Prefixo para chamadas ao backend
        target: 'http://localhost:3000', // URL do backend
        changeOrigin: true, // Muda o cabeçalho Host para o destino
        secure: false, // Define como false caso esteja usando HTTP
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove o prefixo '/api' ao enviar a requisição
      },
    },
  },
});
