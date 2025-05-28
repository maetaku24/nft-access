import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import type { PasswordForm } from '../_schema/passwordSchema';
import { passwordSchema } from '../_schema/passwordSchema';
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession';
import { supabase } from '@/utils/supabase';

export const usePasswordUpdateForm = () => {
  const { register, handleSubmit, setError, formState, reset } =
    useForm<PasswordForm>({
      resolver: zodResolver(passwordSchema),
      mode: 'onBlur',
    });
  const { session } = useSupabaseSession();
  const email = session?.user.email ?? '';

  const handleUpdatePassword: SubmitHandler<PasswordForm> = async ({
    currentPassword,
    newPassword,
  }) => {
    try {
      const { error: signErr } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

      if (signErr) {
        setError('currentPassword', {
          type: 'manual',
          message: '現在のパスワードが違います',
        });
        return;
      }

      const { error: updErr } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (updErr) throw updErr;

      toast.info('パスワードを変更しました');
      reset();
    } catch (error) {
      toast.error(`パスワードの更新に失敗しました。${error}`);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(handleUpdatePassword),
    formState,
  };
};
