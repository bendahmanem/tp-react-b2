/**
 * Base de données en mémoire — Store EventHub
 *
 * Ce fichier simule une base de données en mémoire.
 * Dans une application réelle, on utiliserait SQLite, PostgreSQL, etc.
 *
 * Architecture du store :
 * - Chaque collection (users, events, tickets) est un Map
 * - Les clés sont les IDs (UUID)
 * - Les Maps permettent un accès O(1) par clé
 *
 * Pour la persistance, on pourrait ultérieurement ajouter
 * un adapter SQLite ou PostgreSQL.
 */

import { User, CreateUserDto, UserRole } from '../models/user.js';
import { Event, CreateEventDto, UpdateEventDto, EventCategory, EventFilters } from '../models/event.js';
import { Ticket, CreateTicketDto, TicketStatus, TicketStats } from '../models/ticket.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// =============================================================================
// STORES (collections en mémoire)
// =============================================================================

const users = new Map<string, User>();
const events = new Map<string, Event>();
const tickets = new Map<string, Ticket>();

// =============================================================================
// HELPERS
// =============================================================================

function now(): Date {
  return new Date();
}

// =============================================================================
// USER STORE
// =============================================================================

async function createUser(dto: CreateUserDto): Promise<User> {
  // Vérification email unique
  const existingEmail = [...users.values()].find(u => u.email === dto.email);
  if (existingEmail) {
    throw new Error('EMAIL_ALREADY_EXISTS');
  }

  // Hashage du mot de passe avec bcrypt
  // bcrypt est un algorithme de hashage conçu pour les mots de passe
  // Il est lent intentionnellement pour ralentir les attaques par force brute
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(dto.password, saltRounds);

  const user: User = {
    id: uuidv4(),
    email: dto.email,
    passwordHash,
    name: dto.name,
    role: dto.role ?? UserRole.USER,
    createdAt: now(),
    updatedAt: now(),
  };

  users.set(user.id, user);
  return user;
}

async function findUserByEmail(email: string): Promise<User | undefined> {
  return [...users.values()].find(u => u.email === email);
}

async function findUserById(id: string): Promise<User | undefined> {
  return users.get(id);
}

async function verifyPassword(user: User, password: string): Promise<boolean> {
  // bcrypt.compare compare le mot de passe en clair avec le hash stocké
  return bcrypt.compare(password, user.passwordHash);
}

function updateUser(id: string, dto: { name: string }): User {
  const user = users.get(id);
  if (!user) throw new Error('USER_NOT_FOUND');

  const updated: User = {
    ...user,
    name: dto.name,
    updatedAt: now(),
  };

  users.set(id, updated);
  return updated;
}

function getAllUsers(): User[] {
  return [...users.values()];
}

// =============================================================================
// EVENT STORE
// =============================================================================

function createEvent(dto: CreateEventDto, organizerId: string): Event {
  const event: Event = {
    id: uuidv4(),
    title: dto.title,
    description: dto.description,
    date: dto.date,
    time: dto.time,
    location: dto.location,
    city: dto.city,
    price: dto.price,
    totalPlaces: dto.totalPlaces,
    availablePlaces: dto.totalPlaces,
    category: dto.category,
    image: dto.image,
    organizerId,
    createdAt: now(),
    updatedAt: now(),
  };

  events.set(event.id, event);
  return event;
}

function findEventById(id: string): Event | undefined {
  return events.get(id);
}

function findEvents(filters?: EventFilters): Event[] {
  let result = [...events.values()];

  // Filtre catégorie
  if (filters?.category) {
    result = result.filter(e => e.category === filters.category);
  }

  // Filtre ville (insensible à la casse)
  if (filters?.city) {
    result = result.filter(e =>
      e.city.toLowerCase().includes(filters.city!.toLowerCase())
    );
  }

  // Filtre prix max
  if (filters?.maxPrice !== undefined) {
    result = result.filter(e => e.price <= filters.maxPrice!);
  }

  // Filtre prix min
  if (filters?.minPrice !== undefined) {
    result = result.filter(e => e.price >= filters.minPrice!);
  }

  // Filtre événements à venir uniquement
  if (filters?.upcomingOnly) {
    const today = new Date().toISOString().split('T')[0];
    result = result.filter(e => e.date >= today);
  }

  // Tri par date (les plus proches en premier)
  result.sort((a, b) => a.date.localeCompare(b.date));

  return result;
}

function findEventsByOrganizer(organizerId: string): Event[] {
  return [...events.values()].filter(e => e.organizerId === organizerId);
}

