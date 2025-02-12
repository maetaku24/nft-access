import { supabase } from '@/utils/spabase';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profile } from '../_schemas/profileSchema';
import { userAuthSchema, userAuth } from '@/app/_schemas/userAuthSchema';
import { postRequest } from '../_utils/api';

export const useAuth = () => {
  const router = useRouter();

  const methods = useForm<userAuth>({
    resolver: zodResolver(userAuthSchema),
    mode: 'onBlur', // 初回はフォーカスアウト時にバリデーション
    reValidateMode: 'onBlur', // 再入力時もフォーカスアウトでバリデーション
  });

  const { register, handleSubmit, formState, reset } = methods;

  const signup: SubmitHandler<userAuth> = async (data) => {
    try {
      const { email, password } = data;
      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `http://localhost:3000/login`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // signup時に作成されるidをsupabaseUserIdに格納
      const supabaseUserId = signUpData.user?.id;
      if (!supabaseUserId) {
        throw new Error('ユーザーIDが取得できませんでした');
      }

      // 入力されたemailの@より前の文字をnameに格納
      const name = email.split('@')[0];
      const body = { supabaseUserId, name, email };

      const res = await postRequest<profile, profile>('profile', body);
      console.log('プロファイル作成成功:', res);

      alert('確認メールを送信しました。');
      reset();
    } catch (error) {
      alert('ユーザー登録に失敗しました。');
    }
  };

  const login: SubmitHandler<userAuth> = async (data) => {
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
      alert('ログインに失敗しました');
    }
  };

  return {
    signup,
    login,
    methods: { register, handleSubmit, formState, reset },
  };
};
