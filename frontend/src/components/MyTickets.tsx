/**
 * Composant MyTickets — Liste des billets de l'utilisateur
 */

import { useState } from 'react'

interface MyTicketsProps {
  userId: string
}

interface TicketItem {
  id: string
  eventTitle: string
  date: string
  qrCode: string
}

export default function MyTickets({ userId }: MyTicketsProps) {
  // TODO: fetch GET /tickets depuis l'API avec userId
  const [tickets] = useState<TicketItem[]>([])

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