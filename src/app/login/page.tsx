'use client';

import Link from 'next/link';
import Button from '../_components/Button';
import TextInput from '../_components/TextInput';
import { useLoginForm } from './_hooks/useLoginForm';

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
    <div className='flex min-h-screen items-start justify-center bg-gray-100 pt-28'>
      <div className='w-full max-w-lg'>
        <h1 className='mb-20 text-center text-[32px] font-bold text-gray-900'>
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
          <p className='mt-6 text-xs font-medium text-gray-500'>
            <Link href='/signup' className='underline'>
              アカウントをお持ちでない場合はこちらから新規登録してください。
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
