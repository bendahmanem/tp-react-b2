/**
 * Composant Auth — Formulaire inscription / connexion
 */

import { useState } from 'react'
import type { User } from '../types'

interface AuthProps {
  mode: 'login' | 'register'
  onAuth: (user: User) => void
  onSwitchMode: () => void
}

export default function Auth({ mode, onAuth, onSwitchMode }: AuthProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAuth({
      id: '1',
      name: formData.name || 'Utilisateur',
      email: formData.email,
      role: 'user',
    })
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h2>{mode === 'login' ? 'Connexion' : 'Inscription'}</h2>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="name">Nom</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            {mode === 'login' ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? (
            <>Pas de compte ? <button onClick={onSwitchMode}>Inscrivez-vous</button></>
          ) : (
            <>Déjà inscrit ? <button onClick={onSwitchMode}>Connectez-vous</button></>
          )}
        </p>
      </div>
    </main>
  )
}