/**
 * Types partages de l'application EventHub
 * Ces types sont utilisés par le frontend pour typer les données
 * reçues depuis l'API backend.
 */

// ============================================================
// USER TYPES
// ============================================================

export type UserRole = 'user' | 'organizer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ============================================================
// EVENT TYPES
// ============================================================

export type EventCategory = 'Concert' | 'Conférence' | 'Festival' | 'Sport' | 'Théâtre' | 'Autre';

export interface Event {
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
  category: EventCategory;
  image?: string;
  organizerId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventFilters {
  category?: EventCategory;
  city?: string;
  maxPrice?: number;
  minPrice?: number;
  upcomingOnly?: boolean;
}

export interface EventListResponse {
  events: Event[];
  total: number;
}

// ============================================================
// TICKET TYPES
// ============================================================

export type TicketStatus = 'valid' | 'used' | 'cancelled';

export interface Ticket {
  id: string;
  qrCode: string;
  eventId: string;
  userId: string;
  status: TicketStatus;
  purchaseDate: string;
  usedAt?: string;
  cancelledAt?: string;
}

export interface TicketWithEvent extends Ticket {
  event: {
    id: string;
    title: string;
    date: string;
    time: string;
    city: string;
    price: number;
    location: string;
  } | null;
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiError {
  error: string;
}

export interface TicketsResponse {
  tickets: TicketWithEvent[];
}

// ============================================================
// VIEW TYPES
// ============================================================

export type ViewName = 'home' | 'detail' | 'login' | 'register' | 'my-tickets';

export interface NavigationContext {
  currentView: ViewName;
  selectedEvent: Event | null;
  user: User | null;
}