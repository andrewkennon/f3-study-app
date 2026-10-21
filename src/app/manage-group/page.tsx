'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Shield, Check, X, UserCheck } from 'lucide-react';

interface PendingMember {
  id: string; // group_members row id
  user_id: string;
  f3_name: string;
  real_name: string;
}

export default function ManageGroupPage() {
  const [pending, setPending] = useState<PendingMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPendingRequests() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch groups where current user is the Q
      const { data: myGroups } = await supabase
        .from('groups')
        .select('id')
        .eq('q_id', user.id);

      if (myGroups && myGroups.length > 0) {
        const groupIds = myGroups.map((g) => g.id);

        // Fetch pending requests for those groups
        const { data: requests } = await supabase
          .from('group_members')
          .select('id, user_id, profiles(f3_name, real_name)')
          .in('group_id', groupIds)
          .eq('status', 'pending');

        if (requests) {
          const formatted = requests.map((r: any) => ({
            id: r.id,
            user_id: r.user_id,
            f3_name: r.profiles?.f3_name || 'Unknown Pax',
            real_name: r.profiles?.real_name || 'N/A',
          }));
          setPending(formatted);
        }
      }
      setLoading(false);
    }

    loadPendingRequests();
  }, []);

  const handleUpdateStatus = async (memberRowId: string, newStatus: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('group_members')
      .update({ status: newStatus })
      .eq('id', memberRowId);

    if (!error) {
      setPending((prev) => prev.filter((p) => p.id !== memberRowId));
    }
  };

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <Shield size={22} />
        <h1 className="text-xl font-black tracking-tight">Q APPROVAL PANEL</h1>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-xs text-gray-400 font-bold uppercase py-8">Checking Pending Requests...</p>
        ) : pending.length === 0 ? (
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center space-y-2">
            <UserCheck className="mx-auto text-green-600" size={32} />
            <p className="text-sm font-bold text-gray-800">No Pending Requests</p>
            <p className="text-xs text-gray-500">All member requests for your groups have been processed.</p>
          </div>
        ) : (
          pending.map((req) => (
            <div key={req.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-gray-900">{req.f3_name}</p>
                <p className="text-xs text-gray-500">Real Name: {req.real_name}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(req.id, 'approved')}
                  className="bg-green-700 text-white p-2 rounded hover:bg-green-800 transition-colors"
                  title="Approve"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => handleUpdateStatus(req.id, 'rejected')}
                  className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors"
                  title="Reject"
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