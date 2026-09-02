import React from 'react';
import { prisma } from '@/lib/prisma';
import MainView from '@/components/MainView';

// キャッシュを無効化し、常に最新の登録状況を取得するように設定
export const revalidate = 0;

export default async function Home() {
  // 現在の参加確定人数をサーバーサイドで取得
  let confirmedCount = 0;
  try {
    confirmedCount = await prisma.registration.count({
      where: { status: 'CONFIRMED' },
    });
  } catch (error) {
    console.error('Failed to get confirmed count on server side:', error);
  }

  return <MainView initialConfirmedCount={confirmedCount} />;
}
