'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';
import type { ReservationForm } from '../_schema/reservationFormSchema';
import { useReservationSchedule } from './useReservationSchedule';
import type {
  CreateReservationRequest,
  CreateReservationResponse,
} from '@/app/_types/reservation/CreateReservation';
import type { ReservationSchedule } from '@/app/_types/reservation/ReservationSchedule';
import { postRequest } from '@/app/_utils/api';
import { reservationScheduleHelpers } from '@/app/services/_utils/reservationScheduleHelpers';
import { dayjs } from '@/utils/dayjs';

interface UseReservationProps {
  userId: string;
  eventId: string;
  onClose: () => void;
  form: UseFormReturn<ReservationForm>;
}

export const useReservation = ({
  userId,
  eventId,
  onClose,
  form,
}: UseReservationProps) => {
  const router = useRouter();

  // UI状態管理
  const [selectedSchedule, setSelectedSchedule] =
    useState<ReservationSchedule | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ウォレット情報
  const { address: walletAddress, isConnected } = useAccount();

  // スケジュールデータのキャッシュ更新用
  const { mutate } = useReservationSchedule({ userId, eventId });

  // 時間スロットを選択する処理
  const handleSelectSchedule = (schedule: ReservationSchedule) => {
    if (!reservationScheduleHelpers.isReservable(schedule)) {
      toast.error('この時間は予約できません');
      return;
    }

    // ウォレットが接続されていない場合はエラー
    if (!isConnected || !walletAddress) {
      toast.error('予約にはウォレットの接続が必要です');
      return;
    }

    // UI状態を更新
    setSelectedSchedule(schedule);
    setShowConfirmation(true);
  };

  // 予約送信処理
  const handleSubmit = async (data: ReservationForm) => {
    if (!selectedSchedule) return;

    // ウォレットが接続されていない場合はエラー
    if (!isConnected || !walletAddress) {
      toast.error('ウォレットを接続してください');
      return;
    }

    setIsSubmitting(true);

    try {
      const reservationData: CreateReservationRequest = {
        reservations: [
          {
            eventId: parseInt(eventId),
            name: data.name,
            email: data.email,
            participants: data.participants,
            walletAddress: walletAddress,
            reservationDate: dayjs(selectedSchedule.date).toDate(),
            startTime: selectedSchedule.startTime,
            endTime: selectedSchedule.endTime,
            status: 'COMPLETED' as const,
          },
        ],
      };

      await postRequest<CreateReservationRequest, CreateReservationResponse>(
        `/api/services/${userId}/${eventId}/reservation`,
        reservationData
      );

      toast.success('予約が完了しました');

      // スケジュールデータを最新に更新
      mutate();
      router.replace(`/services/${userId}/${eventId}/reservations`);

      // 成功時のリセットと閉じる処理
      handleResetAndClose();
    } catch (error) {
      toast.error(`予約に失敗しました: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 確認画面を閉じる処理
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setSelectedSchedule(null);
  };

  // 全体をリセットして閉じる処理
  const handleResetAndClose = () => {
    setShowConfirmation(false);
    setSelectedSchedule(null);
    form.reset();
    onClose();
  };

  // モーダルを閉じる処理をラップ
  const handleModalClose = () => {
    if (showConfirmation) {
      handleCloseConfirmation();
    } else {
      handleResetAndClose();
    }
  };

  // フォーム送信用のラッパー
  const onSubmit = (data: ReservationForm) => {
    if (selectedSchedule) {
      handleSubmit(data);
    }
  };

  return {
    // 状態
    selectedSchedule,
    showConfirmation,
    isSubmitting,
    walletAddress,
    isConnected,

    // ハンドラー
    handleSelectSchedule,
    onSubmit,
    handleCloseConfirmation,
    handleResetAndClose,
    handleModalClose,
  };
};
