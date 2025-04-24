import Skeleton from 'react-loading-skeleton';

export const BasicFormSkeleton = () => (
  <div className='space-y-4'>
    <Skeleton height={30} width={300} />
    <Skeleton height={30} width={500} />
    <Skeleton height={30} width={500} />
  </div>
);
