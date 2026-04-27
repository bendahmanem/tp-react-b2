/**
 * EventHub — Application frontend React
 *
 * Ce fichier est le point d'entrée de l'interface utilisateur.
 * Il展示了 React 的核心概念 pour les étudiants qui découvrent la bibliothèque.
 *
 * Concepts clés demostrés dans ce fichier :
 * - useState : gestion d'état local (étatReact)
 * - Componentes : réutilisabilité
 * - Props : transmission de données entre composants
 * - Conditional rendering : affichage conditionnel
 *
 * Structure de l'application :
 * App (composant racine)
 *   ├── Header (navigation + auth)
 *   ├── EventList (liste des événements)
 *   ├── EventCard (carte événement individuelle)
 *   ├── EventDetail (détail d'un événement)
 *   └── Auth (inscription / connexion)
 */

import { useState } from 'react'
import './App.css'

// ============================================================
// COMPOSANT : App (composant racine)
// ============================================================
// Un composant React est simplement une fonction qui retourne
// du JSX (HTML en syntaxe JavaScript).
// Les composants permettent de découper l'UI en pièces réutilisables.

function App() {
  // --------------------------------------------------------
  // useState : le hook d'état de React
  // --------------------------------------------------------
  // useState renvoie un tableau [currentValue, setterFunction]
  // Ici, 'events' stocke la liste des événements
  // et 'setEvents' permet de la mettre à jour (réactif)
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [currentView, setCurrentView] = useState('home') // 'home' | 'detail' | 'login' | 'register' | 'my-tickets'
  const [user, setUser] = useState(null) // null = non connecté, objet = connecté

  // --------------------------------------------------------
  // Fonction de navigation
  // --------------------------------------------------------
  // Permet de changer la vue affichée sans recharger la page
  // C'est le principe du Single Page Application (SPA)
  const navigateTo = (view, event = null) => {
    setCurrentView(view)
    setSelectedEvent(event)
  }

  // --------------------------------------------------------
  // Fonction de connexion (simulation)
  // --------------------------------------------------------
  // En conditions réelles, cette fonction appellerait une API
  // et stockerait le token JWT dans le localStorage
  const handleLogin = (userData) => {
    setUser(userData)
    navigateTo('home')
  }

  // --------------------------------------------------------
  // Fonction de déconnexion
  // --------------------------------------------------------
  const handleLogout = () => {
    setUser(null)
    navigateTo('home')
  }

  // ============================================================
  // RENDU CONDITIONNEL
  // ============================================================
  // En React, on peut décider d'afficher tel ou tel élément
  // en fonction de l'état de l'application (ici : currentView)

  return (
    <div className="app">
      {/* Header : toujours visible, gère la navigation globale */}
      <Header
        user={user}
        currentView={currentView}
        onNavigate={navigateTo}
        onLogout={handleLogout}
      />

      {/* Routage interne : on affiche tel ou tel composant selon la vue */}
      {currentView === 'home' && (
        <EventList
          events={events}
          onSelectEvent={(event) => navigateTo('detail', event)}
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
// ============================================================
// Les Props sont le mécanisme de передачи данных d'un
// composant parent vers un composant enfant.
// C'est analogous à les paramètres d'une fonction.
function Header({ user, currentView, onNavigate, onLogout }) {
  return (
    <header className="header">
      <div className="header-content">
        {/* Logo cliquable → retour à l'accueil */}
        <h1 className="logo" onClick={() => onNavigate('home')}>
          EventHub
        </h1>

        {/* Navigation principale */}
        <nav className="nav">
          <button onClick={() => onNavigate('home')}>
            Événements
          </button>

          {/* Affichage conditionnel selon l'état de connexion */}
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
// ============================================================
// Affiche la liste de tous les événements disponibles.
// 'events' et 'onSelectEvent' sont des props reçues du parent.
function EventList({ events, onSelectEvent }) {
  if (events.length === 0) {
    return (
      <div className="empty-state">
        <p>Aucun événement disponible pour le moment.</p>
      </div>
    )
  }

  return (
    <main className="event-list">
      <h2>Événements à venir</h2>

      {/* La méthode .map() permet de parcourir un tableau et
          de retourner un élément JSX pour chaque item.
          La clé 'key' est obligatoire pour aider React à
          identifier chaque élément de manière unique. */}
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
// ============================================================
// Carte individuelle pour un événement.
// Réutilisable : on peut l'utiliser dans plusieurs contextes
// (liste, recommandations, etc.)
function EventCard({ event, onClick }) {
  return (
    <article className="event-card" onClick={onClick}>
      {/* Image de couverture (optionnelle) */}
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="event-card-image"
        />
      )}

      <div className="event-card-content">
        {/* Badge catégorie */}
        <span className="category-badge">{event.category}</span>

        {/* Titre de l'événement */}
        <h3>{event.title}</h3>

        {/* Informations clés */}
        <p className="event-info">
          {event.date} — {event.city}
        </p>

        {/* Prix et places disponibles */}
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
// ============================================================
// Affiche tous les détails d'un événement + bouton d'achat
function EventDetail({ event, user, onBack }) {
  const handleBuyTicket = () => {
    // Logique d'achat (sera conectada à l'API backend)
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

          {/* Bouton d'achat — désactivé si pas de places ou non connecté */}
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
// COMPOSANT : Auth (inscription / connexion)
// ============================================================
// Gère les deux formulaires avec un prop 'mode'
function Auth({ mode, onAuth, onSwitchMode }) {
  // state local pour les champs du formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  // Mise à jour des champs lors de la saisie
  const handleChange = (e) => {
    setFormData({
      ...formData,       // garde les autres champs existants
      [e.target.name]: e.target.value // met à jour le champ modifié
    })
  }

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault() // empêche le rechargement de la page
    // Envoi des données (sera géré par l'API backend)
    onAuth({ id: 1, name: formData.name || 'Utilisateur' })
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h2>{mode === 'login' ? 'Connexion' : 'Inscription'}</h2>

        <form onSubmit={handleSubmit}>
          {/* Champ nom (inscription uniquement) */}
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

          {/* Champ email */}
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

          {/* Champ mot de passe */}
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

        {/* Lien pour basculer entre inscription et connexion */}
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
// ============================================================
// Affiche les billets de l'utilisateur connecté
function MyTickets({ userId }) {
  // État pour stocker les billets (sera-fetched depuis l'API)
  const [tickets, setTickets] = useState([])

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
              {/* QR Code (sera affiché via une librarie) */}
              <div className="qr-placeholder">{ticket.qrCode}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default App