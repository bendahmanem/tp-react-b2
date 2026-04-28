/**
 * Composant Footer — Pied de page EventHub
 *
 * Affiche les informations de bas de page : marque, liens,
 * et mention de copyright.
 */

import { useNavigate } from 'react-router'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="footer">
      <div className="footer-brand">
        <p><strong>EventHub</strong> — Projet ISITECH B2-D</p>
        <p className="footer-copy">&copy; 2026 Tous droits reserves.</p>
      </div>

      <nav className="footer-nav">
        <button onClick={() => navigate('/')}>Accueil</button>
        <button onClick={() => navigate('/login')}>Connexion</button>
        <button onClick={() => navigate('/register')}>Inscription</button>
      </nav>
    </footer>
  )
}