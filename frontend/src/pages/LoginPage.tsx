/**
 * Page connexion — EventHub
 */

import { useState } from 'react'
import { useNavigate } from 'react-router'
import { login } from '../services/api'
import { useUser } from '../context/UserContext'

export default function LoginPage() {
  const { login: setUser } = useUser()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
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
      const response = await login({ email: formData.email, password: formData.password })
      localStorage.setItem('token', response.token)
      setUser({ id: response.user.id, email: response.user.email, name: response.user.name, role: response.user.role as 'user' | 'organizer' | 'admin' })
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h2>Connexion</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Chargement...' : 'Se connecter'}
          </button>
        </form>
        <p className="auth-switch">
          Pas de compte ? <button onClick={() => navigate('/register')}>Inscrivez-vous</button>
        </p>
      </div>
    </main>
  )
}