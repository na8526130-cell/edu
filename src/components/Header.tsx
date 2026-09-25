import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Code2,
  BookOpen,
  ShieldCheck,
  RefreshCw,
  User,
  Search,
  ChevronDown,
  History,
  ThumbsUp,
  Settings,
  Users,
  Tv,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { EducationParamState, UserProfile } from '../types';

interface HeaderProps {
  activeTab: 'player' | 'creator' | 'account' | 'gas' | 'docs';
  setActiveTab: (tab: 'player' | 'creator' | 'account' | 'gas' | 'docs') => void;
  paramState: EducationParamState;
  onRefreshParam: () => void;
  currentUser: UserProfile;
  activeCreatorName: string;
  searchInput: string;
  setSearchInput: (val: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  paramState,
  onRefreshParam,
  currentUser,
  activeCreatorName,
  searchInput,
  setSearchInput,
  onSearchSubmit,
}) => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <header className="border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-black/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('player')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-red-600 to-black flex items-center justify-center shadow-lg shadow-red-600/40 ring-1 ring-red-500/40 group-hover:scale-105 transition">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white tracking-wide flex items-center gap-1.5 font-sans">
                  <span>YouTubebate版</span>
                </h1>
                <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded tracking-widest uppercase shadow-sm shadow-red-600/50">
                  BETA
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-medium hidden sm:block">
                YouTube Player for Education (赤×黒)
              </p>
            </div>
          </button>
        </div>

        {/* Center: Search / Quick URL input bar (Real YouTube Style) */}
        <div className="flex-1 max-w-lg mx-auto order-3 sm:order-2 w-full sm:w-auto">
          <form onSubmit={onSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="YouTube URL または 動画ID を入力..."
              className="w-full bg-black border border-neutral-800 hover:border-neutral-700 rounded-l-full py-2 pl-4 pr-10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 transition font-mono"
            />
            <button
              type="submit"
              className="bg-neutral-900 hover:bg-neutral-800 border border-l-0 border-neutral-800 hover:border-neutral-700 rounded-r-full px-4 py-2 text-neutral-300 hover:text-white transition flex items-center justify-center"
              title="プレイヤーを生成"
            >
              <Search className="w-4 h-4 text-red-500" />
            </button>
          </form>
        </div>

        {/* Right: Navigation Tabs & Account Menu */}
        <div className="flex items-center gap-2.5 order-2 sm:order-3">
          {/* Navigation Pill Menu */}
          <div className="hidden lg:flex items-center bg-black p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setActiveTab('player')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'player'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>再生</span>
            </button>

            <button
              onClick={() => setActiveTab('creator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'creator'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5 text-red-500" />
              <span className="truncate max-w-[120px]">
                {activeCreatorName ? `${activeCreatorName}` : '投稿者チャンネル'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('account')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'account'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>マイアカウント</span>
            </button>

            <button
              onClick={() => setActiveTab('gas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'gas'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>GAS</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'docs'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>仕様</span>
            </button>
          </div>

          {/* Real YouTube Account Avatar & Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-neutral-900 border border-neutral-800 transition focus:outline-none ring-1 ring-red-600/40"
              title="アカウント設定"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <ChevronDown className="w-3 h-3 text-neutral-400 hidden sm:block mr-1" />
            </button>

            {/* Real YouTube-Style Dropdown Menu */}
            {isAccountMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Account Card Header */}
                <div className="flex items-center gap-3 p-3 border-b border-neutral-800">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-red-600/50"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-bold text-white truncate">
                        {currentUser.name}
                      </p>
                      {currentUser.isVerified && (
                        <CheckCircle2 className="w-3 h-3 text-red-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 font-mono truncate">
                      {currentUser.handle}
                    </p>
                    <button
                      onClick={() => {
                        setActiveTab('account');
                        setIsAccountMenuOpen(false);
                      }}
                      className="text-[11px] text-red-400 hover:text-red-300 font-bold block mt-0.5"
                    >
                      マイ チャンネルを表示 &rarr;
                    </button>
                  </div>
                </div>

                {/* Dropdown Navigation Items */}
                <div className="py-2 space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setActiveTab('creator');
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-xl transition font-medium"
                  >
                    <Tv className="w-4 h-4 text-red-500" />
                    <span>投稿者のチャンネル画面 ({activeCreatorName || '投稿者'})</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('account');
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-xl transition font-medium"
                  >
                    <User className="w-4 h-4 text-neutral-400" />
                    <span>マイ チャンネル / アカウント画面</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('account');
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-xl transition font-medium"
                  >
                    <History className="w-4 h-4 text-neutral-400" />
                    <span>再生履歴</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('account');
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-xl transition font-medium"
                  >
                    <ThumbsUp className="w-4 h-4 text-neutral-400" />
                    <span>高く評価した動画</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('account');
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-xl transition font-medium"
                  >
                    <Users className="w-4 h-4 text-neutral-400" />
                    <span>アカウントを切り替える</span>
                  </button>
                </div>

                {/* Footer status */}
                <div className="pt-2 border-t border-neutral-900 px-3 py-1 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                  <span>Sheet: 1dily2w...</span>
                  <span className="text-red-500">Education Sync</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
