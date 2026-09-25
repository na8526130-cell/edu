import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  FileCode,
  CheckCircle2,
  ExternalLink,
  Terminal,
} from 'lucide-react';
import { SPREADSHEET_ID } from '../utils/youtube';

const CODE_GS_SOURCE = `/**
 * =========================================================================
 * YouTubebate版 - Google Apps Script (GAS) Backend
 * -------------------------------------------------------------------------
 * 1. Google スプレッドシート (1dily2wiik92TAyK3zyIsu8TDuyYNoF20IM1iMk_X-pg) の
 *    A1 セルから YouTube Education 専用パラメータをリアルタイム取得
 * 2. youtubeeducation.com/embed/\${videoId}\${param} の埋め込みプレイヤー生成
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
        const firstLine = text.split('\\n')[0].replace(/^"|"$/g, '').trim();
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

  const shortMatch = str.match(/youtu\\.be\\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  const shortsMatch = str.match(/youtube\\.com\\/shorts\\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];

  const embedMatch = str.match(/embed\\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  const liveMatch = str.match(/live\\/([a-zA-Z0-9_-]{11})/);
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
}`;

const INDEX_HTML_SOURCE = `<!DOCTYPE html>
<html lang="ja">
<head>
  <base target="_top">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YouTubebate版 - Education Player (GAS)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;700;900&display=swap');
    body { font-family: 'Plus Jakarta Sans', 'Noto Sans JP', sans-serif; background-color: #050505; }
  </style>
</head>
<body class="bg-black text-neutral-100 min-h-screen flex flex-col antialiased selection:bg-red-600 selection:text-white">
  <!-- Header: Red & Black Theme -->
  <header class="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-red-600 to-black flex items-center justify-center shadow-lg shadow-red-600/40 border border-red-500/30">
          <i class="fa-brands fa-youtube text-white text-xl"></i>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-base font-black text-white tracking-wider flex items-center gap-1.5">
              <span>YouTubebate版</span>
            </h1>
            <span class="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded tracking-widest uppercase">BETA</span>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="flex-1 max-w-6xl w-full mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
    <!-- Left: Controls -->
    <div class="lg:col-span-5 flex flex-col gap-5">
      <div class="bg-neutral-950 rounded-2xl border border-neutral-800 hover:border-red-600/40 p-5 shadow-2xl">
        <label for="urlInput" class="block text-xs font-bold text-red-500 mb-2 uppercase tracking-wider">
          YouTube URL / 動画ID を入力
        </label>
        <div class="relative">
          <input 
            type="text" 
            id="urlInput" 
            placeholder="例: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            class="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-mono"
            value="<?= typeof initialVideoId !== 'undefined' && initialVideoId ? initialVideoId : '' ?>"
          />
        </div>

        <div class="mt-3 grid grid-cols-2 gap-2">
          <button id="loadBtn" class="bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-red-600/40 border border-red-500/50">
            <i class="fa-solid fa-play"></i> プレイヤー生成
          </button>
          <button id="openTabBtn" class="bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 border border-neutral-800 hover:border-red-500/30">
            <i class="fa-solid fa-arrow-up-right-from-square text-red-400"></i> 別タブで開く
          </button>
        </div>
      </div>

      <!-- Parameter Card -->
      <div class="bg-neutral-950 rounded-2xl border border-neutral-800 hover:border-red-600/40 p-5 shadow-2xl space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-neutral-200 uppercase">Education パラメータ</span>
          <button id="refreshParamBtn" class="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold">
            <i class="fa-solid fa-arrows-rotate text-[10px]"></i> 再取得
          </button>
        </div>
        <div class="bg-black p-3 rounded-xl border border-neutral-900 font-mono text-xs text-red-300 break-all" id="paramDisplay">
          <?= typeof initialParam !== 'undefined' ? initialParam : '(取得中...)' ?>
        </div>
      </div>

      <!-- Quick Copy Actions -->
      <div class="bg-neutral-950 rounded-2xl border border-neutral-800 p-4 shadow-xl grid grid-cols-2 gap-2">
        <button id="copyUrlBtn" class="bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs py-2.5 px-3 rounded-xl border border-neutral-800 hover:border-red-500/40 transition flex items-center justify-center gap-1.5 font-medium">
          <i class="fa-solid fa-link text-red-400"></i> URLコピー
        </button>
        <button id="copyIframeBtn" class="bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs py-2.5 px-3 rounded-xl border border-neutral-800 hover:border-red-500/40 transition flex items-center justify-center gap-1.5 font-medium">
          <i class="fa-solid fa-code text-red-400"></i> iframeコピー
        </button>
      </div>
    </div>

    <!-- Right: Player -->
    <div class="lg:col-span-7 flex flex-col gap-5">
      <div class="bg-neutral-950 rounded-2xl border border-neutral-800 hover:border-red-600/40 p-5 shadow-2xl flex flex-col">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-sm font-bold text-white">YouTubebate版 ライブプレビュー</h2>
          <span id="currentVideoIdBadge" class="text-xs font-mono bg-black text-red-400 px-2.5 py-1 rounded-md border border-neutral-800">ID: -</span>
        </div>
        <div class="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-neutral-800 ring-1 ring-red-950 flex items-center justify-center">
          <iframe 
            id="educationIframe" 
            class="w-full h-full border-0 absolute inset-0" 
            src="" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen>
          </iframe>
        </div>
        <div class="mt-4 p-3 bg-black rounded-xl border border-neutral-900 font-mono text-xs text-red-300 break-all" id="fullEmbedUrlDisplay">
          (未生成)
        </div>
      </div>
    </div>
  </main>

  <script>
    let currentParam = "<?= typeof initialParam !== 'undefined' ? initialParam : '' ?>";
    const SPREADSHEET_ID = "<?= typeof spreadsheetId !== 'undefined' ? spreadsheetId : '1dily2wiik92TAyK3zyIsu8TDuyYNoF20IM1iMk_X-pg' ?>";

    function extractVideoId(input) {
      if (!input) return '';
      const str = input.trim();
      if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;
      const watchMatch = str.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
      if (watchMatch) return watchMatch[1];
      const shortMatch = str.match(/youtu\\.be\\/([a-zA-Z0-9_-]{11})/);
      if (shortMatch) return shortMatch[1];
      const shortsMatch = str.match(/youtube\\.com\\/shorts\\/([a-zA-Z0-9_-]{11})/);
      if (shortsMatch) return shortsMatch[1];
      const embedMatch = str.match(/embed\\/([a-zA-Z0-9_-]{11})/);
      if (embedMatch) return embedMatch[1];
      const liveMatch = str.match(/live\\/([a-zA-Z0-9_-]{11})/);
      if (liveMatch) return liveMatch[1];
      return str;
    }

    function buildEducationEmbedUrl(vid) {
      const cleanId = extractVideoId(vid);
      return 'https://www.youtubeeducation.com/embed/' + cleanId + (currentParam || '');
    }

    function updatePlayer() {
      const vid = extractVideoId(document.getElementById('urlInput').value);
      if (!vid) return alert('動画URLを入力してください');
      const url = buildEducationEmbedUrl(vid);
      document.getElementById('educationIframe').src = url;
      document.getElementById('currentVideoIdBadge').innerText = 'ID: ' + vid;
      document.getElementById('fullEmbedUrlDisplay').innerText = url;
    }

    document.getElementById('loadBtn').addEventListener('click', updatePlayer);
    document.getElementById('openTabBtn').addEventListener('click', () => {
      const vid = extractVideoId(document.getElementById('urlInput').value);
      if (!vid) return alert('動画URLを入力してください');
      window.open(buildEducationEmbedUrl(vid), '_blank');
    });

    document.getElementById('copyUrlBtn').addEventListener('click', () => {
      const vid = extractVideoId(document.getElementById('urlInput').value);
      if (!vid) return alert('動画URLを入力してください');
      navigator.clipboard.writeText(buildEducationEmbedUrl(vid)).then(() => alert('URLをコピーしました'));
    });

    document.getElementById('copyIframeBtn').addEventListener('click', () => {
      const vid = extractVideoId(document.getElementById('urlInput').value);
      if (!vid) return alert('動画URLを入力してください');
      const tag = '<iframe width="560" height="315" src="' + buildEducationEmbedUrl(vid) + '" frameborder="0" allowfullscreen></iframe>';
      navigator.clipboard.writeText(tag).then(() => alert('iframeタグをコピーしました'));
    });

    window.addEventListener('DOMContentLoaded', () => {
      if (document.getElementById('urlInput').value) updatePlayer();
    });
  </script>
</body>
</html>`;

