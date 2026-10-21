'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Search, Plus, MapPin, Users, Check, Clock, BookOpen } from 'lucide-react';

interface Group {
  id: string;
  name: string;
  region: string;
  ao: string;
}

export default function DiscoveryPage() {
  const [tab, setTab] = useState<'groups' | 'studies'>('groups');
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userMemberships, setUserMemberships] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDirectory() {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: groupList } = await supabase.from('groups').select('*');
      if (groupList) setGroups(groupList);

      if (user) {
        const { data: memberships } = await supabase
          .from('group_members')
          .select('group_id, status')
          .eq('user_id', user.id);

        if (memberships) {
          const statusMap: Record<string, string> = {};
          memberships.forEach((m) => { statusMap[m.group_id] = m.status; });
          setUserMemberships(statusMap);
        }
      }
      setLoading(false);
    }

    loadDirectory();
  }, []);

  const handleRequestJoin = async (groupId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('group_members').insert([
      { group_id: groupId, user_id: user.id, status: 'pending' }
    ]);

    if (!error) {
      setUserMemberships((prev) => ({ ...prev, [groupId]: 'pending' }));
    }
  };

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.ao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-tight">DISCOVERY HUB</h1>
        <Link href="/create-group" className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors">
          <Plus size={20} />
        </Link>
      </div>

      {/* Directory Tab Bar */}
      <div className="grid grid-cols-2 gap-1 bg-gray-200 p-1 rounded-lg text-center text-xs font-bold">
        <button
          onClick={() => setTab('groups')}
          className={`py-2 rounded transition-all ${tab === 'groups' ? 'bg-white text-black shadow-sm' : 'text-gray-600'}`}
        >
          F3 Groups
        </button>
        <button
          onClick={() => setTab('studies')}
          className={`py-2 rounded transition-all ${tab === 'studies' ? 'bg-white text-black shadow-sm' : 'text-gray-600'}`}
        >
          Bible Study Tracks
        </button>
      </div>

      {tab === 'groups' ? (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Region, AO, or Group Name..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm bg-white focus:ring-black focus:border-black"
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
                <div key={group.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-3">
                  <div>
                    <h3 className="text-lg font-black tracking-tight">{group.name}</h3>
                    <p className="text-xs font-bold text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={12} /> {group.region} {group.ao !== 'N/A' && `• ${group.ao}`}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
                      <Users size={14} /> F3 Study Group
                    </span>

                    {status === 'approved' ? (
                      <Link href={`/group/${group.id}`} className="bg-green-700 text-white font-bold text-xs px-3 py-2 rounded flex items-center gap-1">
                        <Check size={14} /> Member (Enter)
                      </Link>
                    ) : status === 'pending' ? (
                      <span className="bg-gray-100 text-gray-600 font-bold text-xs px-3 py-2 rounded border border-gray-200 flex items-center gap-1">
                        <Clock size={14} /> Pending Approval
                      </span>
                    ) : (
                      <button onClick={() => handleRequestJoin(group.id)} className="bg-black text-white font-bold text-xs px-3 py-2 rounded active:bg-gray-800">
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
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-black">Being HIM</h3>
              <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded">14 Days</span>
            </div>
            <p className="text-xs text-gray-600 leading-normal">
              A foundational 14-day study on Christian leadership, vulnerability, and holding each other accountable in the gloom and in life.
            </p>
            <div className="pt-2 border-t border-gray-100 flex justify-end">
              <Link href="/study?day=1" className="bg-black text-white text-xs font-bold px-3 py-2 rounded flex items-center gap-1">
                Read Study <BookOpen size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}