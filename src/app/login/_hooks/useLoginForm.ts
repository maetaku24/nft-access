import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import type { LoginForm } from '../_schema/loginSchema';
import { loginSchema } from '../_schema/loginSchema';
import { supabase } from '@/utils/supabase';

export const useLoginForm = () => {
  const router = useRouter();

  const methods = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const { register, handleSubmit, formState, reset } = methods;

  const login: SubmitHandler<LoginForm> = async (data) => {
    try {
      const { email, password } = data;

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }
      router.replace('/dashboard');
    } catch (error) {
      console.log(error);
      toast.error('ログインに失敗しました');
    }
  };

  return {
    login,
    methods: { register, handleSubmit, formState, reset },
  };
};
