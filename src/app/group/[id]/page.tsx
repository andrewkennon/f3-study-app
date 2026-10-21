'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Check, X, BookOpen, MessageSquare, Shield, Lock } from 'lucide-react';

// Hardcoded mock data for the UI (we will make this dynamic later)
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
  const [comments, setComments] = useState([{ id: '1', author: 'Spock', text: 'Ready for the gloom.', time: '2h ago' }]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    async function verifyMembership() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Check if this specific user is an approved member of this specific group
      const { data: member } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .single();

      if (!member) {
        // Not a member? Kick them to the discovery directory.
        router.push('/discovery');
      } else {
        setIsAuthorized(true);
      }
      setLoading(false);
    }

    if (groupId) verifyMembership();
  }, [groupId, router]);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-xs font-bold text-gray-400 uppercase">Checking Clearance...</div>;
  }

  if (!isAuthorized) return null; // Prevent flash of content before redirect

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Prov Squad Study</h1>
            <p className="text-xs text-gray-500 font-bold">Group ID: {groupId.substring(0, 8)}...</p>
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

      {/* Accountability Board */}
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
    </main>
  );
}