'use client';

import { useEmailUpdateForm } from './_hooks/useEmailUpdateForm';
import TextInput from '@/app/_components/TextInput';
import { Button } from '@/app/_components/ui/button';

export default function EmailSettingsPage() {
  const {
    email,
    handleUpdateEmail,
    formMethods: { register, handleSubmit, formState },
  } = useEmailUpdateForm();

  if (!email) return;

  return (
    <form
      onSubmit={handleSubmit(handleUpdateEmail)}
      className='flex flex-col gap-8'
    >
      <div>
        <h2 className='text-base font-bold'>メールアドレスの変更</h2>
      </div>
      <TextInput
        label='現在のメールアドレス'
        id='currentEmail'
        type='email'
        readOnly
        value={email}
      />
      <TextInput
        label='新しいメールアドレス'
        id='newEmail'
        type='email'
        {...register('email')}
        disabled={formState.isSubmitting}
        errorMessage={formState.errors.email?.message}
      />
      <Button
        type='submit'
        size='lg'
        className='mt-5 text-base font-semibold'
        disabled={formState.isSubmitting}
      >
        {formState.isSubmitting ? '更新中...' : '更新'}
      </Button>
    </form>
  );
}
