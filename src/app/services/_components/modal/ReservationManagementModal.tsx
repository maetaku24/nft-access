'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';
import type { ReservationForm } from '../../_schema/reservationFormSchema';
import { reservationFormSchema } from '../../_schema/reservationFormSchema';
import { ReservationManagementPicker } from './elements/ReservationManagementPicker';
import { Modal } from '@/app/_components/Modal';
import { useFetch } from '@/app/_hooks/useFetch';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import type { DeleteReservationResponse } from '@/app/_types/reservation/DeleteReservationResponse';
import type { EventListResponse } from '@/app/_types/reservation/EventListResponse';
import type {
  UpdateReservationRequest,
  UpdateReservationResponse,
} from '@/app/_types/reservation/UpdateReservation';
import { deleteRequest, putRequest } from '@/app/_utils/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reservation: EventListResponse | null;
  eventId: string;
  mode: 'edit' | 'cancel';
  onSuccess: () => void;
}

export const ReservationManagementModal: React.FC<Props> = ({
  isOpen,
  onClose,
  reservation,
  eventId,
  mode,
  onSuccess,
}) => {
  const { token } = useSupabaseSession();
  const { address: walletAddress } = useAccount();

  // イベント情報を取得して最大参加人数を取得
  const { data: eventData } = useFetch<{ maxParticipants?: number }>(
    eventId ? `/api/events/${eventId}` : null
  );

  const form = useForm<ReservationForm>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      name: '',
      email: '',
      participants: 1,
    },
  });

  // モーダルが開かれたときや予約データが変更されたときにフォームをリセット
  useEffect(() => {
    if (isOpen && reservation) {
      form.reset({
        name: reservation.name,
        email: reservation.email,
        participants: reservation.participants,
      });
    } else if (!isOpen) {
      // モーダルが閉じられたときもフォームをリセット
      form.reset({
        name: '',
        email: '',
        participants: 1,
      });
    }
  }, [isOpen, reservation, form]);

  const handleEdit = async (data: ReservationForm) => {
    if (!reservation) return;

    try {
      const url = walletAddress
        ? `/api/events/${eventId}/reservation/${reservation.id}?addr=${walletAddress}`
        : `/api/events/${eventId}/reservation/${reservation.id}`;

      const body: UpdateReservationRequest = {
        name: data.name,
        email: data.email,
        participants: data.participants,
        walletAddress: walletAddress || '',
        reservationDate: reservation.reservationDate,
        startTime: reservation.startTime,
        endTime: reservation.endTime,
      };

      await putRequest<UpdateReservationRequest, UpdateReservationResponse>(
        url,
        body,
        token ?? undefined
      );

      toast.success('予約内容を変更しました');
      onSuccess();
    } catch (error) {
      toast.error(`予約の変更に失敗しました: ${error}`);
    }
  };

  const handleCancel = async () => {
    if (!reservation) return;

    try {
      const url = walletAddress
        ? `/api/events/${eventId}/reservation/${reservation.id}?addr=${walletAddress}`
        : `/api/events/${eventId}/reservation/${reservation.id}`;

      await deleteRequest<DeleteReservationResponse>(url, token ?? undefined);

      toast.success('予約をキャンセルしました');
      onSuccess();
    } catch (error) {
      toast.error(`予約のキャンセルに失敗しました: ${error}`);
    }
  };

  if (!reservation) return null;

  return (
    <Modal isOpen={isOpen} onClose={() => onClose()}>
      <ReservationManagementPicker
        reservation={reservation}
        form={form}
        isSubmitting={form.formState.isSubmitting}
        onSubmit={handleEdit}
        onCancel={handleCancel}
        onClose={onClose}
        mode={mode}
        maxParticipants={eventData?.maxParticipants || 10}
      />
    </Modal>
  );
};
