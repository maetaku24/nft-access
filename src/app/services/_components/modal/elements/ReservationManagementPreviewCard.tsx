'use client';

import { Calendar, Clock, Users } from 'lucide-react';
import type { EventListResponse } from '@/app/_types/reservation/EventListResponse';
import { dayjs } from '@/utils/dayjs';

interface Props {
  reservation: EventListResponse;
  mode: 'edit' | 'cancel';
}

export const ReservationManagementPreviewCard: React.FC<Props> = ({
  reservation,
  mode,
}) => {
  const isEditMode = mode === 'edit';

  return (
    <div className='mb-6 mt-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
      <h3 className='mb-3 flex items-center gap-2 font-semibold text-gray-800'>
        {isEditMode ? '変更する予約の詳細' : 'キャンセルする予約の詳細'}
      </h3>
      <div className='space-y-3'>
        <div className='flex items-center gap-3'>
          <span className='flex size-8 items-center justify-center rounded-full bg-blue-50 text-blue-600'>
            <Calendar className='size-4' />
          </span>
          <div>
            <div className='text-xs text-gray-500'>日付</div>
            <div className='font-medium text-gray-900'>
              {dayjs(reservation.reservationDate).format('YYYY年MM月DD日 (dd)')}
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
              {reservation.startTime} 〜 {reservation.endTime}
            </div>
          </div>
        </div>

        {reservation.maxParticipants && reservation.maxParticipants > 0 && (
          <div className='flex items-center gap-3'>
            <span className='flex size-8 items-center justify-center rounded-full bg-purple-50 text-purple-600'>
              <Users className='size-4' />
            </span>
            <div>
              <div className='text-xs text-gray-500'>最大予約可能人数</div>
              <div className='font-medium text-gray-900'>
                {reservation.maxParticipants}人
              </div>
            </div>
          </div>
        )}

        {reservation.availableCount !== undefined && (
          <div className='flex items-center gap-3'>
            <span className='flex size-8 items-center justify-center rounded-full bg-orange-50 text-orange-600'>
              <Users className='size-4' />
            </span>
            <div>
              <div className='text-xs text-gray-500'>残り予約可能人数</div>
              <div className='font-medium text-gray-900'>
                {reservation.availableCount}人
              </div>
            </div>
          </div>
        )}

        {!isEditMode && (
          <div className='mt-4 rounded-md border-red-400 bg-red-50 p-3'>
            <div className='text-sm text-red-700'>
              この予約をキャンセルすると、元に戻すことはできません。
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
