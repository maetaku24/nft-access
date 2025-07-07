'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, useFormContext, useFieldArray } from 'react-hook-form';
import { Modal } from '@/app/_components/Modal';
import { Button } from '@/app/_components/ui/button';
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/app/_components/ui/form';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';
import { Switch } from '@/app/_components/ui/switch';
import type { WeekDay } from '@/app/_types/schedule/week';
import type { Event } from '@/app/dashboard/_schema/eventSchema';
import type { ScheduleForm } from '@/app/dashboard/_schema/scheduleSchema';
import { scheduleFormSchema } from '@/app/dashboard/_schema/scheduleSchema';
import {
  getInitialValue,
  getFieldIndexById,
  isTargetSchedule,
  sortSchedules,
} from '@/app/dashboard/_utils/scheduleHelpers';
import { dayjs } from '@/utils/dayjs';

interface Props {
  weekday?: WeekDay;
  date?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleModal: React.FC<Props> = ({
  weekday,
  date,
  isOpen,
  onClose,
}) => {
  const { getValues, setValue } = useFormContext<Event>();

  const modal = useForm<ScheduleForm>({
    resolver: zodResolver(scheduleFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  // モーダルが開いたとき or 関連データが変化したとき、対象の曜日・日付に対応するスケジュールを初期値として設定
  useEffect(() => {
    if (!isOpen || !weekday) return;
    const all = getValues('schedules');
    const initial = getInitialValue(all, weekday, date);
    modal.reset({ schedules: initial });
  }, [isOpen, weekday, date, getValues, modal]);

  const { fields, append, remove, update } = useFieldArray({
    control: modal.control,
    name: 'schedules',
  });

  // dayに対応するスケジュール項目を取得
  const dayItems = fields.filter((item) =>
    isTargetSchedule(item, weekday!, date)
  );

  // isClosedは「曜日全体を受け付けない」扱いとし、dayItems[0]の値を参照する
  const isClosed = dayItems[0]?.isClosed || false;

  // すべての項目に対してisClosedを反転する
  const handleToggleClosed = () => {
    dayItems.forEach((field) => {
      const index = getFieldIndexById(fields, field.id);
      if (index >= 0) {
        update(index, {
          ...field,
          isClosed: !isClosed,
        });
      }
    });
  };

  // 新しい時間帯を追加
  const handleAddTime = () => {
    if (!weekday) return;
    append({
      weekday,
      date: date ? dayjs(date).toDate() : undefined,
      startTime: '00:00',
      endTime: '00:00',
      maxParticipants: 1,
      isClosed,
    });
  };

  // 削除
  const handleRemove = (id: string) => {
    const index = getFieldIndexById(fields, id);
    if (index >= 0) remove(index);
  };

  // 編集対象以外のスケジュールを残し、モーダルで編集した内容をマージして保存
  const handleSave = modal.handleSubmit(({ schedules }) => {
    const others = getValues('schedules').filter(
      (schedule) => !isTargetSchedule(schedule, weekday!, date)
    );
    setValue('schedules', sortSchedules([...others, ...schedules]), {
      shouldValidate: true,
      shouldDirty: true,
    });
    onClose();
  });

  // 最大予約数
  const maxNum = 3;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div onClick={(e) => e.stopPropagation}>
        <h3 className='mb-4 text-xl font-semibold'>
          {date
            ? `${dayjs(date).format(
                'M月D日'
              )}のスケジュール（最大${maxNum}件登録できます）`
            : `${weekday}のスケジュール（最大${maxNum}件登録できます）`}
        </h3>
        <div className='mb-4 flex items-center gap-2'>
          <Switch
            checked={isClosed}
            onCheckedChange={() => handleToggleClosed()}
          />
          <Label>この日のスケジュールを受け付けない</Label>
        </div>
        <div className={isClosed ? 'pointer-events-none opacity-50' : ''}>
          {dayItems.map((field, index) => {
            const realIndex = getFieldIndexById(fields, field.id);
            return (
              <div key={field.id} className='mt-6'>
                <Label className='text-base font-medium'>
                  {index + 1}. 受け付ける時間
                </Label>
                <div className='mt-1 flex w-full items-center justify-between'>
                  <div className='flex w-full items-center justify-start gap-4'>
                    {/* 開始時間 */}
                    <FormField
                      control={modal.control}
                      name={`schedules.${realIndex}.startTime`}
                      render={({ field, fieldState }) => (
                        <FormItem className='relative flex'>
                          <FormControl>
                            <Input
                              type='text'
                              placeholder='09:00'
                              {...field}
                              className='w-40 rounded-sm px-3 py-2 text-center font-mono'
                              maxLength={5}
                              onChange={(e) => {
                                let value = e.target.value.replace(
                                  /[^\d:]/g,
                                  ''
                                );
                                if (
                                  value.length === 2 &&
                                  !value.includes(':')
                                ) {
                                  value = value + ':';
                                }
                                if (value.length > 5) {
                                  value = value.slice(0, 5);
                                }
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          {fieldState.error && (
                            <FormMessage className='absolute left-0 top-full mt-1 text-xs text-red-500'>
                              {fieldState.error.message}
                            </FormMessage>
                          )}
                        </FormItem>
                      )}
                    />
                    <span>ー</span>
                    {/* 終了時間 */}
                    <FormField
                      control={modal.control}
                      name={`schedules.${realIndex}.endTime`}
                      render={({ field, fieldState }) => (
                        <FormItem className='relative flex'>
                          <FormControl>
                            <Input
                              type='text'
                              placeholder='18:00'
                              {...field}
                              className='w-40 rounded-sm px-3 py-2 text-center font-mono'
                              maxLength={5}
                              onChange={(e) => {
                                let value = e.target.value.replace(
                                  /[^\d:]/g,
                                  ''
                                );
                                if (
                                  value.length === 2 &&
                                  !value.includes(':')
                                ) {
                                  value = value + ':';
                                }
                                if (value.length > 5) {
                                  value = value.slice(0, 5);
                                }
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          {fieldState.error && (
                            <FormMessage className='absolute left-0 top-full mt-1 text-xs text-red-500'>
                              {fieldState.error.message}
                            </FormMessage>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    {index === 0 ? (
                      <Button
                        size='icon'
                        variant='outline'
                        disabled={dayItems.length >= maxNum}
                        onClick={handleAddTime}
                        className='border-2 border-green-300 text-lg font-bold text-green-300 hover:bg-green-300/20 hover:text-green-300'
                      >
                        ＋
                      </Button>
                    ) : (
                      <div className='flex items-center gap-2'>
                        <Button
                          size='icon'
                          variant='outline'
                          disabled={dayItems.length >= maxNum}
                          onClick={handleAddTime}
                          className='border-2 border-green-300 text-lg font-bold text-green-300 hover:bg-green-300/20 hover:text-green-300'
                        >
                          ＋
                        </Button>
                        <Button
                          size='icon'
                          variant='outline'
                          onClick={() => handleRemove(field.id)}
                          className='border-2 border-red-500 text-lg font-bold text-red-500 hover:bg-red-500/20 hover:text-red-500'
                        >
                          ー
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <FormField
                  control={modal.control}
                  name={`schedules.${realIndex}.maxParticipants`}
                  render={({ field, fieldState }) => (
                    <FormItem className='border-b pb-6 '>
                      <FormControl>
                        <div className='mt-8 flex items-end gap-2'>
                          <span className='text-sm font-medium'>
                            各時間帯最大
                          </span>
                          <Input
                            type='number'
                            className='w-14 rounded-sm p-0 text-center text-base shadow-none'
                            {...field}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val ? Number(val) : '');
                            }}
                          />
                          <span className='text-sm font-medium'>
                            人まで同時に予約可能
                          </span>
                        </div>
                      </FormControl>
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            );
          })}
        </div>
        <div className='mt-4 flex justify-end gap-2 '>
          <Button
            variant='outline'
            className='border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
            onClick={onClose}
          >
            キャンセル
          </Button>
          <Button
            variant='outline'
            onClick={handleSave}
            disabled={!modal.formState.isValid}
            className='border-2 border-green-300 text-green-300 hover:bg-green-300 hover:text-white'
          >
            保存
          </Button>
        </div>
      </div>
    </Modal>
  );
};
