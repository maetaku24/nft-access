'use client';

import { WalletReservationTable } from '@/app/services/_components/WalletReservationTable';

export default function ReservationsPage() {
  return (
    <div className='container mx-auto flex w-full max-w-5xl justify-center p-6'>
      <WalletReservationTable />
    </div>
  );
}
