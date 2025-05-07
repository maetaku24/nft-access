import Skeleton from 'react-loading-skeleton';

export const ScheduleFormSkeleton = () => (
  <div className='space-y-4'>
    {[...Array(7)].map((_, index) => (
      <Skeleton key={index} height={40} width={600} />
    ))}
  </div>
);
