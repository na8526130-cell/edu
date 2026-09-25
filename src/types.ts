export interface VideoPreset {
  id: string;
  title: string;
  url: string;
  category: string;
  description: string;
  channelTitle?: string;
  channelAvatar?: string;
  subscribers?: string;
  viewCount?: string;
  publishedAt?: string;
  likes?: number;
}

export interface EducationParamState {
  param: string;
  rawA1: string;
  source: 'spreadsheet_live' | 'cache' | 'fallback' | 'custom' | 'empty_default';
  updatedAt: string;
  isLoading: boolean;
  error?: string | null;
}

export interface PlayerSettings {
  autoplay: boolean;
  mute: boolean;
  loop: boolean;
  controls: boolean;
  startTime: number;
  customParam: string;
  useCustomParam: boolean;
}

export interface CommentReply {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  isOwner?: boolean;
}

export interface CommentItem {
  id: string;
  videoId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  isHeartedByCreator?: boolean;
  replies: CommentReply[];
  totalRepliesCount?: number;
}

export interface RelatedVideo {
  id: string;
  title: string;
  channelTitle: string;
  channelAvatar: string;
  viewCount: string;
  publishedAt: string;
  duration: string;
  thumbnailUrl: string;
  category: string;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatarUrl: string;
  bannerUrl: string;
  subscriberCount: string;
  videosCount: number;
  joinedDate: string;
  bio: string;
  isVerified: boolean;
}

export interface CreatorChannelVideo {
  id: string;
  title: string;
  views: string;
  uploadedAt: string;
  duration: string;
  thumbnailUrl: string;
}

export interface CreatorCommunityPost {
  id: string;
  date: string;
  content: string;
  likes: number;
  commentsCount: number;
  imageUrl?: string;
}

export interface CreatorChannel {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  bannerUrl: string;
  subscriberCount: string;
  videosCount: number;
  joinedDate: string;
  bio: string;
  isVerified: boolean;
  totalViews: string;
  country: string;
  featuredVideoId: string;
  featuredVideoTitle: string;
  featuredVideoDesc: string;
  videos: CreatorChannelVideo[];
  communityPosts: CreatorCommunityPost[];
}

export interface WatchHistoryItem {
  id: string;
  videoId: string;
  title: string;
  channelTitle: string;
  watchedAt: number;
  thumbnailUrl: string;
}

export interface Playlist {
  id: string;
  title: string;
  videoCount: number;
  updatedAt: string;
  thumbnailUrl: string;
  videoIds: string[];
}
