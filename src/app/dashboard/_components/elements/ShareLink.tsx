import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useShareUrl } from '../../_hooks/useShareUrl';
import { Button } from '@/app/_components/ui/button';

interface Props {
  eventId: number;
}

export const ShareLink: React.FC<Props> = ({ eventId }) => {
  const { data } = useShareUrl(eventId);
  if (!data) return null;
  return (
    <Link href={data.shareUrl} target='_blank'>
      <Button
        size='lg'
        variant='outline'
        className='border-gray-900 bg-transparent px-4 text-xl text-gray-900 hover:bg-gray-200 hover:text-gray-900'
      >
        <ExternalLink size={28} />
        <span>ページを表示</span>
      </Button>
    </Link>
  );
};
