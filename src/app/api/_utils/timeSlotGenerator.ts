import type {
  ScheduleConfig,
  ReservationData,
  GeneratedTimeSlot,
} from '@/app/_types/reservation/timeSlot';
import { dayjs } from '@/utils/dayjs';

export const generateTimeSlotsForDate = (
  schedule: ScheduleConfig,
  dateStr: string,
  slotDuration: number,
  reservations: ReservationData[]
): GeneratedTimeSlot[] => {
  // 開始時間と終了時間を時と分に分解してパース
  // 例: "09:30" → [9, 30]
  const [startHour, startMin] = schedule.startTime.split(':').map(Number);
  const [endHour, endMin] = schedule.endTime.split(':').map(Number);

  // 時間を分単位に変換
  // 例: 9時30分 → 9 * 60 + 30 = 570分
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  // タイムスロットの総数を計算
  // 例: 9:00-17:00（480分）を30分スロットで分割 → 480 / 30 = 16個のスロット
  const slotCount = Math.floor((endMinutes - startMinutes) / slotDuration);

  // 各タイムスロットを生成
  return Array.from({ length: slotCount }, (_, index) => {
    // 現在のスロットの開始・終了時間を分単位で計算
    // 例: index = 0 → 570分（9:00）, index = 1 → 600分（10:00）
    const slotStartMinutes = startMinutes + index * slotDuration;
    const slotEndMinutes = slotStartMinutes + slotDuration;

    // 分単位の時間を時:分形式に戻す
    // 例: 570分 → 9時30分
    const slotStartHour = Math.floor(slotStartMinutes / 60);
    const slotStartMin = slotStartMinutes % 60;
    const slotEndHour = Math.floor(slotEndMinutes / 60);
    const slotEndMin = slotEndMinutes % 60;

    // HH:mm形式の文字列に変換
    // 例: 9時30分 → "09:30"
    const slotStartTime = `${slotStartHour.toString().padStart(2, '0')}:${slotStartMin.toString().padStart(2, '0')}`;
    const slotEndTime = `${slotEndHour.toString().padStart(2, '0')}:${slotEndMin.toString().padStart(2, '0')}`;

    // この時間帯の予約済み参加者数を計算
    // 1. 同じ日付・時間帯の予約をフィルタリング
    // 2. 該当する予約の参加者数を合計
    const reservedCount = reservations
      .filter(
        (reservation) =>
          // 予約日が対象日と一致するかチェック
          dayjs(reservation.reservationDate).format('YYYY-MM-DD') === dateStr &&
          // 予約の開始時間が現在のスロットと一致するかチェック
          reservation.startTime === slotStartTime &&
          // 予約の終了時間が現在のスロットと一致するかチェック
          reservation.endTime === slotEndTime
      )
      // フィルタされた予約の参加者数を合計
      .reduce((sum, reservation) => sum + reservation.participants, 0);

    // 利用可能な参加者数を計算（最大参加者数 - 予約済み参加者数）
    // マイナスにならないよう Math.max で0以上に制限
    const availableCount = Math.max(
      0,
      schedule.maxParticipants - reservedCount
    );

    // タイムスロット情報を返す
    return {
      date: dateStr, // 日付
      startTime: slotStartTime, // 開始時間
      endTime: slotEndTime, // 終了時間
      maxParticipants: schedule.maxParticipants, // 最大参加者数
      reservedCount, // 予約済み参加者数
      availableCount, // 利用可能参加者数
      isClosed: schedule.isClosed, // 休止中フラグ
    };
  });
};
