import React, { useState } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Tv,
  Check,
  Bell,
  Code,
  User,
} from 'lucide-react';
import { EducationParamState, PlayerSettings, UserProfile } from '../types';
import {
  getLikedVideoIds,
  toggleLikedVideo,
  getSubscribedChannels,
  toggleSubscribeChannel,
} from '../utils/storage';
import { INITIAL_RELATED_VIDEOS } from '../utils/mockData';

interface VideoPlayerSectionProps {
  videoId: string;
  embedUrl: string;
  paramState: EducationParamState;
  settings: PlayerSettings;
  currentUser: UserProfile;
  onOpenNewTab: () => void;
  onCopyUrl: () => void;
  onCopyIframe: () => void;
  onOpenCreatorChannel: (channelName: string) => void;
  isCopiedUrl: boolean;
  isCopiedIframe: boolean;
}

export const VideoPlayerSection: React.FC<VideoPlayerSectionProps> = ({
  videoId,
  embedUrl,
  paramState,
  settings,
  currentUser,
  onOpenNewTab,
  onCopyUrl,
  onCopyIframe,
  onOpenCreatorChannel,
  isCopiedUrl,
  isCopiedIframe,
}) => {
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [likedVideoIds, setLikedVideoIds] = useState<string[]>(getLikedVideoIds());
  const [subscribedList, setSubscribedList] = useState<string[]>(getSubscribedChannels());

  // Find metadata for video
  const preset = INITIAL_RELATED_VIDEOS.find((v) => v.id === videoId);
  const title = preset
    ? preset.title
    : videoId
    ? `YouTube 動画 (${videoId}) - YouTube Player for Education`
    : '動画を選択またはURLを入力してください';

  const channelName = preset ? preset.channelTitle : 'YouTube Creator';
  const channelAvatar = preset
    ? preset.channelAvatar
    : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80';
  const views = preset ? preset.viewCount : '120万回';
  const publishedAt = preset ? preset.publishedAt : '2日前';

  const isLiked = likedVideoIds.includes(videoId);
  const isSubscribed = subscribedList.includes(channelName);

  const handleToggleLike = () => {
    if (!videoId) return;
    toggleLikedVideo(videoId);
    setLikedVideoIds(getLikedVideoIds());
  };

  const handleToggleSubscribe = () => {
    toggleSubscribeChannel(channelName);
    setSubscribedList(getSubscribedChannels());
  };

  return (
    <div className="space-y-4">
      {/* 16:9 Aspect Ratio Embed Player Container */}
      <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-2 sm:p-3 shadow-2xl">
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-neutral-900 ring-1 ring-red-950/60 group flex items-center justify-center">
          {videoId && embedUrl ? (
            <iframe
              key={embedUrl}
              src={embedUrl}
              title="YouTubebate版 Player for Education"
              className="w-full h-full border-0 absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-600 p-6 text-center">
              <Tv className="w-12 h-12 text-red-700/80 mb-2 stroke-[1.5]" />
              <p className="text-sm font-bold text-neutral-300">
                YouTube URLを入力すると YouTubebate版 が起動します
              </p>
              <p className="text-xs text-neutral-600 mt-1 font-mono">
                youtubeeducation.com/embed/[videoId][param]
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Video Title */}
      <div className="space-y-3 px-1">
        <h1 className="text-base sm:text-xl font-bold text-white leading-snug">
          {title}
        </h1>

        {/* Channel Bar & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-neutral-900">
          {/* Left: Video Creator Channel Info (Clickable -> Opens Creator Channel Screen) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenCreatorChannel(channelName)}
              className="group focus:outline-none"
              title="投稿者のチャンネル画面を開く"
            >
              <img
                src={channelAvatar}
                alt={channelName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-neutral-800 group-hover:ring-red-500 transition shrink-0 cursor-pointer"
              />
            </button>

            <div>
              <button
                type="button"
                onClick={() => onOpenCreatorChannel(channelName)}
                className="flex items-center gap-1.5 group text-left focus:outline-none"
                title="投稿者のチャンネル画面を開く"
              >
                <span className="text-sm font-bold text-white group-hover:text-red-400 underline-offset-2 group-hover:underline cursor-pointer">
                  {channelName}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              </button>
              <p className="text-[11px] text-neutral-400 font-mono">
                チャンネル登録者数 425万人
              </p>
            </div>

            {/* Subscribe Button */}
            <button
              onClick={handleToggleSubscribe}
              className={`ml-2 px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow ${
                isSubscribed
                  ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/40 border border-red-500/50'
              }`}
            >
              {isSubscribed ? (
                <>
                  <Bell className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  <span>登録済み</span>
                </>
              ) : (
                <span>チャンネル登録</span>
              )}
            </button>

            {/* Direct Button: Open Creator Channel */}
            <button
              onClick={() => onOpenCreatorChannel(channelName)}
              className="px-3 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-red-600/50 text-[11px] font-bold text-red-400 hover:text-red-300 transition flex items-center gap-1"
            >
              <User className="w-3 h-3" />
              <span>投稿者のアカウント画面</span>
            </button>
          </div>

          {/* Right: Like, Dislike, Share, Open Tab Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Like & Dislike Pill */}
            <div className="flex items-center bg-neutral-900 rounded-full border border-neutral-800 overflow-hidden">
              <button
                onClick={handleToggleLike}
                disabled={!videoId}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold transition hover:bg-neutral-800 ${
                  isLiked ? 'text-red-500 font-black' : 'text-neutral-200'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{isLiked ? '高評価済み' : '高評価'}</span>
              </button>
              <div className="w-[1px] h-4 bg-neutral-800" />
              <button
                disabled={!videoId}
                className="px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-800 transition"
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>

            {/* Share / Copy URL */}
            <button
              onClick={onCopyUrl}
              disabled={!videoId}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-red-600/40 text-xs font-bold text-neutral-200 transition"
              title="Education URLをコピー"
            >
              {isCopiedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-red-500" />
                  <span>コピー完了</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-red-400" />
                  <span>共有 (URL)</span>
                </>
              )}
            </button>

            {/* Open in New Tab */}
            <button
              onClick={onOpenNewTab}
              disabled={!videoId}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-red-600/40 text-xs font-bold text-red-400 transition"
              title="全画面・別タブで再生"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>別タブ</span>
            </button>

            {/* Copy iframe */}
            <button
              onClick={onCopyIframe}
              disabled={!videoId}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-red-600/40 text-xs font-bold text-neutral-200 transition"
              title="iframe埋め込みタグをコピー"
            >
              {isCopiedIframe ? (
                <>
                  <Check className="w-3.5 h-3.5 text-red-500" />
                  <span>iframe</span>
                </>
              ) : (
                <>
                  <Code className="w-3.5 h-3.5 text-neutral-400" />
                  <span>iframe</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Expandable Description Box */}
        <div
          onClick={() => setIsDescExpanded(!isDescExpanded)}
          className="bg-neutral-950 hover:bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800 cursor-pointer transition space-y-2 group"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-300 font-mono">
            <span className="text-white">{views} 視聴</span>
            <span>•</span>
            <span>{publishedAt}</span>
            <span className="text-red-400 font-sans ml-1">#YouTubeEducation</span>
            <span className="text-red-400 font-sans">#YouTubebate版</span>
          </div>

          <div className={`text-xs text-neutral-300 leading-relaxed font-sans ${isDescExpanded ? '' : 'line-clamp-2'}`}>
            <p>
              YouTube Player for Education（youtubeeducation.com）による広告非表示・集中学習用埋め込みプレイヤー。
              Google スプレッドシート（A1セル）から動的パラメータをリアルタイム取得し適用しています。
            </p>
            {isDescExpanded && (
              <div className="mt-3 pt-3 border-t border-neutral-800 space-y-2 text-xs text-neutral-400 font-mono">
                <p>📍 投稿者チャンネル: {channelName}</p>
                <p>📍 動画ID: {videoId || 'N/A'}</p>
                <p>🔗 埋め込みURL: {embedUrl || 'N/A'}</p>
                <p>⚙️ 動的パラメータ: {paramState.param || '(標準)'}</p>
              </div>
            )}
          </div>

          <div className="pt-1 flex items-center gap-1 text-xs font-bold text-neutral-400 group-hover:text-white transition">
            {isDescExpanded ? (
              <>
                <span>一部を表示</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>さらに表示</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
