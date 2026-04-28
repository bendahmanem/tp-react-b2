/**
 * Page detail d'un evenement — EventHub
 */

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import type { Event } from '../types'
import { getEventById, buyTicket } from '../services/api'

interface EventApiItem {
  id: string; title: string; description: string; date: string; time: string;
  location: string; city: string; price: number; totalPlaces: number;
  availablePlaces: number; category: string; image?: string; organizerId: string;
  createdAt: string; updatedAt: string;
}

interface LoginUser {
  id: string; email: string; name: string; role: string;
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [event, setEvent] = useState<EventApiItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [buying, setBuying] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (!id) return
    getEventById(id)
      .then(setEvent)
      .catch(() => setError('Evenement introuvable.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleBuyTicket = async () => {
    if (!id) return
    setBuying(true)
    setMessage(null)
    try {
      await buyTicket(id)
      setMessage({ type: 'success', text: 'Billet achete avec succes !' })
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Erreur lors de l\'achat.' })
    } finally {
      setBuying(false)
    }
  }

  if (loading) return <main className="event-detail"><p>Chargement...</p></main>
  if (error || !event) return <main className="event-detail"><p style={{ color: 'red' }}>{error ?? 'Evenement introuvable.'}</p></main>

  return (
    <main className="event-detail">
      <button onClick={() => navigate('/')} className="btn-back">← Retour aux evenements</button>

      <article className="detail-content">
        {event.image && <img src={event.image} alt={event.title} className="detail-image" />}

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

          {message && <p style={{ color: message.type === 'success' ? 'green' : 'red' }}>{message.text}</p>}

          <button
            className="btn-buy"
            onClick={handleBuyTicket}
            disabled={event.availablePlaces === 0 || buying}
          >
            {buying ? 'Achat en cours...' : event.availablePlaces === 0 ? 'Complet' : 'Acheter un billet'}
          </button>
        </div>
      </article>
    </main>
  )
}