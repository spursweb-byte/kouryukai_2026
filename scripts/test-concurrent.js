const http = require('http');

const PORT = 3000;
const TOTAL_REQUESTS = 75;

function postRegister(index) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      companyName: `テスト株式会社_${index}`,
      salesName: `テスト営業_${index}`,
      email: `test_${index}@example.com`,
      deliveryEmail: `delivery_${index}@example.com`,
      resourceStatus: '両方保有',
      note: `同時リクエストテスト用データ_${index}`,
    });

    const options = {
      hostname: 'localhost',
      port: PORT,
      path: '/api/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(body),
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            error: body,
          });
        }
      });
    });

    req.on('error', (e) => {
      resolve({
        status: 500,
        error: e.message,
      });
    });

    req.write(data);
    req.end();
  });
}

// 管理APIを叩いてテストデータを削除する
function clearData() {
  return new Promise((resolve) => {
    const data = JSON.stringify({ action: 'delete-test-data' });
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: '/api/admin',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'x-admin-password': 'spr1232', // パスワード
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ error: body });
        }
      });
    });

    req.on('error', (e) => resolve({ error: e.message }));
    req.write(data);
    req.end();
  });
}

async function runTest() {
  console.log('🧹 テスト前にデータベースの既存データをクリアします...');
  await clearData();
  console.log('✅ クリアしました。');

  console.log(`🚀 ${TOTAL_REQUESTS} 件の同時登録リクエストを送信中...`);
  const promises = [];
  for (let i = 1; i <= TOTAL_REQUESTS; i++) {
    const delay = i * 35;
    promises.push(
      new Promise((resolve) => setTimeout(resolve, delay))
        .then(() => postRegister(i))
    );
  }

  const results = await Promise.all(promises);
  console.log('✅ すべてのレスポンスを受信しました。解析中...');

  let confirmedCount = 0;
  let waitlistCount = 0;
  let errorCount = 0;
  const entryNos = new Set();
  const duplicateEntryNos = [];

  results.forEach((res, i) => {
    if (res.status === 200 && res.data && res.data.success) {
      const { entryNo, status } = res.data.data;
      if (status === 'CONFIRMED') confirmedCount++;
      if (status === 'WAITLIST') waitlistCount++;

      if (entryNos.has(entryNo)) {
        duplicateEntryNos.push(entryNo);
      } else {
        entryNos.add(entryNo);
      }
    } else {
      errorCount++;
      console.error(`❌ エラー発生 (インデックス: ${i + 1}):`, res);
    }
  });

  console.log('\n======================================');
  console.log('📊 テスト結果サマリー');
  console.log('======================================');
  console.log(`送信したリクエスト総数 : ${TOTAL_REQUESTS}`);
  console.log(`正常レスポンス (200 OK) : ${results.filter(r => r.status === 200).length}`);
  console.log(`エラーレスポンス        : ${errorCount}`);
  console.log(`参加確定者数 (CONFIRMED): ${confirmedCount} (期待値: 65)`);
  console.log(`キャンセル待ち (WAITLIST) : ${waitlistCount} (期待値: 10)`);
  console.log(`ユニークなエントリーNo数: ${entryNos.size}`);
  console.log(`重複したエントリーNo数  : ${duplicateEntryNos.length}`);

  if (duplicateEntryNos.length > 0) {
    console.error('❌ 重複エントリーNoを発見しました！:', duplicateEntryNos);
  }

  const success = 
    confirmedCount === 65 && 
    waitlistCount === 10 && 
    duplicateEntryNos.length === 0 && 
    errorCount === 0;

  if (success) {
    console.log('\n🎉 テスト成功！同時処理とキャパシティ制限、ユニーク採番が正常に機能しています。');
  } else {
    console.error('\n❌ テスト失敗。想定と異なる挙動が発生しました。');
  }

  console.log('\n🧹 テスト後片付けのため、登録データをクリアします...');
  await clearData();
  console.log('✅ クリアしました。検証を終了します。');
}

runTest();
