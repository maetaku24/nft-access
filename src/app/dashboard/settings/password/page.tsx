'use client';

import TextInput from '@/app/_components/TextInput';
import { Button } from '@/app/_components/ui/button';

export default function PasswordSettingsPage() {
  return (
    <form className='flex flex-col gap-8'>
      <div>
        <h2 className='text-base font-bold'>パスワードの変更</h2>
      </div>
      <TextInput
        label='現在のパスワード'
        id='current-password'
        type='password'
      />
      <TextInput label='新しいパスワード' id='new-password' type='password' />
      <TextInput
        label='新しいパスワード（確認）'
        id='confirm-password'
        type='password'
      />
      <Button type='button' size='lg' className='mt-5 text-base font-semibold'>
        保存
      </Button>
    </form>
  );
}
