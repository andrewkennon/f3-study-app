'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Check, X, BookOpen, MessageSquare, Shield, Send } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    f3_name: string;
  } | null;
}

const MEMBERS = [
  { id: '1', f3Name: 'Stat (Q)', checks: [true, true, true, true, true, true, true] },
  { id: '2', f3Name: 'Spock', checks: [true, true, false, true, true, true, true] },
  { id: '3', f3Name: 'Corner Kick', checks: [true, true, true, true, false, true, true] },
];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DynamicGroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function initGroupPage() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // 1. Verify Membership
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

      // 2. Fetch Group Comments from Supabase
      const { data: commentData } = await supabase
        .from('group_comments')
        .select('id, content, created_at, profiles(f3_name)')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });

      if (commentData) {
        setComments(commentData as any[]);
      }

      setLoading(false);
    }

    if (groupId) initGroupPage();
  }, [groupId, router]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from('group_comments')
        .insert([
          { group_id: groupId, user_id: user.id, content: newComment.trim() }
        ])
        .select('id, content, created_at, profiles(f3_name)')
        .single();

      if (!error && data) {
        setComments((prev) => [data as any, ...prev]);
        setNewComment('');
      }
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-xs font-bold text-gray-400 uppercase">Checking Clearance...</div>;
  }

  if (!isAuthorized) return null;

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      {/* Group Header */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Prov Squad Study</h1>
            <p className="text-xs text-gray-500 font-bold">F3 Jacksonville • Kernan Forest</p>
          </div>
          <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            <Shield size={12} /> Q: Stat
          </span>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-400 block font-bold uppercase">Active Track</span>
            <span className="text-sm font-bold text-gray-900">Being HIM (14 Days)</span>
          </div>
          <Link href="/study" className="bg-black text-white text-xs font-bold px-3 py-2 rounded flex items-center gap-1">
            <BookOpen size={14} /> Read Today
          </Link>
        </div>
      </div>

      {/* Accountability Grid Board */}
      <section className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-sm font-black uppercase tracking-wide text-gray-700 mb-3">Accountability</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 text-xs font-bold text-gray-400 uppercase">Pax</th>
                {DAYS.map((d) => <th key={d} className="py-2 text-center text-xs font-bold text-gray-400 uppercase w-8">{d}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MEMBERS.map((m) => (
                <tr key={m.id}>
                  <td className="py-3 text-xs font-bold text-gray-900 truncate max-w-[90px]">{m.f3Name}</td>
                  {m.checks.map((done, idx) => (
                    <td key={idx} className="py-3 text-center">
                      {done ? <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-700 rounded-full"><Check size={12} strokeWidth={3} /></span> : <span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 text-red-600 rounded-full"><X size={12} strokeWidth={3} /></span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Group Discussion Feed */}
      <section className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-sm font-black uppercase tracking-wide text-gray-700 mb-4 flex items-center gap-2">
          <MessageSquare size={16} /> Group Discussion
        </h2>

        {/* Input */}
        <form onSubmit={handlePostComment} className="mb-6 space-y-2">
          <textarea
            rows={2}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share an insight with your group..."
            className="w-full p-3 border border-gray-300 rounded text-sm focus:ring-black focus:border-black"
          />
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-black text-white font-bold py-2 rounded text-xs flex items-center justify-center gap-1 active:bg-gray-800 disabled:opacity-50"
          >
            <Send size={14} /> Post Insight
          </button>
        </form>

        {/* Comments Feed */}
        <div className="space-y-3">
          {comments.length === 0 ? (
            <p className="text-center text-xs text-gray-400 py-4">No comments posted yet. Start the conversation!</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="p-3 bg-gray-50 border border-gray-200 rounded text-xs space-y-1">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-gray-900">{c.profiles?.f3_name || 'Pax'}</span>
                  <span className="text-gray-400 font-normal">
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