import Image from 'next/image';
import { instagramUrl } from '@/config/app-config';

export const Footer: React.FC = () => {
  return (
    <footer className='bg-green-100 py-8'>
      <div className='mx-auto max-w-7xl px-4'>
        <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
          <span className='text-sm text-gray-900'>
            © 2025 NFT Access. All Rights Reserved.
          </span>
          <div className='flex'>
            <a
              href={instagramUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='group flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
            >
              <Image
                src='/Instagram_Glyph_Black.svg'
                alt='Instagram'
                width={18}
                height={18}
                className='transition-transform duration-300 group-hover:scale-110'
              />
              <span>
                お問い合わせは<span className='font-bold'>Instagram</span>にて
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
