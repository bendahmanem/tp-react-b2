/**
 * Composant EventList — Liste des evenements disponibles
 *
 * Charge la liste des evenements depuis l'API au montage du composant.
 * Affiche un etat de chargement et gere les erreurs.
 */

import { useEffect, useState } from 'react'
import type { Event } from '../types'
import { getEvents } from '../services/api'
import EventCard from './EventCard'

interface EventListProps {
  onSelectEvent: (event: Event) => void
}

interface EventApiItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  city: string;
  price: number;
  totalPlaces: number;
  availablePlaces: number;
  category: string;
  image?: string;
  organizerId: string;
  createdAt: string;
  updatedAt: string;
}

export default function EventList({ onSelectEvent }: EventListProps) {
  const [events, setEvents] = useState<EventApiItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch(() => setError('Impossible de charger les evenements.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="event-list">
      <h2>Evenements a venir</h2>

      {loading && <p>Chargement...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && events.length === 0 && (
        <div className="empty-state">
          <p>Aucun evenement disponible pour le moment.</p>
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="events-grid">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event as Event}
              onClick={() => onSelectEvent(event as Event)}
            />
          ))}
        </div>
      )}
    </main>
  )
}