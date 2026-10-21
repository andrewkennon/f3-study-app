'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Shield, BookOpen, Settings, Send } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  region: string;
  ao: string;
}

interface Member {
  id: string;
  f3_name: string;
  real_name: string;
}

interface Comment {
  id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export default function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const groupId = resolvedParams.id;

  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [completedDays, setCompletedDays] = useState<Record<string, number[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGroupData() {
      // Fetch Group Info
      const { data: g } = await supabase.from('groups').select('*').eq('id', groupId).single();
      if (g) setGroup(g);

      // Fetch Group Members
      const { data: mData } = await supabase
        .from('group_members')
        .select('profiles(id, f3_name, real_name)')
        .eq('group_id', groupId)
        .eq('status', 'approved');

      if (mData) {
        const parsedMembers = mData.map((m: any) => ({
          id: m.profiles.id,
          f3_name: m.profiles.f3_name || 'Pax',
          real_name: m.profiles.real_name || '',
        }));
        setMembers(parsedMembers);
      }

      // Fetch Accountability Completions
      const { data: accData } = await supabase
        .from('accountability')
        .select('user_id, day_number')
        .eq('group_id', groupId);

      if (accData) {
        const grid: Record<string, number[]> = {};
        accData.forEach((rec) => {
          if (!grid[rec.user_id]) grid[rec.user_id] = [];
          grid[rec.user_id].push(rec.day_number);
        });
        setCompletedDays(grid);
      }

      // Fetch Comments
      const { data: cData } = await supabase
        .from('group_comments')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true });

      if (cData) setComments(cData);

      setLoading(false);
    }

    loadGroupData();
  }, [groupId]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('f3_name, real_name')
      .eq('id', user.id)
      .single();

    const authorName = profile?.f3_name || profile?.real_name || 'Pax';

    const { data: inserted, error } = await supabase
      .from('group_comments')
      .insert([
        {
          group_id: groupId,
          user_id: user.id,
          user_name: authorName,
          content: newComment,
        },
      ])
      .select()
      .single();

    if (!error && inserted) {
      setComments((prev) => [...prev, inserted]);
      setNewComment('');
    }
  };

  if (loading) {
    return <main className="max-w-md mx-auto p-4 text-center text-xs font-bold text-gray-400 py-12">Loading Group...</main>;
  }

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      {/* HEADER WITH STEP 1 SHORTCUT */}
      <div className="bg-black text-white p-5 rounded-lg shadow-sm space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black tracking-tight">{group?.name}</h1>
            <p className="text-xs font-bold text-gray-400">{group?.region} {group?.ao !== 'N/A' && `• ${group?.ao}`}</p>
          </div>
          <Link
            href={`/manage-group?groupId=${groupId}`}
            className="bg-white/10 text-white hover:bg-white hover:text-black border border-white/20 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"
          >
            <Settings size={14} /> Manage
          </Link>
        </div>

        <div className="pt-2 border-t border-gray-800 flex justify-between items-center text-xs font-bold">
          <span className="text-gray-400">Track: Being HIM</span>
          <Link href="/study?day=1" className="bg-white text-black px-3 py-1.5 rounded flex items-center gap-1">
            <BookOpen size={14} /> Open Daily Study
          </Link>
        </div>
      </div>

      {/* ACCOUNTABILITY GRID BOARD */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-3">
        <h2 className="text-sm font-black tracking-wider text-gray-500 uppercase flex items-center gap-1.5">
          <Shield size={16} className="text-black" /> Accountability Board
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-[10px] font-black text-gray-400">
                <th className="py-2 pr-2">PAX</th>
                {Array.from({ length: 14 }).map((_, i) => (
                  <th key={i} className="py-2 text-center w-6">D{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-bold">
              {members.map((m) => {
                const userDone = completedDays[m.id] || [];
                return (
                  <tr key={m.id}>
                    <td className="py-2 pr-2 font-black text-gray-800 truncate max-w-[100px]">{m.f3_name}</td>
                    {Array.from({ length: 14 }).map((_, i) => {
                      const dayNum = i + 1;
                      const isCompleted = userDone.includes(dayNum);
                      return (
                        <td key={i} className="py-2 text-center">
                          {isCompleted ? (
                            <span className="inline-block w-4 h-4 bg-green-600 text-white text-[10px] leading-4 rounded-full text-center">✓</span>
                          ) : (
                            <span className="inline-block w-4 h-4 bg-gray-100 text-gray-300 text-[10px] leading-4 rounded-full text-center">·</span>
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

      {/* GROUP MUMBLECHATTER COMMENTS */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-sm font-black tracking-wider text-gray-500 uppercase">Group Discussion</h2>

        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {comments.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-4">No comments posted yet. Start the conversation below!</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="bg-gray-50 p-3 rounded border border-gray-100 space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-black text-gray-900">{c.user_name}</span>
                  <span className="text-[9px] text-gray-400">{new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-xs text-gray-700 leading-normal">{c.content}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handlePostComment} className="flex gap-2 pt-2 border-t border-gray-100">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add to group chatter..."
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-xs focus:ring-black focus:border-black"
          />
          <button type="submit" className="bg-black text-white font-bold text-xs px-3 py-2 rounded flex items-center gap-1">
            <Send size={12} /> Post
          </button>
        </form>
      </div>
    </main>
  );
}