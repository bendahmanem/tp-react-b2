/**
 * Composant MyTickets — Liste des billets de l'utilisateur connecte
 *
 * Charge les billets depuis GET /tickets avec le JWT de l'utilisateur.
 * Affiche chaque billet avec le QR code et le statut.
 */

import { useEffect, useState } from 'react'
import type { TicketWithEvent } from '../services/api'

interface MyTicketsProps {
  userId: string
}

export default function MyTickets({ userId }: MyTicketsProps) {
  const [tickets, setTickets] = useState<TicketWithEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Non connecte.')
      setLoading(false)
      return
    }

    fetch('http://localhost:3000/tickets', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => {
        setTickets(data.tickets ?? [])
        setLoading(false)
      })
      .catch(() => {
        setError('Impossible de charger vos billets.')
        setLoading(false)
      })
  }, [userId])

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'valid': return 'Valide'
      case 'used': return 'Utilise'
      case 'cancelled': return 'Annule'
      default: return status
    }
  }

  return (
    <main className="my-tickets">
      <h2>Mes billets</h2>

      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && tickets.length === 0 && (
        <p className="empty-state">Vous n'avez pas encore de billet.</p>
      )}

      {!loading && !error && tickets.length > 0 && (
        <div className="tickets-list">
          {tickets.map(ticket => (
            <div key={ticket.id} className="ticket-card">
              <h3>{ticket.event?.title ?? 'Evenement inconnu'}</h3>
              <p>{ticket.event?.date ?? ''} — {ticket.event?.city ?? ''}</p>
              <p><strong>Statut :</strong> {getStatusLabel(ticket.status)}</p>
              <div className="qr-placeholder">{ticket.qrCode}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}