'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../app/page.module.css';
import RegistrationForm from './RegistrationForm';

interface MainViewProps {
  initialConfirmedCount: number;
}

export default function MainView({ initialConfirmedCount }: MainViewProps) {
  const [view, setView] = useState<'lp' | 'form'>('lp');

  const scrollToSection = (id: string) => {
    if (view === 'form') {
      setView('lp');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openForm = () => {
    setView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToLp = () => {
    setView('lp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.pageWrapper}>
      {/* 幾何学的背景ポリゴン装飾（ドット除去済み） */}
      <div className={styles.polyBadgeLeft} />
      <div className={styles.polyTriangleRight1} />
      <div className={styles.polyTriangleRight2} />
      <div className={styles.polyTriangleLeft} />

      {/* 固定ヘッダーナビゲーション */}
      <header className={styles.navHeader}>
        <div className={styles.navContainer}>

          <div className={styles.headerLogoText} onClick={backToLp} role="button" tabIndex={0}>
            交流会エントリーサイト
          </div>

          {view === 'form' && (
            <button onClick={backToLp} className={styles.navLink} style={{ fontWeight: 600 }}>
              ‹ イベント概要に戻る
            </button>
          )}

          <button onClick={openForm} className={styles.navCtaBtn}>
            エントリーする
          </button>
        </div>
      </header>

      <main className={styles.mainContent}>
        {view === 'lp' ? (
          <div className="animate-fade-in">
            {/* ヒーローセクション */}
            <section id="about" className={styles.heroSection}>
              <div className={styles.heroLeft}>
                <span className={styles.badge}>第6回</span>
                <h1 className={`${styles.heroTitle} text-gradient`}>
                  完全無料 SES交流会
                </h1>
                <p className={styles.heroOrganizer}>
                  共同主催：㈱Purgatoria / Spurs㈱
                </p>
                <p className={styles.heroSubtitle}>
                  2026年12月14日（月）13:00スタート ※開場12:45
                </p>
                <p className={styles.heroLead}>
                  SES業界に携わる営業担当者が集い、情報交換や人脈形成を通じて<br />
                  新たなビジネスチャンスを生み出す交流会です。
                </p>

                <div className={styles.pointsList}>
                  <div className={styles.pointItem}>
                    <div className={styles.pointIcon}>📍</div>
                    <div className={styles.pointText}>
                      <h4>幸和ビル 3階</h4>
                      <p>渋谷駅徒歩約3分</p>
                    </div>
                  </div>
                  <div className={styles.pointItem}>
                    <div className={styles.pointIcon}>👥</div>
                    <div className={styles.pointText}>
                      <h4>募集人数：80名 ※先着順</h4>
                      <p style={{ color: 'var(--danger)', fontWeight: 600 }}>各社原則1名までとなります。</p>
                    </div>
                  </div>
                  <div className={styles.pointItem}>
                    <div className={styles.pointIcon}>🎫</div>
                    <div className={styles.pointText}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                        参加費：無料
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右側 会社ロゴ2つ直接表示（カード枠なし・HPリンク付き） */}
              <div className={styles.directLogoContainer}>
                <a 
                  href="https://purga-toria.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.directLogoWrapper}
                  title="株式会社PURGATORIA 公式サイトを開く"
                >
                  <Image 
                    src="/logo1.png" 
                    alt="株式会社PURGATORIA ロゴ" 
                    width={340} 
                    height={170} 
                    className={styles.directLogoImageLarge}
                    priority
                  />
                </a>

                <a 
                  href="https://spurs-inc.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.directLogoWrapper}
                  title="Spurs株式会社 公式サイトを開く"
                >
                  <Image 
                    src="/logo2.png" 
                    alt="Spurs株式会社 ロゴ" 
                    width={220} 
                    height={110} 
                    className={styles.directLogoImage}
                    priority
                  />
                </a>
              </div>
            </section>

            {/* このような方におすすめ (対象者) */}
            <section id="target" className={styles.sectionBlock}>
              <h3 className={styles.sectionHeading}>このような方におすすめ</h3>
              <div className={styles.targetGrid}>
                <div className={styles.targetCard}>
                  <p className={styles.targetText}>
                    新しいビジネスパートナーを<br />探している方
                  </p>
                </div>
                <div className={styles.targetCard}>
                  <p className={styles.targetText}>
                    他社の営業事例や取り組みを<br />知りたい方
                  </p>
                </div>
                <div className={styles.targetCard}>
                  <p className={styles.targetText}>
                    SES業界の最新トレンドを<br />把握したい方
                  </p>
                </div>
              </div>
            </section>

            {/* プログラム */}
            <section id="program" className={styles.sectionBlock}>
              <h3 className={styles.sectionHeading}>プログラム</h3>
              <div className={styles.programGrid}>
                {/* 左側 タイムライン */}
                <div className={styles.timeline}>
                  <div className={styles.timelineItem}>
                    <span className={styles.timelineDot} />
                    <span className={styles.timelineTime}>12:45 ～</span>
                    <div>
                      <span className={styles.timelineTitle}>受付開始 / 開場</span>
                      <p className={styles.timelineNote}>※受付開始時間前のご来場はご遠慮ください。</p>
                    </div>
                  </div>

                  <div className={styles.timelineItem}>
                    <span className={styles.timelineDot} />
                    <span className={styles.timelineTime}>13:00 ～</span>
                    <div>
                      <span className={styles.timelineTitle}>開会挨拶 / ㈱PURGATORIA , Spurs㈱</span>
                    </div>
                  </div>

                  <div className={styles.timelineItem}>
                    <span className={styles.timelineDot} />
                    <span className={styles.timelineTime}>13:05 ～</span>
                    <div>
                      <span className={styles.timelineTitle}>名刺交換・フリー交流スタート</span>
                    </div>
                  </div>

                  <div className={styles.timelineItem}>
                    <span className={styles.timelineDot} />
                    <span className={styles.timelineTime}>～ 14:45</span>
                    <div>
                      <span className={styles.timelineTitle}>交流終了</span>
                    </div>
                  </div>
                </div>

                {/* 右側 会場内注意事項（枠なし・統一禁止標識アイコン） */}
                <div className={styles.venueNoticeContainer}>
                  <div className={styles.venueNoticeItem}>
                    <div className={styles.signIcon}>
                      <span className={styles.signEmoji}>🚬</span>
                    </div>
                    <div className={styles.venueNoticeText}>
                      <h5>館内・会場内完全禁煙</h5>
                    </div>
                  </div>

                  <div className={styles.venueNoticeItem}>
                    <div className={styles.signIcon}>
                      <span className={styles.signEmoji}>📱</span>
                    </div>
                    <div className={styles.venueNoticeText}>
                      <h5>会場内、および3階フロアでの通話禁止</h5>
                    </div>
                  </div>

                  <div className={styles.venueNoticeItem}>
                    <div className={styles.signIcon}>
                      <span className={styles.signEmoji}>🍱</span>
                    </div>
                    <div className={styles.venueNoticeText}>
                      <h5>食事禁止</h5>
                    </div>
                  </div>

                  <div className={styles.venueNoticeItem}>
                    <div className={styles.signIcon}>
                      <span className={styles.signEmoji}>🗣️</span>
                    </div>
                    <div className={styles.venueNoticeText}>
                      <h5>建物内を移動する際は大きな声を出さないでください</h5>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* アクセス */}
            <section id="access" className={styles.sectionBlock}>
              <h3 className={styles.sectionHeading}>アクセス</h3>
              <div className={styles.accessGrid}>
                <div className={styles.mapBox}>
                  <iframe 
                    src="https://maps.google.com/maps?q=%E6%9D%B1%E4%BA%AC%E9%83%BD%E6%B8%8B%E8%B0%B7%E5%8C%BA%E6%B8%8B%E8%B0%B72-22-6%20%E5%B9%B8%E5%92%8C%E3%83%93%E3%83%AB&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div className={styles.accessInfo}>
                  <h4>幸和ビル 3階</h4>
                  <p className={styles.accessAddress}>
                    〒150-0002<br />
                    東京都渋谷区渋谷2-22-6 幸和ビル3階
                  </p>
                  <div className={styles.accessStationList}>
                    <div className={styles.accessStationItem}>
                      <span>🚆</span> 渋谷駅（ヒカリエ改札方面） 徒歩約3分
                    </div>
                  </div>

                  <a 
                    href="https://maps.google.com/?q=東京都渋谷区渋谷2-22-6+幸和ビル" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.googleMapBtn}
                  >
                    Googleマップで見る ↗
                  </a>
                </div>
              </div>
            </section>

            {/* ボトムCTA */}
            <section className={styles.bottomCtaBanner}>
              <p className={styles.bottomCtaSubtitle}>完全無料 SES交流会に参加する</p>
              <h2 className={styles.bottomCtaTitle}>今すぐエントリーする</h2>
              <p className={styles.bottomCtaNote}>80名限定・先着順でのご案内となります</p>
              <button onClick={openForm} className={styles.bottomCtaBtn}>
                エントリーフォームを開く ➔
              </button>
            </section>
          </div>
        ) : (
          /* エントリーフォーム画面 */
          <RegistrationForm 
            initialConfirmedCount={initialConfirmedCount} 
            onBackToLp={backToLp}
          />
        )}
      </main>

      {/* 1/3スリムサイズの無限ロゴスクロールフッター */}
      <footer className={styles.footer}>
        {/* 無限ロゴスクロール */}
        <div className={styles.logoTickerWrapper}>
          <div className={styles.logoTickerTrack}>
            {[...Array(8)].map((_, i) => (
              <React.Fragment key={i}>
                <a 
                  href="https://purga-toria.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.tickerLogoItem}
                  title="株式会社PURGATORIA 公式サイトを開く"
                >
                  <Image src="/logo1.png" alt="株式会社PURGATORIA ロゴ" width={140} height={38} className={styles.tickerLogoImg} />
                </a>
                <a 
                  href="https://spurs-inc.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.tickerLogoItem}
                  title="Spurs株式会社 公式サイトを開く"
                >
                  <Image src="/logo2.png" alt="Spurs株式会社 ロゴ" width={140} height={38} className={styles.tickerLogoImg} />
                </a>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* コンパクトなフッターボトムバー */}
        <div className={styles.footerBottomContainer}>
          <p>© Spurs Inc. All Rights Reserved.</p>
          <div className={styles.footerLinks}>
            <a href="https://spurs-inc.com/" target="_blank" rel="noopener noreferrer">
              プライバシーポリシー ↗
            </a>
            <a href="/admin" className={styles.adminLink}>
              管理者ログイン
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
