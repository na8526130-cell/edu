import React, { useState } from 'react';
import {
  Play,
  ExternalLink,
  Copy,
  Check,
  Code,
  Sparkles,
  Layers,
  ShieldCheck,
  X,
  Share2,
  Tv,
  CheckCircle2,
} from 'lucide-react';
import {
  CommentItem,
  EducationParamState,
  PlayerSettings,
  UserProfile,
} from '../types';
import {
  extractVideoId,
  buildEducationEmbedUrl,
  buildIframeHtml,
} from '../utils/youtube';
import { ParamInspector } from './ParamInspector';
import { VideoPlayerSection } from './VideoPlayerSection';
import { CommentsSection } from './CommentsSection';
import { RelatedVideosSection } from './RelatedVideosSection';

interface PlayerViewProps {
  urlInput: string;
  setUrlInput: (val: string) => void;
  paramState: EducationParamState;
  onRefreshParam: () => void;
  settings: PlayerSettings;
  onUpdateSettings: (settings: Partial<PlayerSettings>) => void;
  currentUser: UserProfile;
  comments: CommentItem[];
  onCommentsChange: (updated: CommentItem[]) => void;
  onSelectVideo: (videoId: string, title?: string) => void;
  onOpenCreatorChannel: (channelName: string) => void;
}

export const PlayerView: React.FC<PlayerViewProps> = ({
  urlInput,
  setUrlInput,
  paramState,
  onRefreshParam,
  settings,
  onUpdateSettings,
  currentUser,
  comments,
  onCommentsChange,
  onSelectVideo,
  onOpenCreatorChannel,
}) => {
  const [copiedType, setCopiedType] = useState<'url' | 'iframe' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const videoId = extractVideoId(urlInput);
  const activeBaseParam =
    settings.useCustomParam && settings.customParam.trim()
      ? settings.customParam.trim()
      : paramState.param;

  const currentEmbedUrl = videoId
    ? buildEducationEmbedUrl(videoId, activeBaseParam, settings)
    : '';

  const iframeHtmlCode = currentEmbedUrl
    ? buildIframeHtml(currentEmbedUrl)
    : '';

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleCopyUrl = async () => {
    if (!currentEmbedUrl) return;
    try {
      await navigator.clipboard.writeText(currentEmbedUrl);
      setCopiedType('url');
      triggerToast('YouTube Education 埋め込み URL をコピーしました！');
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      triggerToast('コピーに失敗しました');
    }
  };

  const handleCopyIframe = async () => {
    if (!iframeHtmlCode) return;
    try {
      await navigator.clipboard.writeText(iframeHtmlCode);
      setCopiedType('iframe');
      triggerToast('iframe 埋め込みタグをコピーしました！');
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      triggerToast('コピーに失敗しました');
    }
  };

  const handleOpenNewTab = () => {
    if (!currentEmbedUrl) return;
    window.open(currentEmbedUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Top Grid: Main Video + Info + Comments (Left 8 cols) & Related Videos + Params (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Area (8 cols): Player, Channel Details, Actions, Comments */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Video Player Section */}
          <VideoPlayerSection
            videoId={videoId}
            embedUrl={currentEmbedUrl}
            paramState={paramState}
            settings={settings}
            currentUser={currentUser}
            onOpenNewTab={handleOpenNewTab}
            onCopyUrl={handleCopyUrl}
            onCopyIframe={handleCopyIframe}
            onOpenCreatorChannel={onOpenCreatorChannel}
            isCopiedUrl={copiedType === 'url'}
            isCopiedIframe={copiedType === 'iframe'}
          />

          {/* YouTube Comments & Nested Replies Section */}
          <CommentsSection
            videoId={videoId || 'dQw4w9WgXcQ'}
            currentUser={currentUser}
            comments={comments}
            onCommentsChange={onCommentsChange}
          />
        </div>

        {/* Right Area (4 cols): Related Videos & Parameter Inspector */}
        <div className="lg:col-span-4 space-y-6">
          {/* URL Input Box & Generator Bar */}
          <div className="bg-neutral-950 rounded-2xl border border-neutral-800 hover:border-red-600/40 p-4 sm:p-5 shadow-2xl space-y-3.5 transition duration-300">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="youtube-url-input"
                  className="text-xs font-black text-red-500 uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Tv className="w-3.5 h-3.5 text-red-500" />
                  <span>YouTube URL / 動画ID を入力</span>
                </label>
                {videoId && (
                  <span className="text-[11px] font-mono bg-red-950 text-red-400 px-2 py-0.5 rounded border border-red-800/60 font-bold">
                    ID: {videoId}
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  id="youtube-url-input"
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="例: https://www.youtube.com/watch?v=..."
                  className="w-full bg-black border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition font-mono"
                />
                {urlInput && (
                  <button
                    onClick={() => setUrlInput('')}
                    className="absolute right-3 top-2.5 text-neutral-500 hover:text-red-400 p-1 rounded-md transition"
                    title="クリア"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleOpenNewTab}
                disabled={!videoId}
                className="bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 text-neutral-100 font-bold py-2 px-3 rounded-xl text-xs transition flex items-center justify-center gap-2 border border-neutral-800 hover:border-red-600/40"
              >
                <ExternalLink className="w-3.5 h-3.5 text-red-400" />
                <span>別タブで開く</span>
              </button>

              <button
                onClick={handleCopyUrl}
                disabled={!videoId}
                className="bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold py-2 px-3 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-red-600/40 border border-red-500/50"
              >
                {copiedType === 'url' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>コピー完了</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>URLコピー</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Related Videos & Next Suggestions Section */}
          <RelatedVideosSection
            currentVideoId={videoId}
            onSelectVideo={onSelectVideo}
          />

          {/* Dynamic Education Parameter Inspector & Sync */}
          <ParamInspector
            paramState={paramState}
            onRefresh={onRefreshParam}
            settings={settings}
            onUpdateSettings={onUpdateSettings}
          />
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-neutral-900 border border-red-500/60 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
