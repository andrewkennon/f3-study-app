'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Search, Plus, MapPin, Users, Check, Clock, BookOpen, ArrowRight, Shield } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  region: string;
  ao: string;
  q_id: string;
}

interface StudyPlan {
  id: string;
  title: string;
  duration: string;
  description: string;
  slug: string;
}

const AVAILABLE_STUDIES: StudyPlan[] = [
  {
    id: 'being-him',
    title: 'Being HIM',
    duration: '14 Days',
    description: 'A foundational 14-day study on Christian leadership, vulnerability, and holding each other accountable in the gloom and in life.',
    slug: 'being-him'
  },
  {
    id: 'godly-man',
    title: 'Godly Man',
    duration: '7 Days',
    description: 'Core biblical commands on standing firm, acting with courage, and leading your family and region with love.',
    slug: 'godly-man'
  }
];

export default function DiscoveryPage() {
  const [tab, setTab] = useState<'groups' | 'studies'>('groups');
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userMemberships, setUserMemberships] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDirectory() {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const pendingF3 = localStorage.getItem('pending_f3_name');
        const pendingReal = localStorage.getItem('pending_real_name');
        const pendingRegion = localStorage.getItem('pending_region');
        const pendingAo = localStorage.getItem('pending_home_ao');

        if (pendingF3 || pendingReal) {
          await supabase.from('profiles').upsert([
            {
              id: user.id,
              f3_name: pendingF3 || 'Pax',
              real_name: pendingReal || '',
              region: pendingRegion || 'Prov Squad',
              home_ao: pendingAo || 'Pool Party',
              email: user.email || '',
            }
          ], { onConflict: 'id' });

          localStorage.removeItem('pending_f3_name');
          localStorage.removeItem('pending_real_name');
          localStorage.removeItem('pending_region');
          localStorage.removeItem('pending_home_ao');
        }
      }

      const { data: groupList } = await supabase.from('groups').select('*');
      if (groupList) setGroups(groupList);

      if (user) {
        const { data: memberships } = await supabase
          .from('group_members')
          .select('group_id, status')
          .eq('user_id', user.id);

        if (memberships) {
          const statusMap: Record<string, string> = {};
          memberships.forEach((m: any) => {
            statusMap[m.group_id] = m.status;
          });
          setUserMemberships(statusMap);
        }
      }
      setLoading(false);
    }

    loadDirectory();
  }, []);

  const handleRequestJoin = async (groupId: string, qId: string, groupName: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error: joinError } = await supabase
      .from('group_members')
      .insert([{ group_id: groupId, user_id: user.id, status: 'pending' }]);

    if (joinError) {
      alert('Error requesting to join: ' + joinError.message);
      return;
    }

    setUserMemberships((prev) => ({ ...prev, [groupId]: 'pending' }));

    const { data: qProfile } = await supabase
      .from('profiles')
      .select('email, f3_name, real_name')
      .eq('id', qId)
      .single();

    const { data: paxProfile } = await supabase
      .from('profiles')
      .select('f3_name, real_name')
      .eq('id', user.id)
      .single();

    const qEmail = qProfile?.email;
    const paxName = paxProfile?.f3_name || paxProfile?.real_name || 'A Pax';

    if (qEmail) {
      await fetch('/api/notify-q', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qEmail, groupName, paxName }),
      });
    }
  };

  const filteredGroups = groups.filter(
    (g) =>
      g.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.ao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-tight">DISCOVERY HUB</h1>
        <Link href="/create-group" className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors">
          <Plus size={20} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-1 bg-gray-200 p-1 rounded-xl text-center text-xs font-black">
        <button
          onClick={() => setTab('groups')}
          className={`py-2.5 rounded-lg transition-all ${tab === 'groups' ? 'bg-white text-black shadow-sm' : 'text-gray-600'}`}
        >
          F3 Groups
        </button>
        <button
          onClick={() => setTab('studies')}
          className={`py-2.5 rounded-lg transition-all ${tab === 'studies' ? 'bg-white text-black shadow-sm' : 'text-gray-600'}`}
        >
          Bible Study Tracks
        </button>
      </div>

      {tab === 'groups' ? (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Region, AO, or Group Name..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-xs bg-white focus:ring-black focus:border-black font-bold outline-none"
            />
          </div>

          {loading ? (
            <p className="text-center text-xs text-gray-400 font-bold uppercase py-8">Loading Directory...</p>
          ) : filteredGroups.length === 0 ? (
            <p className="text-center text-xs text-gray-400 py-8">No groups found matching your search.</p>
          ) : (
            filteredGroups.map((group) => {
              const status = userMemberships[group.id];
              return (
                <div key={group.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                  <div>
                    <h3 className="text-base font-black tracking-tight">{group.name}</h3>
                    <p className="text-xs font-bold text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={12} /> {group.region} {group.ao && group.ao !== 'N/A' ? `• ${group.ao}` : ''}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Users size={12} /> F3 Study Group
                    </span>

                    {status === 'approved' ? (
                      <Link
                        href={`/group/${group.id}`}
                        className="bg-green-700 text-white font-black text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 hover:bg-green-800 transition-colors"
                      >
                        <Check size={14} /> Enter Group
                      </Link>
                    ) : status === 'pending' ? (
                      <span className="bg-gray-100 text-gray-600 font-bold text-xs px-3 py-2 rounded-xl border border-gray-200 flex items-center gap-1">
                        <Clock size={14} /> Pending Approval
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRequestJoin(group.id, group.q_id, group.name)}
                        className="bg-black text-white font-black text-xs px-4 py-2 rounded-xl active:bg-gray-800 transition-colors"
                      >
                        Request to Join
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {AVAILABLE_STUDIES.map((study) => (
            <div 
              key={study.id} 
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 hover:border-black transition-colors"
            >
              <div className="flex justify-between items-start">
                <span className="bg-black text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                  {study.duration}
                </span>
                <span className="text-xs font-bold text-gray-400">ESV Edition</span>
              </div>

              <div>
                <h3 className="text-base font-black tracking-tight text-gray-900">{study.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-1">{study.description}</p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                  <Shield size={12} /> Accountability Enabled
                </span>
                <Link
                  href={`/study?study=${study.slug}&day=1`}
                  className="bg-black text-white text-xs font-black px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                >
                  Start Study <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}