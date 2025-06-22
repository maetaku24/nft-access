'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useReservation } from '../../_hooks/useReservation';
import type { ReservationForm } from '../../_schema/reservationFormSchema';
import { reservationFormSchema } from '../../_schema/reservationFormSchema';
import { ReservationDetails } from './elements/ReservationDetails';
import { SchedulePicker } from './elements/SchedulePicker';
import { Modal } from '@/app/_components/Modal';
import type { ReservationSchedule } from '@/app/_types/reservation/ReservationSchedule';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  schedules: ReservationSchedule[];
  eventId: string;
  userId: string;
}

export const ReservationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedDate,
  schedules,
  eventId,
  userId,
}) => {
  const form = useForm<ReservationForm>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      name: '',
      email: '',
      participants: 1,
    },
  });

  const {
    selectedSchedule,
    showConfirmation,
    isSubmitting,
    walletAddress,
    handleSelectSchedule,
    onSubmit,
    handleCloseConfirmation,
    handleResetAndClose,
    handleModalClose,
  } = useReservation({
    userId,
    eventId,
    onClose,
    form,
  });

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose}>
      {showConfirmation && selectedSchedule ? (
        <SchedulePicker
          selectedSchedule={selectedSchedule}
          walletAddress={walletAddress || ''}
          form={form}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onBack={handleCloseConfirmation}
        />
      ) : (
        <ReservationDetails
          selectedDate={selectedDate}
          schedules={schedules}
          onSelectSchedule={handleSelectSchedule}
          onClose={handleResetAndClose}
        />
      )}
    </Modal>
  );
};
