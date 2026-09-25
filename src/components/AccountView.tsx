import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  History,
  ThumbsUp,
  Settings,
  Users,
  Edit3,
  CheckCircle2,
  Play,
  Trash2,
  ExternalLink,
  Plus,
  Radio,
  Sparkles,
  Camera,
  Layers,
  Table,
} from 'lucide-react';
import { UserProfile, WatchHistoryItem } from '../types';
import { DEFAULT_USERS } from '../utils/mockData';
import {
  getStoredUsers,
  saveStoredUsers,
  setCurrentUserId,
  updateCurrentUser,
  getWatchHistory,
  getLikedVideoIds,
  getSubscribedChannels,
} from '../utils/storage';
import { INITIAL_RELATED_VIDEOS } from '../utils/mockData';
import { SPREADSHEET_ID } from '../utils/youtube';

interface AccountViewProps {
  currentUser: UserProfile;
  onUserChange: (user: UserProfile) => void;
  onSelectVideo: (videoId: string, title?: string) => void;
  onBackToPlayer: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  currentUser,
  onUserChange,
  onSelectVideo,
  onBackToPlayer,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'liked' | 'switch' | 'edit' | 'education'>('history');
  const [users, setUsers] = useState<UserProfile[]>(getStoredUsers());
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>(getWatchHistory());
  const [likedVideoIds, setLikedVideoIds] = useState<string[]>(getLikedVideoIds());
  const subscribedChannels = getSubscribedChannels();

