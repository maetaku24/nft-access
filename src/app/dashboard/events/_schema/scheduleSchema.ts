import { z } from 'zod';
import { Type } from '@prisma/client';

const typeEnum = z.nativeEnum(Type);

export const scheduleSchema = z
  .object({
    id: z.number(),
    type: typeEnum,
    weekday: z.string().optional().nullable(),
    date: z.date().optional().nullable(),
    startTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
        message: '入力してください',
      }),
    endTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
        message: '入力してください',
      }),
    maxParticipants: z.number().min(1, '1名以上を入力してください'),
    isClosed: z.boolean(),
  })
  .refine(({ startTime, endTime }) => startTime <= endTime, {
    message: '終了時間は開始時間より後の時間を入力してください',
    path: ['endTime'],
  });

export type Schedule = z.infer<typeof scheduleSchema>;
