'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ReservationManagementModal } from './modal/ReservationManagementModal';
import { GenericTable } from '@/app/_components/GenericTable';
import { Button } from '@/app/_components/ui/button';
import { Label } from '@/app/_components/ui/label';
import { useFetch } from '@/app/_hooks/useFetch';
import type { EventListResponse } from '@/app/_types/reservation/EventListResponse';
import { SkeletonTable } from '@/app/dashboard/_components/skeleton/SkeletonTable';
import { dayjs } from '@/utils/dayjs';

interface ReservationModalState {
  isOpen: boolean;
  reservation: EventListResponse | null;
  mode: 'edit' | 'cancel';
}

export const WalletReservationTable: React.FC = () => {
  const [modalState, setModalState] = useState<ReservationModalState>({
    isOpen: false,
    reservation: null,
    mode: 'edit',
  });
  const { eventId } = useParams<{ eventId: string }>();
  const { address: walletAddress } = useAccount();

  const apiUrl =
    walletAddress && eventId
      ? `/api/events/${eventId}/reservation/wallet/${encodeURIComponent(walletAddress)}`
      : null;

  const {
    data = [],
    isLoading,
    mutate,
  } = useFetch<EventListResponse[]>(apiUrl, null);

  const openModal = (
    reservation: EventListResponse,
    mode: 'edit' | 'cancel'
  ) => {
    setModalState({
      isOpen: true,
      reservation,
      mode,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      reservation: null,
      mode: 'edit',
    });
  };

  const columnHelper = createColumnHelper<EventListResponse>();
  const columns = [
    columnHelper.accessor(
      (row) =>
        `${dayjs(row.reservationDate).format('YYYY年MM月DD日 (dd)')} ${row.startTime} - ${row.endTime}`,
      {
        header: '日時',
      }
    ),
    columnHelper.accessor('email', {
      header: 'メールアドレス',
    }),
    columnHelper.accessor('participants', {
      header: '予約人数',
      cell: (props) => <>{props.getValue()} 人</>,
    }),
    columnHelper.display({
      id: 'actions',
      header: '操作',
      cell: (props) => (
        <div className='flex justify-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='px-3 py-1 hover:bg-green-300/10 hover:text-green-300'
            onClick={() => openModal(props.row.original, 'edit')}
            title='予約を変更'
          >
            変更
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='border-red-500 px-3 py-1 text-red-600 hover:border-red-400 hover:bg-red-50 hover:text-red-600'
            onClick={() => openModal(props.row.original, 'cancel')}
            title='予約をキャンセル'
          >
            キャンセル
          </Button>
        </div>
      ),
    }),
  ];

  return (
    <div className='w-full min-w-[800px]'>
      <Label className='text-base font-semibold'>予約一覧</Label>
      <div className='mt-2 overflow-hidden overflow-x-auto rounded-md border border-black bg-white'>
        <GenericTable
          data={data}
          columns={columns as ColumnDef<EventListResponse, unknown>[]}
          isLoading={isLoading}
          emptyMessage='現在予約はありません'
          skeleton={<SkeletonTable row={3} columns={columns.length} />}
        />
      </div>

      <ReservationManagementModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        reservation={modalState.reservation}
        eventId={eventId}
        mode={modalState.mode}
        onSuccess={() => {
          mutate();
          closeModal();
        }}
      />
    </div>
  );
};
