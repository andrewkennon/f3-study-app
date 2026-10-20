'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search } from 'lucide-react';

type Group = {
  id: string;
  name: string;
  region: string;
  location: string;
  ao: string;
  profiles: { f3_name: string } | null;
};

export default function DiscoveryPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchGroups() {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          id,
          name,
          region,
          location,
          ao,
          profiles:q_id ( f3_name )
        `);

      if (!error && data) {
        setGroups(data as unknown as Group[]);
      }
    }
    fetchGroups();
  }, []);

  const filteredGroups = groups.filter((g) => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.ao.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="max-w-md mx-auto p-4 pt-8">
      <h1 className="text-2xl font-black mb-6 tracking-tight">GROUP DIRECTORY</h1>
      
      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search Region, Location, or AO..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
        />
      </div>

      {/* Directory List */}
      <div className="space-y-4">
        {filteredGroups.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No groups found. Create one to get started!</p>
        ) : (
          filteredGroups.map((group) => (
            <div key={group.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{group.name}</h3>
                  <p className="text-sm text-gray-500">{group.location} • AO: {group.ao}</p>
                </div>
                <span className="bg-gray-100 text-xs font-bold px-2 py-1 rounded">
                  Q: {group.profiles?.f3_name || 'Unknown'}
                </span>
              </div>
              <button className="w-full mt-4 bg-gray-100 text-black font-bold py-2 rounded border border-gray-300 active:bg-gray-200">
                Request to Join
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}