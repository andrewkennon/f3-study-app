'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Shield, BookOpen, Compass, Plus, ArrowRight } from 'lucide-react';

interface ActiveGroup {
  id: string;
  name: string;
  region: string;
  ao: string;
}

export default function GroupDashboardPage() {
  const [activeGroups, setActiveGroups] = useState<ActiveGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserGroups() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: memberships } = await supabase
        .from('group_members')
        .select('group_id, groups(id, name, region, ao)')
        .eq('user_id', user.id)
        .eq('status', 'approved');

      if (memberships) {
        const groups = memberships
          .map((m: any) => m.groups)
          .filter(Boolean);
        setActiveGroups(groups);
      }
      setLoading(false);
    }

    loadUserGroups();
  }, []);

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-tight">MY BIBLE STUDIES</h1>
        <Link href="/create-group" className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors">
          <Plus size={20} />
        </Link>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-xs text-gray-400 font-bold uppercase py-8">Loading Active Groups...</p>
        ) : activeGroups.length === 0 ? (
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center space-y-4">
            <p className="text-sm font-bold text-gray-800">You haven&apos;t joined any study groups yet.</p>
            <p className="text-xs text-gray-500">Explore open groups in your region or start your own study group.</p>
            <div className="flex justify-center gap-2 pt-2">
              <Link href="/discovery" className="bg-black text-white text-xs font-bold px-4 py-2.5 rounded flex items-center gap-1">
                <Compass size={14} /> Find a Group
              </Link>
            </div>
          </div>
        ) : (
          activeGroups.map((g) => (
            <div key={g.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-black">{g.name}</h3>
                  <p className="text-xs font-bold text-gray-500">{g.region} {g.ao !== 'N/A' && `• ${g.ao}`}</p>
                </div>
                <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <Shield size={12} /> Active
                </span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-400 font-bold uppercase">Track: Being HIM</span>
                <Link href={`/group/${g.id}`} className="bg-black text-white text-xs font-bold px-3 py-2 rounded flex items-center gap-1">
                  Enter Group <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}