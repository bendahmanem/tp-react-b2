/**
 * Layout principal — EventHub
 *
 * Wrapper qui affiche le Header sur toutes les pages.
 * Les routes enfants sont rendues dans <Outlet />.
 */

import { Outlet, useNavigate, useLocation } from 'react-router'
import type { User } from '../types'
import Header from '../components/Header'

interface AppLayoutProps {
  user: User | null
  onLogout: () => void
}

export default function AppLayout({ user, onLogout }: AppLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const navigateTo = (view: string) => {
    navigate(view)
  }

  return (
    <div className="app">
      <Header
        user={user}
        onNavigate={navigateTo}
        onLogout={onLogout}
      />
      <Outlet />
    </div>
  )
}