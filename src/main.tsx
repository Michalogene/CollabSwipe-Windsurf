import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Import debug functions
import { debugDatabaseContent, testSupabaseConnection } from './utils/debugData';

// Debug au démarrage (seulement en développement)
if (import.meta.env.DEV) {
  console.log('🚀 ColabSwipe - Mode Développement');
  
  // Tester la connexion Supabase
  testSupabaseConnection().then(isConnected => {
    if (isConnected) {
      // Débugger le contenu de la base
      debugDatabaseContent();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);