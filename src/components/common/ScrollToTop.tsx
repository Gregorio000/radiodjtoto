import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Riporta la pagina in cima a ogni cambio di rotta.
 * Senza questo, navigando tra le pagine React mantiene la posizione di
 * scroll precedente (comportamento di default delle single-page app).
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}
