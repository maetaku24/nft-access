import { NextResponse } from 'next/server';

// errorで渡ってくる型がわからないのでunknown型
export const handleError = async (error: unknown) => {
  if (error instanceof Error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
  return NextResponse.json(
    { status: 'エラー', message: '不明なエラーが発生しました' },
    { status: 500 }
  );
};
