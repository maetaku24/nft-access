'use client';

import { Check, Copy } from 'lucide-react';
import { useClipboard } from '../../_hooks/useClipboard';
import { Button } from '@/app/_components/ui/button';

interface Props {
  shareUrl: string;
  className?: string;
}

export const CopyUrlButton: React.FC<Props> = ({ shareUrl, className }) => {
  const { copied, handleCopy } = useClipboard({ text: shareUrl });

  return (
    <Button variant='ghost' onClick={handleCopy} className={className}>
      {copied ? (
        <Check size={16} strokeWidth={4} />
      ) : (
        <Copy size={16} strokeWidth={3} />
      )}
      {copied ? 'コピー済み' : 'URLをコピー'}
    </Button>
  );
};
