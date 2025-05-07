'use client';

import { useShareUrl } from '../../_hooks/useShareUrl';
import { UrlSkeleton } from '../skeleton/UrlSkeleton';
import { CopyUrlButton } from './CopyUrlButton';

interface Props {
  eventId: number;
}

export const CopyableUrlBox: React.FC<Props> = ({ eventId }) => {
  const { data, isLoading } = useShareUrl(eventId);
  if (!data) return;

  return (
    <div className='flex w-full max-w-[600px] rounded border'>
      {isLoading || !data ? (
        <UrlSkeleton />
      ) : (
        <input
          readOnly
          value={data.shareUrl}
          className='w-full rounded-l border-none bg-white px-4 py-2 text-sm font-semibold text-gray-900 focus:outline-none'
        />
      )}

      <CopyUrlButton
        shareUrl={data.shareUrl}
        className='flex min-w-[140px] items-center justify-center gap-2 whitespace-nowrap rounded-l-none rounded-r bg-green-300 px-4 text-sm font-bold text-white shadow-none hover:bg-green-300/70 hover:text-white'
      />
    </div>
  );
};