function updateEvent(id: string, dto: UpdateEventDto): Event {
  const event = events.get(id);
  if (!event) throw new Error('EVENT_NOT_FOUND');

  const updated: Event = {
    ...event,
    ...dto,
    // Si totalPlaces est modifié, on ajuste aussi availablePlaces
    // selon le nombre de billets déjà vendus
    availablePlaces: dto.totalPlaces !== undefined
      ? dto.totalPlaces - (event.totalPlaces - event.availablePlaces)
      : event.availablePlaces,
    updatedAt: now(),
  };

  events.set(id, updated);
  return updated;
}

function deleteEvent(id: string): boolean {
  const event = events.get(id);
  if (!event) return false;

  // Vérifier si des billets ont été vendus
  const soldTickets = [...tickets.values()].filter(t => t.eventId === id);
  if (soldTickets.length > 0) {
    throw new Error('EVENT_HAS_SOLD_TICKETS');
  }

  return events.delete(id);
}

// =============================================================================
// TICKET STORE
// =============================================================================

function createTicket(dto: CreateTicketDto): Ticket {
  const event = events.get(dto.eventId);
  if (!event) throw new Error('EVENT_NOT_FOUND');

  // Vérification des places disponibles
  if (event.availablePlaces <= 0) {
    throw new Error('EVENT_SOLD_OUT');
  }

  // Vérification que l'événement n'est pas dans le passé
  const today = new Date().toISOString().split('T')[0];
  if (event.date < today) {
    throw new Error('EVENT_PAST');
  }

  const ticket: Ticket = {
    id: uuidv4(),
    qrCode: uuidv4(), // UUID utilisé comme QR code unique
    eventId: dto.eventId,
    userId: dto.userId,
    status: TicketStatus.VALID,
    purchaseDate: now(),
  };

  tickets.set(ticket.id, ticket);

  // Décrémenter les places disponibles
  event.availablePlaces -= 1;
  events.set(event.id, event);

  return ticket;
}

function findTicketById(id: string): Ticket | undefined {
  return tickets.get(id);
}

function findTicketsByUser(userId: string): Ticket[] {
  return [...tickets.values()].filter(t => t.userId === userId);
}

function findTicketsByEvent(eventId: string): Ticket[] {
  return [...tickets.values()].filter(t => t.eventId === eventId);
}

function updateTicketStatus(id: string, status: TicketStatus): Ticket {
  const ticket = tickets.get(id);
  if (!ticket) throw new Error('TICKET_NOT_FOUND');

  const updated: Ticket = {
    ...ticket,
    status,
    ...(status === TicketStatus.USED ? { usedAt: now() } : {}),
    ...(status === TicketStatus.CANCELLED ? { cancelledAt: now() } : {}),
  };

  tickets.set(id, updated);

  // Si billet annulé, remettre la place en disponibilité
  if (status === TicketStatus.CANCELLED) {
    const event = events.get(ticket.eventId);
    if (event) {
      event.availablePlaces += 1;
      events.set(event.id, event);
    }
  }

  return updated;
}

function getTicketStatsByOrganizer(organizerId: string): TicketStats {
  const organizerEvents = findEventsByOrganizer(organizerId);
  const organizerEventIds = new Set(organizerEvents.map(e => e.id));

  const organizerTickets = [...tickets.values()].filter(t =>
    organizerEventIds.has(t.eventId)
  );

  let totalRevenue = 0;
  for (const ticket of organizerTickets) {
    const event = events.get(ticket.eventId);
    if (event && ticket.status !== TicketStatus.CANCELLED) {
      totalRevenue += event.price;
    }
  }

  return {
    totalTickets: organizerTickets.length,
    validTickets: organizerTickets.filter(t => t.status === TicketStatus.VALID).length,
    usedTickets: organizerTickets.filter(t => t.status === TicketStatus.USED).length,
    cancelledTickets: organizerTickets.filter(t => t.status === TicketStatus.CANCELLED).length,
    totalRevenue,
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export const db = {
  users: {
    create: createUser,
    findByEmail: findUserByEmail,
    findById: findUserById,
    verifyPassword,
    update: updateUser,
    getAll: getAllUsers,
  },
  events: {
    create: createEvent,
    findById: findEventById,
    findAll: findEvents,
    findByOrganizer: findEventsByOrganizer,
    update: updateEvent,
    delete: deleteEvent,
  },
  tickets: {
    create: createTicket,
    findById: findTicketById,
    findByUser: findTicketsByUser,
    findByEvent: findTicketsByEvent,
    updateStatus: updateTicketStatus,
    getStatsByOrganizer: getTicketStatsByOrganizer,
  },
};

export default db;