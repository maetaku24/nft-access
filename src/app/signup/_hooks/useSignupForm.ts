import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import type { SignupForm } from '../_schema/signupSchema';
import { signupSchema } from '../_schema/signupSchema';
import type {
  CreateProfileRequest,
  CreateProfileResponse,
} from '@/app/_types/profile/CreateProfile';
import { postRequest } from '@/app/_utils/api';
import { appBaseUrl } from '@/config/app-config';
import { supabase } from '@/utils/supabase';

export const useSignupForm = () => {
  const { register, handleSubmit, formState, reset } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const signup: SubmitHandler<SignupForm> = async (data) => {
    try {
      const { email, password } = data;
      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${appBaseUrl}/login`,
        },
      });

      if (error) {
        throw new Error(`登録に失敗しました: ${error.message}`);
      }

      // signup時に作成されるidをsupabaseUserIdに格納
      const supabaseUserId = signUpData.user?.id;
      if (!supabaseUserId) {
        throw new Error('ユーザーIDが取得できませんでした');
      }

      // 入力されたemailの@より前の文字をnameに格納
      const userId = email.split('@')[0];
      const body: CreateProfileRequest = { supabaseUserId, userId, email };

      const res = await postRequest<
        CreateProfileRequest,
        CreateProfileResponse
      >('/api/profile', body);

      console.log('プロファイル作成成功:', res);

      toast.info('確認メールを送信しました。');
      reset();
    } catch (error) {
      console.log(error);
      toast.error('ユーザー登録に失敗しました。');
    }
  };

  return {
    signup,
    methods: { register, handleSubmit, formState, reset },
  };
};
