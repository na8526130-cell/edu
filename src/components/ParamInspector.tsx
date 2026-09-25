import React, { useState } from 'react';
import {
  RefreshCw,
  Sliders,
  Sparkles,
  CheckCircle2,
  Table,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { EducationParamState, PlayerSettings } from '../types';
import { SPREADSHEET_ID } from '../utils/youtube';

interface ParamInspectorProps {
  paramState: EducationParamState;
  onRefresh: () => void;
  settings: PlayerSettings;
  onUpdateSettings: (settings: Partial<PlayerSettings>) => void;
}

export const ParamInspector: React.FC<ParamInspectorProps> = ({
  paramState,
  onRefresh,
  settings,
  onUpdateSettings,
}) => {
  const [isOpenCustom, setIsOpenCustom] = useState(false);

  return (
    <div className="bg-neutral-950 rounded-2xl border border-neutral-800 hover:border-red-600/40 p-5 shadow-2xl space-y-4 transition duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-sm shadow-red-500"></div>
          <h2 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
            YouTube Education 専用パラメータ (動的補正)
          </h2>
        </div>
        <button
          onClick={onRefresh}
          disabled={paramState.isLoading}
          className="text-xs font-bold text-red-500 hover:text-red-400 flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3 h-3 ${paramState.isLoading ? 'animate-spin' : ''}`}
          />
          <span>リアルタイム再取得</span>
        </button>
      </div>

      {/* Spreadsheet Status & Param Box */}
      <div className="bg-black rounded-xl p-3.5 border border-neutral-900 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400">
          <span className="flex items-center gap-1.5 font-medium text-neutral-300">
            <Table className="w-3.5 h-3.5 text-red-500" />
            <span>Googleスプレッドシート (A1セル)</span>
          </span>
          <span className="font-mono text-[10px] text-red-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
            ID: {SPREADSHEET_ID.substring(0, 10)}...{SPREADSHEET_ID.slice(-5)}
          </span>
        </div>

        {/* Current Dynamic Param Display */}
        <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 font-mono text-xs text-red-300 break-all flex items-center justify-between gap-2">
          <span className="select-all">
            {paramState.isLoading
              ? 'パラメータ取得中...'
              : paramState.param
              ? paramState.param
              : '(パラメータなし / 標準クエリ適用)'}
          </span>
          <span className="shrink-0 text-[10px] bg-red-950/80 text-red-400 px-2 py-0.5 rounded border border-red-800/60 font-sans font-bold">
            {paramState.source === 'spreadsheet_live'
              ? 'Live Sheet'
              : paramState.source === 'cache'
              ? 'Cached'
              : 'Synced'}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
          <span className="flex items-center gap-1 text-red-400 font-medium">
            <CheckCircle2 className="w-3 h-3 text-red-500" />
            <span>動的補正: ? / & 自動整形済み</span>
          </span>
          <span className="text-[10px] text-neutral-500 font-mono">
            更新: {paramState.updatedAt ? new Date(paramState.updatedAt).toLocaleTimeString() : 'N/A'}
          </span>
        </div>
      </div>

      {/* Feature explanation */}
      <div className="text-[11px] text-neutral-400 bg-black/60 p-3 rounded-xl border border-neutral-900 space-y-1.5 leading-relaxed">
        <div className="flex items-start gap-2">
          <Sparkles className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
          <p>
            <strong className="text-neutral-200">しあTube（Jy コンポーネント / StreamType1）仕様準拠:</strong>
            {' '}スプレッドシートおよび <code className="text-red-400 font-mono">/api/education-param</code> から埋め込みパラメータをリアルタイム取得し、
            <code className="text-red-400 font-mono ml-1">youtubeeducation.com/embed/$&#123;videoId&#125;$&#123;param&#125;</code>
            {' '}でプレイヤーを構築します。
          </p>
        </div>
      </div>

      {/* Customizable playback options */}
      <div className="border-t border-neutral-900 pt-3">
        <button
          onClick={() => setIsOpenCustom(!isOpenCustom)}
          className="w-full flex items-center justify-between text-xs font-bold text-neutral-300 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-red-500" />
            <span>再生オプション & カスタムパラメータ</span>
          </span>
          {isOpenCustom ? (
            <ChevronUp className="w-4 h-4 text-neutral-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-neutral-400" />
          )}
        </button>

        {isOpenCustom && (
          <div className="mt-3 space-y-3 pt-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-black border border-neutral-800 cursor-pointer hover:border-red-600/40 transition text-xs text-neutral-200 font-medium">
                <input
                  type="checkbox"
                  checked={settings.autoplay}
                  onChange={(e) => onUpdateSettings({ autoplay: e.target.checked })}
                  className="rounded bg-neutral-900 border-neutral-700 text-red-600 focus:ring-0"
                />
                <span>自動再生</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-black border border-neutral-800 cursor-pointer hover:border-red-600/40 transition text-xs text-neutral-200 font-medium">
                <input
                  type="checkbox"
                  checked={settings.mute}
                  onChange={(e) => onUpdateSettings({ mute: e.target.checked })}
                  className="rounded bg-neutral-900 border-neutral-700 text-red-600 focus:ring-0"
                />
                <span>ミュート</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-black border border-neutral-800 cursor-pointer hover:border-red-600/40 transition text-xs text-neutral-200 font-medium">
                <input
                  type="checkbox"
                  checked={settings.loop}
                  onChange={(e) => onUpdateSettings({ loop: e.target.checked })}
                  className="rounded bg-neutral-900 border-neutral-700 text-red-600 focus:ring-0"
                />
                <span>ループ再生</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg bg-black border border-neutral-800 cursor-pointer hover:border-red-600/40 transition text-xs text-neutral-200 font-medium">
                <input
                  type="checkbox"
                  checked={settings.controls}
                  onChange={(e) => onUpdateSettings({ controls: e.target.checked })}
                  className="rounded bg-neutral-900 border-neutral-700 text-red-600 focus:ring-0"
                />
                <span>コントロール表示</span>
              </label>
            </div>

            {/* Custom parameter input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-400">
                手動パラメータ上書き (指定時は優先適用):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.customParam}
                  onChange={(e) =>
                    onUpdateSettings({
                      customParam: e.target.value,
                      useCustomParam: e.target.value.trim().length > 0,
                    })
                  }
                  placeholder="例: ?rel=0&modestbranding=1"
                  className="flex-1 bg-black border border-neutral-800 rounded-lg px-3 py-1.5 text-xs font-mono text-red-300 placeholder-neutral-700 focus:outline-none focus:border-red-600"
                />
                {settings.customParam && (
                  <button
                    onClick={() =>
                      onUpdateSettings({ customParam: '', useCustomParam: false })
                    }
                    className="px-2.5 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg transition"
                  >
                    リセット
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
