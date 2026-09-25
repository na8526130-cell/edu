import React, { useState } from 'react';
import {
  Play,
  Flame,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ListFilter,
  Eye,
  Radio,
} from 'lucide-react';
import { RelatedVideo } from '../types';
import { INITIAL_RELATED_VIDEOS } from '../utils/mockData';

interface RelatedVideosSectionProps {
  currentVideoId: string;
  onSelectVideo: (videoId: string, title?: string) => void;
}

const CATEGORIES = ['すべて', '関連動画', 'おすすめ', '音楽', '勉強用', '開発・技術'];

export const RelatedVideosSection: React.FC<RelatedVideosSectionProps> = ({
  currentVideoId,
  onSelectVideo,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('すべて');
  // Initial 5 videos, expands with "さらに表示"
  const [visibleCount, setVisibleCount] = useState(5);

  const filteredVideos = INITIAL_RELATED_VIDEOS.filter((video) => {
    if (selectedCategory === 'すべて' || selectedCategory === '関連動画') return true;
    return video.category === selectedCategory;
  });

  const displayedVideos = filteredVideos.slice(0, visibleCount);
  const hasMore = filteredVideos.length > visibleCount;

  return (
    <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-4 sm:p-5 shadow-2xl space-y-4">
      {/* Header & Filter Pills */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-sm shadow-red-500" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              関連動画 & 次の候補
            </h2>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            {filteredVideos.length}件
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setVisibleCount(5);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/30'
                  : 'bg-black text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Related Videos List */}
      <div className="space-y-3">
        {displayedVideos.map((video) => {
          const isCurrent = currentVideoId === video.id;

          return (
            <div
              key={video.id}
              onClick={() => onSelectVideo(video.id, video.title)}
              className={`flex gap-3 p-2 rounded-xl cursor-pointer transition group border ${
                isCurrent
                  ? 'bg-red-950/40 border-red-600/60 shadow-md shadow-red-950/50'
                  : 'bg-black/60 hover:bg-neutral-900/90 border-transparent hover:border-neutral-800'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative w-36 sm:w-40 aspect-video rounded-lg overflow-hidden shrink-0 bg-neutral-900 border border-neutral-800 group-hover:border-red-600/50 transition">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
                <span
                  className={`absolute bottom-1 right-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    video.duration === 'LIVE'
                      ? 'bg-red-600 text-white flex items-center gap-0.5 animate-pulse'
                      : 'bg-black/90 text-white'
                  }`}
                >
                  {video.duration === 'LIVE' && <Radio className="w-2.5 h-2.5 inline" />}
                  {video.duration}
                </span>

                {isCurrent && (
                  <div className="absolute inset-0 bg-red-600/30 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded shadow">
                      再生中
                    </span>
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="flex-1 min-w-0 space-y-1 py-0.5">
                <h3
                  className={`text-xs font-bold line-clamp-2 leading-snug transition ${
                    isCurrent
                      ? 'text-red-400 font-black'
                      : 'text-neutral-200 group-hover:text-white'
                  }`}
                  title={video.title}
                >
                  {video.title}
                </h3>

                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                  <span className="truncate hover:text-neutral-200 font-medium">
                    {video.channelTitle}
                  </span>
                  <CheckCircle2 className="w-3 h-3 text-neutral-400 shrink-0" />
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono">
                  <span>{video.viewCount}</span>
                  <span>•</span>
                  <span>{video.publishedAt}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* "さらに表示" Expand Button for Related Videos */}
      {hasMore && (
        <div className="pt-1">
          <button
            onClick={() => setVisibleCount((prev) => prev + 5)}
            className="w-full py-2.5 px-3 rounded-xl bg-black hover:bg-neutral-900 text-xs font-bold text-red-500 hover:text-red-400 border border-neutral-800 hover:border-red-600/40 transition flex items-center justify-center gap-1.5 shadow-sm"
          >
            <ChevronDown className="w-4 h-4 text-red-500" />
            <span>関連動画をさらに表示 (残り {filteredVideos.length - visibleCount} 件)</span>
          </button>
        </div>
      )}
    </div>
  );
};
