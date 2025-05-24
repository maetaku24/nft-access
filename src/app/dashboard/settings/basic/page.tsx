'use client';

import { FormProvider } from 'react-hook-form';
import { AvatarSettings } from '../../_components/elements/AvatarSettings';
import { useProfileBasic } from './_hooks/useProfileBasic';
import TextInput from '@/app/_components/TextInput';
import { Button } from '@/app/_components/ui/button';

export default function BasicSettingsPage() {
  const { methods, handleUpdateProfile } = useProfileBasic();

  const { handleSubmit, register, formState } = methods;
  return (
    <FormProvider {...methods}>
      <form
        className='flex flex-col gap-8'
        onSubmit={handleSubmit(handleUpdateProfile)}
      >
        <div>
          <h2 className='text-base font-bold'>プロフィール設定</h2>
        </div>
        <AvatarSettings />
        <TextInput
          label='ユーザーID'
          id='userid'
          type='text'
          {...register('userId')}
          disabled={formState.isSubmitting}
          errorMessage={formState.errors.userId?.message}
        />
        <TextInput
          label='ユーザー名'
          id='username'
          type='text'
          {...register('name')}
          disabled={formState.isSubmitting}
          errorMessage={formState.errors.name?.message}
        />
        <TextInput
          label='ウォレットアドレス'
          id='walletAddress'
          type='text'
          {...register('walletAddress')}
          errorMessage={formState.errors.walletAddress?.message}
        />
        <Button
          type='submit'
          size='lg'
          className='mt-5 text-base font-semibold'
        >
          保存
        </Button>
      </form>
    </FormProvider>
  );
}
