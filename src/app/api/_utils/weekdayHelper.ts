import { WEEKDAYS } from '@/app/_types/schedule/week';

/**
 * 数値インデックスから日本語曜日を取得する
 * @param dayIndex - 曜日のインデックス (0: 日曜日, 1: 月曜日, ...)
 * @returns 日本語の曜日文字列
 */
export const getJapaneseWeekday = (dayIndex: number): string => {
  return WEEKDAYS[dayIndex] || '';
};
