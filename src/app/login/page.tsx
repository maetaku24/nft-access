'use client';

import { useLoginForm } from './_hooks/useLoginForm';
import TextInput from '../_components/TextInput';
import Button from '../_components/Button';
import Link from 'next/link';

export default function LoginPage() {
  const {
    login,
    methods: {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    },
  } = useLoginForm();

  return (
    <div className='min-h-screen flex items-start justify-center pt-28 bg-gray-100'>
      <div className='w-full max-w-lg'>
        <h1 className='text-center text-[32px] font-bold text-gray-900 mb-20'>
          ログイン
        </h1>
        <form onSubmit={handleSubmit(login)}>
          <div className='space-y-5'>
            <TextInput
              label='メールアドレス'
              id='email'
              type='email'
              autoComplete='username'
              placeholder='your@example.com'
              {...register('email')}
              disabled={isSubmitting}
              errorMessage={errors.email?.message}
            />
            <TextInput
              label='パスワード'
              id='password'
              type='password'
              autoComplete='current-password'
              placeholder='• • • • • • • •'
              {...register('password')}
              disabled={isSubmitting}
              errorMessage={errors.password?.message}
            />
          </div>
          <Button
            type='submit'
            variant='primary'
            width='stretch'
            className='mt-16'
            disabled={isSubmitting}
          >
            {isSubmitting ? '送信中...' : 'ログイン'}
          </Button>
          <p className='text-xs text-gray-500 font-medium mt-6'>
            <Link href='/signup' className='underline'>
              アカウントをお持ちでない場合はこちらから新規登録してください。
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
