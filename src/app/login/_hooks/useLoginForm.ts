import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { supabase } from '@/utils/supabase';
import { LoginForm, loginSchema } from '../_schema/loginSchema';

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
      console.log(error)
      toast.error('ログインに失敗しました');
    }
  };

  return {
    login,
    methods: { register, handleSubmit, formState, reset },
  };
};
