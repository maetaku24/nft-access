'use client';

import { Label } from '@radix-ui/react-dropdown-menu';
import { useEvents } from '../../_hooks/useEvents';
import { CopyableUrlBox } from '../elements/CopyableUrlBox';
import { Badge } from '@/app/_components/ui/badge';
import { Card, CardContent } from '@/app/_components/ui/card';
import { dayjs } from '@/utils/dayjs';

interface Props {
  eventId: number;
}

export const ShareUrlCard: React.FC<Props> = ({ eventId }) => {
  const { data: events } = useEvents();
  if (!events) return;
  const event = events.find((e) => e.id === eventId);

  return (
    <div className='w-full'>
      <Label className='text-base font-semibold'>
        イベントURLを共有しましょう
      </Label>
      <Card className='mt-2 rounded-md border border-gray-400 px-10 shadow-none'>
        <CardContent className='flex items-center justify-between py-6'>
          <div className='flex items-center justify-between gap-10'>
            <div className='flex items-center justify-center gap-2'>
              <Badge className='bg-green-200 font-bold text-gray-900 shadow-none hover:bg-green-200'>
                イベント名
              </Badge>
              <span className='text-base font-medium text-gray-600'>
                {event?.eventName}
              </span>
            </div>
            <div className='flex items-center justify-center gap-2'>
              <Badge className='bg-green-200 font-bold text-gray-900 shadow-none hover:bg-green-200'>
                最終更新日
              </Badge>
              <span className='text-base font-medium text-gray-600'>
                {dayjs(event?.updatedAt).format('YYYY/MM/DD')}
              </span>
            </div>
          </div>
          <CopyableUrlBox eventId={eventId} />
        </CardContent>
      </Card>
    </div>
  );
};
