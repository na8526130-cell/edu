import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { PlayerView } from './components/PlayerView';
import { AccountView } from './components/AccountView';
import { CreatorChannelView } from './components/CreatorChannelView';
import { GasExportView } from './components/GasExportView';
import { DocsView } from './components/DocsView';
import {
  CommentItem,
  CreatorChannel,
  EducationParamState,
  PlayerSettings,
  UserProfile,
} from './types';
import { SPREADSHEET_ID, extractVideoId } from './utils/youtube';
import {
  getCurrentUser,
  getStoredComments,
  addToWatchHistory,
} from './utils/storage';
import { INITIAL_RELATED_VIDEOS, getCreatorChannel } from './utils/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'player' | 'creator' | 'account' | 'gas' | 'docs'>('player');
  const [urlInput, setUrlInput] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');

  const [currentUser, setCurrentUser] = useState<UserProfile>(getCurrentUser());

  // Current Video ID and Creator
  const currentVideoId = extractVideoId(urlInput) || 'dQw4w9WgXcQ';
  const matchedPreset = INITIAL_RELATED_VIDEOS.find((v) => v.id === currentVideoId);
  const defaultCreatorName = matchedPreset ? matchedPreset.channelTitle : 'Rick Astley';

  const [activeCreatorChannel, setActiveCreatorChannel] = useState<CreatorChannel>(
    getCreatorChannel(defaultCreatorName, currentVideoId)
  );

  const [comments, setComments] = useState<CommentItem[]>(
    getStoredComments(currentVideoId)
  );

  const [paramState, setParamState] = useState<EducationParamState>({
    param: '',
    rawA1: '',
    source: 'empty_default',
    updatedAt: '',
    isLoading: true,
    error: null,
  });

  const [playerSettings, setPlayerSettings] = useState<PlayerSettings>({
    autoplay: false,
    mute: false,
    loop: false,
    controls: true,
    startTime: 0,
    customParam: '',
    useCustomParam: false,
  });

  const handleUpdateSettings = (newSettings: Partial<PlayerSettings>) => {
    setPlayerSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const fetchParam = useCallback(async () => {
    setParamState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await fetch('/api/education-param?refresh=true');
      if (res.ok) {
        const data = await res.json();
        setParamState({
          param: data.param || '',
          rawA1: data.rawA1 || data.param || '',
          source: data.source || 'cache',
          updatedAt: data.updatedAt || new Date().toISOString(),
          isLoading: false,
          error: null,
        });
        return;
      }
    } catch {}

    try {
      const gvizUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv`;
      const res2 = await fetch(gvizUrl);
      if (res2.ok) {
        const text = await res2.text();
        const firstLine = text.split('\n')[0].replace(/^"|"$/g, '').trim();
        let param = firstLine;
        if (param && !param.startsWith('?') && !param.startsWith('&')) {
          param = '?' + param;
        }
        setParamState({
          param,
          rawA1: firstLine,
          source: 'spreadsheet_live',
          updatedAt: new Date().toISOString(),
          isLoading: false,
          error: null,
        });
        return;
      }
    } catch {}

    setParamState({
      param: '',
      rawA1: '',
      source: 'empty_default',
      updatedAt: new Date().toISOString(),
      isLoading: false,
      error: null,
    });
  }, []);

  useEffect(() => {
    fetchParam();
  }, [fetchParam]);

  // Handle opening the Creator's Channel (YouTubeを投稿している人のアカウント画面)
  const handleOpenCreatorChannel = (channelName: string) => {
    const creator = getCreatorChannel(channelName, extractVideoId(urlInput));
    setActiveCreatorChannel(creator);
    setActiveTab('creator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle video selection from Related Videos, Channel, or History
  const handleSelectVideo = (videoId: string, title?: string) => {
    setUrlInput(videoId);
    setActiveTab('player');
    const matched = INITIAL_RELATED_VIDEOS.find((v) => v.id === videoId);
    const videoTitle = title || (matched ? matched.title : `YouTube 動画 (${videoId})`);
    const channelName = matched ? matched.channelTitle : 'YouTube Creator';

    setActiveCreatorChannel(getCreatorChannel(channelName, videoId));
    
    addToWatchHistory({
      videoId,
      title: videoTitle,
      channelTitle: channelName,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    });

    setComments(getStoredComments(videoId));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle search submission in header
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const vid = extractVideoId(searchInput.trim());
    if (vid) {
      handleSelectVideo(vid);
      setSearchInput('');
    } else {
      setUrlInput(searchInput.trim());
      setActiveTab('player');
      setSearchInput('');
    }
  };

  // Sync creator & comments when videoId changes from manual input
  useEffect(() => {
    const vid = extractVideoId(urlInput);
    if (vid) {
      setComments(getStoredComments(vid));
      const matched = INITIAL_RELATED_VIDEOS.find((v) => v.id === vid);
      const chName = matched ? matched.channelTitle : 'YouTube Creator';
      setActiveCreatorChannel(getCreatorChannel(chName, vid));

      addToWatchHistory({
        videoId: vid,
        title: matched ? matched.title : `YouTube 動画 (${vid})`,
        channelTitle: chName,
        thumbnailUrl: `https://img.youtube.com/vi/${vid}/mqdefault.jpg`,
      });
    }
  }, [urlInput]);

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col antialiased selection:bg-red-600 selection:text-white font-sans">
      {/* Real YouTube-Style Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        paramState={paramState}
        onRefreshParam={fetchParam}
        currentUser={currentUser}
        activeCreatorName={activeCreatorChannel.name}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6">
        {activeTab === 'player' && (
          <PlayerView
            urlInput={urlInput}
            setUrlInput={setUrlInput}
            paramState={paramState}
            onRefreshParam={fetchParam}
            settings={playerSettings}
            onUpdateSettings={handleUpdateSettings}
            currentUser={currentUser}
            comments={comments}
            onCommentsChange={setComments}
            onSelectVideo={handleSelectVideo}
            onOpenCreatorChannel={handleOpenCreatorChannel}
          />
        )}

        {activeTab === 'creator' && (
          <CreatorChannelView
            channel={activeCreatorChannel}
            onSelectVideo={handleSelectVideo}
            onBackToPlayer={() => setActiveTab('player')}
          />
        )}

        {activeTab === 'account' && (
          <AccountView
            currentUser={currentUser}
            onUserChange={setCurrentUser}
            onSelectVideo={handleSelectVideo}
            onBackToPlayer={() => setActiveTab('player')}
          />
        )}

        {activeTab === 'gas' && <GasExportView />}

        {activeTab === 'docs' && <DocsView />}
      </main>

      {/* YouTube Dark Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950/90 py-5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-black text-white">YouTubebate版</span>
            <span>•</span>
            <span>YouTube Player for Education (赤×黒 エディション)</span>
            <span>•</span>
            <span className="text-red-500 font-mono">
              Spreadsheet: {SPREADSHEET_ID.substring(0, 8)}...
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('player')}
              className="text-neutral-400 hover:text-white transition font-medium"
            >
              プレイヤー
            </button>
            <button
              onClick={() => setActiveTab('creator')}
              className="text-neutral-400 hover:text-red-400 transition font-medium"
            >
              投稿者チャンネル ({activeCreatorChannel.name})
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className="text-neutral-400 hover:text-red-400 transition font-medium"
            >
              マイアカウント
            </button>
            <button
              onClick={() => setActiveTab('gas')}
              className="text-neutral-400 hover:text-red-400 transition font-medium"
            >
              code.gs / index.html
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className="text-neutral-400 hover:text-red-400 transition font-medium"
            >
              仕様ドキュメント
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
