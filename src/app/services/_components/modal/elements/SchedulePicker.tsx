'use client';

import { Loader2 } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { ReservationForm } from '../../../_schema/reservationFormSchema';
import { ReservationPreviewCard } from './ReservationPreviewCard';
import { Button } from '@/app/_components/ui/button';
import { Form } from '@/app/_components/ui/form';
import type { ReservationSchedule } from '@/app/_types/reservation/ReservationSchedule';
import { generateParticipantOptions } from '@/app/_utils/participantOptions';
import { FormInput } from '@/app/dashboard/_components/form/elements/FormInput';
import { FormSelect } from '@/app/dashboard/_components/form/elements/FormSelect';

interface Props {
  selectedSchedule: ReservationSchedule;
  walletAddress: string;
  form: UseFormReturn<ReservationForm>;
  isSubmitting: boolean;
  onSubmit: (data: ReservationForm) => void;
  onBack: () => void;
}

export const SchedulePicker: React.FC<Props> = ({
  selectedSchedule,
  walletAddress,
  form,
  isSubmitting,
  onSubmit,
  onBack,
}) => {
  const participantOptions = generateParticipantOptions(
    selectedSchedule.availableCount
  );

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className='flex h-[80vh] max-h-[600px] min-h-[400px] flex-col'
    >
      <div className='min-h-0 flex-1 space-y-6 overflow-y-auto px-1 pr-2'>
        <ReservationPreviewCard
          selectedSchedule={selectedSchedule}
          walletAddress={walletAddress}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormInput
              control={form.control}
              name='name'
              label='お名前 *'
              placeholder='お名前'
              disabled={isSubmitting}
            />

            <FormInput
              control={form.control}
              name='email'
              label='メールアドレス *'
              type='email'
              placeholder='example@email.com'
              disabled={isSubmitting}
            />

            <FormSelect
              control={form.control}
              name='participants'
              label='参加人数 *'
              options={participantOptions}
              placeholder='参加人数を選択'
              contentClassName='z-[9999] max-h-[200px] overflow-y-auto'
              disabled={isSubmitting}
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
                onClick={onBack}
                disabled={isSubmitting}
                className='flex-1 border-gray-300 text-gray-900 hover:bg-blue-50 hover:text-gray-900'
              >
                戻る
              </Button>
              <Button type='submit' disabled={isSubmitting} className='flex-1'>
                {isSubmitting ? (
                  <div className='flex items-center gap-2'>
                    <Loader2 className='size-4 animate-spin' />
                    <span>予約中...</span>
                  </div>
                ) : (
                  '予約を確定する'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
