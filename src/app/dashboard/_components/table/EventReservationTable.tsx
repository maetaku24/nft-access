'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { ConfirmDialog } from '../elements/ConfirmDialog';
import { SkeletonTable } from '../skeleton/SkeletonTable';
import { GenericTable } from '@/app/_components/GenericTable';
import { Button } from '@/app/_components/ui/button';
import { Label } from '@/app/_components/ui/label';

import { useFetch } from '@/app/_hooks/useFetch';
import type { DeleteReservationResponse } from '@/app/_types/reservation/DeleteReservationResponse';
import type { EventListResponse } from '@/app/_types/reservation/EventListResponse';
import { deleteRequest } from '@/app/_utils/api';
import 'react-loading-skeleton/dist/skeleton.css';
import { dayjs } from '@/utils/dayjs';

export const EventReservationTable: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const { id } = useParams();
  const {
    data = [],
    isLoading,
    mutate,
  } = useFetch<EventListResponse[]>(`/api/events/${id}/reservation`);

  const handleDelete = async (reservationId: number) => {
    try {
      if (!reservationId) return;
      await deleteRequest<DeleteReservationResponse>(
        `/api/events/${id}/reservation/${reservationId}`
      );
      toast.info('予約をキャンセルしました。');
      mutate();
      setIsOpen(false);
      setReservationId(null);
    } catch (error) {
      toast.error(`予約がキャンセルできませんでした: ${error}`);
    }
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
    columnHelper.accessor('name', {
      header: '予約者',
    }),
    columnHelper.accessor('email', {
      header: 'メールアドレス',
    }),
    columnHelper.accessor('participants', {
      header: '予約人数',
      cell: (props) => <>{props.getValue()} 人</>,
    }),
    columnHelper.display({
      id: 'delete',
      header: 'キャンセル',
      cell: (props) => (
        <Button
          variant='outline'
          className='rounded-3xl border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
          onClick={() => {
            setReservationId(props.row.original.id);
            setIsOpen(true);
          }}
        >
          キャンセルする
        </Button>
      ),
    }),
  ];

  return (
    <div className='w-full'>
      <Label className='text-base font-semibold'>予約一覧</Label>
      <div className='mt-2 overflow-hidden rounded-md border border-black bg-white'>
        <GenericTable
          data={data}
          columns={columns as ColumnDef<EventListResponse, unknown>[]}
          isLoading={isLoading}
          emptyMessage='現在予約はありません'
          skeleton={<SkeletonTable row={3} columns={columns.length} />}
        />
        <ConfirmDialog
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            setReservationId(null);
          }}
          onConfirm={() => reservationId && handleDelete(reservationId)}
          title='予約キャンセルの確認'
          description={`この予約を本当にキャンセルしてもよろしいですか？\n実行後は元に戻せません。`}
          confirmText='予約をキャンセル'
        />
      </div>
    </div>
  );
};
