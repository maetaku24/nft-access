import { avatarBucket } from '@/config/app-config';
import { supabase } from '@/utils/supabase';

export const avatarUrlFromKey = (
  iconKey?: string | null | undefined
): string | undefined => {
  if (!iconKey) return undefined;

  const { data } = supabase.storage.from(avatarBucket).getPublicUrl(iconKey);
  return data.publicUrl || undefined;
};
