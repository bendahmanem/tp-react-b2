/**
 * Context utilisateur — EventHub
 *
 * Fournit le user connecte a toutes les pages via useUser().
 */

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { User } from '../types'

interface UserContextValue {
  user: User | null
  login: (userData: User) => void
  logout: () => void
}

const UserContext = createContext<UserContextValue>({
  user: null,
  login: () => {},
  logout: () => {},
})

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('token')
    if (!token) return null
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return { id: payload.sub, email: payload.email, name: '', role: payload.role }
    } catch {
      return null
    }
  })

  const login = (userData: User) => setUser(userData)
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>
}

export function useUser() {
  return useContext(UserContext)
}