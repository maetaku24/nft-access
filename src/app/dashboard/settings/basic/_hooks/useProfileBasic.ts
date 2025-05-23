import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import type { ProfileBasic } from '../_schema/profileBasicSchema';
import { profileBasicSchema } from '../_schema/profileBasicSchema';
import { useFetch } from '@/app/_hooks/useFetch';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import type {
  UpdateProfileRequest,
  UpdateProfileResponse,
} from '@/app/_types/profile/UpdateProfile';
import { putRequest } from '@/app/_utils/api';

export const useProfileBasic = () => {
  const { data: profile, mutate } =
    useFetch<UpdateProfileRequest>('/api/profile');
  const { token } = useSupabaseSession();

  const methods = useForm<ProfileBasic>({
    resolver: zodResolver(profileBasicSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  useEffect(() => {
    if (profile) methods.reset(profile);
  }, [profile, methods]);

  const handleUpdateProfile: SubmitHandler<ProfileBasic> = async ({
    userId,
    name,
    walletAddress,
    iconKey,
  }) => {
    try {
      const body: UpdateProfileRequest = {
        userId,
        name,
        walletAddress,
        iconKey,
      };
      await putRequest<UpdateProfileRequest, UpdateProfileResponse>(
        '/api/profile',
        body,
        token ?? undefined
      );
      mutate();
      toast.info('プロフィールを更新しました');
    } catch (error) {
      toast.error(`プロフィールの更新に失敗しました。${error}`);
    }
  };
  return {
    profile,
    methods,
    handleUpdateProfile,
  };
};
