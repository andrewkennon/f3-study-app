'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Check, BookOpen, MessageSquare, Shield, Send, Settings } from 'lucide-react';

interface MemberCheck {
  f3Name: string;
  checks: boolean[];
}

interface Comment {
  id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export default function DynamicGroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState('');
  const [region, setRegion] = useState('');
  const [ao, setAo] = useState('');
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [paxChecks, setPaxChecks] = useState<MemberCheck[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function initGroupData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        // 1. Verify Membership & Load Group Info
        const { data: group } = await supabase
          .from('groups')
          .select('*')
          .eq('id', groupId)
          .single();

        if (group) {
          setGroupName(group.name || 'Group Study');
          setRegion(group.region || 'F3');
          setAo(group.ao || '');
        }

        const { data: member } = await supabase
          .from('group_members')
          .select('*')
          .eq('group_id', groupId)
          .eq('user_id', user.id)
          .eq('status', 'approved')
          .single();

        if (!member) {
          router.push('/discovery');
          return;
        }

        setIsAuthorized(true);

        // 2. Fetch Pending Join Requests Count Safely
        try {
          const { count } = await supabase
            .from('group_members')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', groupId)
            .eq('status', 'pending');

          if (count !== null) setPendingCount(count);
        } catch (err) {
          console.warn('Could not fetch pending count:', err);
        }

        // 3. Fetch Group Members & Accountability Checks
        const { data: members } = await supabase
          .from('group_members')
          .select('user_id, profiles(id, f3_name, real_name)')
          .eq('group_id', groupId)
          .eq('status', 'approved');

        const memberUserIds = members ? members.map((m: any) => m.user_id) : [];

        const { data: accountability } = await supabase
          .from('accountability')
          .select('user_id, day_number, group_id')
          .or(`group_id.eq.${groupId},user_id.in.(${memberUserIds.join(',')})`);

        if (members) {
          const gridData = members.map((m: any) => {
            const profile = m.profiles;
            const name = profile?.f3_name || profile?.real_name || 'Pax';

            const userCompletions = accountability
              ? accountability
                  .filter((a) => a.user_id === m.user_id)
                  .map((a) => Number(a.day_number))
              : [];

            const checks = Array.from({ length: 14 }, (_, i) => userCompletions.includes(i + 1));

            return {
              f3Name: name,
              checks,
            };
          });

          setPaxChecks(gridData);
        }

        // 4. Fetch Discussion Feed
        const { data: commentData } = await supabase
          .from('group_comments')
          .select('*')
          .eq('group_id', groupId)
          .order('created_at', { ascending: false });

        if (commentData) {
          setComments(commentData);
        }
      } catch (error) {
        console.error('Error initializing group page:', error);
      } finally {
        setLoading(false);
      }
    }

    if (groupId) initGroupData();
  }, [groupId, router]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('f3_name, real_name')
        .eq('id', user.id)
        .single();

      const authorName = profile?.f3_name || profile?.real_name || 'Pax';

      const { data, error } = await supabase
        .from('group_comments')
        .insert([
          {
            group_id: groupId,
            user_id: user.id,
            user_name: authorName,
            content: newComment.trim(),
          },
        ])
        .select()
        .single();

      if (!error && data) {
        setComments((prev) => [data, ...prev]);
        setNewComment('');
      }
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xs font-bold text-gray-400 uppercase">
        Loading Group...
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      {/* HEADER SECTION WITH BADGE */}
      <div className="bg-black text-white p-5 rounded-lg shadow-sm space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black tracking-tight">{groupName}</h1>
            <p className="text-xs font-bold text-gray-400">
              {region} {ao && ao !== 'N/A' ? `• ${ao}` : ''}
            </p>
          </div>
          <Link
            href={`/manage-group?groupId=${groupId}`}
            className="relative bg-white/10 text-white hover:bg-white hover:text-black border border-white/20 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"
          >
            <Settings size={14} /> Manage
            {pendingCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-black animate-pulse">
                {pendingCount}
              </span>
            )}
          </Link>
        </div>

        <div className="pt-2 border-t border-gray-800 flex justify-between items-center text-xs font-bold">
          <span className="text-gray-400">Track: Being HIM (14 Days)</span>
          <Link
            href={`/study?day=1&group_id=${groupId}`}
            className="bg-white text-black px-3 py-1.5 rounded flex items-center gap-1"
          >
            <BookOpen size={14} /> Read Today
          </Link>
        </div>
      </div>

      {/* ACCOUNTABILITY GRID BOARD */}
      <section className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-3">
        <h2 className="text-sm font-black uppercase tracking-wide text-gray-700 flex items-center gap-1.5">
          <Shield size={16} className="text-black" /> Accountability Grid
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 text-[10px] font-black text-gray-400 uppercase">Pax</th>
                {Array.from({ length: 14 }).map((_, i) => (
                  <th key={i} className="py-2 text-center text-[10px] font-black text-gray-400 uppercase w-6">
                    D{i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paxChecks.map((m, idx) => (
                <tr key={idx}>
                  <td className="py-2 pr-2 text-xs font-black text-gray-800 truncate max-w-[90px]">{m.f3Name}</td>
                  {m.checks.map((done, dIdx) => (
                    <td key={dIdx} className="py-2 text-center">
                      {done ? (
                        <span className="inline-flex items-center justify-center w-4 h-4 bg-green-600 text-white text-[10px] rounded-full">
                          <Check size={10} strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-4 h-4 bg-gray-100 text-gray-300 text-[10px] rounded-full">
                          ·
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* DISCUSSION FEED */}
      <section className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-sm font-black uppercase tracking-wide text-gray-700 flex items-center gap-2">
          <MessageSquare size={16} /> Group Discussion
        </h2>

        <form onSubmit={handlePostComment} className="space-y-2">
          <textarea
            rows={2}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share an insight with the group..."
            className="w-full p-3 border border-gray-300 rounded text-xs focus:ring-black focus:border-black"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white font-bold py-2 rounded text-xs flex items-center justify-center gap-1 active:bg-gray-800 disabled:opacity-50"
          >
            <Send size={14} /> Post Insight
          </button>
        </form>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {comments.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">No comments posted yet. Start the conversation!</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="p-3 bg-gray-50 border border-gray-200 rounded text-xs space-y-1">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-gray-900">{c.user_name || 'Pax'}</span>
                  <span className="text-gray-400 font-normal text-[10px]">
                    {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-gray-700 leading-normal">{c.content}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}