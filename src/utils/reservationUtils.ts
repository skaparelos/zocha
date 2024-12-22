import { ReservationDetails } from '../types/reservations';

export function updateAllUsers(userDetails: any[], allUsers: Map<string, string>): void {
  userDetails.forEach((user) =>
    allUsers.set(user.user_id.toString(), `${user.first_name} ${user.last_name}`)
  );
}

export function logReservations(allReservations: Map<string, ReservationDetails>): void {
  for (const [key, value] of allReservations.entries()) {
    console.log(`Reservation ID: ${key}`);
    console.log(`Details:`, value);
  }
}

export function updateAllReservations(
  reservationDetails: any[],
  allReservations: Map<string, ReservationDetails>,
  allUsers: Map<string, string>
): void {
  reservationDetails.forEach((reservation) => {
    allReservations.set(reservation.reservation_id, {
      id: reservation.reservation_id,
      last_updated: reservation.last_updated,
      guest_name: allUsers.get(reservation.user_id.toString()) || reservation.user_id,
      party_size: reservation.lock_data.party.size,
      tags: reservation.annotations.tags,
      reservation_time: reservation.lock_data.date.start,
      seating_area: reservation.status.table_seated_at,
      status: reservation.specs.is_cancelled,
    });
  });
}

export function filterReservationsToCheck(
  reservations: any[],
  allReservations: Map<string, ReservationDetails>
): string[] {
  // We only need to check reservations if
  // 1. they don't exist in our db
  // 2. the last_updated time doesn't match our last_updated time
  return reservations.filter((res) => {
    const existingReservation = allReservations.get(res.id);
    return !existingReservation || existingReservation.last_updated !== res.last_updated;
  }).map((res) => res.id);
} 