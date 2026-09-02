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
      {/* 幾何学的背景ポリゴン＆ドットクラスタ装飾（モック画像と一致） */}
      <div className={styles.polyDotCluster} />
      <div className={styles.polyPolygon1} />
      <div className={styles.polyPolygon2} />
      <div className={styles.polyPolygon3} />

      {/* 固定ヘッダーナビゲーション */}
      <header className={styles.navHeader}>
        <div className={styles.navContainer}>
          <a href="https://spurs-inc.com/" target="_blank" rel="noopener noreferrer" className={styles.navLogoLink}>
            <Image 
              src="/logo.png" 
              alt="Spurs Logo" 
              width={140} 
              height={42} 
              className={styles.navLogo}
              priority
            />
          </a>

          {view === 'lp' ? (
            <ul className={styles.navMenu}>
              <li><button onClick={() => scrollToSection('about')} className={styles.navLink}>イベント概要</button></li>
              <li><button onClick={() => scrollToSection('overview')} className={styles.navLink}>開催概要</button></li>
              <li><button onClick={() => scrollToSection('target')} className={styles.navLink}>対象者</button></li>
              <li><button onClick={() => scrollToSection('program')} className={styles.navLink}>プログラム</button></li>
              <li><button onClick={() => scrollToSection('access')} className={styles.navLink}>アクセス</button></li>
            </ul>
          ) : (
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
                <span className={styles.badge}>SES企業限定</span>
                <h1 className={`${styles.heroTitle} text-gradient`}>
                  SES営業交流会
                </h1>
                <p className={styles.heroSubtitle}>
                  ～ビジネスを加速させる名刺交換会～
                </p>
                <p className={styles.heroLead}>
                  SES業界に携わる営業担当者が集い、情報交換や人脈形成を通じて<br />
                  新たなビジネスチャンスを生み出す交流会です。
                </p>

                <div className={styles.pointsList}>
                  <div className={styles.pointItem}>
                    <div className={styles.pointIcon}>👥</div>
                    <div className={styles.pointText}>
                      <h4>66名限定</h4>
                      <p>質の高い交流を実現する少数制</p>
                    </div>
                  </div>
                  <div className={styles.pointItem}>
                    <div className={styles.pointIcon}>🤝</div>
                    <div className={styles.pointText}>
                      <h4>ビジネス機会の創出</h4>
                      <p>新たなパートナーシップやビジネスチャンスを見つける</p>
                    </div>
                  </div>
                  <div className={styles.pointItem}>
                    <div className={styles.pointIcon}>📈</div>
                    <div className={styles.pointText}>
                      <h4>業界トレンドの共有</h4>
                      <p>最新の業界動向や成功事例を共有</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右側 開催概要イベントカード */}
              <div id="overview" className={styles.eventCard}>
                <div className={styles.eventInfoGrid}>
                  <div className={styles.eventInfoRow}>
                    <span className={styles.eventIcon}>📅</span>
                    <div className={styles.eventDetail}>
                      <h5>日時</h5>
                      <p>2026年7月27日 (月)</p>
                      <p style={{ fontSize: '1.2rem', fontWeight: 800 }}>13:30〜14:45</p>
                      <span className={styles.subText}>(13:15 開場・受付開始)</span>
                    </div>
                  </div>

                  <div className={styles.eventInfoRow}>
                    <span className={styles.eventIcon}>📍</span>
                    <div className={styles.eventDetail}>
                      <h5>会場</h5>
                      <p>幸和ビル 4階</p>
                      <span className={styles.subText}>〒150-0002 東京都渋谷区渋谷2-22-6</span>
                    </div>
                  </div>

                  <div className={styles.eventInfoRow}>
                    <span className={styles.eventIcon}>🎫</span>
                    <div className={styles.eventDetail}>
                      <h5>費用 / 定員</h5>
                      <p>無料 / 66名限定</p>
                      <span className={styles.subText} style={{ color: 'var(--spurs-green)', fontWeight: 600 }}>
                        ({66 - initialConfirmedCount > 0 ? `残り ${66 - initialConfirmedCount} 席` : '66名以降はキャンセル待ち'})
                      </span>
                    </div>
                  </div>
                </div>

                <button onClick={openForm} className={styles.heroFormBtn}>
                  エントリーする
                </button>
                <p className={styles.deadlineNote}>
                  エントリー締切：2026年7月24日 (金) 18:00
                </p>
              </div>
            </section>

            {/* このような方におすすめ (対象者) */}
            <section id="target" className={styles.sectionBlock}>
              <h3 className={styles.sectionHeading}>このような方におすすめ</h3>
              <div className={styles.targetGrid}>
                <div className={styles.targetCard}>
                  <span className={styles.targetIcon}>👥</span>
                  <p className={styles.targetText}>
                    新しいビジネスパートナーを<br />探している方
                  </p>
                </div>
                <div className={styles.targetCard}>
                  <span className={styles.targetIcon}>🏢</span>
                  <p className={styles.targetText}>
                    他社の営業事例や取り組みを<br />知りたい方
                  </p>
                </div>
                <div className={styles.targetCard}>
                  <span className={styles.targetIcon}>📈</span>
                  <p className={styles.targetText}>
                    SES業界の最新トレンドを<br />把握したい方
                  </p>
                </div>
              </div>
            </section>

            {/* プログラム */}
            <section id="program" className={styles.sectionBlock}>
              <h3 className={styles.sectionHeading}>プログラム</h3>
              <div className={styles.timeline}>
                <div className={styles.timelineItem}>
                  <span className={styles.timelineTime}>13:15 ～</span>
                  <span className={styles.timelineTitle}>受付開始</span>
                </div>
                <div className={styles.timelineItem}>
                  <span className={styles.timelineTime}>13:30 ～</span>
                  <span className={styles.timelineTitle}>開会挨拶・主催企業PR</span>
                </div>
                <div className={styles.timelineItem}>
                  <span className={styles.timelineTime}>13:50 ～</span>
                  <span className={styles.timelineTitle}>名刺交換・フリー交流会</span>
                </div>
                <div className={styles.timelineItem}>
                  <span className={styles.timelineTime}>14:40 ～</span>
                  <span className={styles.timelineTitle}>閉会挨拶</span>
                </div>
                <div className={styles.timelineItem}>
                  <span className={styles.timelineTime}>14:45</span>
                  <span className={styles.timelineTitle}>終了</span>
                </div>
              </div>
            </section>

            {/* アクセス */}
            <section id="access" className={styles.sectionBlock}>
              <h3 className={styles.sectionHeading}>アクセス</h3>
              <div className={styles.accessGrid}>
                <div className={styles.mapBox}>
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.747975472379!2d139.70327337626356!3d35.65858047259461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b56417d4a13%3A0xb35515bfecffc977!2z44CSMTUwLTAwMDIgVG9reW8sIFNoaWJ1eWEgQ2l0eSwgU2hpYnV5YSwgMi1jaG9tZS0yMi02IOWNuOWSjOODk-ODqw!5e0!3m2!1sja!2sjp!4v1700000000000!5m2!1sja!2sjp" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div className={styles.accessInfo}>
                  <h4>幸和ビル 4階</h4>
                  <p className={styles.accessAddress}>
                    〒150-0002<br />
                    東京都渋谷区渋谷2-22-6
                  </p>
                  <div className={styles.accessStationList}>
                    <div className={styles.accessStationItem}>
                      <span>🚆</span> JR渋谷駅 徒歩約5分
                    </div>
                    <div className={styles.accessStationItem}>
                      <span>🚇</span> 地下鉄各線 渋谷駅 徒歩約3分
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
              <p className={styles.bottomCtaSubtitle}>SES営業交流会に参加する</p>
              <h2 className={styles.bottomCtaTitle}>今すぐエントリーする</h2>
              <p className={styles.bottomCtaNote}>66名限定・先着順でのご案内となります</p>
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

      {/* フッター */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerTop}>
            <div>
              <Image 
                src="/logo.png" 
                alt="Spurs Logo" 
                width={120} 
                height={36} 
                style={{ height: 'auto' }}
              />
              <p className={styles.footerDesc}>
                Spurs株式会社は、システム開発やSES事業、スタートアップの新規事業立ち上げ支援などを行うITプロフェッショナル集団です。
              </p>
            </div>

            <div className={styles.footerNav}>
              <a href="https://spurs-inc.com/" target="_blank" rel="noopener noreferrer">
                プライバシーポリシー ↗
              </a>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>© Spurs Inc. All Rights Reserved.</p>
            <a href="/admin" className={styles.adminLink}>
              管理者ログイン
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
