/**
 * Composant Header — Navigation globale
 */

import type { User, ViewName } from '../types'

interface HeaderProps {
  user: User | null
  onNavigate: (view: ViewName, event?: import('../types').Event | null) => void
  onLogout: () => void
}

export default function Header({ user, onNavigate, onLogout }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo" onClick={() => onNavigate('home')}>
          EventHub
        </h1>

        <nav className="nav">
          <button onClick={() => onNavigate('home')}>
            Événements
          </button>

          {user ? (
            <>
              <button onClick={() => onNavigate('my-tickets')}>
                Mes billets
              </button>
              <span className="user-name">Bienvenue, {user.name}</span>
              <button onClick={onLogout} className="btn-secondary">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <button onClick={() => onNavigate('login')}>
                Connexion
              </button>
              <button onClick={() => onNavigate('register')}>
                Inscription
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}