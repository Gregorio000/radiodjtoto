import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configurazione Vite.
// Il proxy /api evita problemi di CORS in sviluppo quando si punta
// all'endpoint RadioBoss: le richieste a /api/* vengono inoltrate.
// In produzione si usa direttamente l'URL configurato in src/config.ts.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    // Proxy di sviluppo verso il server RadioBoss.fm: evita i blocchi CORS
    // quando si gira in locale. Deve puntare allo stesso host/porta dei due
    // URL in src/config.ts — aggiornalo se cambi server di streaming.
    proxy: {
      '/__radioboss': {
        target: 'https://c26.radioboss.fm:8795',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/__radioboss/, ''),
      },
    },
  },
});
