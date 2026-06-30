'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './admin.module.css';

interface Registration {
  id: number;
  entryNo: string;
  companyName: string;
  salesName: string;
  email: string;
  deliveryEmail: string;
  resourceStatus: string;
  note: string | null;
  status: string;
  attended: boolean;
  createdAt: string;
}

interface Stats {
  totalRegistrations: number;
  attendedCount: number;
  confirmedCount: number;
  waitlistCount: number;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalRegistrations: 0,
    attendedCount: 0,
    confirmedCount: 0,
    waitlistCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // セッションストレージから以前入力したパスワードがあれば読み込む
  useEffect(() => {
    const savedPassword = sessionStorage.getItem('admin_pass');
    if (savedPassword) {
      setPassword(savedPassword);
      verifySavedPassword(savedPassword);
    }
  }, []);

  const fetchData = async (authPass: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin', {
        method: 'GET',
        headers: {
          'x-admin-password': authPass,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'データの取得に失敗しました。');
      }

      setRegistrations(result.data.registrations);
      setStats(result.data.stats);
      setIsAuthorized(true);
      sessionStorage.setItem('admin_pass', authPass);
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました。');
      setIsAuthorized(false);
      sessionStorage.removeItem('admin_pass');
    } finally {
      setLoading(false);
    }
  };

  const verifySavedPassword = (savedPass: string) => {
    fetchData(savedPass);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    fetchData(password);
  };

  // 来場確認トグル処理
  const handleToggleAttendance = async (id: number, currentAttended: boolean) => {
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({
          action: 'toggle-attendance',
          id,
          attended: !currentAttended,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      // 一覧と集計の再読み込み
      fetchData(password);
    } catch (err: any) {
      alert(`来場ステータスの更新に失敗しました: ${err.message}`);
    }
  };

  // ステータス（参加・キャンセル待ち等）更新処理
  const handleStatusChange = async (id: number, newStatus: string) => {
    if (!window.confirm(`ステータスを「${newStatus === 'CONFIRMED' ? '参加確定' : newStatus === 'WAITLIST' ? 'キャンセル待ち' : 'キャンセル'}」に変更しますか？`)) {
      // 変更をリセットするため再読み込み
      fetchData(password);
      return;
    }

    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({
          action: 'update-status',
          id,
          status: newStatus,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      fetchData(password);
    } catch (err: any) {
      alert(`ステータスの更新に失敗しました: ${err.message}`);
    }
  };

  // テストデータ一括削除処理
  const handleDeleteTestData = async () => {
    const confirmation = window.confirm(
      '⚠️ 警告 ⚠️\nすべての登録データが完全に消去されます。この操作は取り消せません。\n本当にテストデータを一括削除しますか？'
    );
    if (!confirmation) return;

    setLoading(true);
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({
          action: 'delete-test-data',
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      alert(result.message);
      fetchData(password);
    } catch (err: any) {
      alert(`データの削除に失敗しました: ${err.message}`);
      setLoading(false);
    }
  };

  // CSVダウンロード
  const downloadCSV = () => {
    if (!registrations.length) {
      alert('出力するデータがありません。');
      return;
    }

    const headers = [
      'ID', 'エントリーNo', '会社名', '営業名', 'メールアドレス', 
      '配信受信アドレス', '案件・要員保有状況', 'その他', 
      'ステータス', '来場状況', '登録日時'
    ];

    const rows = registrations.map(reg => [
      reg.id.toString(),
      reg.entryNo,
      reg.companyName,
      reg.salesName,
      reg.email,
      reg.deliveryEmail,
      reg.resourceStatus,
      reg.note || '',
      reg.status === 'CONFIRMED' ? '参加確定' : reg.status === 'WAITLIST' ? 'キャンセル待ち' : 'キャンセル',
      reg.attended ? '来場済' : '未着',
      new Date(reg.createdAt).toLocaleString('ja-JP')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Excelの文字化けを防ぐため、BOM付きUTF-8にする
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', `SES交流会_参加者一覧_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_pass');
    setIsAuthorized(false);
    setPassword('');
  };

  // 1. パスワード入力（ゲート）画面
  if (!isAuthorized) {
    return (
      <main className={styles.gateWrapper}>
        <div className={`${styles.gateCard} animate-fade-in`}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔒</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }} className="text-gradient">
            管理者ログイン
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '8px' }}>
            管理画面にアクセスするにはパスワードを入力してください。
          </p>

          {error && (
            <div style={{ 
              background: 'rgba(239,68,68,0.1)', 
              color: '#fca5a5', 
              padding: '10px', 
              borderRadius: 'var(--border-radius-sm)', 
              fontSize: '0.85rem', 
              marginTop: '15px' 
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <input
              type="password"
              className={styles.gateInput}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button 
              type="submit" 
              className={styles.btn} 
              style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, var(--spurs-blue), var(--spurs-green))', color: 'white' }}
              disabled={loading}
            >
              {loading ? '認証中...' : 'ロック解除'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // 2. 管理画面ダッシュボード
  return (
    <main className={`${styles.container} animate-fade-in`}>
      <header className={styles.header}>
        <div>
          <h1 className={`${styles.title} text-gradient`}>交流会 管理ダッシュボード</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            SES営業名刺交換会 当日受付・ステータス管理
          </p>
        </div>
        <div className={styles.controls}>
          <button onClick={downloadCSV} className={`${styles.btn} ${styles.btnPrimary}`}>
            <span>📊</span> CSV出力
          </button>
          <button onClick={handleDeleteTestData} className={`${styles.btn} ${styles.btnDanger}`}>
            <span>🗑️</span> テストデータ削除
          </button>
          <button onClick={handleLogout} className={`${styles.btn} ${styles.btnSecondary}`}>
            ログアウト
          </button>
        </div>
      </header>

      {/* ダッシュボード集計値 */}
      <section className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.blue}`}>
          <span className={styles.statLabel}>申込数（総数）</span>
          <span className={styles.statValue}>{stats.totalRegistrations} 件</span>
        </div>
        <div className={`${styles.statCard} ${styles.green}`}>
          <span className={styles.statLabel}>入場数（来場確認済）</span>
          <span className={styles.statValue}>{stats.attendedCount} 名</span>
        </div>
        <div className={`${styles.statCard} ${styles.purple}`}>
          <span className={styles.statLabel}>参加予定人数（確定枠）</span>
          <span className={styles.statValue}>{stats.confirmedCount} / 65 名</span>
        </div>
        <div className={`${styles.statCard} ${styles.yellow}`}>
          <span className={styles.statLabel}>キャンセル待ち数</span>
          <span className={styles.statValue}>{stats.waitlistCount} 名</span>
        </div>
      </section>

      {/* 参加者一覧テーブル */}
      <section className={styles.tableCard}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>エントリーユーザー一覧</h2>
          <button 
            onClick={() => fetchData(password)} 
            className={styles.btn} 
            style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.02)' }}
            disabled={loading}
          >
            🔄 一覧を更新
          </button>
        </div>

        <div className={styles.tableWrapper}>
          {registrations.length === 0 ? (
            <div className={styles.emptyState}>
              現在エントリーされているユーザーはいません。
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>No</th>
                  <th className={styles.th}>エントリーNo</th>
                  <th className={styles.th}>会社名</th>
                  <th className={styles.th}>営業名</th>
                  <th className={styles.th}>メールアドレス</th>
                  <th className={styles.th}>ステータス</th>
                  <th className={styles.th} style={{ textAlign: 'center' }}>当日の来場確認</th>
                  <th className={styles.th}>案件/要員</th>
                  <th className={styles.th}>その他備考</th>
                  <th className={styles.th}>登録日時</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id} className={styles.tr}>
                    <td className={styles.td}>{reg.id}</td>
                    <td className={styles.td} style={{ fontWeight: 700, color: 'var(--spurs-blue)' }}>{reg.entryNo}</td>
                    <td className={styles.td} style={{ fontWeight: 600 }}>{reg.companyName}</td>
                    <td className={styles.td}>{reg.salesName}</td>
                    <td className={styles.td}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>宛: {reg.email}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>配: {reg.deliveryEmail}</div>
                    </td>
                    <td className={styles.td}>
                      <select
                        className={styles.selectStatus}
                        value={reg.status}
                        onChange={(e) => handleStatusChange(reg.id, e.target.value)}
                      >
                        <option value="CONFIRMED">参加確定</option>
                        <option value="WAITLIST">キャンセル待ち</option>
                        <option value="CANCELLED">キャンセル</option>
                      </select>
                    </td>
                    <td className={styles.td} style={{ textAlign: 'center' }}>
                      <label className={styles.toggleSwitch}>
                        <input
                          type="checkbox"
                          checked={reg.attended}
                          onChange={() => handleToggleAttendance(reg.id, reg.attended)}
                          disabled={reg.status === 'CANCELLED'} // キャンセルされた人は来場トグル不可
                        />
                        <span className={styles.slider}></span>
                      </label>
                      <span style={{ 
                        marginLeft: '8px', 
                        fontSize: '0.8rem', 
                        color: reg.attended ? 'var(--success)' : 'var(--text-muted)',
                        fontWeight: 600
                      }}>
                        {reg.attended ? '来場済' : '未着'}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.badge} style={{ 
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--card-border)',
                        color: 'var(--text-secondary)'
                      }}>
                        {reg.resourceStatus}
                      </span>
                    </td>
                    <td className={styles.td} style={{ maxWidth: '200px', whiteSpace: 'normal', wordBreak: 'break-all', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {reg.note || '-'}
                    </td>
                    <td className={styles.td} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(reg.createdAt).toLocaleString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
  );
}
