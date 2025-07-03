'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { EventForm } from '../../_components/form';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import type {
  CreateEventRequest,
  CreateEventResponse,
} from '@/app/_types/event/CreateEvent';
import { postRequest } from '@/app/_utils/api';

export default function NewEventPage() {
  const router = useRouter();
  const { token } = useSupabaseSession();

  const handleSubmit = async (data: CreateEventRequest) => {
    try {
      await postRequest<CreateEventRequest, CreateEventResponse>(
        '/api/events',
        data,
        token ?? undefined
      );
      router.replace('/dashboard');
      toast.info('イベントが登録できました。');
    } catch (error) {
      console.log(error);
      toast.error(`イベントが作成できませんでした: ${error}`);
    }
  };
  return (
    <div>
      <h1 className='flex items-start justify-center text-4xl font-bold'>
        新規イベント登録
      </h1>
      <EventForm onSubmit={handleSubmit} />
    </div>
  );
}
