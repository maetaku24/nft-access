'use client';

import { Button } from '@/app/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/app/_components/ui/dialog';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
}

export const ConfirmDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          document.body.style.pointerEvents = '';
        }}
        className='focus:outline-none'
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className='whitespace-pre-line text-left'>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-y-2'>
          <Button variant='destructive' onClick={onConfirm}>
            {confirmText}
          </Button>
          <DialogClose asChild>
            <Button variant='outline'>戻る</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
