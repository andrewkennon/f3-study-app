'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const DEFAULT_REGIONS = [
  'Jacksonville',
  'Tallahassee',
  'Orlando',
  'First Coast',
  'South Georgia',
];

const DEFAULT_AOS = [
  'Prov Squad',
  'Pool Party',
];

export default function CreateGroupPage() {
  const [name, setName] = useState('');
  const [region, setRegion] = useState('Jacksonville');
  const [ao, setAo] = useState('');
  
  // Default start date to today in YYYY-MM-DD format
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [activeStudyId, setActiveStudyId] = useState('being-him');
  
  const [message, setMessage] = useState('');
  const router = useRouter();

  const [regionsList, setRegionsList] = useState<string[]>(DEFAULT_REGIONS);
  const [aosList, setAosList] = useState<string[]>(DEFAULT_AOS);

  useEffect(() => {
    async function fetchExistingOptions() {
      const { data } = await supabase.from('groups').select('region, ao');
      if (data) {
        const fetchedRegions = Array.from(new Set(data.map((g) => g.region).filter(Boolean))) as string[];
        const fetchedAos = Array.from(new Set(data.map((g) => g.ao).filter(Boolean))) as string[];

        setRegionsList(Array.from(new Set([...DEFAULT_REGIONS, ...fetchedRegions])));
        setAosList(Array.from(new Set([...DEFAULT_AOS, ...fetchedAos])));
      }
    }
    fetchExistingOptions();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Creating group...');

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage('You are not logged in. Redirecting to login...');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }

    // Ensure profile row exists to satisfy the foreign key constraint on q_id
    await supabase.from('profiles').upsert([
      {
        id: user.id,
        f3_name: user.user_metadata?.f3_name || 'Pax',
        real_name: user.user_metadata?.real_name || '',
        region: user.user_metadata?.region || region.trim(),
        home_ao: user.user_metadata?.home_ao || '',
        email: user.email || '',
      }
    ], { onConflict: 'id' });

    const { data: groupData, error: groupError } = await supabase
      .from('groups')
      .insert([
        { 
          name: name.trim(), 
          region: region.trim(), 
          location: region.trim(), 
          ao: ao.trim() || 'N/A', 
          q_id: user.id,
          active_study_id: activeStudyId,
          start_date: startDate // Saved directly from user input
        }
      ])
      .select()
      .single();

    if (groupError) {
      setMessage(`Database Error: ${groupError.message}`);
      return;
    }

    if (groupData) {
      await supabase.from('group_members').insert([
        { group_id: groupData.id, user_id: user.id, status: 'approved' }
      ]);
    }

    setMessage('Success! Group created.');
    setTimeout(() => {
      router.push(`/group/${groupData.id}`);
    }, 1200);
  };

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/discovery" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-black tracking-tight">START A GROUP</h1>
      </div>

      <form onSubmit={handleCreateGroup} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">Group Name</label>
          <input 
            type="text" 
            required 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded-xl text-xs bg-white focus:ring-black focus:border-black outline-none font-bold" 
            placeholder="e.g. Prov Squad Study" 
          />
        </div>

        {/* Region Input */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">F3 Region</label>
          <input 
            type="text"
            required
            list="region-options"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="Type or select region..."
            className="w-full p-3 border border-gray-300 rounded-xl text-xs bg-white focus:ring-black focus:border-black outline-none font-bold"
          />
          <datalist id="region-options">
            {regionsList.map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
        </div>

        {/* AO Input */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
            AO (Area of Operation) <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input 
            type="text"
            list="ao-options"
            value={ao}
            onChange={(e) => setAo(e.target.value)}
            placeholder="Type or select AO..."
            className="w-full p-3 border border-gray-300 rounded-xl text-xs bg-white focus:ring-black focus:border-black outline-none font-bold"
          />
          <datalist id="ao-options">
            {aosList.map((a) => (
              <option key={a} value={a} />
            ))}
          </datalist>
        </div>

        {/* Study Track Selection */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
            Initial Study Track
          </label>
          <select
            value={activeStudyId}
            onChange={(e) => setActiveStudyId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl text-xs bg-white focus:ring-black focus:border-black outline-none font-bold"
          >
            <option value="being-him">Being HIM (14 Days)</option>
            <option value="godly-man">Godly Man (7 Days)</option>
          </select>
        </div>

        {/* Study Start Date Input */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
            Study Start Date (Day 1 Kickoff)
          </label>
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl text-xs bg-white focus:ring-black focus:border-black outline-none font-bold"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-black text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider hover:bg-gray-800 transition-all shadow-md mt-4"
        >
          Establish Group & Set Schedule
        </button>

        {message && <p className="text-center text-xs font-bold text-blue-600 mt-4">{message}</p>}
      </form>
    </main>
  );
}