/**
 * =========================================================================
 * YouTubebate版 - Google Apps Script (GAS) Backend
 * -------------------------------------------------------------------------
 * 1. Google スプレッドシート (1dily2wiik92TAyK3zyIsu8TDuyYNoF20IM1iMk_X-pg) の
 *    A1 セルから YouTube Education 専用パラメータをリアルタイム取得
 * 2. youtubeeducation.com/embed/${videoId}${param} の埋め込みプレイヤー生成
 * =========================================================================
 */

const SPREADSHEET_ID = '1dily2wiik92TAyK3zyIsu8TDuyYNoF20IM1iMk_X-pg';

/**
 * Web アプリケーションのエントリポイント
 */
function doGet(e) {
  // 1. API モード: ?action=param の場合、JSON形式で現在のパラメータを返却
  if (e && e.parameter && e.parameter.action === 'param') {
    const param = getEducationParam();
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      app: 'YouTubebate版',
      param: param,
      spreadsheetId: SPREADSHEET_ID,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }

  // 2. ダイレクト埋め込みリダイレクト: ?v=VIDEO_ID または ?videoId=VIDEO_ID
  const videoId = (e && e.parameter && (e.parameter.v || e.parameter.videoId || e.parameter.url)) || '';
  if (videoId && e.parameter.redirect === 'true') {
    const cleanId = extractVideoId(videoId);
    const param = getEducationParam();
    const embedUrl = 'https://www.youtubeeducation.com/embed/' + cleanId + param;
    return HtmlService.createHtmlOutput(
      '<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=' + embedUrl + '"></head><body style="background:#000;color:#fff;font-family:sans-serif;text-align:center;padding-top:20px;">YouTubebate版 - Education プレイヤーへ転送中...</body></html>'
    );
  }

  // 3. Web UI レンダリング (index.html)
  const template = HtmlService.createTemplateFromFile('index');
  template.appName = 'YouTubebate版';
  template.initialParam = getEducationParam();
  template.spreadsheetId = SPREADSHEET_ID;
  template.initialVideoId = videoId ? extractVideoId(videoId) : '';

  return template.evaluate()
    .setTitle('YouTubebate版 - Education Player')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Googleスプレッドシートの A1 セルから YouTube Education 専用パラメータを取得＆補正
 * @returns {string} 補正済みパラメータ (例: "?enablejsapi=1..." または 空文字)
 */
function getEducationParam() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getActiveSheet();
    const val = sheet.getRange('A1').getValue();
    let param = (val !== null && val !== undefined) ? String(val).trim() : '';

    if (param) {
      if (!param.startsWith('?') && !param.startsWith('&')) {
        param = '?' + param;
      }
    }
    return param;
  } catch (err) {
    console.warn('SpreadsheetApp.openById error: ' + err.message + '. Trying UrlFetch fallback...');
    try {
      const url = 'https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID + '/gviz/tq?tqx=out:csv';
      const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
      if (res.getResponseCode() === 200) {
        const text = res.getContentText();
        const firstLine = text.split('\n')[0].replace(/^"|"$/g, '').trim();
        if (firstLine) {
          return (firstLine.startsWith('?') || firstLine.startsWith('&')) ? firstLine : '?' + firstLine;
        }
      }
    } catch (e2) {
      console.error('UrlFetch fallback failed: ' + e2.message);
    }
    return '';
  }
}

/**
 * YouTube の様々な URL 形式から 11文字の Video ID を抽出
 * @param {string} input YouTube URL または Video ID
 * @returns {string} 抽出された Video ID
 */
function extractVideoId(input) {
  if (!input) return '';
  const str = String(input).trim();
  
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
    return str;
  }

  const watchMatch = str.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  const shortMatch = str.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  const shortsMatch = str.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];

  const embedMatch = str.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  const liveMatch = str.match(/live\/([a-zA-Z0-9_-]{11})/);
  if (liveMatch) return liveMatch[1];

  return str;
}

/**
 * フロントエンド (google.script.run) から呼び出し可能な API
 */
function apiGetLatestParam() {
  return {
    success: true,
    app: 'YouTubebate版',
    param: getEducationParam(),
    spreadsheetId: SPREADSHEET_ID,
    timestamp: new Date().toISOString()
  };
}
