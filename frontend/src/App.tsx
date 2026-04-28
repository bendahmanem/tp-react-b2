/**
 * Composant racine — EventHub
 *
 * Restoration de session au demarrage si un token JWT existe.
 * Utilise useUser du context pour partager l'etat auth.
 */

import { useEffect } from 'react'
import { useUser } from './context/UserContext'

export default function App() {
  const { user, login } = useUser()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || user) return
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      login({ id: payload.sub, email: payload.email, name: '', role: payload.role })
    } catch {
      localStorage.removeItem('token')
    }
  }, [])

  return null
}