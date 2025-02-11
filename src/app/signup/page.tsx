'use client';

import { supabase } from '@/utils/spabase';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userAuthSchema, userAuth } from '@/app/_schemas/userAuthSchema';
import TextInput from '../_components/TextInput';
import Button from '../_components/Button';
import Link from 'next/link';

export default function SiguUpPaga() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<userAuth>({
    resolver: zodResolver(userAuthSchema),
    mode: 'onBlur', // 初回はフォーカスアウト時にバリデーション
    reValidateMode: 'onBlur', // 再入力時もフォーカスアウトでバリデーション
  });

  const onSubmit: SubmitHandler<userAuth> = async (data) => {
    try {
      const { email, password } = data;
      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `http://localhost:3000/login`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // signup時に作成されるidをsupabaseUserIdに格納
      const supabaseUserId = signUpData.user?.id;
      if (!supabaseUserId) {
        throw new Error('ユーザーIDが取得できませんでした');
      }

      // 入力されたemailの@より前の文字をnameに格納
      const name = email.split('@')[0];

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseUserId,
          name,
          email,
        }),
      });

      if (!res.ok) throw new Error('送信に失敗しました');

      alert('確認メールを送信しました。');
      reset();
    } catch (error) {
      alert('ユーザー登録に失敗しました。');
    }
  };

  return (
    <div className='min-h-screen flex items-start justify-center pt-28 bg-gray-100'>
      <div className='w-full max-w-lg'>
        <h1 className='text-center text-[32px] font-bold text-gray-900 mb-20'>
          新規登録
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
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
          <p className='text-xs text-gray-400 font-medium mt-6'>
            すでに登録済みの方は
            <Link href='/login' className='text-sm font-bold underline'>
              こちら
            </Link>
            からログインしてください。
          </p>
        </form>
      </div>
    </div>
  );
}
