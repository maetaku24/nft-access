'use client';
import dayjs from 'dayjs';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { useFetch } from '@/app/_hooks/useFetch';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import type { DetailResponse } from '@/app/_types/event/DetailResponse';
import type {
  UpdateEventRequest,
  UpdateEventResponse,
} from '@/app/_types/event/UpdateEvent';
import { putRequest } from '@/app/_utils/api';
import { EventForm } from '@/app/dashboard/_components/form';

export default function EditEventPage() {
  const { id } = useParams();
  const { token } = useSupabaseSession();
  const router = useRouter();
  const { data, isLoading, mutate } = useFetch<DetailResponse>(
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

  if (isLoading || !data)
    return (
      <div className='mt-40 flex items-center justify-center text-4xl font-bold'>
        ロード中...
      </div>
    );

  return (
    <div>
      <h1 className='mt-40 flex items-start justify-center text-4xl font-bold'>
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
