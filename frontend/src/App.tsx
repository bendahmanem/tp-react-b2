/**
 * EventHub — Composant racine de l'application React
 *
 * Ce fichier constitue le point d'entrée de l'interface utilisateur.
 * Il展示了 les fondamentaux de React pour les étudiants.
 */

import { useState } from 'react'
import type { User, Event, ViewName } from './types'
import './App.css'

// ============================================================
// COMPOSANT PRINCIPAL : App
// ============================================================

function App() {
  // state : liste des événements chargés depuis l'API
  const [events, setEvents] = useState<Event[]>([])
  // state : événement actuellement sélectionné (pour la vue détail)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  // state : vue actuelle (navigation entre pages)
  const [currentView, setCurrentView] = useState<ViewName>('home')
  // state : utilisateur connecté (null = non connecté)
  const [user, setUser] = useState<User | null>(null)

  // Navigation vers une vue + event optionnel
  const navigateTo = (view: ViewName, event: Event | null = null) => {
    setCurrentView(view)
    setSelectedEvent(event)
  }

  // Connexion — en production, appeler l'API POST /auth/login
  const handleLogin = (userData: User) => {
    setUser(userData)
    navigateTo('home')
  }

  // Déconnexion
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
          events={events}
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

// ============================================================
// COMPOSANT : Header
// Navigation globale + état de connexion
// ============================================================

interface HeaderProps {
  user: User | null
  onNavigate: (view: ViewName, event?: Event | null) => void
  onLogout: () => void
}

function Header({ user, onNavigate, onLogout }: HeaderProps) {
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

// ============================================================
// COMPOSANT : EventList
// Affiche la grille des événements disponibles
// ============================================================

interface EventListProps {
  events: Event[]
  onSelectEvent: (event: Event) => void
}

function EventList({ events, onSelectEvent }: EventListProps) {
  if (events.length === 0) {
    return (
      <main className="event-list">
        <h2>Événements à venir</h2>
        <div className="empty-state">
          <p>Aucun événement disponible pour le moment.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="event-list">
      <h2>Événements à venir</h2>

      <div className="events-grid">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onClick={() => onSelectEvent(event)}
          />
        ))}
      </div>
    </main>
  )
}

// ============================================================
// COMPOSANT : EventCard
// Carte individuelle d'événement — réutilisable
// ============================================================

interface EventCardProps {
  event: Event
  onClick: () => void
}

function EventCard({ event, onClick }: EventCardProps) {
  return (
    <article className="event-card" onClick={onClick}>
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="event-card-image"
        />
      )}

      <div className="event-card-content">
        <span className="category-badge">{event.category}</span>
        <h3>{event.title}</h3>
        <p className="event-info">
          {event.date} — {event.city}
        </p>
        <div className="event-footer">
          <span className="price">{event.price}€</span>
          <span className="places">
            {event.availablePlaces} places
          </span>
        </div>
      </div>
    </article>
  )
}

// ============================================================
// COMPOSANT : EventDetail
// Page détail d'un événement + achat de billet
// ============================================================

interface EventDetailProps {
  event: Event
  user: User | null
  onBack: () => void
}

function EventDetail({ event, user, onBack }: EventDetailProps) {
  const handleBuyTicket = () => {
    // TODO: appeler l'API POST /tickets
    alert(`Achat d'un billet pour : ${event.title}`)
  }

  return (
    <main className="event-detail">
      <button onClick={onBack} className="btn-back">
        ← Retour aux événements
      </button>

      <article className="detail-content">
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="detail-image"
          />
        )}

        <div className="detail-info">
          <span className="category-badge">{event.category}</span>
          <h2>{event.title}</h2>
          <p className="description">{event.description}</p>

          <ul className="detail-meta">
            <li><strong>Date :</strong> {event.date}</li>
            <li><strong>Heure :</strong> {event.time}</li>
            <li><strong>Lieu :</strong> {event.location}</li>
            <li><strong>Ville :</strong> {event.city}</li>
            <li><strong>Prix :</strong> {event.price}€</li>
            <li><strong>Places disponibles :</strong> {event.availablePlaces}</li>
          </ul>

          <button
            className="btn-buy"
            onClick={handleBuyTicket}
            disabled={event.availablePlaces === 0 || !user}
          >
            {event.availablePlaces === 0
              ? 'Complet'
              : !user
              ? 'Connectez-vous pour acheter'
              : 'Acheter un billet'}
          </button>
        </div>
      </article>
    </main>
  )
}

// ============================================================
// COMPOSANT : Auth
// Formulaire inscription / connexion
// ============================================================

interface AuthProps {
  mode: 'login' | 'register'
  onAuth: (user: User) => void
  onSwitchMode: () => void
}

function Auth({ mode, onAuth, onSwitchMode }: AuthProps) {
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
    // TODO: appeler l'API POST /auth/login ou /auth/register
    onAuth({ id: '1', name: formData.name || 'Utilisateur', email: formData.email, role: 'user' })
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

// ============================================================
// COMPOSANT : MyTickets
// Liste des billets de l'utilisateur
// ============================================================

interface MyTicketsProps {
  userId: string
}

function MyTickets({ userId }: MyTicketsProps) {
  // TODO: fetch GET /tickets depuis l'API
  const [tickets] = useState<Array<{ id: string; eventTitle: string; date: string; qrCode: string }>>([])

  return (
    <main className="my-tickets">
      <h2>Mes billets</h2>

      {tickets.length === 0 ? (
        <p className="empty-state">Vous n'avez pas encore de billet.</p>
      ) : (
        <div className="tickets-list">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card">
              <h3>{ticket.eventTitle}</h3>
              <p>{ticket.date}</p>
              <div className="qr-placeholder">{ticket.qrCode}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default App