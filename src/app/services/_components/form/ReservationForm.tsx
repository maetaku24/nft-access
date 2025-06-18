'use client';

import { ReservationCalendar } from '../elements/ReservationCalendar';

interface Props {
  userId: string;
  eventId: string;
  walletAddress: string;
}

export const ReservationForm: React.FC<Props> = ({
  userId,
  eventId,
  walletAddress,
}) => {
  return (
    <div className='mx-auto max-w-4xl space-y-8'>
      <div className='rounded-lg border bg-white p-6'>
        <h3 className='mb-2 text-sm font-semibold text-gray-700'>
          ✅ 接続中のウォレット
        </h3>
        <div className='rounded-sm bg-green-50 p-3'>
          <p className='break-all font-mono text-sm text-gray-900'>
            {walletAddress}
          </p>
        </div>
      </div>
      <div className='rounded-lg border bg-white p-6 shadow-sm'>
        <ReservationCalendar userId={userId} eventId={eventId} />
      </div>
    </div>
  );
};
