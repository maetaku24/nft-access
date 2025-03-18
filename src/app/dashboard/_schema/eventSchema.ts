import { z } from 'zod';
import { nftSchema } from './nftSchema';
import { scheduleSchema } from './scheduleSchema';

export const EventSchema = z.object({
  eventName: z
    .string({ message: 'イベント名を入力してください' })
    .min(1, 'イベント名を入力してください')
    .max(30, '30文字以内で入力してください'),
  length: z.coerce.number().min(15, '15分以上で設定してください'),
  nfts: z.array(nftSchema),
  schedules: z.array(scheduleSchema),
});
export type Event = z.infer<typeof EventSchema>;
