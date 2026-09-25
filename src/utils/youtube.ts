import { VideoPreset } from '../types';

export const SPREADSHEET_ID = '1dily2wiik92TAyK3zyIsu8TDuyYNoF20IM1iMk_X-pg';

/**
 * Extracts 11-character YouTube video ID from various URL formats
 */
export function extractVideoId(input: string): string {
  if (!input) return '';
  const str = input.trim();

  // If already 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
    return str;
  }

  // Standard watch: ?v=XXXXXXXXXXX
  const watchMatch = str.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  // Short URL: youtu.be/XXXXXXXXXXX
  const shortMatch = str.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // Shorts: youtube.com/shorts/XXXXXXXXXXX
  const shortsMatch = str.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) return shortsMatch[1];

  // Embed: youtube.com/embed/XXXXXXXXXXX or youtubeeducation.com/embed/XXXXXXXXXXX
  const embedMatch = str.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  // Live: youtube.com/live/XXXXXXXXXXX
  const liveMatch = str.match(/live\/([a-zA-Z0-9_-]{11})/);
  if (liveMatch) return liveMatch[1];

  // Attribution or other query formats
  const anyMatch = str.match(/([a-zA-Z0-9_-]{11})/);
  if (anyMatch && anyMatch[1].length === 11) {
    return anyMatch[1];
  }

  return '';
}

/**
 * Generates the full YouTube Education embed URL
 */
export function buildEducationEmbedUrl(
  videoId: string,
  baseParam: string = '',
  settings?: {
    autoplay?: boolean;
    mute?: boolean;
    loop?: boolean;
    controls?: boolean;
    startTime?: number;
  }
): string {
  const cleanId = extractVideoId(videoId);
  if (!cleanId) return '';

  let param = baseParam.trim();
  if (param && !param.startsWith('?') && !param.startsWith('&')) {
    param = '?' + param;
  }

  const queryParts: string[] = [];
  if (settings?.autoplay) queryParts.push('autoplay=1');
  if (settings?.mute) queryParts.push('mute=1');
  if (settings?.controls === false) queryParts.push('controls=0');
  if (settings?.loop) {
    queryParts.push('loop=1');
    queryParts.push(`playlist=${cleanId}`);
  }
  if (settings?.startTime && settings.startTime > 0) {
    queryParts.push(`start=${settings.startTime}`);
  }

  if (queryParts.length > 0) {
    const joiner = param ? (param.includes('?') ? '&' : '?') : '?';
    param = param + joiner + queryParts.join('&');
  }

  return `https://www.youtubeeducation.com/embed/${cleanId}${param}`;
}

/**
 * Generates iframe HTML embed tag
 */
export function buildIframeHtml(embedUrl: string, title = 'YouTube video player'): string {
  return `<iframe width="100%" height="100%" src="${embedUrl}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
}

export const PRESET_VIDEOS: VideoPreset[] = [
  {
    id: 'dQw4w9WgXcQ',
    title: 'Never Gonna Give You Up',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    category: 'テスト・音楽',
    description: 'クラシックなテスト動画 (80s Synthpop)',
  },
  {
    id: 'L_LUpnjgPso',
    title: 'Lofi Hip Hop Radio - Beats to Relax/Study to',
    url: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    category: '勉強・BGM',
    description: '学習・集中用 ライブストリーム/音楽',
  },
  {
    id: 'M7lc1UVf-VE',
    title: 'YouTube Developers API Demo',
    url: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    category: 'プログラミング',
    description: '公式 YouTube IFrame API ドキュメントデモ',
  },
  {
    id: 'fJ9rUzIMcZQ',
    title: 'Bohemian Rhapsody (Queen Official)',
    url: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    category: '音楽・カルチャー',
    description: '高解像度 リマスター版 公式ミュージックビデオ',
  },
  {
    id: 'kJQP7kiw5Fk',
    title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
    url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    category: 'ポップス',
    description: '全世界メガヒット ラテンポップ',
  },
];
