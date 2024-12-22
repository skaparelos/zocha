import fs from 'fs/promises';
import { ReservationDetails } from '../../types/reservations';

export async function saveToDisk(
  reservations: Map<string, ReservationDetails>,
  users: Map<string, string>
): Promise<void> {
  try {
    // Ensure data directory exists
    await fs.mkdir('data', { recursive: true });

    await fs.writeFile(
      'data/reservations.json',
      JSON.stringify(Array.from(reservations.entries()))
    );
    await fs.writeFile(
      'data/users.json',
      JSON.stringify(Array.from(users.entries()))
    );
  } catch (error) {
    console.error('Error saving data to disk:', error);
  }
}

export async function loadFromDisk(): Promise<{
  reservations: Map<string, ReservationDetails>,
  users: Map<string, string>
}> {
  try {
    const reservationsData = await fs.readFile('data/reservations.json', 'utf-8');
    const usersData = await fs.readFile('data/users.json', 'utf-8');

    return {
      reservations: new Map(JSON.parse(reservationsData)),
      users: new Map(JSON.parse(usersData))
    };
  } catch (error) {
    // Initialize empty maps if files don't exist
    return {
      reservations: new Map(),
      users: new Map()
    };
  }
}