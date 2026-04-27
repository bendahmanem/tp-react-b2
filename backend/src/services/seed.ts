/**
 * Seed des données de démonstration
 *
 * Ce fichier initialise la base de données avec des données de test
 * conformes à l'énoncé du projet EventHub.
 *
 * Données à insérer :
 * - 3 utilisateurs (organisateur, utilisateur, admin)
 * - 5 événements de démonstration
 *
 * Les données de démo permettent de tester l'application immédiatement
 * sans avoir à créer manuellement des comptes et des événements.
 */

import db from './db.js';
import { UserRole } from '../models/user.js';
import { EventCategory } from '../models/event.js';

export async function seedDemoData(): Promise<void> {
  console.log('Seeding demo data...');

  // =============================================================================
  // UTILISATEURS DE DÉMO
  // =============================================================================

  const usersData = [
    {
      email: 'organisateur@example.com',
      password: 'password123',
      name: 'Jean Organisateur',
      role: UserRole.ORGANIZER,
    },
    {
      email: 'utilisateur@example.com',
      password: 'password123',
      name: 'Marie Utilisatrice',
      role: UserRole.USER,
    },
    {
      email: 'admin@example.com',
      password: 'password123',
      name: 'Admin EventHub',
      role: UserRole.ADMIN,
    },
  ];

  for (const userData of usersData) {
    try {
      const existing = await db.users.findByEmail(userData.email);
      if (!existing) {
        await db.users.create(userData);
        console.log(`  Created user: ${userData.email}`);
      } else {
        console.log(`  User already exists: ${userData.email}`);
      }
    } catch (error) {
      console.error(`  Failed to create user ${userData.email}:`, error);
    }
  }

  // =============================================================================
  // ÉVÉNEMENTS DE DÉMONSTRATION
  // =============================================================================

  // On récupère l'ID de l'organisateur pour l'associer aux événements
  const organizer = await db.users.findByEmail('organisateur@example.com');

  if (!organizer) {
    console.error('Organisateur not found — skipping event seed');
    return;
  }

  const eventsData = [
    {
      title: 'Concert Jazz au Sunset',
      description: 'Une soirée jazz exceptionnelle avec le quartet de Pierre Lenoir. Ambiance intimiste et musicale au cœur de Paris.',
      date: '2026-06-15',
      time: '20:30',
      location: 'Le Sunset',
      city: 'Paris',
      price: 35,
      totalPlaces: 100,
      category: EventCategory.CONCERT,
    },
    {
      title: 'Conférence Tech Leaders',
      description: 'Les meilleurs experts tech partagent leurs retours d'expérience sur l'architecture des systèmes distribués à grande échelle.',
      date: '2026-05-20',
      time: '09:00',
      location: 'Centre de Congrès',
      city: 'Lyon',
      price: 50,
      totalPlaces: 200,
      category: EventCategory.CONFERENCE,
    },
    {
      title: 'Festival Électro Summer',
      description: '3 scènes, 20 artistes, une nuit entière de musique électronique. Le rendez-vous incontournable de lété marseillais.',
      date: '2026-07-10',
      time: '22:00',
      location: 'Parc des Expositions',
      city: 'Marseille',
      price: 45,
      totalPlaces: 500,
      category: EventCategory.FESTIVAL,
    },
    {
      title: 'Match de Gala',
      description: 'Match de charité opposant les légendes du football français aux anciens internationaux. Un événement sportif et solidaire.',
      date: '2026-06-01',
      time: '19:00',
      location: 'Stade Chaban-Delmas',
      city: 'Bordeaux',
      price: 25,
      totalPlaces: 150,
      category: EventCategory.SPORT,
    },
    {
      title: 'Hamlet - Comédie Française',
      description: 'La tragédie universelle de Shakespeare dans une mise en scène contemporaine par la troupe de la Comédie Française.',
      date: '2026-05-25',
      time: '20:00',
      location: 'Théâtre de lOdéon',
      city: 'Paris',
      price: 40,
      totalPlaces: 80,
      category: EventCategory.THEATER,
    },
  ];

  for (const eventData of eventsData) {
    // On vérifie qu'un événement avec ce titre n'existe pas déjà
    const existingEvents = db.events.findAll();
    const exists = existingEvents.some(e => e.title === eventData.title);

    if (!exists) {
      db.events.create(eventData, organizer.id);
      console.log(`  Created event: ${eventData.title}`);
    } else {
      console.log(`  Event already exists: ${eventData.title}`);
    }
  }

  console.log('Demo data seeded successfully.');
}

export default seedDemoData;