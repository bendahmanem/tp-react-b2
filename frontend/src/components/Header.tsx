/**
 * Composant Header — Barre de navigation
 *
 * Lit le token JWT depuis localStorage pour determiner
 * si l'utilisateur est connecte. Navigation via router.
 */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

interface HeaderUser {
  id: string; email: string; name: string; role: string
}

export default function Header() {
  const navigate = useNavigate()
  const [user, setUser] = useState<HeaderUser | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setUser(null); return }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setUser({ id: payload.sub, email: payload.email, name: '', role: payload.role })
    } catch {
      setUser(null)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header-brand">
        <h1>EventHub</h1>
      </div>

      <nav className="header-nav">
        <button onClick={() => navigate('/')}>Evenements</button>

        {user ? (
          <>
            <button onClick={() => navigate('/my-tickets')}>Mes Billets</button>
            <span className="user-info">{user.email}</span>
            <button onClick={handleLogout} className="btn-logout">Deconnexion</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')}>Connexion</button>
            <button onClick={() => navigate('/register')}>Inscription</button>
          </>
        )}
      </nav>
    </header>
  )
}