import { z } from 'zod';
import { nftSchema } from './nftSchema';
import { scheduleSchema } from './scheduleSchema';

export const EventSchema = z.object({
  profileId: z.number(),
  eventName: z
    .string()
    .min(1, 'イベント名を入力してください')
    .max(30, '30文字以内で入力してください'),
  length: z.number().min(1, '予約確保時間を選択してください'),
  nfts: z.array(nftSchema),
  schedules: z.array(scheduleSchema),
});
export type Event = z.infer<typeof EventSchema>;