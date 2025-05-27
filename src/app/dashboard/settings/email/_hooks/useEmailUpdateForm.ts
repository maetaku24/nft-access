import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import type { ProfileEmail } from '../_schema/profileEmailSchema';
import { profileEmailSchema } from '../_schema/profileEmailSchema';
import { useFetch } from '@/app/_hooks/useFetch';
import type { EmailResponse } from '@/app/_types/profile/UpdateEmail';
import { appBaseUrl } from '@/config/app-config';
import { supabase } from '@/utils/supabase';

export const useEmailUpdateForm = () => {
  const { register, handleSubmit, formState } = useForm<ProfileEmail>({
    resolver: zodResolver(profileEmailSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const { data } = useFetch<EmailResponse>('/api/profile/email');

  const handleUpdateEmail: SubmitHandler<ProfileEmail> = async ({ email }) => {
    try {
      const { error: updateUserError } = await supabase.auth.updateUser(
        { email },
        { emailRedirectTo: `${appBaseUrl}/login` }
      );

      if (updateUserError) {
        throw new Error(
          `メールアドレスの更新に失敗しました: ${updateUserError.message}`
        );
      }

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw new Error(
          `メールアドレスの更新に失敗しました: ${signOutError.message}`
        );
      }
      toast.info(`更新用のメールを送信しました。\n再ログインをお願いします。`);
    } catch (error) {
      toast.error(`メールアドレスの更新に失敗しました。${error}`);
    }
  };

  return {
    email: data?.email,
    register,
    handleSubmit: handleSubmit(handleUpdateEmail),
    formState,
  };
};
