import { isTokenExpired, refreshAuthToken } from './resy/auth';
import dotenv from 'dotenv';
import { getReservationDetails, getReservationIds } from './resy/reservations';
import { ReservationDetails } from './types/reservations';
import { getUserDetails } from './resy/users';
import {
  updateAllUsers,
  logReservations,
  updateAllReservations,
  filterReservationsToCheck
} from './utils/reservationUtils';
import { loadFromDisk, saveToDisk } from './db';

// Load environment variables from the `.env` file
dotenv.config();

let allReservations: Map<string, ReservationDetails> = new Map();
let allUsers: Map<string, string> = new Map();

async function checkAndUpdateReservations(authToken: string, shortJwtToken: string): Promise<void> {
  try {

    // 0. refresh the auth token if it's expired
    if (isTokenExpired(shortJwtToken)) {
      shortJwtToken = await refreshAuthToken(authToken);
    }

    // 1. get reservation ids for the given time period
    const startDate = '2024-12-15 05:00:00'
    const endDate = '2024-12-22 04:59:59'
    const reservations = await getReservationIds(startDate, endDate, shortJwtToken)

    // 2. filter out reservations that don't need to be checked so we don't make unneccesary requests
    const checkReservations = filterReservationsToCheck(reservations, allReservations);
    if (checkReservations.length === 0) {
      console.log("No changes to reservations")
      return
    }

    // 3. get reservation details for the reservations that need to be checked  
    const reservationDetails = await getReservationDetails(checkReservations, shortJwtToken)

    // 4. get user details for the reservations that need to be checked
    const userIds = reservationDetails.map((r: any) => r.user_id as string).filter((uid: string) => !allUsers.has(uid))
    const userDetails = await getUserDetails(userIds, shortJwtToken)

    // 5. update the users and reservations
    updateAllUsers(userDetails, allUsers)
    updateAllReservations(reservationDetails, allReservations, allUsers)
    await saveToDisk(allReservations, allUsers)

    logReservations(allReservations)
  } catch (error) {
    console.error('Something went wrong:', error);
  }
}

async function main(): Promise<void> {
  try {
    if (!process.env.RESY_AUTH_TOKEN) {
      throw new Error('RESY_AUTH_TOKEN environment variable is required');
    }
    const authToken = process.env.RESY_AUTH_TOKEN;
    let shortJwtToken: string = await refreshAuthToken(authToken);

    const { reservations, users } = await loadFromDisk();
    allReservations = reservations;
    allUsers = users;

    await checkAndUpdateReservations(authToken, shortJwtToken);

    // Set up an interval to call `performTask` every minute
    setInterval(() => {
      checkAndUpdateReservations(authToken, shortJwtToken).catch((error) => {
        console.error('Unhandled error in performTask:', error);
      });
    }, 60000); // 60000ms = 1 minute

  } catch (error) {
    console.error('Something went wrong in main:', error);
  }
}

main();

process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await saveToDisk(allReservations, allUsers);
  process.exit();
});

process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  await saveToDisk(allReservations, allUsers);
  process.exit();
});