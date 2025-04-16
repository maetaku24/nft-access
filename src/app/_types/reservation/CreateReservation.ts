import type { Reservation } from '.';

export interface CreateReservationRequest {
  reservations: Reservation[];
}

export interface CreateReservationResponse {
  message: string;
  data: Reservation[];
}
