import { MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { instagramUrl, feedbackUrl } from '@/config/app-config';

export const Footer: React.FC = () => {
  return (
    <footer className='bg-green-100 py-9'>
      <div className='mx-auto max-w-7xl px-4'>
        <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
          <span className='text-sm text-gray-900'>
            © 2025 NFT Access. All Rights Reserved.
          </span>
          <div className='flex gap-3'>
            <a
              href={instagramUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='group relative flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-300 hover:bg-gray-50 hover:shadow-md'
            >
              <div className='absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 p-[2px]'>
                <div className='size-full rounded-full bg-white'></div>
              </div>
              <div className='relative z-10 flex items-center gap-2'>
                <Image
                  src='/Instagram_Glyph_Black.svg'
                  alt='Instagram'
                  width={18}
                  height={18}
                  className='transition-transform duration-300 group-hover:scale-110'
                />
                <div className='flex flex-col'>
                  <span className='text-xs'>アプリについてのお問い合わせ</span>
                  <span className='font-bold'>Instagram</span>
                </div>
              </div>
            </a>

            <a
              href={feedbackUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='group relative flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-300 hover:bg-gray-50 hover:shadow-md'
            >
              <div className='absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 p-[2px]'>
                <div className='size-full rounded-full bg-white'></div>
              </div>
              <div className='relative z-10 flex items-center gap-2'>
                <MessageSquare
                  size={18}
                  className='transition-transform duration-300 group-hover:scale-110'
                />
                <div className='flex flex-col'>
                  <span className='text-xs'>アプリへのご意見・ご要望</span>
                  <span className='font-bold'>フィードバック</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
