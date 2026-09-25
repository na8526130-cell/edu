import React from 'react';
import {
  BookOpen,
  Table,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { SPREADSHEET_ID } from '../utils/youtube';

export const DocsView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-neutral-950 rounded-2xl border border-neutral-800 hover:border-red-600/40 p-6 shadow-2xl space-y-4 transition duration-300">
        <div className="flex items-center gap-2 text-red-500">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-base font-black text-white">YouTubebate版 仕様ドキュメント</h2>
        </div>
        <p className="text-xs text-neutral-300 leading-relaxed">
          <strong>YouTubebate版</strong>は、YouTube URLから<strong>YouTube Player for Education</strong>（
          <code className="text-red-400 font-mono">youtubeeducation.com/embed/&#123;videoId&#125;&#123;param&#125;</code>
          ）埋め込みプレイヤーを自動生成し、Google スプレッドシートから最新の教育専用パラメータをリアルタイムで取得・動的補正して提供するシステムです。
        </p>
      </div>

      {/* Grid: 2 Core Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1 */}
        <div className="bg-neutral-950 rounded-2xl border border-neutral-800 hover:border-red-600/40 p-5 shadow-2xl space-y-3 transition duration-300">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-red-600/20 text-red-500 border border-red-600/40 flex items-center justify-center text-xs font-bold font-mono">
              1
            </span>
            <h3 className="text-sm font-bold text-white">
              専用パラメータの動的取得 (Google Spreadsheet API)
            </h3>
          </div>
          <ul className="text-xs text-neutral-300 space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <span>
                <strong>対象スプレッドシート:</strong>{' '}
                <code className="text-red-400 font-mono bg-black px-1.5 py-0.5 rounded text-[11px] border border-neutral-800">
                  {SPREADSHEET_ID}
                </code>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <span>
                <strong>A1セルリアルタイム取得:</strong> しあTube（Jy コンポーネント / StreamType1）同様に、スプレッドシートの先頭セル（A1）に保存された最新の Education 用クエリ文字列をリアルタイムにフェッチします。
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <span>
                <strong>フォールバック:</strong> 万一スプレッドシートへの通信がタイムアウトまたはアクセス制限された場合でも、安全な初期パラメータまたはサーバーサイドキャッシュで稼働を継続します。
              </span>
            </li>
          </ul>
        </div>

        {/* Module 2 */}
        <div className="bg-neutral-950 rounded-2xl border border-neutral-800 hover:border-red-600/40 p-5 shadow-2xl space-y-3 transition duration-300">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-red-600/20 text-red-500 border border-red-600/40 flex items-center justify-center text-xs font-bold font-mono">
              2
            </span>
            <h3 className="text-sm font-bold text-white">
              パラメータ動的補正機能 & プレイヤー生成
            </h3>
          </div>
          <ul className="text-xs text-neutral-300 space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <span>
                <strong>プレフィックス補正:</strong> セル内の値が <code className="text-red-400 font-mono">?</code> や <code className="text-red-400 font-mono">&</code> から始まっていない場合でも自動的に先頭に付与し、不正なURL生成を防ぎます。
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <span>
                <strong>URLパーサー:</strong> ユーザーが入力した YouTube の watch URL、Shorts、youtu.be 短縮リンク、iframe embed URL、live URL から11文字の動画IDを確実に抽出します。
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <span>
                <strong>別タブ・iframe連携:</strong> 生成された URL はインラインでの即時再生、別タブでのフルスクリーン再生、iframe埋め込みタグのワンクリックコピーに対応しています。
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* API Endpoint Documentation */}
      <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-6 shadow-2xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-red-500" />
          <span>API エンドポイント仕様</span>
        </h3>

        <div className="space-y-3">
          <div className="bg-black p-3.5 rounded-xl border border-neutral-900 font-mono text-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white px-2 py-0.5 rounded font-bold text-[10px]">
                GET
              </span>
              <span className="text-red-300">/api/education-param</span>
            </div>
            <p className="text-neutral-400 font-sans text-[11px]">
              現在の YouTube Education 埋め込みパラメータを JSON で返却します。
            </p>
            <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 text-red-300 text-[11px] overflow-x-auto">
              <pre>{`{
  "success": true,
  "app": "YouTubebate版",
  "param": "?enablejsapi=1...",
  "source": "spreadsheet_live",
  "spreadsheetId": "1dily2wiik92TAyK3zyIsu8TDuyYNoF20IM1iMk_X-pg",
  "updatedAt": "2026-08-19T05:30:00.000Z"
}`}</pre>
            </div>
          </div>

          <div className="bg-black p-3.5 rounded-xl border border-neutral-900 font-mono text-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-neutral-800 text-red-400 border border-neutral-700 px-2 py-0.5 rounded font-bold text-[10px]">
                GAS GET
              </span>
              <span className="text-red-300">https://script.google.com/.../exec?action=param</span>
            </div>
            <p className="text-neutral-400 font-sans text-[11px]">
              GAS Web App に <code className="text-red-400 font-mono">?action=param</code> を付与してリクエストすると、スプレッドシートから取得したパラメータを即時 JSON 応答します。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
