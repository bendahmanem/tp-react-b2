/**
 * Service API — EventHub
 *
 * Toutes les communications avec le backend passent par ici.
 * Utilise l'API fetch native + gestion du JWT stocke en localStorage.
 */

const API_BASE = 'http://localhost:3000';

// =============================================================================
// HELPERS
// =============================================================================

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `HTTP ${response.status}`);
  }

  return response.json();
}

// =============================================================================
// AUTH
// =============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getMe(): Promise<{ id: string; email: string; name: string; role: string }> {
  return request('/auth/me');
}

// =============================================================================
// EVENTS
// =============================================================================

export interface EventListItem {
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

export async function getEvents(): Promise<EventListItem[]> {
  const data = await request<{ events: EventListItem[] }>('/events');
  return data.events;
}

export async function getEventById(id: string): Promise<EventListItem> {
  return request<EventListItem>(`/events/${id}`);
}

// =============================================================================
// TICKETS
// =============================================================================

export interface TicketData {
  id: string;
  qrCode: string;
  eventId: string;
  userId: string;
  status: 'valid' | 'used' | 'cancelled';
  purchaseDate: string;
  usedAt?: string;
  cancelledAt?: string;
}

export interface TicketWithEvent {
  id: string;
  qrCode: string;
  eventId: string;
  userId: string;
  status: 'valid' | 'used' | 'cancelled';
  purchaseDate: string;
  usedAt?: string;
  cancelledAt?: string;
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

export async function buyTicket(eventId: string): Promise<TicketData> {
  return request<TicketData>('/tickets', {
    method: 'POST',
    body: JSON.stringify({ eventId }),
  });
}

export async function getMyTickets(): Promise<TicketWithEvent[]> {
  const data = await request<{ tickets: TicketWithEvent[] }>('/tickets');
  return data.tickets;
}