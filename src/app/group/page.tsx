'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Shield, ArrowRight, Bell } from 'lucide-react';

interface GroupMembership {
  id: string;
  name: string;
  region: string;
  ao: string;
  q_id: string;
  master_studies?: {
    title: string;
  };
}

export default function GroupDashboardPage() {
  const [groups, setGroups] = useState<GroupMembership[]>([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState<Record<string, number>>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserGroups() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      setCurrentUserId(user.id);

      // Fetch groups the user actively belongs to
      const { data: memberships } = await supabase
        .from('group_members')
        .select(`
          group_id,
          status,
          groups (
            id, name, region, ao, q_id,
            master_studies:active_study_id (title)
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'approved');

      if (memberships) {
        const userGroupList = memberships
          .map((m: any) => m.groups)
          .filter(Boolean);
        setGroups(userGroupList);

        // For groups where user is Q, check for pending join requests
        const qGroupIds = userGroupList
          .filter((g: any) => g.q_id === user.id)
          .map((g: any) => g.id);

        if (qGroupIds.length > 0) {
          const { data: pendingData } = await supabase
            .from('group_members')
            .select('group_id')
            .in('group_id', qGroupIds)
            .eq('status', 'pending');

          if (pendingData) {
            const counts: Record<string, number> = {};
            pendingData.forEach((item: any) => {
              counts[item.group_id] = (counts[item.group_id] || 0) + 1;
            });
            setPendingRequestsCount(counts);
          }
        }
      }
      setLoading(false);
    }

    loadUserGroups();
  }, []);

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      {/* Header Bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-tight">MY GROUPS</h1>
        <Link
          href="/create-group"
          className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          <Plus size={20} />
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-xs font-bold text-gray-400 py-12 uppercase">
          Loading Groups...
        </p>
      ) : groups.length === 0 ? (
        <div className="bg-white p-6 rounded-xl border border-gray-200 text-center space-y-4 shadow-sm">
          <Shield size={36} className="mx-auto text-gray-400" />
          <div className="space-y-1">
            <h3 className="font-black text-lg">No Active Groups</h3>
            <p className="text-xs text-gray-500">
              You aren't a member of any F3 Bible study groups yet.
            </p>
          </div>
          <Link
            href="/discovery"
            className="inline-block bg-black text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Find a Group
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => {
            const isQ = currentUserId === group.q_id;
            const pendingCount = pendingRequestsCount[group.id] || 0;

            return (
              <div
                key={group.id}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-black tracking-tight">{group.name}</h2>
                    <p className="text-xs font-bold text-gray-500 mt-0.5">
                      {group.region} {group.ao && group.ao !== 'N/A' ? `• ${group.ao}` : ''}
                    </p>
                  </div>
                  <span className="bg-black text-white text-[10px] font-black px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Shield size={10} /> Active
                  </span>
                </div>

                {/* Q Action Banner / Pending Requests Notification */}
                {isQ && pendingCount > 0 && (
                  <Link
                    href={`/manage-group?groupId=${group.id}`}
                    className="bg-amber-500 text-black p-2.5 rounded-lg font-bold text-xs flex items-center justify-between shadow-sm animate-pulse"
                  >
                    <span className="flex items-center gap-1.5">
                      <Bell size={14} className="fill-black" />
                      {pendingCount} Pending Join Request{pendingCount > 1 ? 's' : ''}
                    </span>
                    <span className="underline text-[11px]">Review</span>
                  </Link>
                )}

                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-[11px] font-black tracking-wide text-gray-400 uppercase">
                    TRACK: {group.master_studies?.title || 'BEING HIM'}
                  </span>

                  <Link
                    href={`/group/${group.id}`}
                    className="bg-black text-white font-black text-xs px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1"
                  >
                    Enter Group <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}