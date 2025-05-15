'use client';

import { useProfileEmail } from './_hooks/useProfileEmail';
import TextInput from '@/app/_components/TextInput';
import { Button } from '@/app/_components/ui/button';

export default function EmailSettingsPage() {
  const { data } = useProfileEmail();
  if (!data) return;
  return (
    <form className='flex flex-col gap-8'>
      <div>
        <h2 className='text-base font-bold'>メールアドレスの変更</h2>
      </div>
      <TextInput
        label='メールアドレス'
        id='email'
        type='email'
        value={data.email}
      />
      <Button type='button' size='lg' className='mt-5 text-base font-semibold'>
        保存
      </Button>
    </form>
  );
}
