'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageSquare, Send } from 'lucide-react';

interface Member {
  user_id: string;
  profiles: { f3_name: string; real_name: string; region: string };
}

interface Comment {
  id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  user_id: string;
  profiles: { f3_name: string; real_name: string; region: string };
  reactions?: Record<string, number>;
}

interface DiscussionProps {
  dayNumber: number;
  userId: string | null;
  groupId: string | null;
  userRegion: string;
  members: Member[];
  comments: Comment[];
  onRefreshComments: (groupId: string) => void;
}

export function StudyDiscussion({
  dayNumber,
  userId,
  groupId,
  userRegion,
  members,
  comments,
  onRefreshComments,
}: DiscussionProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [mentionSearch, setMentionSearch] = useState('');
  const [showMentionBox, setShowMentionBox] = useState(false);

  const handleInputChange = (value: string) => {
    setNewComment(value);
    const lastWord = value.split(' ').pop() || '';
    if (lastWord.startsWith('@')) {
      setMentionSearch(lastWord.slice(1).toLowerCase());
      setShowMentionBox(true);
    } else {
      setShowMentionBox(false);
    }
  };

  const selectMention = (f3Name: string) => {
    const words = newComment.split(' ');
    words.pop();
    setNewComment([...words, `@${f3Name} `].join(' '));
    setShowMentionBox(false);
  };

  const handlePostComment = async (parentId: string | null = null, contentText: string) => {
    if (!contentText.trim() || !userId || !groupId) return;

    const formattedContent = parentId ? contentText.trim() : `[Day ${dayNumber}] ${contentText.trim()}`;

    const { data: newPost, error } = await supabase
      .from('group_comments')
      .insert([{ group_id: groupId, user_id: userId, parent_id: parentId, content: formattedContent }])
      .select()
      .single();

    if (!error && newPost) {
      const matches = contentText.match(/@(\w+)/g);
      if (matches) {
        const taggedNames = matches.map((m) => m.slice(1).toLowerCase());
        const taggedMembers = members.filter((m) =>
          taggedNames.includes((m.profiles?.f3_name || '').toLowerCase())
        );

        for (const tagged of taggedMembers) {
          if (tagged.user_id !== userId) {
            await supabase.from('notifications').insert([
              {
                user_id: tagged.user_id,
                sender_id: userId,
                group_id: groupId,
                comment_id: newPost.id,
                day_number: dayNumber,
              },
            ]);
          }
        }
      }

      setNewComment('');
      setReplyText('');
      setReplyingToId(null);
      onRefreshComments(groupId);
    }
  };

  const toggleReaction = async (commentId: string, emoji: string) => {
    if (!userId || !groupId) return;

    const { error } = await supabase.from('comment_reactions').insert([
      { comment_id: commentId, user_id: userId, emoji },
    ]);

    if (error) {
      await supabase
        .from('comment_reactions')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', userId)
        .eq('emoji', emoji);
    }
    onRefreshComments(groupId);
  };

  const topLevelComments = comments.filter((c) => !c.parent_id);
  const filteredMembers = members.filter((m) =>
    (m.profiles?.f3_name || '').toLowerCase().includes(mentionSearch)
  );

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
        <MessageSquare size={16} className="text-black" />
        <h3 className="text-xs font-black uppercase tracking-wider">Group Discussion</h3>
      </div>

      <div className="relative">
        {showMentionBox && filteredMembers.length > 0 && (
          <div className="absolute bottom-12 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-36 overflow-y-auto p-1">
            {filteredMembers.map((m) => (
              <button
                key={m.user_id}
                onClick={() => selectMention(m.profiles?.f3_name || 'Pax')}
                className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-gray-100 rounded flex justify-between"
              >
                <span>{m.profiles?.f3_name || m.profiles?.real_name}</span>
                <span className="text-[10px] text-gray-400">({m.profiles?.region})</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={`Comment on Day ${dayNumber} or tag @Pax...`}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:ring-black focus:border-black"
          />
          <button
            onClick={() => handlePostComment(null, newComment)}
            disabled={!newComment.trim()}
            className="bg-black text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 disabled:opacity-50 flex items-center gap-1"
          >
            <Send size={12} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {topLevelComments.length === 0 ? (
          <p className="text-center text-[11px] text-gray-400 py-3">No comments yet for Day {dayNumber}.</p>
        ) : (
          topLevelComments.map((comment) => {
            const replies = comments.filter((c) => c.parent_id === comment.id);

            return (
              <div key={comment.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-black text-[11px]">
                    {comment.profiles?.f3_name || comment.profiles?.real_name || 'Pax'}
                    <span className="text-[9px] text-gray-400 font-normal ml-1">
                      ({comment.profiles?.region || userRegion})
                    </span>
                  </span>
                  <span className="text-[9px] text-gray-400">
                    {new Date(comment.created_at).toLocaleDateString([], { month: 'numeric', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-gray-700 leading-snug">{comment.content}</p>

                <div className="flex items-center gap-1 pt-1">
                  {['👍', '🙏', '💪', '🎯'].map((emoji) => {
                    const count = comment.reactions?.[emoji] || 0;
                    return (
                      <button
                        key={emoji}
                        onClick={() => toggleReaction(comment.id, emoji)}
                        className={`text-[10px] px-2 py-0.5 rounded border font-bold flex items-center gap-1 transition-colors ${
                          count > 0 ? 'bg-white border-gray-400 text-black' : 'bg-gray-100 border-gray-200 text-gray-500'
                        }`}
                      >
                        <span>{emoji}</span>
                        {count > 0 && <span>{count}</span>}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                    className="text-[10px] font-bold text-gray-500 hover:text-black ml-auto"
                  >
                    Reply
                  </button>
                </div>

                {replyingToId === comment.id && (
                  <div className="flex gap-2 pt-2 border-t border-gray-200">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded text-xs bg-white focus:ring-black"
                    />
                    <button
                      onClick={() => handlePostComment(comment.id, replyText)}
                      disabled={!replyText.trim()}
                      className="bg-black text-white px-2.5 py-1.5 rounded text-xs font-bold disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                )}

                {replies.length > 0 && (
                  <div className="space-y-1.5 pt-2 pl-3 border-l-2 border-gray-300">
                    {replies.map((reply) => (
                      <div key={reply.id} className="bg-white p-2 rounded text-xs space-y-0.5 border border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="font-black text-[10px]">
                            {reply.profiles?.f3_name || reply.profiles?.real_name}
                            <span className="text-[8px] text-gray-400 font-normal ml-1">({reply.profiles?.region})</span>
                          </span>
                          <span className="text-[8px] text-gray-400">
                            {new Date(reply.created_at).toLocaleDateString([], { month: 'numeric', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-snug">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}