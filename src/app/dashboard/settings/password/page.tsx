'use client';

import { usePasswordUpdateForm } from './_hooks/usePasswordUpdateForm';
import TextInput from '@/app/_components/TextInput';
import { Button } from '@/app/_components/ui/button';

export default function PasswordSettingsPage() {
  const { register, handleSubmit, formState } = usePasswordUpdateForm();

  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
      <div>
        <h2 className='text-base font-bold'>パスワードの変更</h2>
      </div>
      <TextInput
        label='現在のパスワード'
        id='currentPassword'
        type='password'
        {...register('currentPassword')}
        disabled={formState.isSubmitting}
        errorMessage={formState.errors.currentPassword?.message}
      />
      <TextInput
        label='新しいパスワード'
        id='newPassword'
        type='password'
        {...register('newPassword')}
        disabled={formState.isSubmitting}
        errorMessage={formState.errors.newPassword?.message}
      />
      <TextInput
        label='新しいパスワード（確認）'
        id='passwordConfirmation'
        type='password'
        {...register('passwordConfirmation')}
        disabled={formState.isSubmitting}
        errorMessage={formState.errors.passwordConfirmation?.message}
      />
      <Button type='submit' size='lg' className='mt-5 text-base font-semibold'>
        {formState.isSubmitting ? '更新中...' : '更新'}
      </Button>
    </form>
  );
}