  // Edit profile form state
  const [editName, setEditName] = useState(currentUser.name);
  const [editHandle, setEditHandle] = useState(currentUser.handle);
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editAvatar, setEditAvatar] = useState(currentUser.avatarUrl);
  const [isSavedToast, setIsSavedToast] = useState(false);

  const handleSwitchUser = (user: UserProfile) => {
    setCurrentUserId(user.id);
    onUserChange(user);
    setEditName(user.name);
    setEditHandle(user.handle);
    setEditBio(user.bio);
    setEditAvatar(user.avatarUrl);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateCurrentUser({
      name: editName,
      handle: editHandle,
      bio: editBio,
      avatarUrl: editAvatar,
    });
    onUserChange(updated);
    setUsers(getStoredUsers());
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handleClearHistory = () => {
    localStorage.removeItem('youtubebate_watch_history');
    setWatchHistory([]);
  };

  const likedVideos = INITIAL_RELATED_VIDEOS.filter((v) =>
    likedVideoIds.includes(v.id)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Profile Header */}
      <div className="bg-neutral-950 rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl">
        {/* Banner */}
        <div className="relative h-44 sm:h-56 w-full bg-neutral-900 overflow-hidden">
          <img
            src={currentUser.bannerUrl}
            alt="Channel Banner"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="text-xs font-bold bg-black/80 backdrop-blur-md text-red-400 border border-red-900/50 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
              <span>YouTubebate版 アカウント</span>
            </span>
          </div>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 sm:px-8 pb-6 -mt-16 sm:-mt-20 relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            {/* Avatar & Main Titles */}
            <div className="flex items-end gap-4">
              <div className="relative group">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-black shadow-2xl bg-neutral-900"
                />
                <button
                  onClick={() => setActiveTab('edit')}
                  className="absolute bottom-1 right-1 p-2 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg transition"
                  title="プロフィール画像を変更"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {currentUser.name}
                  </h1>
                  {currentUser.isVerified && (
                    <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0" />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 font-mono">
                  <span className="text-red-400 font-bold">{currentUser.handle}</span>
                  <span>•</span>
                  <span>チャンネル登録者数 {currentUser.subscriberCount}</span>
                  <span>•</span>
                  <span>動画 {currentUser.videosCount} 本</span>
                </div>
                <p className="text-xs text-neutral-300 max-w-xl line-clamp-2 pt-1">
                  {currentUser.bio}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('edit')}
                className="flex-1 sm:flex-none px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl border border-neutral-700 hover:border-red-500/50 transition flex items-center justify-center gap-1.5 shadow"
              >
                <Edit3 className="w-3.5 h-3.5 text-red-400" />
                <span>チャンネルをカスタマイズ</span>
              </button>
              <button
                onClick={() => setActiveTab('switch')}
                className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/40 transition flex items-center justify-center gap-1.5 border border-red-500/50"
              >
                <Users className="w-3.5 h-3.5" />
                <span>アカウント切替</span>
              </button>
            </div>
          </div>

          {/* Account Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-neutral-800 pt-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition border-b-2 whitespace-nowrap ${
                activeTab === 'history'
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              <span>再生履歴 ({watchHistory.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('liked')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition border-b-2 whitespace-nowrap ${
                activeTab === 'liked'
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>高く評価した動画 ({likedVideoIds.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('switch')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition border-b-2 whitespace-nowrap ${
                activeTab === 'switch'
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>アカウント管理</span>
            </button>

            <button
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition border-b-2 whitespace-nowrap ${
                activeTab === 'edit'
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>プロフィール設定</span>
            </button>

            <button
              onClick={() => setActiveTab('education')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition border-b-2 whitespace-nowrap ${
                activeTab === 'education'
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Education・GAS情報</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Watch History */}
      {activeTab === 'history' && (
        <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-red-500" />
                <span>再生履歴 (YouTube Education Player)</span>
              </h2>
              <p className="text-xs text-neutral-400">
                最近視聴した動画のリストです。クリックするとプレイヤーで即時再生します。
              </p>
            </div>
            {watchHistory.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-xs text-neutral-400 hover:text-red-400 flex items-center gap-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>すべての履歴を消去</span>
              </button>
            )}
          </div>

          {watchHistory.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 space-y-2">
              <History className="w-10 h-10 mx-auto text-neutral-700 stroke-[1.5]" />
              <p className="text-xs font-bold text-neutral-400">再生履歴はありません</p>
              <button
                onClick={onBackToPlayer}
                className="text-xs text-red-500 hover:underline font-bold"
              >
                動画を検索・再生する &rarr;
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              {watchHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectVideo(item.videoId, item.title)}
                  className="bg-black rounded-xl border border-neutral-900 hover:border-red-600/50 p-3 cursor-pointer group transition space-y-2 shadow-sm"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <Play className="w-8 h-8 text-red-500 fill-red-500" />
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-neutral-200 group-hover:text-white line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-neutral-400">{item.channelTitle}</p>
                    <p className="text-[10px] text-neutral-500 font-mono">
                      {new Date(item.watchedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Liked Videos */}
      {activeTab === 'liked' && (
        <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-red-500" />
                <span>高く評価した動画</span>
              </h2>
              <p className="text-xs text-neutral-400">
                お気に入りに追加された動画の一覧です。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {likedVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => onSelectVideo(video.id, video.title)}
                className="bg-black rounded-xl border border-neutral-900 hover:border-red-600/50 p-3 cursor-pointer group transition space-y-2 shadow-sm"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Play className="w-8 h-8 text-red-500 fill-red-500" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-neutral-200 group-hover:text-white line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-[11px] text-neutral-400">{video.channelTitle}</p>
                  <p className="text-[10px] text-neutral-500 font-mono">{video.viewCount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Account Switcher */}
      {activeTab === 'switch' && (
        <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-6 shadow-2xl space-y-5">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-red-500" />
              <span>アカウントの切り替え</span>
            </h2>
            <p className="text-xs text-neutral-400">
              YouTube同様に複数のアカウント（個人、学習用、クリエイター用）をワンクリックで切り替えて利用できます。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {users.map((u) => {
              const isSelected = u.id === currentUser.id;
              return (
                <div
                  key={u.id}
                  onClick={() => handleSwitchUser(u)}
                  className={`p-4 rounded-2xl border cursor-pointer transition relative space-y-3 ${
                    isSelected
                      ? 'bg-red-950/40 border-red-600 shadow-lg shadow-red-950/60 ring-1 ring-red-500/50'
                      : 'bg-black hover:bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatarUrl}
                      alt={u.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-neutral-800"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">
                          {u.name}
                        </span>
                        {u.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-400 font-mono block truncate">
                        {u.handle}
                      </span>
                      <span className="text-[10px] text-neutral-500 block truncate">
                        {u.email}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex items-center justify-between text-[11px] text-red-400 font-bold bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-800/60">
                      <span>現在ログイン中</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Edit Profile Form */}
      {activeTab === 'edit' && (
        <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-6 shadow-2xl space-y-5">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-red-500" />
              <span>チャンネル・プロフィール設定</span>
            </h2>
            <p className="text-xs text-neutral-400">
              チャンネル名、ハンドル名、自己紹介、アイコン画像を設定できます。
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-300">チャンネル表示名</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-300">ハンドル (@handle)</label>
              <input
                type="text"
                value={editHandle}
                onChange={(e) => setEditHandle(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-red-300 font-mono focus:outline-none focus:border-red-600"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-300">プロフィール画像 URL</label>
              <input
                type="url"
                value={editAvatar}
                onChange={(e) => setEditAvatar(e.target.value)}
                className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-300">自己紹介 (Bio)</label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={3}
                className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-600"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/40 transition flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>変更を保存</span>
              </button>
              {isSavedToast && (
                <span className="text-xs text-red-400 font-bold animate-pulse">
                  プロフィールを更新しました！
                </span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Tab 5: Education / Sheet Integration info */}
      {activeTab === 'education' && (
        <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-6 shadow-2xl space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Table className="w-4 h-4 text-red-500" />
            <span>YouTube Education × Google Spreadsheet 連携状態</span>
          </h2>
          <div className="bg-black p-4 rounded-xl border border-neutral-900 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">対象スプレッドシートID:</span>
              <span className="font-mono text-red-400">{SPREADSHEET_ID}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">取得セル位置:</span>
              <span className="font-mono text-neutral-200">A1セル (先頭パラメータ)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">埋め込み先ドメイン:</span>
              <span className="font-mono text-red-400">youtubeeducation.com/embed/</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
