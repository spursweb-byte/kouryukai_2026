'use client';

import React, { useState } from 'react';
import styles from '../app/page.module.css';

interface RegistrationFormProps {
  initialConfirmedCount: number;
}

export default function RegistrationForm({ initialConfirmedCount }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    salesName: '',
    email: '',
    deliveryEmail: '',
    resourceStatus: '',
    note: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    entryNo: string;
    status: string;
    companyName: string;
    salesName: string;
  } | null>(null);

  const capacity = 65;
  const isCurrentlyFull = initialConfirmedCount >= capacity;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // バリデーション
    if (!formData.companyName || !formData.salesName || !formData.email || !formData.deliveryEmail || !formData.resourceStatus) {
      setError('必須項目が入力されていません。');
      setLoading(false);
      return;
    }

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

  // 1. 送信完了画面
  if (submittedData) {
    const isConfirmed = submittedData.status === 'CONFIRMED';
    return (
      <div className={`${styles.formCard} animate-fade-in`} style={{ textAlign: 'center' }}>
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
            <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--spurs-blue)' }}>{submittedData.entryNo}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>ステータス</span>
            <span style={{ 
              fontWeight: 700, 
              color: isConfirmed ? 'var(--success)' : 'var(--warning)',
              background: isConfirmed ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
              padding: '2px 8px',
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
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>営業名</span>
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
          onClick={() => window.location.reload()} 
          className={styles.submitBtn}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)' }}
        >
          トップページへ戻る
        </button>
      </div>
    );
  }

  // 2. 入力フォーム画面
  return (
    <div className={`${styles.formCard} animate-fade-in`}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
        エントリーフォーム
      </h3>

      <div className={styles.capacityIndicator}>
        <span className={styles.capacityText}>現在の空き状況</span>
        <span className={`${styles.capacityStatus} ${
          isCurrentlyFull 
            ? styles.statusFull 
            : (capacity - initialConfirmedCount <= 10) 
              ? styles.statusWarning 
              : styles.statusAvailable
        }`}>
          {isCurrentlyFull 
            ? '満席（キャンセル待ち受付中）' 
            : `残席あり (残り ${capacity - initialConfirmedCount} 席)`}
        </span>
      </div>

      {isCurrentlyFull && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          color: '#fde047',
          padding: '12px 16px',
          borderRadius: 'var(--border-radius-sm)',
          fontSize: '0.85rem',
          marginBottom: '24px',
          lineHeight: 1.5
        }}>
          ⚠️ 現在、定員の65名に達しているため、今からのご応募は<strong>「キャンセル待ち」</strong>としての受付となります。
          先着順にてキャンセルが発生し次第、繰り上げのご案内をメールにてお送りいたします。
        </div>
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="companyName" className={styles.label}>
            会社名 <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            className={styles.input}
            placeholder="例: Spurs株式会社"
            required
            value={formData.companyName}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="salesName" className={styles.label}>
            営業名 <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="salesName"
            name="salesName"
            className={styles.input}
            placeholder="例: 山田 太郎"
            required
            value={formData.salesName}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            メールアドレス <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.input}
            placeholder="例: email@example.com"
            required
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="deliveryEmail" className={styles.label}>
            配信受信アドレス <span className={styles.required}>*</span>
          </label>
          <input
            type="email"
            id="deliveryEmail"
            name="deliveryEmail"
            className={styles.input}
            placeholder="例: delivery@example.com"
            required
            value={formData.deliveryEmail}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="resourceStatus" className={styles.label}>
            案件・要員保有状況 <span className={styles.required}>*</span>
          </label>
          <select
            id="resourceStatus"
            name="resourceStatus"
            className={styles.select}
            required
            value={formData.resourceStatus}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">選択してください</option>
            <option value="両方保有">両方保有</option>
            <option value="案件保有">案件保有</option>
            <option value="要員保有">要員保有</option>
            <option value="なし">なし</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="note" className={styles.label}>
            その他（アピールポイントやご質問など）
          </label>
          <textarea
            id="note"
            name="note"
            className={styles.textarea}
            placeholder="ご自由にご記入ください"
            value={formData.note}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? (
            <>
              <span style={{
                display: 'inline-block',
                width: '18px',
                height: '18px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#ffffff',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                marginRight: '8px'
              }} />
              送信中...
            </>
          ) : isCurrentlyFull ? (
            'キャンセル待ちでエントリーする'
          ) : (
            'この内容でエントリーする'
          )}
        </button>
      </form>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
