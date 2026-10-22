'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { BookOpen, CheckCircle2, AlertCircle, Calendar, ArrowLeft, Settings, Send, MessageSquare, Pin, Check, X } from 'lucide-react';

interface GroupData {
  id: string;
  name: string;
  region: string;
  ao: string;
  q_id: string;
  start_date: string;
  master_studies: {
    id: string;
    title: string;
    total_days: number;
  };
}

interface Member {
  user_id: string;
  profiles: {
    f3_name: string;
    real_name: string;
    region: string;
  };
}

interface AccountabilityRecord {
  user_id: string;
  day_number: number;
  completed: boolean;
}

interface Comment {
  id: string;
  parent_id: string | null;
  content: string;
  is_pinned: boolean;
  created_at: string;
  user_id: string;
  profiles: {
    f3_name: string;
    real_name: string;
    region: string;
  };
  reactions?: Record<string, number>;
}

export default function GroupDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const groupId = resolvedParams.id;

  const [group, setGroup] = useState<GroupData | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [accountabilityData, setAccountabilityData] = useState<AccountabilityRecord[]>([]);
  
  // Discussion state
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [mentionSearch, setMentionSearch] = useState('');
  const [showMentionBox, setShowMentionBox] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGroupDetails() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      const { data: groupData } = await supabase
        .from('groups')
        .select(`
          id, name, region, ao, q_id, start_date,
          master_studies:active_study_id (id, title, total_days)
        `)
        .eq('id', groupId)
        .single();

      if (groupData) {
        setGroup(groupData as any);

        const { data: memberData } = await supabase
          .from('group_members')
          .select('user_id, profiles(f3_name, real_name, region)')
          .eq('group_id', groupId)
          .eq('status', 'approved');

        if (memberData) setMembers(memberData as any);

        const { data: accountabilityList } = await supabase
          .from('accountability')
          .select('user_id, day_number, completed')
          .eq('group_id', groupId);

        if (accountabilityList) {
          setAccountabilityData(accountabilityList);
        }

        fetchComments();
      }
      setLoading(false);
    }

    fetchGroupDetails();
  }, [groupId]);

  const fetchComments = async () => {
    const { data: commentList } = await supabase
      .from('group_comments')
      .select(`
        id, parent_id, content, is_pinned, created_at, user_id,
        profiles (f3_name, real_name, region)
      `)
      .eq('group_id', groupId)
      .order('is_pinned', { ascending: false })
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

  const handlePostComment = async (parentId: string | null = null, contentText: string) => {
    if (!contentText.trim() || !currentUserId) return;

    const { data: newPost, error } = await supabase
      .from('group_comments')
      .insert([
        {
          group_id: groupId,
          user_id: currentUserId,
          parent_id: parentId,
          content: contentText.trim(),
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
          if (tagged.user_id !== currentUserId) {
            await supabase.from('notifications').insert([
              {
                user_id: tagged.user_id,
                sender_id: currentUserId,
                group_id: groupId,
                comment_id: newPost.id,
              },
            ]);
          }
        }
      }

      setNewComment('');
      setReplyText('');
      setReplyingToId(null);
      fetchComments();
    }
  };

  const togglePin = async (commentId: string, currentPinned: boolean) => {
    await supabase
      .from('group_comments')
      .update({ is_pinned: !currentPinned })
      .eq('id', commentId);
    fetchComments();
  };

  const toggleReaction = async (commentId: string, emoji: string) => {
    if (!currentUserId) return;

    const { error } = await supabase.from('comment_reactions').insert([
      { comment_id: commentId, user_id: currentUserId, emoji },
    ]);

    if (error) {
      await supabase
        .from('comment_reactions')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', currentUserId)
        .eq('emoji', emoji);
    }
    fetchComments();
  };

  if (loading) {
    return <p className="text-center text-xs font-bold text-gray-400 py-12 uppercase">Loading Group Data...</p>;
  }

  if (!group) {
    return <p className="text-center text-xs text-gray-500 py-12">Group not found.</p>;
  }

  const study = group.master_studies || { id: 'being-him', title: 'Being HIM', total_days: 14 };
  const studySlug = study.id || 'being-him';
  const startDate = group.start_date ? new Date(group.start_date) : new Date();
  const today = new Date();
  
  const diffTime = today.getTime() - startDate.getTime();
  const rawDiffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const targetDay = Math.max(1, Math.min(rawDiffDays + 1, study.total_days));

  const userCompletedDays = accountabilityData
    .filter((a) => a.user_id === currentUserId && a.completed)
    .map((a) => a.day_number);
  const maxCompletedDay = userCompletedDays.length > 0 ? Math.max(...userCompletedDays) : 0;
  const daysBehind = targetDay - maxCompletedDay;
  const userNextDay = daysBehind > 0 ? Math.min(maxCompletedDay + 1, study.total_days) : targetDay;

  const isQ = currentUserId === group.q_id;
  const topLevelComments = comments.filter((c) => !c.parent_id);
  const filteredMembers = members.filter((m) =>
    (m.profiles?.f3_name || '').toLowerCase().includes(mentionSearch)
  );

  const daysArray = Array.from({ length: study.total_days }, (_, i) => {
    const dayNum = i + 1;
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return {
      dayNumber: dayNum,
      dateString: `${d.getMonth() + 1}/${d.getDate()}`
    };
  });

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      {/* Header Bar */}
      <div className="flex justify-between items-center">
        <Link href="/group" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-black tracking-tight">{group.name}</h1>
        {isQ ? (
          <Link href={`/manage-group?groupId=${group.id}`} className="p-2 rounded-full bg-black text-white hover:bg-gray-800">
            <Settings size={18} />
          </Link>
        ) : (
          <div className="w-9" />
        )}
      </div>

      {/* Pace Status Banner */}
      <div className="bg-black text-white p-5 rounded-xl space-y-4 shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Active Track</span>
            <h2 className="text-xl font-black">{study.title}</h2>
          </div>
          <span className="bg-gray-800 text-gray-200 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
            <Calendar size={12} /> Day {targetDay} of {study.total_days}
          </span>
        </div>

        <div className="pt-3 border-t border-gray-800 flex justify-between items-center">
          <div className="text-xs">
            <p className="text-gray-400 font-bold text-[10px] uppercase">Your Status</p>
            {daysBehind <= 0 ? (
              <p className="text-green-400 font-black flex items-center gap-1">
                <CheckCircle2 size={14} /> Caught Up!
              </p>
            ) : (
              <p className="text-amber-400 font-black flex items-center gap-1">
                <AlertCircle size={14} /> {daysBehind} {daysBehind === 1 ? 'Day' : 'Days'} Behind
              </p>
            )}
          </div>

          <Link
            href={`/study?study=${studySlug}&day=${userNextDay}`}
            className="bg-white text-black font-black text-xs px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5"
          >
            Read Day {userNextDay} <BookOpen size={14} />
          </Link>
        </div>
      </div>

      {/* 1. Personal Date Boxes linked directly to study content */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase text-gray-500 tracking-wider">Your Reading Schedule</h3>
        <div className="grid grid-cols-7 gap-1.5">
          {daysArray.map((d) => {
            const isDone = userCompletedDays.includes(d.dayNumber);
            const isPastOrToday = d.dayNumber <= targetDay;

            const bgClass = isDone 
              ? 'bg-green-700 text-white border-green-800 hover:bg-green-800' 
              : isPastOrToday 
              ? 'bg-red-600 text-white border-red-700 hover:bg-red-700' 
              : 'bg-white text-gray-900 border-gray-200 hover:border-gray-400';

            return (
              <Link
                key={d.dayNumber}
                href={`/study?study=${studySlug}&day=${d.dayNumber}`}
                className={`p-2 rounded-lg border text-center flex items-center justify-center transition-all shadow-sm ${bgClass}`}
                title={`Day ${d.dayNumber} - ${d.dateString}`}
              >
                <span className="text-xs font-black">{d.dateString}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 2. Accountability Grid Table with Frozen PAX Column */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <Calendar size={14} /> Accountability Grid
          </h3>
          <span className="text-[10px] font-bold text-gray-400">Group Progress</span>
        </div>

        <div className="overflow-x-auto relative">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400">
                <th className="py-2 pr-4 font-black text-[11px] uppercase sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  PAX
                </th>
                {daysArray.map((d) => (
                  <th key={d.dayNumber} className="py-2 px-2 text-center font-bold text-[10px] whitespace-nowrap">
                    {d.dateString}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map((member) => {
                const memberName = member.profiles?.f3_name || member.profiles?.real_name || 'Pax';

                return (
                  <tr key={member.user_id}>
                    <td className="py-2.5 pr-4 font-black text-gray-900 whitespace-nowrap sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      {memberName} {member.user_id === currentUserId && <span className="text-[9px] font-normal text-gray-400">(You)</span>}
                    </td>
                    {daysArray.map((d) => {
                      const record = accountabilityData.find(
                        (a) => a.user_id === member.user_id && a.day_number === d.dayNumber
                      );
                      const isDone = record?.completed;
                      const isPastOrToday = d.dayNumber <= targetDay;

                      return (
                        <td key={d.dayNumber} className="py-2.5 px-2 text-center whitespace-nowrap">
                          {isDone ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-700 rounded-full mx-auto">
                              <Check size={12} strokeWidth={3} />
                            </span>
                          ) : isPastOrToday ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 text-red-600 rounded-full mx-auto">
                              <X size={12} strokeWidth={3} />
                            </span>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Group Discussion Feed */}
      <div className="space-y-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-black" />
          <h3 className="text-sm font-black uppercase tracking-wider">Group Discussion</h3>
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
              placeholder="Share an insight or tag @Pax..."
              className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-xs bg-white focus:ring-black focus:border-black"
            />
            <button
              onClick={() => handlePostComment(null, newComment)}
              disabled={!newComment.trim()}
              className="bg-black text-white px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-gray-800 disabled:opacity-50 flex items-center gap-1"
            >
              <Send size={14} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {topLevelComments.length === 0 ? (
            <p className="text-center text-xs text-gray-400 py-6">
              No comments yet. Be the first Pax to post!
            </p>
          ) : (
            topLevelComments.map((comment) => {
              const replies = comments.filter((c) => c.parent_id === comment.id);

              return (
                <div
                  key={comment.id}
                  className={`p-4 rounded-xl border space-y-2.5 ${
                    comment.is_pinned
                      ? 'bg-amber-50 border-amber-300 shadow-sm'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-black">
                        {comment.profiles?.f3_name || comment.profiles?.real_name || 'Pax'}
                        <span className="text-[10px] text-gray-500 font-normal ml-1">
                          ({comment.profiles?.region || group.region})
                        </span>
                      </span>
                      {comment.is_pinned && (
                        <span className="ml-2 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded inline-flex items-center gap-0.5">
                          <Pin size={10} /> PINNED ANNOUNCEMENT
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400">
                        {new Date(comment.created_at).toLocaleDateString([], { month: 'numeric', day: 'numeric' })}
                      </span>
                      {isQ && (
                        <button
                          onClick={() => togglePin(comment.id, comment.is_pinned)}
                          className="text-gray-400 hover:text-black"
                        >
                          <Pin size={12} />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-gray-800 leading-relaxed">{comment.content}</p>

                  <div className="flex items-center gap-1.5 pt-1">
                    {['👍', '🙏', '💪', '🎯'].map((emoji) => {
                      const count = comment.reactions?.[emoji] || 0;
                      return (
                        <button
                          key={emoji}
                          onClick={() => toggleReaction(comment.id, emoji)}
                          className={`text-xs px-2 py-1 rounded-md border text-[11px] font-bold flex items-center gap-1 transition-colors ${
                            count > 0 ? 'bg-gray-100 border-gray-400 text-black' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                          }`}
                        >
                          <span>{emoji}</span>
                          {count > 0 && <span>{count}</span>}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                      className="text-[11px] font-bold text-gray-500 hover:text-black ml-auto"
                    >
                      Reply
                    </button>
                  </div>

                  {replyingToId === comment.id && (
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:ring-black"
                      />
                      <button
                        onClick={() => handlePostComment(comment.id, replyText)}
                        disabled={!replyText.trim()}
                        className="bg-black text-white px-3 py-2 rounded-lg text-xs font-bold disabled:opacity-50"
                      >
                        Send
                      </button>
                    </div>
                  )}

                  {replies.length > 0 && (
                    <div className="space-y-2 pt-2 pl-4 border-l-2 border-gray-200">
                      {replies.map((reply) => (
                        <div key={reply.id} className="bg-gray-50 p-2.5 rounded-lg text-xs space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-black text-[11px]">
                              {reply.profiles?.f3_name || reply.profiles?.real_name}
                              <span className="text-[9px] text-gray-400 font-normal ml-1">
                                ({reply.profiles?.region})
                              </span>
                            </span>
                            <span className="text-[9px] text-gray-400">
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
    </main>
  );
}