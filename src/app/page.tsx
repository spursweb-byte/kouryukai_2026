import React from 'react';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import RegistrationForm from '@/components/RegistrationForm';

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

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoWrapper}>
          <a href="https://spurs-inc.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block' }}>
            <Image 
              src="/logo.png" 
              alt="Spurs Logo" 
              width={180} 
              height={55} 
              className={styles.logo}
              priority
            />
          </a>
        </div>
        <h1 className={`${styles.title} text-gradient`}>
          SES営業 交流会
        </h1>
        <p className={styles.subtitle}>
          〜 ビジネスを加速させる名刺交換会 〜
        </p>
      </header>

      {/* 開催概要カード */}
      <section className={`${styles.infoCard} animate-fade-in`}>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>日時</span>
            <span className={styles.infoValue}>
              2026年7月27日 (月)<br />
              13:30 〜 14:45<br />
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                (13:15 開場・受付開始)
              </span>
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>会場</span>
            <span className={styles.infoValue}>
              幸和ビル 4階<br />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                〒150-0002<br />東京都渋谷区渋谷2-22-6
              </span>
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>費用・定員</span>
            <span className={styles.infoValue}>
              無料 / 65名限定<br />
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--spurs-green)' }}>
                (66名以降はキャンセル待ち)
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Spurs株式会社 PRセクション */}
      <section className={`${styles.prSection} animate-fade-in`} style={{ animationDelay: '0.1s' }}>
        <span className={styles.prBadge}>主催企業 PR</span>
        <div className={styles.prContent}>
          <h3 className="text-gradient-spurs">Spurs株式会社について</h3>
          <p className={styles.prText}>
            Spurs（スパーズ）株式会社は、システム開発やSES事業、スタートアップの新規事業立ち上げ支援などを行うITプロフェッショナル集団です。
            確かな技術力と柔軟な機動力を活かし、お客様のビジネスに寄り添って課題を解決します。
            今回の交流会では、SES業界に関わる皆様が横の繋がりを深め、ビジネス機会を創出できる場をご提供いたします。
          </p>
          <a 
            href="https://spurs-inc.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.prLink}
          >
            Spurs株式会社 公式サイトへ
            <span style={{ fontSize: '0.8rem' }}>↗</span>
          </a>
        </div>
      </section>

      {/* ルール・注意事項セクション */}
      <section className={`${styles.rulesSection} animate-fade-in`} style={{ animationDelay: '0.2s' }}>
        <h3 className={styles.sectionTitle}>
          <span>⚠️</span> 会当日の注意事項・ルール
        </h3>
        <ul className={styles.rulesList}>
          <li className={styles.ruleItem}>
            <span className={styles.ruleIcon}>📇</span>
            <div className={styles.ruleText}>
              <h4>名刺のご持参について</h4>
              <p>名刺は60枚程度ご持参ください。受付時に1枚ご提出いただきます。</p>
            </div>
          </li>
          <li className={styles.ruleItem}>
            <span className={styles.ruleIcon}>🚫</span>
            <div className={styles.ruleText}>
              <h4>禁止事項について</h4>
              <p>強引な他社要員の引き抜き、他業界の営業・勧誘行為（マルチ商法、保険、宗教等）は固く禁止いたします。</p>
            </div>
          </li>
          <li className={styles.ruleItem}>
            <span className={styles.ruleIcon}>⏰</span>
            <div className={styles.ruleText}>
              <h4>遅刻・キャンセルについて</h4>
              <p>キャンセルされる場合はお早めにご連絡ください。遅れる場合は運営事務局まで本メールへの返信、または support@spurs-inc.com までご一報をお願いいたします。<strong>無料開催の為、無断キャンセルされた企業については次回以降ご来場をお断りさせていただきます。</strong></p>
            </div>
          </li>
        </ul>
      </section>

      {/* フォーム入力部 */}
      <section style={{ animationDelay: '0.3s' }} className="animate-fade-in">
        <RegistrationForm initialConfirmedCount={confirmedCount} />
      </section>

      <footer style={{ marginTop: '50px', paddingBottom: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        <p>© 2026 Spurs Inc. All rights reserved.</p>
        <a href="/admin" style={{ color: 'rgba(255,255,255,0.15)', textDecoration: 'none', fontSize: '0.75rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-muted)'} onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.15)'}>
          管理者ログイン
        </a>
      </footer>
    </main>
  );
}
