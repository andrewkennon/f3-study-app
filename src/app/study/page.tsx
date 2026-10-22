'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, ArrowLeft, MessageSquare, Send, Bot, ExternalLink } from 'lucide-react';

interface Member {
  user_id: string;
  profiles: {
    f3_name: string;
    real_name: string;
    region: string;
  };
}

interface Comment {
  id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    f3_name: string;
    real_name: string;
    region: string;
  };
  reactions?: Record<string, number>;
}

function StudyContent() {
  const searchParams = useSearchParams();
  const dayParam = searchParams.get('day');
  const dayNumber = dayParam ? parseInt(dayParam, 10) : 1;

  const [userId, setUserId] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [userRegion, setUserRegion] = useState<string>('F3 Jacksonville');
  const [members, setMembers] = useState<Member[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHimConnection, setShowHimConnection] = useState(false);
  const [showWordStudy, setShowWordStudy] = useState(false);

  // Discussion State
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [mentionSearch, setMentionSearch] = useState('');
  const [showMentionBox, setShowMentionBox] = useState(false);

  // Dynamic Scripture Reference (Defaults to Proverbs 27 for Day 1 demo)
  const book = 'Proverbs';
  const chapter = 27;
  const verseReference = 'PROVERBS 27:17 (ESV)';
  const esvChapterUrl = `https://www.esv.org/${book}+${chapter}/`;

  useEffect(() => {
    async function loadStudyData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      // Fetch Profile for region
      const { data: profile } = await supabase
        .from('profiles')
        .select('region')
        .eq('id', user.id)
        .single();
      if (profile?.region) setUserRegion(profile.region);

      // Retrieve primary group membership
      const { data: membership } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .limit(1)
        .single();

      if (membership) {
        setGroupId(membership.group_id);

        // Check if current day is logged as completed
        const { data: acc } = await supabase
          .from('accountability')
          .select('completed')
          .eq('group_id', membership.group_id)
          .eq('user_id', user.id)
          .eq('day_number', dayNumber)
          .single();

        if (acc) setIsCompleted(acc.completed);

        // Fetch Group Members for @ tagging
        const { data: memberData } = await supabase
          .from('group_members')
          .select('user_id, profiles(f3_name, real_name, region)')
          .eq('group_id', membership.group_id)
          .eq('status', 'approved');

        if (memberData) setMembers(memberData as any);

        fetchComments(membership.group_id);
      }
    }

    loadStudyData();
  }, [dayNumber]);

  const fetchComments = async (activeGroupId: string) => {
    const { data: commentList } = await supabase
      .from('group_comments')
      .select(`
        id, parent_id, content, created_at, user_id,
        profiles (f3_name, real_name, region)
      `)
      .eq('group_id', activeGroupId)
      .order('created_at', { ascending: false });

    if (commentList) {
      const commentIds = commentList.map((c) => c.id);
      if (commentIds.length > 0) {
        const { data: reactionsData } = await supabase
          .from('comment_reactions')
          .select('comment_id, emoji')
          .in('comment_id', commentIds);

        const reactionMap: Record<string, Record<string, number>> = {};
        if (reactionsData) {
          reactionsData.forEach((r: any) => {
            if (!reactionMap[r.comment_id]) reactionMap[r.comment_id] = {};
            reactionMap[r.comment_id][r.emoji] = (reactionMap[r.comment_id][r.emoji] || 0) + 1;
          });
        }

        setComments(
          commentList.map((c: any) => ({
            ...c,
            reactions: reactionMap[c.id] || {},
          }))
        );
      } else {
        setComments(commentList as any);
      }
    }
  };

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

  const toggleCompletion = async () => {
    if (!userId || !groupId) return;

    const nextState = !isCompleted;
    setIsCompleted(nextState);

    await supabase.from('accountability').upsert(
      [
        {
          group_id: groupId,
          user_id: userId,
          day_number: dayNumber,
          completed: nextState,
        },
      ],
      { onConflict: 'group_id, user_id, day_number' }
    );
  };

  const handlePostComment = async (parentId: string | null = null, contentText: string) => {
    if (!contentText.trim() || !userId || !groupId) return;

    const formattedContent = parentId ? contentText.trim() : `[Day ${dayNumber}] ${contentText.trim()}`;

    const { data: newPost, error } = await supabase
      .from('group_comments')
      .insert([
        {
          group_id: groupId,
          user_id: userId,
          parent_id: parentId,
          content: formattedContent,
        },
      ])
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
      fetchComments(groupId);
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
    fetchComments(groupId);
  };

  const backHref = groupId ? `/group/${groupId}` : '/group';
  const topLevelComments = comments.filter((c) => !c.parent_id);
  const filteredMembers = members.filter((m) =>
    (m.profiles?.f3_name || '').toLowerCase().includes(mentionSearch)
  );

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      {/* Header Bar */}
      <div className="flex justify-between items-center">
        <Link href={backHref} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <span className="text-xs font-black uppercase tracking-widest text-gray-500">
          BEING HIM
        </span>
        <span className="bg-black text-white text-xs font-bold px-2.5 py-1 rounded-md">
          Day {dayNumber} of 14
        </span>
      </div>

      {/* 1. Scripture Card with Full ESV Copyright Compliance */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="border-b border-gray-100 pb-2 flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
              {verseReference}
            </span>
            <h2 className="text-lg font-black tracking-tight mt-0.5">{book} {chapter}:17</h2>
          </div>
          <a
            href={esvChapterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-gray-600 hover:text-black flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-md transition-colors shrink-0"
          >
            Full Chapter <ExternalLink size={12} />
          </a>
        </div>

        <div className="text-base font-serif leading-relaxed text-gray-900 space-y-2">
          <p>
            <sup className="font-sans text-xs font-bold mr-1 text-gray-400">17</sup>
            Iron sharpens iron, and one man sharpens another.
          </p>
        </div>

        {/* Required Crossway Standard ESV Copyright Statement */}
        <div className="pt-3 border-t border-gray-100 space-y-2 text-[10px] text-gray-400 leading-normal">
          <p>
            Scripture quotations marked "ESV" are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. The ESV text may not be quoted in any publication made available to the public by a Creative Commons license. The ESV may not be translated into any other language.
          </p>
          <div className="flex justify-between items-center italic pt-1">
            <span>Users may not copy or download more than 500 verses of the ESV Bible.</span>
            <a
              href={esvChapterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="not-italic font-bold underline hover:text-gray-600 shrink-0 ml-2"
            >
              esv.org
            </a>
          </div>
        </div>
      </div>

      {/* 2. Collapsible HIM Connection */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowHimConnection(!showHimConnection)}
          className="w-full p-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
        >
          <span className="font-black text-sm text-gray-900">HIM Connection</span>
          {showHimConnection ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {showHimConnection && (
          <div className="p-4 pt-0 border-t border-gray-100 space-y-3">
            <p className="text-xs text-gray-700 leading-relaxed">
              As iron sharpens iron, so one man sharpens another. True leadership requires putting yourself in the gloom alongside other men who will challenge, hold accountable, and sharpen your faith.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 italic pt-2 border-t border-gray-100">
              <Bot size={12} className="shrink-0" />
              <span>Devotional content generated by AI. The best reference for the Bible is the Bible.</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Collapsible Deep Word Study */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowWordStudy(!showWordStudy)}
          className="w-full p-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
        >
          <span className="font-black text-sm text-gray-900">Deep Word Study</span>
          {showWordStudy ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {showWordStudy && (
          <div className="p-4 pt-0 border-t border-gray-100 space-y-3">
            <div className="text-xs text-gray-700 leading-relaxed space-y-2">
              <p>
                <strong>Hebrew Word:</strong> <em className="font-serif">Yachad</em> (יַחַד) – To unite, join together, or sharpen mutually.
              </p>
              <p>
                The physical metaphor refers to two iron blades striking each other to remove dullness and rust. Spiritual sharpening requires friction, proximity, and honest feedback.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 italic pt-2 border-t border-gray-100">
              <Bot size={12} className="shrink-0" />
              <span>Devotional content generated by AI. The best reference for the Bible is the Bible.</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Private Group Discussion Board */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <MessageSquare className="text-black" size={16} />
          <h3 className="text-xs font-black uppercase tracking-wider">Group Discussion</h3>
        </div>

        {/* Input Form with @ Tag Autocomplete */}
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

        {/* Threaded Comment Feed */}
        <div className="space-y-3">
          {topLevelComments.length === 0 ? (
            <p className="text-center text-[11px] text-gray-400 py-3">
              No comments yet for Day {dayNumber}.
            </p>
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

                  {/* Emoji Tapback Bar */}
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

                  {/* Inline Reply Input */}
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

                  {/* 1-Level Threaded Replies */}
                  {replies.length > 0 && (
                    <div className="space-y-1.5 pt-2 pl-3 border-l-2 border-gray-300">
                      {replies.map((reply) => (
                        <div key={reply.id} className="bg-white p-2 rounded text-xs space-y-0.5 border border-gray-100">
                          <div className="flex justify-between items-center">
                            <span className="font-black text-[10px]">
                              {reply.profiles?.f3_name || reply.profiles?.real_name}
                              <span className="text-[8px] text-gray-400 font-normal ml-1">
                                ({reply.profiles?.region})
                              </span>
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

      {/* 5. Mark Completed Toggle Button */}
      <button
        onClick={toggleCompletion}
        className={`w-full py-4 rounded-xl font-black text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 ${
          isCompleted
            ? 'bg-green-700 text-white hover:bg-green-800'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {isCompleted ? (
          <>
            <CheckCircle2 size={20} /> COMPLETED
          </>
        ) : (
          <>
            <Circle size={20} /> MARK COMPLETED
          </>
        )}
      </button>
    </main>
  );
}

export default function StudyPage() {
  return (
    <Suspense fallback={<p className="text-center text-xs font-bold text-gray-400 py-12 uppercase">Loading Study...</p>}>
      <StudyContent />
    </Suspense>
  );
}