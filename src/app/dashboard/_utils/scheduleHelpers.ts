import dayjs from 'dayjs';

// 型・バリデーション
import type { Event } from '../_schema/eventSchema';
import { WEEKDAYS } from '@/app/_types/schedule/week';
import type { WeekDay } from '@/app/_types/schedule/week';

type Schedule = Event['schedules'][number];

// dateが存在しなければtrueを返す
export const isWeekdayTemplate = (item: Schedule) => !item.date;

// dateが存在すればtrueを返す
export const isDateSchedule = (item: Schedule) => !!item.date;

// 特定の曜日 or 特定の日付に該当するかどうかを判定
export const isTargetSchedule = (
  item: Schedule,
  weekday: WeekDay,
  date?: string
) => {
  if (date) {
    return (
      item.weekday === weekday &&
      item.date &&
      dayjs(item.date).isSame(date, 'day')
    );
  }
  return item.weekday === weekday && !item.date;
};

// 特定の曜日や日付に応じたスケジュールの「初期値」を作る
export const getInitialValue = (
  all: Schedule[],
  weekday: WeekDay,
  date?: string
): Schedule[] => {
  const dateRows = all.filter((schedule) =>
    isTargetSchedule(schedule, weekday, date)
  );
  if (dateRows.length > 0) return dateRows;

  const templates = all.filter(
    (schedule) => isTargetSchedule(schedule, weekday) && !schedule.date
  );
  return templates.map((template) => ({
    ...template,
    date: date ? dayjs(date).toDate() : undefined,
  }));
};

// 指定したidのフィールドが配列の何番目かを返す
export const getFieldIndexById = (fields: { id: string }[], id: string) =>
  fields.findIndex((f) => f.id === id);

// スケジュールを曜日テンプレートと日付スケジュールの種類ごとに並び替える
export const sortSchedules = (schedules: Schedule[]) => {
  return [...schedules].sort((a, b) => {
    if (isWeekdayTemplate(a) && isWeekdayTemplate(b)) {
      return (
        WEEKDAYS.indexOf(a.weekday as WeekDay) -
        WEEKDAYS.indexOf(b.weekday as WeekDay)
      );
    }
    if (isDateSchedule(a) && isDateSchedule(b)) {
      return dayjs(a.date).unix() - dayjs(b.date).unix();
    }
    return isWeekdayTemplate(a) ? -1 : 1;
  });
};
