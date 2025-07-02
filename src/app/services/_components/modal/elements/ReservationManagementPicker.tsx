'use client';

import { Loader2 } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { ReservationForm } from '../../../_schema/reservationFormSchema';
import { ReservationManagementPreviewCard } from './ReservationManagementPreviewCard';
import { Button } from '@/app/_components/ui/button';
import { Form } from '@/app/_components/ui/form';
import type { EventListResponse } from '@/app/_types/reservation/EventListResponse';
import { generateParticipantOptions } from '@/app/_utils/participantOptions';
import { FormInput } from '@/app/dashboard/_components/form/elements/FormInput';
import { FormSelect } from '@/app/dashboard/_components/form/elements/FormSelect';

interface Props {
  reservation: EventListResponse;
  form: UseFormReturn<ReservationForm>;
  isSubmitting: boolean;
  onSubmit: (data: ReservationForm) => void;
  onCancel: () => void;
  onClose: () => void;
  mode: 'edit' | 'cancel';
  maxParticipants?: number;
}

export const ReservationManagementPicker: React.FC<Props> = ({
  reservation,
  form,
  isSubmitting,
  onSubmit,
  onCancel,
  onClose,
  mode,
  maxParticipants = 10,
}) => {
  const currentAvailableCount = reservation.availableCount || 0;
  const currentReservationParticipants = reservation.participants;
  const editableMaxCount = Math.min(
    maxParticipants,
    currentAvailableCount + currentReservationParticipants
  );

  // 参加人数の選択肢を生成
  const participantOptions = generateParticipantOptions(editableMaxCount);

  const isEditMode = mode === 'edit';
  const isDisabled = isSubmitting || mode === 'cancel';
  const submitButtonText = isEditMode
    ? isSubmitting
      ? '変更中...'
      : '変更を確定する'
    : isSubmitting
      ? 'キャンセル中...'
      : '予約をキャンセルする';

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className='flex h-[80vh] max-h-[600px] min-h-[400px] flex-col pt-4'
    >
      <div className='min-h-0 flex-1 space-y-6 overflow-y-auto px-1 pr-2 pt-2'>
        <ReservationManagementPreviewCard
          reservation={reservation}
          mode={mode}
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(isEditMode ? onSubmit : onCancel)}
            className={`space-y-4 ${mode === 'cancel' ? 'opacity-75' : ''}`}
          >
            <FormInput
              control={form.control}
              name='name'
              label='お名前'
              placeholder='お名前'
              disabled={isDisabled}
              required={true}
            />

            <FormInput
              control={form.control}
              name='email'
              label='メールアドレス'
              type='email'
              placeholder='example@email.com'
              disabled={isDisabled}
              required={true}
            />

            <FormSelect
              control={form.control}
              name='participants'
              label='参加人数'
              options={participantOptions}
              placeholder='参加人数を選択'
              contentClassName='z-[9999] max-h-[200px] overflow-y-auto'
              disabled={isDisabled}
              required={true}
              onValueChange={(value: string) => {
                const numValue = parseInt(value, 10);
                if (!isNaN(numValue)) {
                  form.setValue('participants', numValue);
                }
              }}
            />

            <div className='flex gap-3 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                disabled={isSubmitting}
                className='flex-1 border-gray-300 text-gray-900 hover:bg-blue-50 hover:text-gray-900'
              >
                キャンセル
              </Button>
              <Button
                type='submit'
                disabled={isSubmitting}
                className={`flex-1 ${!isEditMode ? 'bg-red-600 hover:bg-red-700' : ''}`}
                variant={!isEditMode ? 'destructive' : 'default'}
              >
                {isSubmitting ? (
                  <div className='flex items-center gap-2'>
                    <Loader2 className='size-4 animate-spin' />
                    <span>{isEditMode ? '変更中...' : 'キャンセル中...'}</span>
                  </div>
                ) : (
                  submitButtonText
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
