import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import type { ProfileEmail } from '../_schema/profileEmailSchema';
import { profileEmailSchema } from '../_schema/profileEmailSchema';
import { useFetch } from '@/app/_hooks/useFetch';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import type {
  EmailResponse,
  EmailRequest,
} from '@/app/_types/profile/UpdateEmail';
import { putRequest } from '@/app/_utils/api';
import { appBaseUrl } from '@/config/app-config';
import { supabase } from '@/utils/supabase';

export const useEmailUpdateForm = () => {
  const methods = useForm<ProfileEmail>({
    resolver: zodResolver(profileEmailSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const router = useRouter();

  const { data, mutate } = useFetch<EmailResponse>('/api/profile/email');
  const { token } = useSupabaseSession();

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

      const body: EmailRequest = { email };

      await putRequest<EmailRequest, EmailResponse>(
        '/api/profile/email',
        body,
        token ?? undefined
      );

      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        throw new Error(
          `メールアドレスの更新に失敗しました: ${signOutError.message}`
        );
      }
      mutate();
      router.push('/');
      toast.info(`更新用のメールを送信しました。\n再ログインをお願いします。`);
    } catch (error) {
      toast.error(`メールアドレスの更新に失敗しました。${error}`);
    }
  };

  return {
    email: data?.email,
    handleUpdateEmail,
    formMethods: methods,
  };
};
