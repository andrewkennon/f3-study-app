'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Shield, Check, X, ArrowLeft, Users, AlertCircle } from 'lucide-react';

interface PendingMember {
  user_id: string;
  group_id: string;
  group_name: string;
  status: string;
  f3_name: string;
  real_name: string;
}

function ManageGroupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetGroupId = searchParams.get('groupId');

  const [pendingList, setPendingList] = useState<PendingMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugMsg, setDebugMsg] = useState('');

  const fetchPendingRequests = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    // Fetch pending requests without querying non-existent 'id'
    const { data, error } = await supabase
      .from('group_members')
      .select('user_id, group_id, status, groups(name), profiles(f3_name, real_name)')
      .eq('status', 'pending');

    if (error) {
      setDebugMsg(`Query Error: ${error.message}`);
    } else if (data) {
      setDebugMsg(`Found ${data.length} total pending record(s) in database.`);
      const formatted: PendingMember[] = data.map((item: any) => ({
        user_id: item.user_id,
        group_id: item.group_id,
        group_name: item.groups?.name || 'Unknown Group',
        status: item.status,
        f3_name: item.profiles?.f3_name || 'Pax',
        real_name: item.profiles?.real_name || 'N/A',
      }));

      if (targetGroupId) {
        setPendingList(formatted.filter((f) => f.group_id === targetGroupId));
      } else {
        setPendingList(formatted);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPendingRequests();
  }, [targetGroupId]);

  const handleDecision = async (groupId: string, userId: string, decision: 'approved' | 'rejected') => {
    // Target row via composite key (group_id, user_id)
    const { error } = await supabase
      .from('group_members')
      .update({ status: decision })
      .eq('group_id', groupId)
      .eq('user_id', userId);

    if (!error) {
      setPendingList((prev) => prev.filter((item) => !(item.group_id === groupId && item.user_id === userId)));
    }
  };

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/group" className="bg-gray-100 p-2 rounded-full text-gray-700 hover:bg-gray-200">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-black tracking-tight">Q APPROVAL PANEL</h1>
        <Shield size={20} className="text-black" />
      </div>

      {debugMsg && (
        <div className="bg-gray-100 border border-gray-300 p-3 rounded text-xs font-bold text-gray-700 flex items-center gap-2">
          <AlertCircle size={16} className="text-black shrink-0" />
          <span>{debugMsg}</span>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
          <Users size={14} /> Pending Join Requests ({pendingList.length})
        </h2>

        {loading ? (
          <p className="text-center text-xs font-bold text-gray-400 py-8">Loading requests...</p>
        ) : pendingList.length === 0 ? (
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center space-y-1">
            <p className="text-sm font-bold text-gray-800">No pending requests</p>
            <p className="text-xs text-gray-400">No pending requests found for this group filter.</p>
          </div>
        ) : (
          pendingList.map((req) => (
            <div key={`${req.group_id}-${req.user_id}`} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-black text-sm text-gray-900">{req.f3_name}</h3>
                <p className="text-xs text-gray-500 font-bold">Hospital Name: {req.real_name}</p>
                <p className="text-[10px] text-gray-400 font-bold mt-1">Group: {req.group_name}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDecision(req.group_id, req.user_id, 'approved')}
                  className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors"
                  title="Approve Member"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => handleDecision(req.group_id, req.user_id, 'rejected')}
                  className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors"
                  title="Reject Request"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

export default function ManageGroupPage() {
  return (
    <Suspense fallback={<div className="p-4 text-xs font-bold text-gray-400 text-center">Loading Panel...</div>}>
      <ManageGroupContent />
    </Suspense>
  );
}