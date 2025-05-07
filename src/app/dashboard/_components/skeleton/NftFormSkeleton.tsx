import Skeleton from 'react-loading-skeleton';

export const NftFormSkeleton = () => (
  <div className='space-y-4'>
    <Skeleton height={30} width={500} />
    <Skeleton height={150} width={600} />
  </div>
);
