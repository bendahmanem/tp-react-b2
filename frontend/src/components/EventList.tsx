/**
 * Composant EventList — Liste des événements disponibles
 */

import type { Event } from '../types'
import EventCard from './EventCard'

interface EventListProps {
  events: Event[]
  onSelectEvent: (event: Event) => void
}

export default function EventList({ events, onSelectEvent }: EventListProps) {
  return (
    <main className="event-list">
      <h2>Événements à venir</h2>

      {events.length === 0 ? (
        <div className="empty-state">
          <p>Aucun événement disponible pour le moment.</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => onSelectEvent(event)}
            />
          ))}
        </div>
      )}
    </main>
  )
}