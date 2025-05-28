'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/_components/ui/avatar';
import { Button } from '@/app/_components/ui/button';
import { Label } from '@/app/_components/ui/label';
import { avatarBucket } from '@/config/app-config';
import { supabase } from '@/utils/supabase';

export const AvatarSettings = () => {
  const { setValue, control } = useFormContext();
  const iconKey = useWatch({ name: 'iconKey', control });
  const iconUrl = useWatch({ name: 'iconUrl', control });

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      return;
    }

    const file = event.target.files[0];
    const filePath = `private/${uuidv4()}`;
    const { data, error } = await supabase.storage
      .from(avatarBucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setValue('iconKey', data.path, { shouldValidate: true });

    const { data: urlRes } = supabase.storage
      .from(avatarBucket)
      .getPublicUrl(data.path);
    setValue('iconUrl', urlRes.publicUrl, { shouldValidate: true });
  };

  const handleImageDelete = async () => {
    if (!iconKey) return;
    await supabase.storage.from(avatarBucket).remove([iconKey]);
    setValue('iconKey', undefined, { shouldValidate: true });
    setValue('iconUrl', undefined);
  };

  return (
    <div>
      <Label className='mb-2 block text-sm font-semibold text-gray-900'>
        ユーザーアイコン
      </Label>
      <div className='flex items-center gap-8'>
        <Label htmlFor='avatarFile' className='cursor-pointer'>
          <Avatar className='size-20 border'>
            {iconUrl ? (
              <AvatarImage
                src={iconUrl}
                alt='Rounded avatar'
                width={400}
                height={400}
              />
            ) : (
              <AvatarFallback className='text-xs'>画像を選択</AvatarFallback>
            )}
          </Avatar>
        </Label>
        <input
          id='avatarFile'
          type='file'
          className='hidden'
          onChange={handleImageChange}
          accept='image/jpeg,image/png'
        />
        <div className='flex items-center gap-2'>
          {iconUrl && (
            <Button
              type='button'
              className='bg-red-600 hover:bg-red-600/75'
              onClick={handleImageDelete}
            >
              削除
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
