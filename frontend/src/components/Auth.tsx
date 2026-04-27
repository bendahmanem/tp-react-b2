/**
 * Composant Auth — Formulaire inscription / connexion
 *
 * Utilise l'API pour authentifier ou inscrire l'utilisateur.
 * Stocke le token JWT en localStorage sur succes.
 */

import { useState } from 'react'
import type { User } from '../types'
import { login, register } from '../services/api'

interface AuthProps {
  mode: 'login' | 'register'
  onAuth: (user: User) => void
  onSwitchMode: () => void
}

export default function Auth({ mode, onAuth, onSwitchMode }: AuthProps) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let response;
      if (mode === 'login') {
        response = await login({ email: formData.email, password: formData.password })
      } else {
        if (!formData.name.trim()) {
          setError('Le nom est obligatoire.')
          setLoading(false)
          return
        }
        response = await register({ name: formData.name, email: formData.email, password: formData.password })
      }

      localStorage.setItem('token', response.token)
      onAuth({ id: response.user.id, email: response.user.email, name: response.user.name, role: response.user.role as User['role'] })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h2>{mode === 'login' ? 'Connexion' : 'Inscription'}</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="name">Nom</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
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