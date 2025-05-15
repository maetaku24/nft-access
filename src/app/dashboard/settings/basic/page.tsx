'use client';

import { AvatarSettings } from '../../_components/elements/AvatarSettings';
import { useProfileBasic } from './_hooks/useProfileBasic';
import TextInput from '@/app/_components/TextInput';
import { Button } from '@/app/_components/ui/button';

export default function BasicSettingsPage() {
  const { data } = useProfileBasic();
  if (!data) return;
  return (
    <form className='flex flex-col gap-8'>
      <div>
        <h2 className='text-base font-bold'>プロフィール設定</h2>
      </div>
      <AvatarSettings />
      <TextInput
        label='ユーザーID'
        id='userid'
        type='text'
        value={data.userId}
      />
      <TextInput
        label='ユーザー名'
        id='username'
        type='text'
        value={data.name}
      />
      <TextInput
        label='ウォレットアドレス'
        id='walletAddress'
        type='text'
        value={data.walletAddress}
      />
      <Button type='button' size='lg' className='mt-5 text-base font-semibold'>
        保存
      </Button>
    </form>
  );
}
