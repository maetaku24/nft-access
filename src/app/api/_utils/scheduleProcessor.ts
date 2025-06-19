import type { GeneratedTimeSlot } from '@/app/_types/reservation/timeSlot';
import type {
  EventScheduleList,
  ReservationListForSchedule,
  Schedule,
} from '@/app/_types/schedule/scheduleTypes';
import { generateTimeSlotsForDate } from '@/app/api/_utils/timeSlotGenerator';
import { getJapaneseWeekday } from '@/app/api/_utils/weekdayHelper';
import { dayjs } from '@/utils/dayjs';

export const processEventSchedules = (
  eventSchedules: EventScheduleList,
  eventLength: number,
  reservations: ReservationListForSchedule,
  days: number = 30
): GeneratedTimeSlot[] => {
  const today = dayjs().startOf('day');

  // 特定日付スケジュールを抽出
  const specificDates = getSpecificDates(eventSchedules, today);

  // 各スケジュールをタイプ別に処理してflatMapで統合
  return eventSchedules.flatMap(({ schedule }) => {
    if (schedule.date !== null) {
      // 特定日付のスケジュール（例: 2024-06-20）
      return createSpecificDateSlots(
        schedule,
        today,
        eventLength,
        reservations
      );
    } else if (schedule.weekday) {
      // 曜日繰り返しスケジュール（例: 毎週月曜日）
      return createRecurringSlots(
        schedule,
        today,
        eventLength,
        reservations,
        specificDates,
        days
      );
    }
    return [];
  });
};

// 特定日付のスケジュールから日付セットを取得
const getSpecificDates = (
  eventSchedules: EventScheduleList,
  today: dayjs.Dayjs
): Set<string> => {
  const dates = new Set<string>();

  eventSchedules.forEach(({ schedule }) => {
    if (schedule.date) {
      const scheduleDate = dayjs(schedule.date).startOf('day');
      if (!scheduleDate.isBefore(today)) {
        dates.add(scheduleDate.format('YYYY-MM-DD'));
      }
    }
  });

  return dates;
};

// 特定日付のタイムスロットを作成
const createSpecificDateSlots = (
  schedule: Schedule,
  today: dayjs.Dayjs,
  eventLength: number,
  reservations: ReservationListForSchedule
): GeneratedTimeSlot[] => {
  // 日付が設定されていない場合はスキップ
  if (!schedule.date) {
    return [];
  }

  const scheduleDate = dayjs(schedule.date).startOf('day');

  // 過去の日付はスキップ
  if (scheduleDate.isBefore(today)) {
    return [];
  }

  // タイムスロット生成
  const dateStr = scheduleDate.format('YYYY-MM-DD');
  return generateTimeSlotsForDate(schedule, dateStr, eventLength, reservations);
};

// 曜日繰り返しのタイムスロットを作成
const createRecurringSlots = (
  schedule: Schedule,
  today: dayjs.Dayjs,
  eventLength: number,
  reservations: ReservationListForSchedule,
  specificDates: Set<string>,
  days: number
): GeneratedTimeSlot[] => {
  // 指定日数分の日付配列を生成
  const dateRange = Array.from({ length: days }, (_, i) => today.add(i, 'day'));

  // 条件に合う日付のみフィルタリングしてスロット生成
  return dateRange
    .filter((currentDate) => {
      const dateStr = currentDate.format('YYYY-MM-DD');
      return (
        !specificDates.has(dateStr) &&
        isWeekdayMatch(schedule.weekday, currentDate)
      );
    })
    .flatMap((currentDate) => {
      const dateStr = currentDate.format('YYYY-MM-DD');
      return generateTimeSlotsForDate(
        schedule,
        dateStr,
        eventLength,
        reservations
      );
    });
};

// 曜日が一致するかチェック
const isWeekdayMatch = (
  scheduleWeekday: string,
  currentDate: dayjs.Dayjs
): boolean => {
  // 各形式で曜日を取得
  const currentWeekday = getJapaneseWeekday(currentDate.day());
  const currentWeekdayShort = currentDate.format('ddd');
  const currentWeekdayEn = currentDate.format('dddd');

  // いずれかの形式で一致すればOK
  return (
    scheduleWeekday === currentWeekday ||
    scheduleWeekday === currentWeekdayShort ||
    scheduleWeekday === currentWeekdayEn
  );
};
