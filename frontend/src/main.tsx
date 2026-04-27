/**
 * Point d'entrée de l'application React — EventHub
 *
 * Ce fichier monte le composant racine App dans le DOM.
 * StrictMode active des vérifications supplémentaires en développement.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Monte le composant App dans l'élément #root du HTML
// createRoot remplace l'ancienne API ReactDOM.render
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)