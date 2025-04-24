import Skeleton from 'react-loading-skeleton';
import { BasicFormSkeleton } from './BasicFormSkeleton';
import { NftFormSkeleton } from './NftFormSkeleton';
import { ScheduleFormSkeleton } from './ScheduleFormSkeleton';

export const EventFormSkeleton = () => (
  <div className='mt-40 flex flex-col items-center space-y-20'>
    <BasicFormSkeleton />
    <NftFormSkeleton />
    <ScheduleFormSkeleton />
    <div className='my-16'>
      <Skeleton height={50} width={200} />
    </div>
  </div>
);
