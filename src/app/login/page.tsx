'use client';

import { supabase } from '@/utils/spabase';
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userAuthSchema, userAuth } from '@/app/_schemas/userAuthSchema';
import TextInput from '../_components/TextInput';
import Button from '../_components/Button';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<userAuth>({
    resolver: zodResolver(userAuthSchema),
    mode: 'onBlur', // 初回はフォーカスアウト時にバリデーション
    reValidateMode: 'onBlur', // 再入力時もフォーカスアウトでバリデーション
  });

  const onSubmit: SubmitHandler<userAuth> = async (data) => {
    try {
      const { email, password } = data;

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }
      router.replace('/dashboard')
    } catch (error) {
      alert("ログインに失敗しました");
    }
  };

  return (
    <div className='min-h-screen flex items-start justify-center pt-28 bg-gray-100'>
      <div className='w-full max-w-lg'>
        <h1 className='text-center text-[32px] font-bold text-gray-900 mb-20'>
          ログイン
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-5'>
            <TextInput
              label='メールアドレス'
              id='email'
              type='email'
              autoComplete="username"
              placeholder='your@example.com'
              {...register('email')}
              disabled={isSubmitting}
              errorMessage={errors.email?.message}
            />
            <TextInput
              label='パスワード'
              id='password'
              type='password'
              autoComplete="current-password"
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
          <p className='text-xs text-gray-400 font-medium mt-6'>
            アカウントをお持ちでない場合は
            <Link href='/signup' className='text-sm font-bold underline'>
              こちら
            </Link>
            から新規登録してください。
          </p>
        </form>
      </div>
    </div>
  )
}
