import { z } from 'zod';

export const reservationFormSchema = z.object({
  name: z.string().min(1, '名前を入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  participants: z.number().min(1, '参加人数は1人以上を入力してください'),
});

export type ReservationForm = z.infer<typeof reservationFormSchema>;
