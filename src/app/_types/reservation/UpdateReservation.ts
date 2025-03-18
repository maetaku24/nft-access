import { Status } from '@prisma/client';

export interface UpdateReservationRequest {
  name: string;
  email: string;
  participants: number;
  walletAddress: string;
  reservationDate: Date;
  startTime: string;
  endTime: string;
  status: Status;
}

export interface UpdateReservationResponse {
  message: string;
  data: UpdateReservationRequest;
}
