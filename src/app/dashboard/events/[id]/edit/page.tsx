'use client';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { useFetch } from '@/app/_hooks/useFetch';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import type { EditResponse } from '@/app/_types/event/EditResponse';
import type {
  UpdateEventRequest,
  UpdateEventResponse,
} from '@/app/_types/event/UpdateEvent';
import { putRequest } from '@/app/_utils/api';
import { EventForm } from '@/app/dashboard/_components/form';
import { EventFormSkeleton } from '@/app/dashboard/_components/skeleton/EventFormSkeleton';
import { dayjs } from '@/utils/dayjs';

export default function EditEventPage() {
  const { id } = useParams();
  const { token } = useSupabaseSession();
  const router = useRouter();
  const { data, isLoading, mutate } = useFetch<EditResponse>(
    `/api/events/${id}`
  );

  const handleSubmit = async (data: UpdateEventRequest) => {
    try {
      await putRequest<UpdateEventRequest, UpdateEventResponse>(
        `/api/events/${id}`,
        data,
        token ?? undefined
      );
      mutate();
      router.replace('/dashboard');
      toast.info('イベントが更新できました。');
    } catch (error) {
      toast.error(`イベントが更新できませんでした: ${error}`);
    }
  };

  if (isLoading || !data) return <EventFormSkeleton />;

  return (
    <div>
      <h1 className='flex items-start justify-center text-4xl font-bold'>
        イベント編集
      </h1>
      <EventForm
        onSubmit={handleSubmit}
        defaultValues={{
          ...data,
          schedules: data.schedules.map((s) => ({
            ...s,
            date: s.date ? dayjs(s.date).toDate() : undefined,
          })),
        }}
      />
    </div>
  );
}
