'use client';

import { Calendar, Clock, Link } from 'lucide-react';
import type { ReservationSchedule } from '@/app/_types/reservation/ReservationSchedule';
import { dayjs } from '@/utils/dayjs';

interface Props {
  selectedSchedule: ReservationSchedule;
  walletAddress: string;
}

export const ReservationPreviewCard: React.FC<Props> = ({
  selectedSchedule,
  walletAddress,
}) => {
  return (
    <div className='mb-6 mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
      <h3 className='mb-3 flex items-center gap-2 font-semibold text-gray-800'>
        予約の確認
      </h3>
      <div className='space-y-3'>
        <div className='flex items-center gap-3'>
          <span className='flex size-8 items-center justify-center rounded-full bg-blue-50 text-blue-600'>
            <Calendar className='size-4' />
          </span>
          <div>
            <div className='text-xs text-gray-500'>日付</div>
            <div className='font-medium text-gray-900'>
              {dayjs(selectedSchedule.date).format('YYYY年MM月DD日 (dd)')}
            </div>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <span className='flex size-8 items-center justify-center rounded-full bg-green-50 text-green-600'>
            <Clock className='size-4' />
          </span>
          <div>
            <div className='text-xs text-gray-500'>時間</div>
            <div className='font-medium text-gray-900'>
              {selectedSchedule.startTime} 〜 {selectedSchedule.endTime}
            </div>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <span className='flex size-8 items-center justify-center rounded-full bg-purple-50 text-purple-600'>
            <Link className='size-4' />
          </span>
          <div>
            <div className='text-xs text-gray-500'>ウォレットアドレス</div>
            <div className='break-all font-mono text-sm font-medium text-gray-900'>
              {walletAddress || '未接続'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
