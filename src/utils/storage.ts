import { CommentItem, CommentReply, Playlist, UserProfile, WatchHistoryItem } from '../types';
import { DEFAULT_USERS, INITIAL_COMMENTS } from './mockData';

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'youtubebate_current_user_id',
  USERS: 'youtubebate_users',
  COMMENTS: 'youtubebate_comments_v2',
  WATCH_HISTORY: 'youtubebate_watch_history',
  LIKED_VIDEOS: 'youtubebate_liked_videos',
  PLAYLISTS: 'youtubebate_playlists',
  SUBSCRIBED_CHANNELS: 'youtubebate_subscribed_channels',
};

export function getStoredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_USERS;
}

export function saveStoredUsers(users: UserProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch {}
}

export function getCurrentUser(): UserProfile {
  const users = getStoredUsers();
  try {
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (currentId) {
      const found = users.find((u) => u.id === currentId);
      if (found) return found;
    }
  } catch {}
  return users[0] || DEFAULT_USERS[0];
}

export function setCurrentUserId(userId: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  } catch {}
}

export function updateCurrentUser(updated: Partial<UserProfile>): UserProfile {
  const users = getStoredUsers();
  const current = getCurrentUser();
  const index = users.findIndex((u) => u.id === current.id);
  const newUser = { ...current, ...updated };
  if (index >= 0) {
    users[index] = newUser;
  } else {
    users.push(newUser);
  }
  saveStoredUsers(users);
  return newUser;
}

export function getStoredComments(videoId: string): CommentItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    if (raw) {
      const all: Record<string, CommentItem[]> = JSON.parse(raw);
      if (all[videoId] && all[videoId].length > 0) {
        return all[videoId];
      }
    }
  } catch {}
  return INITIAL_COMMENTS.map((c) => ({ ...c, videoId }));
}

export function saveCommentsForVideo(videoId: string, comments: CommentItem[]): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    const all: Record<string, CommentItem[]> = raw ? JSON.parse(raw) : {};
    all[videoId] = comments;
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(all));
  } catch {}
}

export function addComment(
  videoId: string,
  user: UserProfile,
  text: string
): CommentItem[] {
  const comments = getStoredComments(videoId);
  const newComment: CommentItem = {
    id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    videoId,
    authorName: user.name,
    authorHandle: user.handle,
    authorAvatar: user.avatarUrl,
    text,
    timestamp: 'たった今',
    likes: 0,
    isLiked: false,
    replies: [],
    totalRepliesCount: 0,
  };
  const updated = [newComment, ...comments];
  saveCommentsForVideo(videoId, updated);
  return updated;
}

export function addReply(
  videoId: string,
  commentId: string,
  user: UserProfile,
  text: string
): CommentItem[] {
  const comments = getStoredComments(videoId);
  const newReply: CommentReply = {
    id: `r_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    authorName: user.name,
    authorHandle: user.handle,
    authorAvatar: user.avatarUrl,
    text,
    timestamp: 'たった今',
    likes: 0,
    isLiked: false,
    isOwner: true,
  };

  const updated = comments.map((c) => {
    if (c.id === commentId) {
      return {
        ...c,
        replies: [...c.replies, newReply],
        totalRepliesCount: (c.totalRepliesCount || c.replies.length) + 1,
      };
    }
    return c;
  });

  saveCommentsForVideo(videoId, updated);
  return updated;
}

export function getWatchHistory(): WatchHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WATCH_HISTORY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [
    {
      id: 'h1',
      videoId: 'dQw4w9WgXcQ',
      title: 'Rick Astley - Never Gonna Give You Up',
      channelTitle: 'Rick Astley',
      watchedAt: Date.now() - 1000 * 60 * 30,
      thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
    },
    {
      id: 'h2',
      videoId: 'L_LUpnjgPso',
      title: 'synthwave radio 🌌 - chill / retro beats',
      channelTitle: 'Lofi Girl',
      watchedAt: Date.now() - 1000 * 60 * 60 * 4,
      thumbnailUrl: 'https://img.youtube.com/vi/L_LUpnjgPso/mqdefault.jpg',
    },
    {
      id: 'h3',
      videoId: 'M7lc1UVf-VE',
      title: 'YouTube Developers: Introducing YouTube Player API',
      channelTitle: 'Google Developers',
      watchedAt: Date.now() - 1000 * 60 * 60 * 24,
      thumbnailUrl: 'https://img.youtube.com/vi/M7lc1UVf-VE/mqdefault.jpg',
    },
  ];
}

export function addToWatchHistory(item: Omit<WatchHistoryItem, 'id' | 'watchedAt'>): void {
  try {
    const list = getWatchHistory();
    const filtered = list.filter((h) => h.videoId !== item.videoId);
    const updated = [
      {
        ...item,
        id: `h_${Date.now()}`,
        watchedAt: Date.now(),
      },
      ...filtered,
    ].slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.WATCH_HISTORY, JSON.stringify(updated));
  } catch {}
}

export function getLikedVideoIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LIKED_VIDEOS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return ['dQw4w9WgXcQ'];
}

export function toggleLikedVideo(videoId: string): boolean {
  try {
    const list = getLikedVideoIds();
    const isLiked = list.includes(videoId);
    const updated = isLiked ? list.filter((id) => id !== videoId) : [...list, videoId];
    localStorage.setItem(STORAGE_KEYS.LIKED_VIDEOS, JSON.stringify(updated));
    return !isLiked;
  } catch {
    return false;
  }
}

export function getSubscribedChannels(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIBED_CHANNELS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return ['Rick Astley', 'Lofi Girl'];
}

export function toggleSubscribeChannel(channelName: string): boolean {
  try {
    const list = getSubscribedChannels();
    const isSub = list.includes(channelName);
    const updated = isSub ? list.filter((n) => n !== channelName) : [...list, channelName];
    localStorage.setItem(STORAGE_KEYS.SUBSCRIBED_CHANNELS, JSON.stringify(updated));
    return !isSub;
  } catch {
    return false;
  }
}
