/**
 * 人数選択オプションを生成するヘルパー関数
 * @param maxCount 最大人数
 * @returns 人数選択用のオプション配列
 */

interface ParticipantOption {
  value: string;
  label: string;
}

export const generateParticipantOptions = (
  maxCount: number
): ParticipantOption[] =>
  Array.from({ length: maxCount }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1}人`,
  }));
