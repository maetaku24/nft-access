// 曜日リスト
export const WEEKDAYS = [
  '日曜日',
  '月曜日',
  '火曜日',
  '水曜日',
  '木曜日',
  '金曜日',
  '土曜日',
] as const;

// 曜日リストのユニオン型
export type WeekDay = (typeof WEEKDAYS)[number];