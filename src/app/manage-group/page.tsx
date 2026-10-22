'use client';

import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Shield, Check, X, BookOpen, Save } from 'lucide-react';

interface PendingMember {
  user_id: string;
  group_id: string;
  profiles: {
    f3_name: string;
    real_name: string;
    region: string;
    home_ao: string;
  };
}

interface GroupInfo {
  id: string;
  name: string;
  q_id: string;
  active_study_id: string;
}

function ManageGroupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupId = searchParams.get('groupId');

  const [group, setGroup] = useState<GroupInfo | null>(null);
  const [pendingMembers, setPendingMembers] = useState<PendingMember[]>([]);
  const [activeStudy, setActiveStudy] = useState('being-him');
  const [loading, setLoading] = useState(true);
  const [savingStudy, setSavingStudy] = useState(false);

  useEffect(() => {
    if (!groupId) return;

    async function loadData() {
      // 1. Fetch Group Details
      const { data: groupData } = await supabase
        .from('groups')
        .select('id, name, q_id, active_study_id')
        .eq('id', groupId)
        .single();

      if (groupData) {
        setGroup(groupData);
        setActiveStudy(groupData.active_study_id || 'being-him');
      }

      // 2. Fetch Pending Join Requests
      const { data: pendingData } = await supabase
        .from('group_members')
        .select(`
          user_id,
          group_id,
          profiles (f3_name, real_name, region, home_ao)
        `)
        .eq('group_id', groupId)
        .eq('status', 'pending');

      if (pendingData) {
        setPendingMembers(pendingData as any);
      }

      setLoading(false);
    }

    loadData();
  }, [groupId]);

 const handleUpdateStudy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId) return;
    setSavingStudy(true);

    const { error } = await supabase
      .from('groups')
      .update({ active_study_id: activeStudy })
      .eq('id', groupId);

    setSavingStudy(false);

    if (error) {
      alert('Error updating active study: ' + error.message);
    } else {
      alert('Active study track updated successfully!');
      // Force a full browser reload to bypass Next.js client cache and load the new track
      window.location.href = `/group/${groupId}`;
    }
  };

  const handleApprove = async (userId: string) => {
    const { error } = await supabase
      .from('group_members')
      .update({ status: 'approved' })
      .eq('group_id', groupId)
      .eq('user_id', userId);

    if (!error) {
      setPendingMembers((prev) => prev.filter((m) => m.user_id !== userId));
    } else {
      alert('Error approving member: ' + error.message);
    }
  };

  const handleReject = async (userId: string) => {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);

    if (!error) {
      setPendingMembers((prev) => prev.filter((m) => m.user_id !== userId));
    } else {
      alert('Error rejecting member: ' + error.message);
    }
  };

  if (loading) {
    return <p className="text-center text-xs font-bold text-gray-400 py-12 uppercase">Loading Panel...</p>;
  }

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={groupId ? `/group/${groupId}` : '/discovery'} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-black tracking-tight">Q APPROVAL PANEL</h1>
      </div>

      {/* Group Info Badge */}
      <div className="bg-black text-white p-4 rounded-xl flex justify-between items-center shadow-sm">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Group</span>
          <h2 className="text-base font-black">{group?.name}</h2>
        </div>
        <span className="bg-gray-800 text-gray-200 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
          <Shield size={12} /> Q Leader
        </span>
      </div>

      {/* Active Study Track Form */}
      <form onSubmit={handleUpdateStudy} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <BookOpen size={16} className="text-black" />
          <h3 className="text-xs font-black uppercase tracking-wider">Active Study Track</h3>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">Select Track</label>
          <select
            value={activeStudy}
            onChange={(e) => setActiveStudy(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-xl text-xs bg-white focus:ring-black focus:border-black outline-none font-bold"
          >
            <option value="being-him">Being HIM (14 Days)</option>
            <option value="godly-man">Godly Man (7 Days)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={savingStudy}
          className="w-full bg-black text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-1.5"
        >
          {savingStudy ? 'Updating...' : <><Save size={14} /> Update Active Study</>}
        </button>
      </form>

      {/* Pending Join Requests */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-black" />
          <h3 className="text-xs font-black uppercase tracking-wider">Pending Join Requests ({pendingMembers.length})</h3>
        </div>

        <div className="space-y-2">
          {pendingMembers.length === 0 ? (
            <div className="bg-white p-5 rounded-xl border border-gray-200 text-center text-xs text-gray-400 space-y-1">
              <p className="font-bold text-gray-600">No pending requests</p>
              <p>All join requests for this group have been processed.</p>
            </div>
          ) : (
            pendingMembers.map((m) => (
              <div key={m.user_id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-black">{m.profiles?.f3_name || m.profiles?.real_name || 'Pax'}</h4>
                  <p className="text-[10px] text-gray-500">
                    {m.profiles?.region} {m.profiles?.home_ao ? `• ${m.profiles.home_ao}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(m.user_id)}
                    className="bg-green-700 text-white p-2 rounded-lg hover:bg-green-800 transition-colors"
                    title="Approve"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => handleReject(m.user_id)}
                    className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition-colors"
                    title="Reject"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default function ManageGroupPage() {
  return (
    <Suspense fallback={<p className="text-center text-xs font-bold text-gray-400 py-12 uppercase">Loading Panel...</p>}>
      <ManageGroupContent />
    </Suspense>
  );
}