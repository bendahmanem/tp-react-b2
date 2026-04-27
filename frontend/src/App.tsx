/**
 * Composant racine — EventHub
 */

import { useState } from 'react'
import type { User, Event, ViewName } from './types'
import Header from './components/Header'
import EventList from './components/EventList'
import EventDetail from './components/EventDetail'
import Auth from './components/Auth'
import MyTickets from './components/MyTickets'
import './App.css'

export default function App() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [currentView, setCurrentView] = useState<ViewName>('home')
  const [user, setUser] = useState<User | null>(null)

  const navigateTo = (view: ViewName, event: Event | null = null) => {
    setCurrentView(view)
    setSelectedEvent(event)
  }

  const handleLogin = (userData: User) => {
    setUser(userData)
    navigateTo('home')
  }

  const handleLogout = () => {
    setUser(null)
    navigateTo('home')
  }

  return (
    <div className="app">
      <Header
        user={user}
        onNavigate={navigateTo}
        onLogout={handleLogout}
      />

      {currentView === 'home' && (
        <EventList
          onSelectEvent={(event: Event) => navigateTo('detail', event)}
        />
      )}

      {currentView === 'detail' && selectedEvent && (
        <EventDetail
          event={selectedEvent}
          user={user}
          onBack={() => navigateTo('home')}
        />
      )}

      {currentView === 'login' && (
        <Auth
          mode="login"
          onAuth={handleLogin}
          onSwitchMode={() => navigateTo('register')}
        />
      )}

      {currentView === 'register' && (
        <Auth
          mode="register"
          onAuth={handleLogin}
          onSwitchMode={() => navigateTo('login')}
        />
      )}

      {currentView === 'my-tickets' && user && (
        <MyTickets userId={user.id} />
      )}
    </div>
  )
}