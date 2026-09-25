import React, { useState } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  CornerDownRight,
  ChevronDown,
  ChevronUp,
  Send,
  MoreVertical,
  CheckCircle,
  Heart,
  Flame,
} from 'lucide-react';
import { CommentItem, CommentReply, UserProfile } from '../types';
import { addComment, addReply } from '../utils/storage';

interface CommentsSectionProps {
  videoId: string;
  currentUser: UserProfile;
  comments: CommentItem[];
  onCommentsChange: (updated: CommentItem[]) => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  videoId,
  currentUser,
  comments,
  onCommentsChange,
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [sortBy, setSortBy] = useState<'top' | 'newest'>('top');

  // Pagination for main comments: "さらに表示"
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(3);

  // Active reply box per comment id
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Expanded replies state per comment id (boolean)
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  // Pagination for replies: "返信をさらに表示" (number of replies shown per comment)
  const [visibleRepliesCount, setVisibleRepliesCount] = useState<Record<string, number>>({});

  // Local likes tracking for instant visual feedback
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const [likedReplies, setLikedReplies] = useState<Record<string, boolean>>({});

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const updated = addComment(videoId, currentUser, newCommentText.trim());
    onCommentsChange(updated);
    setNewCommentText('');
    setIsInputFocused(false);
  };

  const handlePostReply = (commentId: string) => {
    if (!replyText.trim()) return;
    const updated = addReply(videoId, commentId, currentUser, replyText.trim());
    onCommentsChange(updated);
    setReplyText('');
    setReplyingCommentId(null);
    // ensure replies thread is expanded
    setExpandedReplies((prev) => ({ ...prev, [commentId]: true }));
    setVisibleRepliesCount((prev) => ({
      ...prev,
      [commentId]: Math.max(prev[commentId] || 2, 5),
    }));
  };

  const toggleExpandReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const nextState = !prev[commentId];
      if (nextState && !visibleRepliesCount[commentId]) {
        setVisibleRepliesCount((counts) => ({ ...counts, [commentId]: 2 }));
      }
      return { ...prev, [commentId]: nextState };
    });
  };

  const handleShowMoreReplies = (commentId: string, totalCount: number) => {
    setVisibleRepliesCount((prev) => {
      const current = prev[commentId] || 2;
      return { ...prev, [commentId]: Math.min(current + 3, totalCount) };
    });
  };

  const handleToggleLikeComment = (commentId: string) => {
    setLikedComments((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleToggleLikeReply = (replyId: string) => {
    setLikedReplies((prev) => ({ ...prev, [replyId]: !prev[replyId] }));
  };

  // Sort comments
  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'newest') {
      return 0; // maintain newest insertion order
    }
    return b.likes - a.likes;
  });

  const displayedComments = sortedComments.slice(0, visibleCommentsCount);
  const totalCommentsCount = comments.reduce(
    (acc, c) => acc + 1 + (c.totalRepliesCount || c.replies.length),
    0
  );

  return (
    <div className="bg-neutral-950 rounded-2xl border border-neutral-800 p-5 shadow-2xl space-y-6">
      {/* Comments Header: Count & Sort */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            <span>コメント</span>
            <span className="text-neutral-400 font-mono text-sm">
              {totalCommentsCount.toLocaleString()}件
            </span>
          </h2>

          <div className="flex items-center gap-1.5 text-xs text-neutral-400 bg-black px-2.5 py-1 rounded-lg border border-neutral-800">
            <span className="font-medium">並べ替え:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'top' | 'newest')}
              aria-label="並べ替え順"
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="top" className="bg-neutral-900 text-white">
                評価順
              </option>
              <option value="newest" className="bg-neutral-900 text-white">
                新しい順
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Add New Comment Box (Logged-in User) */}
      <div className="flex items-start gap-3 pt-2">
        <img
          src={currentUser.avatarUrl}
          alt={currentUser.name}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-red-600/40 shrink-0"
        />
        <div className="flex-1 space-y-2">
          <form onSubmit={handlePostComment}>
            <textarea
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              placeholder="コメントを追加..."
              rows={isInputFocused ? 3 : 1}
              className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition resize-none font-sans"
            />
            {isInputFocused && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-neutral-500">
                  {currentUser.name} ({currentUser.handle}) として投稿
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewCommentText('');
                      setIsInputFocused(false);
                    }}
                    className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white rounded-lg transition"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={!newCommentText.trim()}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg shadow-md shadow-red-600/40 transition flex items-center gap-1.5"
                  >
                    <Send className="w-3 h-3" />
                    <span>コメント</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6 pt-2">
        {displayedComments.map((comment) => {
          const isLiked = likedComments[comment.id] || comment.isLiked;
          const currentLikes = comment.likes + (likedComments[comment.id] ? 1 : 0);
          const isRepliesOpen = expandedReplies[comment.id] || false;
          const repliesLimit = visibleRepliesCount[comment.id] || 2;
          const repliesToShow = comment.replies.slice(0, repliesLimit);
          const hasMoreReplies = comment.replies.length > repliesLimit;

          return (
            <div key={comment.id} className="space-y-3 group">
              {/* Main Comment Row */}
              <div className="flex items-start gap-3">
                <img
                  src={comment.authorAvatar}
                  alt={comment.authorName}
                  className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-neutral-800"
                />
                <div className="flex-1 space-y-1">
                  {/* Author Header */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white hover:underline cursor-pointer">
                      {comment.authorName}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      {comment.authorHandle}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      • {comment.timestamp}
                    </span>
                  </div>

                  {/* Comment Text */}
                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed break-words font-sans">
                    {comment.text}
                  </p>

                  {/* Actions Row: Likes, Dislike, Heart, Reply */}
                  <div className="flex items-center gap-4 pt-1 text-xs text-neutral-400">
                    <button
                      onClick={() => handleToggleLikeComment(comment.id)}
                      className={`flex items-center gap-1.5 hover:text-white transition ${
                        isLiked ? 'text-red-500 font-bold' : ''
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      <span className="text-[11px] font-mono">{currentLikes > 0 ? currentLikes.toLocaleString() : ''}</span>
                    </button>

                    <button className="hover:text-white transition">
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>

                    {comment.isHeartedByCreator && (
                      <span className="flex items-center gap-1 text-[10px] text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-900/40">
                        <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                        <span>投稿者</span>
                      </span>
                    )}

                    <button
                      onClick={() =>
                        setReplyingCommentId(
                          replyingCommentId === comment.id ? null : comment.id
                        )
                      }
                      className="text-xs font-bold text-neutral-400 hover:text-red-400 transition ml-1"
                    >
                      返信
                    </button>
                  </div>

                  {/* Reply Input Box (when '返信' clicked) */}
                  {replyingCommentId === comment.id && (
                    <div className="mt-3 flex items-start gap-2.5 pl-2 border-l-2 border-red-600">
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.name}
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={`${comment.authorName} さんへ返信...`}
                          className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600"
                          autoFocus
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setReplyText('');
                              setReplyingCommentId(null);
                            }}
                            className="text-xs text-neutral-400 hover:text-white px-2.5 py-1"
                          >
                            キャンセル
                          </button>
                          <button
                            onClick={() => handlePostReply(comment.id)}
                            disabled={!replyText.trim()}
                            className="text-xs bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold px-3 py-1 rounded-md shadow"
                          >
                            返信する
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Nested Replies Toggle & List */}
                  {comment.replies.length > 0 && (
                    <div className="pt-2">
                      <button
                        onClick={() => toggleExpandReplies(comment.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-400 transition py-1 px-2 rounded-full hover:bg-red-950/30"
                      >
                        {isRepliesOpen ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {comment.replies.length} 件の返信
                        </span>
                      </button>

                      {/* Expanded Replies Thread */}
                      {isRepliesOpen && (
                        <div className="space-y-3.5 mt-2 pl-4 border-l-2 border-neutral-900">
                          {repliesToShow.map((reply) => {
                            const isReplyLiked = likedReplies[reply.id] || reply.isLiked;
                            const replyLikes = reply.likes + (likedReplies[reply.id] ? 1 : 0);

                            return (
                              <div key={reply.id} className="flex items-start gap-2.5">
                                <img
                                  src={reply.authorAvatar}
                                  alt={reply.authorName}
                                  className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-neutral-800"
                                />
                                <div className="flex-1 space-y-0.5">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-xs font-bold text-white">
                                      {reply.authorName}
                                    </span>
                                    {reply.isOwner && (
                                      <span className="text-[9px] bg-red-600 text-white px-1 rounded font-bold">
                                        投稿者
                                      </span>
                                    )}
                                    <span className="text-[10px] text-neutral-500 font-mono">
                                      {reply.authorHandle}
                                    </span>
                                    <span className="text-[10px] text-neutral-500">
                                      • {reply.timestamp}
                                    </span>
                                  </div>

                                  <p className="text-xs text-neutral-300 leading-relaxed break-words font-sans">
                                    {reply.text}
                                  </p>

                                  <div className="flex items-center gap-3 pt-0.5 text-xs text-neutral-400">
                                    <button
                                      onClick={() => handleToggleLikeReply(reply.id)}
                                      className={`flex items-center gap-1 hover:text-white transition ${
                                        isReplyLiked ? 'text-red-500 font-bold' : ''
                                      }`}
                                    >
                                      <ThumbsUp className={`w-3 h-3 ${isReplyLiked ? 'fill-red-500 text-red-500' : ''}`} />
                                      {replyLikes > 0 && (
                                        <span className="text-[10px] font-mono">{replyLikes}</span>
                                      )}
                                    </button>
                                    <button className="hover:text-white transition">
                                      <ThumbsDown className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {/* "返信をさらに表示" Button */}
                          {hasMoreReplies && (
                            <button
                              onClick={() =>
                                handleShowMoreReplies(comment.id, comment.replies.length)
                              }
                              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-neutral-900 transition"
                            >
                              <CornerDownRight className="w-3 h-3 text-red-500" />
                              <span>返信をさらに表示 ({comment.replies.length - repliesLimit}件)</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Comments "さらに表示" Button */}
      {sortedComments.length > visibleCommentsCount && (
        <div className="pt-2 text-center">
          <button
            onClick={() =>
              setVisibleCommentsCount((prev) =>
                Math.min(prev + 4, sortedComments.length)
              )
            }
            className="w-full py-2.5 px-4 rounded-xl bg-black hover:bg-neutral-900 text-xs font-bold text-red-500 hover:text-red-400 border border-neutral-800 hover:border-red-600/40 transition flex items-center justify-center gap-2 shadow-sm"
          >
            <ChevronDown className="w-4 h-4 text-red-500" />
            <span>
              コメントをさらに表示 (残り {sortedComments.length - visibleCommentsCount} 件)
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
