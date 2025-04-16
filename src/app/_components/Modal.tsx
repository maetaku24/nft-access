'use client';

import { CircleX } from 'lucide-react';
import type { FC, ReactNode } from 'react';
import React from 'react';
import ReactModal from 'react-modal';

interface Props {
  isOpen: boolean;
  onClose: (e: React.MouseEvent<HTMLElement>) => void;
  children: ReactNode;
}

export const Modal: FC<Props> = ({ isOpen, onClose, children }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel='Modal'
      closeTimeoutMS={300}
      ariaHideApp={false}
      className='relative mx-auto w-full max-w-lg rounded bg-white p-6 outline-none'
      overlayClassName='fixed inset-0 bg-black_main bg-black/80 flex items-center justify-center z-[99]'
    >
      <div
        className='flex size-full items-center justify-center'
        onClick={onClose}
      >
        <button
          className={`absolute right-0 top-0 z-[999] p-3`}
          onClick={onClose}
        >
          <CircleX />
        </button>
      </div>
      {children}
    </ReactModal>
  );
};
