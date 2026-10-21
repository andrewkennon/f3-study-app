'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Shield, Check, X, ArrowLeft, Users, BookOpen, Save } from 'lucide-react';

interface PendingMember {
  user_id: string;
  group_id: string;
  group_name: string;
  status: string;
  f3_name: string;
  real_name: string;
}

interface MasterStudy {
  id: string;
  title: string;
  total_days: number;
}

function ManageGroupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetGroupId = searchParams.get('groupId');

  const [pendingList, setPendingList] = useState<PendingMember[]>([]);
  const [studies, setStudies] = useState<MasterStudy[]>([]);
  const [selectedStudyId, setSelectedStudyId] = useState<string>('');
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchGroupAndRequests = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    // 1. Fetch Master Studies Library
    const { data: studiesData } = await supabase.from('master_studies').select('id, title, total_days');
    if (studiesData) setStudies(studiesData);

    // 2. Fetch Group Details
    if (targetGroupId) {
      const { data: groupData } = await supabase
        .from('groups')
        .select('name, active_study_id')
        .eq('id', targetGroupId)
        .single();

      if (groupData) {
        setGroupName(groupData.name);
        if (groupData.active_study_id) {
          setSelectedStudyId(groupData.active_study_id);
        } else if (studiesData && studiesData.length > 0) {
          setSelectedStudyId(studiesData[0].id);
        }
      }
    }

    // 3. Fetch Pending Join Requests
    let query = supabase
      .from('group_members')
      .select('user_id, group_id, status, groups(name), profiles(f3_name, real_name)')
      .eq('status', 'pending');

    if (targetGroupId) {
      query = query.eq('group_id', targetGroupId);
    }

    const { data: pendingData } = await query;

    if (pendingData) {
      const formatted: PendingMember[] = pendingData.map((item: any) => ({
        user_id: item.user_id,
        group_id: item.group_id,
        group_name: item.groups?.name || 'Unknown Group',
        status: item.status,
        f3_name: item.profiles?.f3_name || 'Pax',
        real_name: item.profiles?.real_name || 'N/A',
      }));
      setPendingList(formatted);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchGroupAndRequests();
  }, [targetGroupId]);

  const handleSaveStudyTrack = async () => {
    if (!targetGroupId || !selectedStudyId) return;

    const { error } = await supabase
      .from('groups')
      .update({ active_study_id: selectedStudyId })
      .eq('id', targetGroupId);

    if (!error) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleDecision = async (groupId: string, userId: string, decision: 'approved' | 'rejected') => {
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

      {groupName && (
        <div className="bg-black text-white p-3.5 rounded-lg text-xs font-bold flex items-center justify-between shadow-sm">
          <span>Group: {groupName}</span>
          <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">Q Leader</span>
        </div>
      )}

      {/* INTERACTIVE STUDY TRACK SELECTOR */}
      {targetGroupId && (
        <section className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
          <h2 className="text-xs font-black uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
            <BookOpen size={14} className="text-black" /> Active Study Track
          </h2>

          <div className="space-y-2">
            <select
              value={selectedStudyId}
              onChange={(e) => setSelectedStudyId(e.target.value)}
              className="w-full border border-gray-300 rounded p-2.5 text-xs font-bold bg-white focus:ring-black focus:border-black"
            >
              {studies.length === 0 ? (
                <option value="">Being HIM (14 Days)</option>
              ) : (
                studies.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.total_days} Days)
                  </option>
                ))
              )}
            </select>

            <button
              onClick={handleSaveStudyTrack}
              className="w-full bg-black text-white font-bold text-xs py-2 rounded flex items-center justify-center gap-1.5 active:bg-gray-800"
            >
              <Save size={14} /> {saveSuccess ? 'Track Updated!' : 'Update Active Study'}
            </button>
          </div>
        </section>
      )}

      {/* PENDING REQUESTS PANEL */}
      <section className="space-y-3">
        <h2 className="text-xs font-black uppercase text-gray-400 tracking-wider flex items-center gap-1.5">
          <Users size={14} /> Pending Join Requests ({pendingList.length})
        </h2>

        {loading ? (
          <p className="text-center text-xs font-bold text-gray-400 py-8">Loading requests...</p>
        ) : pendingList.length === 0 ? (
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center space-y-1">
            <p className="text-sm font-bold text-gray-800">No pending requests</p>
            <p className="text-xs text-gray-400">All join requests for this group have been processed.</p>
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
      </section>
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