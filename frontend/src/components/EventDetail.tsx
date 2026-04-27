/**
 * Composant EventDetail — Page detail d'un evenement + achat de billet
 *
 * Affiche les details d'un evenement et permet d'acheter un billet
 * via POST /tickets si l'utilisateur est connecte.
 */

import { useState } from 'react'
import type { Event, User } from '../types'
import { buyTicket } from '../services/api'

interface EventDetailProps {
  event: Event
  user: User | null
  onBack: () => void
}

export default function EventDetail({ event, user, onBack }: EventDetailProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleBuyTicket = async () => {
    if (!user) return

    setLoading(true)
    setMessage(null)

    try {
      await buyTicket(event.id)
      setMessage({ type: 'success', text: 'Billet achete avec succes !' })
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erreur lors de l\'achat.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="event-detail">
      <button onClick={onBack} className="btn-back">← Retour aux evenements</button>

      <article className="detail-content">
        {event.image && (
          <img src={event.image} alt={event.title} className="detail-image" />
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

          {message && (
            <p style={{ color: message.type === 'success' ? 'green' : 'red' }}>
              {message.text}
            </p>
          )}

          <button
            className="btn-buy"
            onClick={handleBuyTicket}
            disabled={event.availablePlaces === 0 || !user || loading}
          >
            {loading ? 'Achat en cours...' : event.availablePlaces === 0 ? 'Complet' : !user ? 'Connectez-vous pour acheter' : 'Acheter un billet'}
          </button>
        </div>
      </article>
    </main>
  )
}