import { useEffect } from 'react';
import { useForm, useFormContext, useFieldArray } from 'react-hook-form';

// 外部ライブラリ
import { zodResolver } from '@hookform/resolvers/zod';

// UIコンポーネント
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

// 型・ユーティリティ・バリデーション
import type { WeekDay } from '@/app/_types/schedule/week';
import type { Event } from '@/app/dashboard/_schema/eventSchema';
import type { ScheduleForm } from '@/app/dashboard/_schema/scheduleSchema';
import { dayjs } from '@/utils/dayjs';
import {
  getInitialValue,
  getFieldIndexById,
  isTargetSchedule,
  sortSchedules,
} from '@/app/dashboard/_utils/scheduleHelpers';
import { scheduleFormSchema } from '@/app/dashboard/_schema/scheduleSchema';

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
        <h3 className='text-xl font-semibold mb-4'>
          {date
            ? `${dayjs(date).format(
                'M月D日'
              )}のスケジュール（最大${maxNum}件登録できます）`
            : `${weekday}のスケジュール（最大${maxNum}件登録できます）`}
        </h3>
        <div className='flex items-center gap-2 mb-4'>
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
                <div className='flex justify-between items-center w-full mt-1'>
                  <div className='flex justify-start items-center w-full gap-4'>
                    {/* 開始時間 */}
                    <FormField
                      control={modal.control}
                      name={`schedules.${realIndex}.startTime`}
                      render={({ field, fieldState }) => (
                        <FormItem className='relative flex'>
                          <FormControl>
                            <Input
                              type='time'
                              {...field}
                              className='w-40 text-center rounded-sm'
                            />
                          </FormControl>
                          {fieldState.error && (
                            <FormMessage className='absolute left-0 top-full text-xs text-red-500 mt-1'>
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
                              type='time'
                              {...field}
                              className='w-40 flex text-center rounded-sm'
                            />
                          </FormControl>
                          {fieldState.error && (
                            <FormMessage className='absolute left-0 top-full text-xs text-red-500 mt-1'>
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
                        className='text-lg font-bold border-2 border-green-300 text-green-300 hover:text-green-300 hover:bg-green-300/20'
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
                          className='text-lg font-bold border-2 border-green-300 text-green-300 hover:text-green-300 hover:bg-green-300/20'
                        >
                          ＋
                        </Button>
                        <Button
                          size='icon'
                          variant='outline'
                          onClick={() => handleRemove(field.id)}
                          className='text-lg font-bold border-2 border-red-500 text-red-500 hover:text-red-500 hover:bg-red-500/20'
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
                        <div className='flex items-end gap-1 mt-8'>
                          <span className='text-sm font-medium'>
                            この時間帯は
                          </span>
                          <Input
                            type='number'
                            className='w-14 p-0 text-base rounded-sm text-center shadow-none'
                            {...field}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val ? Number(val) : '');
                            }}
                          />
                          <span className='text-sm font-medium'>
                            人の予約を受け付ける
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
        <div className='flex justify-end gap-2 mt-4 '>
          <Button variant='outline' onClick={onClose}>
            キャンセル
          </Button>
          <Button
            variant='outline'
            onClick={handleSave}
            disabled={!modal.formState.isValid}
            className='border-2 border-green-300 text-green-300 hover:text-white hover:bg-green-300'
          >
            保存
          </Button>
        </div>
      </div>
    </Modal>
  );
};
