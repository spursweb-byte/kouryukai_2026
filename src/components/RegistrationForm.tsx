'use client';

import React, { useState } from 'react';
import styles from '../app/page.module.css';

interface RegistrationFormProps {
  initialConfirmedCount: number;
  onBackToLp?: () => void;
}

export default function RegistrationForm({ initialConfirmedCount, onBackToLp }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    salesName: '',
    email: '',
    phoneNumber: '',
    deliveryEmail: '',
    employeeCount: '',
    businessContent: '',
    purpose: '',
  });

  // 同意チェックボックス
  const [agreements, setAgreements] = useState({
    purposeConsent: false,
    cardsConsent: false,
    cancelConsent: false,
    privacyConsent: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    entryNo: string;
    status: string;
    companyName: string;
    salesName: string;
  } | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const capacity = 65;
  const isCurrentlyFull = initialConfirmedCount >= capacity;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setAgreements((prev) => ({ ...prev, [name]: checked }));
  };

  const executeSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || 'お申し込みに失敗しました。');
        throw new Error(result.error || 'お申し込みに失敗しました。');
      }

      setSubmittedData(result.data);
    } catch (err: any) {
      setError(err.message || '通信エラーが発生しました。ネットワーク接続を確認してください。');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // バリデーション
    if (!formData.companyName || !formData.salesName || !formData.email || !formData.phoneNumber || !formData.employeeCount || !formData.businessContent) {
      setError('必須項目が入力されていません。');
      setLoading(false);
      return;
    }

    if (!agreements.purposeConsent || !agreements.cardsConsent || !agreements.cancelConsent || !agreements.privacyConsent) {
      setError('全ての確認事項（チェックボックス）への同意が必要です。');
      setLoading(false);
      return;
    }

    // 配信受信アドレスが未入力の場合の確認ポップアップ（カスタムモーダル）
    if (!formData.deliveryEmail.trim()) {
      setShowConfirmModal(true);
      return;
    }

    await executeSubmit();
  };

  // 1. 送信完了画面
  if (submittedData) {
    const isConfirmed = submittedData.status === 'CONFIRMED';
    return (
      <div className={`${styles.formPageWrapper} animate-fade-in`}>
        <div className={styles.formCard} style={{ textAlign: 'center', padding: '48px 32px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
            {isConfirmed ? '🎉' : '⏳'}
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px' }} className="text-gradient">
            {isConfirmed ? 'お申し込みが完了しました！' : 'キャンセル待ちとして受付しました'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '0.95rem' }}>
            ご入力いただいたメールアドレス（{formData.email}）宛てに、<br />
            受付完了メールを自動送信いたしました。メールボックスをご確認ください。
          </p>

          <div style={{ 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid var(--card-border)', 
            borderRadius: 'var(--border-radius-sm)',
            padding: '24px',
            marginBottom: '35px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>エントリーNo.</span>
              <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#38bdf8' }}>{submittedData.entryNo}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>ステータス</span>
              <span style={{ 
                fontWeight: 700, 
                color: isConfirmed ? 'var(--success)' : 'var(--warning)',
                background: isConfirmed ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                padding: '2px 10px',
                borderRadius: '12px',
                fontSize: '0.85rem'
              }}>
                {isConfirmed ? '参加確定' : 'キャンセル待ち'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>会社名</span>
              <span style={{ fontWeight: 600 }}>{submittedData.companyName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>来場担当者名</span>
              <span style={{ fontWeight: 600 }}>{submittedData.salesName} 様</span>
            </div>
          </div>

          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '30px' }}>
            <h4>💡 当日の受付について</h4>
            <p style={{ marginTop: '6px' }}>
              会場受付にて、こちらの画面の「エントリーNo.」をご提示いただくか、<br />
              自動送信メールをご提示ください。名刺は60枚程度お持ちください。
            </p>
          </div>

          <button 
            onClick={() => {
              if (onBackToLp) {
                onBackToLp();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                window.location.reload();
              }
            }} 
            className={styles.submitBtnGradient}
            style={{ width: 'auto', padding: '14px 36px', display: 'inline-block' }}
          >
            トップページへ戻る
          </button>
        </div>
      </div>
    );
  }

  // 2. 入力フォーム画面
  return (
    <div className={`${styles.formPageWrapper} animate-fade-in`}>
      {onBackToLp && (
        <button onClick={onBackToLp} className={styles.backBtn}>
          <span>‹</span> イベント概要に戻る
        </button>
      )}

      <div className={styles.formHeader}>
        <h2 className={`${styles.formHeaderTitle} text-gradient`}>エントリーフォーム</h2>
        <p className={styles.formHeaderSub}>
          以下のフォームにご入力の上、送信してください。<br />
          内容を確認後、参加確定のご連絡をいたします。
        </p>
      </div>

      {isCurrentlyFull && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#fde047',
          padding: '14px 18px',
          borderRadius: 'var(--border-radius-sm)',
          fontSize: '0.88rem',
          marginBottom: '28px',
          lineHeight: 1.5
        }}>
          ⚠️ 現在、定員の65名に達しているため、今からのご応募は<strong>「キャンセル待ち」</strong>としての受付となります。
        </div>
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* セクション1: 参加者情報 */}
        <div className={styles.formCard}>
          <h3 className={styles.formSectionTitle}>参加者情報</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="salesName" className={styles.formLabel}>
              お名前 <span className={styles.requiredTag}>*</span>
            </label>
            <input
              type="text"
              id="salesName"
              name="salesName"
              className={styles.input}
              placeholder="例) 山田 太郎"
              required
              value={formData.salesName}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="companyName" className={styles.formLabel}>
              会社名 <span className={styles.requiredTag}>*</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              className={styles.input}
              placeholder="例) Spurs株式会社"
              required
              value={formData.companyName}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>
              メールアドレス <span className={styles.requiredTag}>*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              placeholder="例) yamada@spurs-inc.com"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phoneNumber" className={styles.formLabel}>
              電話番号 <span className={styles.requiredTag}>*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              className={styles.input}
              placeholder="例) 090-1234-5678"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup} style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <label htmlFor="deliveryEmail" className={styles.formLabel} style={{ marginBottom: 0 }}>
                配信受信アドレス
              </label>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                主催企業からの配信メールお受取先を入力してください。
              </span>
            </div>
            <input
              type="email"
              id="deliveryEmail"
              name="deliveryEmail"
              className={styles.input}
              placeholder="例) delivery@spurs-inc.com"
              value={formData.deliveryEmail}
              onChange={handleChange}
              disabled={loading}
            />
            <div style={{ textAlign: 'right', marginTop: '6px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--spurs-blue)', fontWeight: 700 }}>
                こちらをご入力いただいた参加者様には、会終了後参加者リストを無料配布！
              </span>
            </div>
          </div>
        </div>

        {/* セクション2: SES企業について */}
        <div className={styles.formCard}>
          <h3 className={styles.formSectionTitle}>SES企業について</h3>

          <div className={styles.formGroup}>
            <label htmlFor="employeeCount" className={styles.formLabel}>
              従業員数 <span className={styles.requiredTag}>*</span>
            </label>
            <select
              id="employeeCount"
              name="employeeCount"
              className={styles.select}
              required
              value={formData.employeeCount}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">選択してください</option>
              <option value="1〜10名">1〜10名</option>
              <option value="11〜30名">11〜30名</option>
              <option value="31〜50名">31〜50名</option>
              <option value="51〜100名">51〜100名</option>
              <option value="101名以上">101名以上</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="businessContent" className={styles.formLabel}>
              保有情報 <span className={styles.requiredTag}>*</span>
            </label>
            <select
              id="businessContent"
              name="businessContent"
              className={styles.select}
              required
              value={formData.businessContent}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">選択してください</option>
              <option value="案件保有">案件保有</option>
              <option value="要員保有">要員保有</option>
              <option value="両方">両方</option>
            </select>
          </div>

          <div className={styles.formGroup} style={{ marginBottom: 0 }}>
            <label htmlFor="purpose" className={styles.formLabel}>
              参加の目的・期待すること
            </label>
            <textarea
              id="purpose"
              name="purpose"
              className={styles.textarea}
              placeholder="ご自由にご記入ください"
              value={formData.purpose}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        {/* セクション3: ご確認事項 */}
        <div className={styles.formCard}>
          <h3 className={styles.formSectionTitle}>ご確認ください</h3>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxItem}>
              <input
                type="checkbox"
                name="purposeConsent"
                checked={agreements.purposeConsent}
                onChange={handleCheckboxChange}
                className={styles.checkboxInput}
                disabled={loading}
              />
              <span>
                本交流会の主旨に同意し、営業・名刺交換を目的とした参加であることを確認しました。
                <span className={styles.checkboxBadge}>必須</span>
              </span>
            </label>

            <label className={styles.checkboxItem}>
              <input
                type="checkbox"
                name="cardsConsent"
                checked={agreements.cardsConsent}
                onChange={handleCheckboxChange}
                className={styles.checkboxInput}
                disabled={loading}
              />
              <span>
                当日は名刺を60枚以上ご持参します。
                <span className={styles.checkboxBadge}>必須</span>
              </span>
            </label>

            <label className={styles.checkboxItem}>
              <input
                type="checkbox"
                name="cancelConsent"
                checked={agreements.cancelConsent}
                onChange={handleCheckboxChange}
                className={styles.checkboxInput}
                disabled={loading}
              />
              <span>
                キャンセルする場合は、必ず事前に連絡します。
                <span className={styles.checkboxBadge}>必須</span>
              </span>
            </label>

            <label className={styles.checkboxItem}>
              <input
                type="checkbox"
                name="privacyConsent"
                checked={agreements.privacyConsent}
                onChange={handleCheckboxChange}
                className={styles.checkboxInput}
                disabled={loading}
              />
              <span>
                プライバシーポリシーに同意します。
                <span className={styles.checkboxBadge}>必須</span>
              </span>
            </label>
          </div>
        </div>

        <button type="submit" className={styles.submitBtnGradient} disabled={loading}>
          {loading ? (
            '送信中...'
          ) : isCurrentlyFull ? (
            'キャンセル待ちでエントリーする'
          ) : (
            'エントリーを送信する'
          )}
        </button>

        <p className={styles.formFooterNote}>
          ※ 送信完了後、自動返信メールが届きます。<br />
          届かない場合は迷惑メールをご確認ください。
        </p>
      </form>

      {/* カスタム確認モーダル */}
      {showConfirmModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h4 className={styles.modalTitle}>【確認】配信受信アドレスの未入力</h4>
            <div className={styles.modalBody}>
              <p>配信受信アドレスが入力されていません。</p>
              <p style={{ marginTop: '10px' }}>このままだと、主催企業からの今後の案件・要員情報の配信が行えず、<strong>機会ロスとなってしまう可能性</strong>があります。</p>
              <p style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>※よろしければ「入力に戻る」を押して配信アドレスをご入力ください。</p>
            </div>
            <div className={styles.modalActions}>
              <button 
                type="button" 
                className={styles.modalBtnCancel} 
                onClick={() => {
                  setShowConfirmModal(false);
                  setLoading(false);
                  document.getElementById('deliveryEmail')?.focus();
                }}
              >
                入力に戻る
              </button>
              <button 
                type="button" 
                className={styles.modalBtnConfirm}
                onClick={async () => {
                  setShowConfirmModal(false);
                  await executeSubmit();
                }}
              >
                このままエントリーする
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
