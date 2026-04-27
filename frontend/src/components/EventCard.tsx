/**
 * Composant EventCard — Carte d'événement individuelle
 */

import type { Event } from '../types'

interface EventCardProps {
  event: Event
  onClick: () => void
}

export default function EventCard({ event, onClick }: EventCardProps) {
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