'use client';

import { Ellipsis } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useEvents } from '../../_hooks/useEvents';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import type { DeleteEventResponse } from '@/app/_types/event/DeleteEventResponse';
import { deleteRequest } from '@/app/_utils/api';

interface Props {
  id: number;
}

export const EventMenu: React.FC<Props> = ({ id }) => {
  const { mutate } = useEvents();
  const { token } = useSupabaseSession();
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('削除しますか？')) {
      try {
        await deleteRequest<DeleteEventResponse>(
          `/api/events/${id}`,
          token ?? undefined
        );
        toast.info('イベントを削除しました');
        mutate();
        router.replace('/dashboard');
      } catch (error) {
        toast.error(`イベントが削除できませんでした: ${error}`);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='translate-x-4 p-2'>
        <DropdownMenuItem asChild className='py-2'>
          <Link href={`/dashboard/events/${id}/edit`}>編集</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className='py-2 text-red-600' onClick={handleDelete}>
          削除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
