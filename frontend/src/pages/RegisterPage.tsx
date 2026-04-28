/**
 * Page inscription — EventHub
 */

import { useState } from 'react'
import { useNavigate } from 'react-router'
import { register } from '../services/api'
import type { User } from '../types'

interface RegisterPageProps {
  onAuth: (user: User) => void
}

export default function RegisterPage({ onAuth }: RegisterPageProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) { setError('Le nom est obligatoire.'); return }
    setLoading(true)
    setError(null)
    try {
      const response = await register({ name: formData.name, email: formData.email, password: formData.password })
      localStorage.setItem('token', response.token)
      onAuth({ id: response.user.id, email: response.user.email, name: response.user.name, role: response.user.role as User['role'] })
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
        <h2>Inscription</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nom</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Chargement...' : "S'inscrire"}
          </button>
        </form>
        <p className="auth-switch">
          Deja inscrit ? <button onClick={() => navigate('/login')}>Connectez-vous</button>
        </p>
      </div>
    </main>
  )
}