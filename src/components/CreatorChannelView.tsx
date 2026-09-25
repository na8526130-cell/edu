import React, { useState } from 'react';
import {
  CheckCircle2,
  Bell,
  Play,
  Share2,
  Calendar,
  Eye,
  Globe,
  Radio,
  Sparkles,
  ChevronDown,
  Layers,
  Flame,
  ThumbsUp,
  MessageSquare,
  ArrowLeft,
  Tv,
  Check,
} from 'lucide-react';
import { CreatorChannel } from '../types';
import { getSubscribedChannels, toggleSubscribeChannel } from '../utils/storage';

interface CreatorChannelViewProps {
  channel: CreatorChannel;
  onSelectVideo: (videoId: string, title?: string) => void;
  onBackToPlayer: () => void;
}

export const CreatorChannelView: React.FC<CreatorChannelViewProps> = ({
  channel,
  onSelectVideo,
  onBackToPlayer,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'videos' | 'community' | 'about'>('home');
  const [videoSort, setVideoSort] = useState<'latest' | 'popular'>('latest');
  const [visibleVideosCount, setVisibleVideosCount] = useState(6);
  const [isCopied, setIsCopied] = useState(false);
  const [subscribedList, setSubscribedList] = useState<string[]>(getSubscribedChannels());

  const isSubscribed = subscribedList.includes(channel.name);

  const handleToggleSubscribe = () => {
    toggleSubscribeChannel(channel.name);
    setSubscribedList(getSubscribedChannels());
  };

  const handleShareChannel = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://www.youtube.com/${channel.handle}`
      );
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {}
  };

  const sortedVideos = [...channel.videos].sort((a, b) => {
    if (videoSort === 'popular') {
      return 0; // retain popular
    }
    return 0;
  });

  const displayedVideos = sortedVideos.slice(0, visibleVideosCount);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back button to video player */}
      <button
        onClick={onBackToPlayer}
        className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 px-4 py-2 rounded-xl border border-neutral-800 transition shadow-sm"
      >
        <ArrowLeft className="w-4 h-4 text-red-500" />
        <span>動画プレイヤーに戻る</span>
      </button>

      {/* Creator Channel Main Container */}
      <div className="bg-neutral-950 rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl">
        {/* Channel Banner */}
        <div className="relative h-44 sm:h-64 w-full bg-neutral-900 overflow-hidden">
          <img
            src={channel.bannerUrl}
            alt={`${channel.name} Banner`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
        </div>

        {/* Creator Channel Header Info */}
        <div className="px-6 sm:px-8 pb-6 -mt-16 sm:-mt-20 relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-5">
            {/* Left: Avatar & Channel Names */}
            <div className="flex items-end gap-5">
              <img
                src={channel.avatarUrl}
                alt={channel.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover ring-4 ring-black shadow-2xl bg-neutral-900 shrink-0"
              />

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                    {channel.name}
                  </h1>
                  {channel.isVerified && (
                    <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0" />
                  )}
                  <span className="text-[10px] font-bold bg-red-950 text-red-400 border border-red-800/60 px-2 py-0.5 rounded-full font-mono">
                    投稿者公式チャンネル
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 font-mono">
                  <span className="text-white font-bold">{channel.handle}</span>
                  <span>•</span>
                  <span className="text-neutral-300">
                    チャンネル登録者数 {channel.subscriberCount}
                  </span>
                  <span>•</span>
                  <span>動画 {channel.videosCount} 本</span>
                </div>

                <p className="text-xs text-neutral-300 max-w-2xl line-clamp-2 leading-relaxed">
                  {channel.bio}
                </p>
              </div>
            </div>

            {/* Right: Subscribe Button & Share Channel */}
            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              <button
                onClick={handleToggleSubscribe}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full text-xs font-black transition flex items-center justify-center gap-2 shadow-lg ${
                  isSubscribed
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/40 border border-red-500/50'
                }`}
              >
                {isSubscribed ? (
                  <>
                    <Bell className="w-4 h-4 text-red-500 fill-red-500" />
                    <span>登録済み (通知ON)</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    <span>チャンネル登録</span>
                  </>
                )}
              </button>

              <button
                onClick={handleShareChannel}
                className="px-4 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-red-600/40 text-xs font-bold text-neutral-200 transition flex items-center gap-1.5"
                title="チャンネルリンクをコピー"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-red-500" />
                    <span>コピー済み</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-red-400" />
                    <span>共有</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* YouTube Channel Tabs */}
          <div className="flex items-center gap-1 border-b border-neutral-800 pt-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-5 py-3 text-xs font-bold transition border-b-2 whitespace-nowrap ${
                activeTab === 'home'
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              ホーム
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`px-5 py-3 text-xs font-bold transition border-b-2 whitespace-nowrap ${
                activeTab === 'videos'
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              動画 ({channel.videos.length})
            </button>

            <button
              onClick={() => setActiveTab('community')}
              className={`px-5 py-3 text-xs font-bold transition border-b-2 whitespace-nowrap ${
                activeTab === 'community'
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              コミュニティ ({channel.communityPosts.length})
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`px-5 py-3 text-xs font-bold transition border-b-2 whitespace-nowrap ${
                activeTab === 'about'
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              概要 (About)
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Home (Featured Video + Uploads) */}
      {activeTab === 'home' && (
        <div className="space-y-6">
          {/* Featured Video Showcase Card */}
          <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-500" />
              <h2 className="text-xs font-black text-white uppercase tracking-wider">
                注目・おすすめの動画 (Featured Video)
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Thumbnail / Player preview */}
              <div
                onClick={() =>
                  onSelectVideo(channel.featuredVideoId, channel.featuredVideoTitle)
                }
                className="lg:col-span-5 relative aspect-video rounded-xl overflow-hidden bg-black border border-neutral-800 group cursor-pointer shadow-lg"
              >
                <img
                  src={`https://img.youtube.com/vi/${channel.featuredVideoId}/mqdefault.jpg`}
                  alt={channel.featuredVideoTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-600/50 group-hover:scale-110 transition">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Featured Video Info */}
              <div className="lg:col-span-7 space-y-3">
                <h3
                  onClick={() =>
                    onSelectVideo(channel.featuredVideoId, channel.featuredVideoTitle)
                  }
                  className="text-base sm:text-lg font-bold text-white hover:text-red-400 cursor-pointer transition leading-snug"
                >
                  {channel.featuredVideoTitle}
                </h3>

                <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
                  <span>{channel.name}</span>
                  <span>•</span>
                  <span>YouTube Player for Education 集中再生対応</span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed font-sans line-clamp-3">
                  {channel.featuredVideoDesc}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() =>
                      onSelectVideo(channel.featuredVideoId, channel.featuredVideoTitle)
                    }
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/40 transition inline-flex items-center gap-2 border border-red-500/50"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Education プレイヤーで今すぐ再生</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Videos Row */}
          <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500" />
                <span>アップロード動画</span>
              </h2>
              <button
                onClick={() => setActiveTab('videos')}
                className="text-xs text-red-500 hover:underline font-bold"
              >
                すべて見る ({channel.videos.length}) &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
              {channel.videos.slice(0, 3).map((v) => (
                <div
                  key={v.id}
                  onClick={() => onSelectVideo(v.id, v.title)}
                  className="bg-black rounded-xl border border-neutral-900 hover:border-red-600/50 p-3 cursor-pointer group transition space-y-2 shadow-sm"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900">
                    <img
                      src={v.thumbnailUrl}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute bottom-1 right-1 text-[10px] font-mono font-bold bg-black/90 text-white px-1.5 py-0.5 rounded">
                      {v.duration}
                    </span>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <Play className="w-8 h-8 text-red-500 fill-red-500" />
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-neutral-200 group-hover:text-white line-clamp-2">
                      {v.title}
                    </h3>
                    <p className="text-[10px] text-neutral-400 font-mono">
                      {v.views} 視聴 • {v.uploadedAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Videos (Full Video Grid & Filter) */}
      {activeTab === 'videos' && (
        <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-6 shadow-2xl space-y-5">
          {/* Header & Sort */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Tv className="w-4 h-4 text-red-500" />
              <span>{channel.name} の動画一覧</span>
            </h2>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setVideoSort('latest')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  videoSort === 'latest'
                    ? 'bg-red-600 text-white'
                    : 'bg-black text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                最新順
              </button>
              <button
                onClick={() => setVideoSort('popular')}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  videoSort === 'popular'
                    ? 'bg-red-600 text-white'
                    : 'bg-black text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                人気順
              </button>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            {displayedVideos.map((v) => (
              <div
                key={v.id}
                onClick={() => onSelectVideo(v.id, v.title)}
                className="bg-black rounded-xl border border-neutral-900 hover:border-red-600/50 p-3 cursor-pointer group transition space-y-2 shadow-sm"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900">
                  <img
                    src={v.thumbnailUrl}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute bottom-1 right-1 text-[10px] font-mono font-bold bg-black/90 text-white px-1.5 py-0.5 rounded">
                    {v.duration}
                  </span>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Play className="w-8 h-8 text-red-500 fill-red-500" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-neutral-200 group-hover:text-white line-clamp-2">
                    {v.title}
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-mono">
                    {v.views} 視聴 • {v.uploadedAt}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {channel.videos.length > visibleVideosCount && (
            <div className="pt-2 text-center">
              <button
                onClick={() => setVisibleVideosCount((prev) => prev + 6)}
                className="px-6 py-2.5 bg-black hover:bg-neutral-900 border border-neutral-800 hover:border-red-600/40 text-xs font-bold text-red-500 rounded-xl transition"
              >
                さらに動画を表示
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Community Posts */}
      {activeTab === 'community' && (
        <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-6 shadow-2xl space-y-5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-red-500" />
            <span>コミュニティの投稿 (Community Posts)</span>
          </h2>

          <div className="space-y-4">
            {channel.communityPosts.map((post) => (
              <div
                key={post.id}
                className="bg-black rounded-2xl border border-neutral-900 p-5 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={channel.avatarUrl}
                    alt={channel.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-neutral-800"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{channel.name}</span>
                      {channel.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      {post.date}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans">
                  {post.content}
                </p>

                <div className="flex items-center gap-4 pt-1 text-xs text-neutral-400 border-t border-neutral-900">
                  <div className="flex items-center gap-1.5 text-red-400 font-mono">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{post.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.commentsCount} 件のコメント</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: About / Description */}
      {activeTab === 'about' && (
        <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-6 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Bio & Description */}
            <div className="md:col-span-8 space-y-4">
              <h2 className="text-sm font-bold text-white">説明 (About Description)</h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans whitespace-pre-line bg-black p-4 rounded-xl border border-neutral-900">
                {channel.bio}
              </p>
            </div>

            {/* Right: Stats Details */}
            <div className="md:col-span-4 space-y-4">
              <h2 className="text-sm font-bold text-white">詳細 (Channel Stats)</h2>
              <div className="bg-black p-4 rounded-xl border border-neutral-900 space-y-3 text-xs">
                <div className="flex items-center gap-2.5 text-neutral-300">
                  <Calendar className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{channel.joinedDate} に登録</span>
                </div>
                <div className="flex items-center gap-2.5 text-neutral-300">
                  <Eye className="w-4 h-4 text-red-500 shrink-0" />
                  <span>総視聴回数 {channel.totalViews}</span>
                </div>
                <div className="flex items-center gap-2.5 text-neutral-300">
                  <Globe className="w-4 h-4 text-red-500 shrink-0" />
                  <span>国・地域: {channel.country}</span>
                </div>
                <div className="flex items-center gap-2.5 text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                  <span>認証バッジ: 公式クリエイター</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
