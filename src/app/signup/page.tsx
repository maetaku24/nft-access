'use client';

import { useSignupForm } from '@/app/signup/_hooks/useSignupForm'
import TextInput from '../_components/TextInput';
import Button from '../_components/Button';
import Link from 'next/link';

export default function SiguUpPaga() {
  const {
    signup,
    methods: {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    },
  } = useSignupForm();

  return (
    <div className='min-h-screen flex items-start justify-center pt-28 bg-gray-100'>
      <div className='w-full max-w-lg'>
        <h1 className='text-center text-[32px] font-bold text-gray-900 mb-20'>
          新規登録
        </h1>
        <form onSubmit={handleSubmit(signup)}>
          <div className='space-y-5'>
            <TextInput
              label='メールアドレス'
              id='email'
              type='email'
              placeholder='your@example.com'
              {...register('email')}
              disabled={isSubmitting}
              errorMessage={errors.email?.message}
            />
            <TextInput
              label='パスワード'
              id='password'
              type='password'
              placeholder='• • • • • • • •'
              {...register('password')}
              disabled={isSubmitting}
              errorMessage={errors.password?.message}
            />
            <TextInput
              label='確認用パスワード'
              id='passwordConfirmation'
              type='password'
              placeholder='• • • • • • • •'
              {...register('passwordConfirmation')}
              disabled={isSubmitting}
              errorMessage={errors.passwordConfirmation?.message}
            />
          </div>
          <Button
            type='submit'
            variant='primary'
            width='stretch'
            className='mt-16'
            disabled={isSubmitting}
          >
            {isSubmitting ? '送信中...' : '送信'}
          </Button>
          <p className='text-xs text-gray-500 font-medium mt-6'>
            <Link href='/login' className='underline'>
              すでに登録済みの方はこちらからログインしてください。
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
