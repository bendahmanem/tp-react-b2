/**
 * Composant EventDetail — Page détail d'un événement + achat
 */

import type { Event, User } from '../types'

interface EventDetailProps {
  event: Event
  user: User | null
  onBack: () => void
}

export default function EventDetail({ event, user, onBack }: EventDetailProps) {
  const handleBuyTicket = () => {
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