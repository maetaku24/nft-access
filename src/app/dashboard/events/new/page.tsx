'use client';

import { useRouter } from 'next/navigation';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'

// 外部ライブラリ
import { toast } from 'react-toastify';

// UIコンポーネント
import { EventForm } from '../../_components/form';

// 型・ユーティリティ
import { postRequest } from '@/app/_utils/api';
import {
  CreateEventRequest,
  CreateEventResponse,
} from '@/app/_types/event/CreateEvent';

export default function NewEventPage() {
  const router = useRouter();
  const { token } = useSupabaseSession()

  const handleSubmit = async (data: CreateEventRequest) => {
    try {
      const res = await postRequest<CreateEventRequest, CreateEventResponse>(
        '/api/events',
        data,
        token ?? undefined
      ); 
      console.log('イベント作成成功:', res);
      router.replace('/dashboard');
      toast.info('イベントが登録できました。');
    } catch (error) {
      console.log(error);
      toast.error('イベントが作成できませんでした');
    }
  };
  return (
    <div>
      <h1 className='flex justify-center items-start text-4xl font-bold mt-40'>新規イベント登録</h1>
      <EventForm onSubmit={handleSubmit} />
    </div>
  );
}