export const GasExportView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<'code.gs' | 'index.html'>('code.gs');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const handleCopyCode = async (filename: 'code.gs' | 'index.html') => {
    const code = filename === 'code.gs' ? CODE_GS_SOURCE : INDEX_HTML_SOURCE;
    try {
      await navigator.clipboard.writeText(code);
      setCopiedFile(filename);
      setTimeout(() => setCopiedFile(null), 2500);
    } catch {
      // ignore
    }
  };

  const handleDownload = (filename: 'code.gs' | 'index.html') => {
    const code = filename === 'code.gs' ? CODE_GS_SOURCE : INDEX_HTML_SOURCE;
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Intro */}
      <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 p-6 rounded-2xl border border-neutral-800 shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider flex items-center gap-1.5 shadow-sm shadow-red-600/50">
                <FileCode className="w-3.5 h-3.5" />
                YouTubebate版 GAS配布ファイル
              </span>
              <span className="bg-black text-red-400 border border-neutral-800 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
                code.gs & index.html
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              YouTubebate版 GAS Web アプリケーション用 完全ソースコード
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Google Apps Script (GAS) 用の2つのファイル
              （<code className="text-red-400 font-mono">code.gs</code> と{' '}
              <code className="text-red-400 font-mono">index.html</code>）の全コードです。
              Google スプレッドシート（
              <code className="text-red-400 font-mono text-[11px]">1dily2wiik92TAyK3zyIsu8TDuyYNoF20IM1iMk_X-pg</code>
              ）のA1セルから最新パラメータを自動取得・補正するスクリプトが組み込まれています。
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownload('code.gs')}
              className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold border border-neutral-800 hover:border-red-600/40 flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-red-500" />
              <span>code.gs 保存</span>
            </button>
            <button
              onClick={() => handleDownload('index.html')}
              className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold border border-neutral-800 hover:border-red-600/40 flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-red-500" />
              <span>index.html 保存</span>
            </button>
          </div>
        </div>
      </div>

      {/* Code Viewer & Switcher */}
      <div className="bg-neutral-950 rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Tab Header */}
        <div className="bg-black px-4 py-3 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedFile('code.gs')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                selectedFile === 'code.gs'
                  ? 'bg-neutral-900 text-red-400 border border-red-600/50 shadow-sm shadow-red-950'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-red-500" />
              <span>code.gs (バックエンド)</span>
            </button>
            <button
              onClick={() => setSelectedFile('index.html')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                selectedFile === 'index.html'
                  ? 'bg-neutral-900 text-red-400 border border-red-600/50 shadow-sm shadow-red-950'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-red-500" />
              <span>index.html (フロントエンド)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopyCode(selectedFile)}
              className="bg-red-600 hover:bg-red-500 text-white font-bold py-1.5 px-3.5 rounded-lg text-xs transition flex items-center gap-1.5 shadow-lg shadow-red-600/40 border border-red-500/50"
            >
              {copiedFile === selectedFile ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>コピー完了！</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{selectedFile} のコードをコピー</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Content Container */}
        <div className="p-4 bg-black overflow-x-auto max-h-[500px]">
          <pre className="font-mono text-xs text-neutral-200 leading-relaxed select-all whitespace-pre">
            {selectedFile === 'code.gs' ? CODE_GS_SOURCE : INDEX_HTML_SOURCE}
          </pre>
        </div>
      </div>

      {/* 3-Step GAS Deployment Guide */}
      <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-6 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-red-500" />
          <span>Google Apps Script (GAS) への 3分デプロイ手順</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black p-4 rounded-xl border border-neutral-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-white">
              <span className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-[10px] text-white font-black">
                1
              </span>
              <span>GAS プロジェクト作成</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              <a
                href="https://script.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-red-400 hover:underline inline-flex items-center gap-1 font-semibold"
              >
                script.google.com
                <ExternalLink className="w-2.5 h-2.5" />
              </a>{' '}
              にアクセスし、「新しいプロジェクト」を作成します。
            </p>
          </div>

          <div className="bg-black p-4 rounded-xl border border-neutral-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-white">
              <span className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-[10px] text-white font-black">
                2
              </span>
              <span>2つのファイルを貼り付け</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              デフォルトの <code className="text-red-400 font-mono">コード.gs</code> に{' '}
              <code className="text-red-400 font-mono">code.gs</code> の内容を貼り付け、
              「+」ボタンからHTMLファイル <code className="text-red-400 font-mono">index.html</code> を追加して貼り付けます。
            </p>
          </div>

          <div className="bg-black p-4 rounded-xl border border-neutral-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-white">
              <span className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-[10px] text-white font-black">
                3
              </span>
              <span>ウェブアプリとしてデプロイ</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              右上の「デプロイ」&gt;「新しいデプロイ」&gt;「種類の選択: ウェブアプリ」を選択し、
              アクセスできるユーザーを「全員」にしてデプロイ完了です！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
