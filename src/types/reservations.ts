export interface ReservationsIdsResponse {
  id: string
  last_updated: string
  flag: boolean
}

export interface ReservationDetails {
  id: string;
  last_updated: string; // ISO string for the last updated timestamp
  guest_name: string
  party_size: number
  tags?: string[]
  reservation_time: string
  seating_area: string
  status: string
}
