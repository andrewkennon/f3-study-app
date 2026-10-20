'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const REGIONS = [
  'F3 Jacksonville',
  'F3 Tallahassee',
  'F3 Orlando',
  'F3 First Coast',
  'F3 South Georgia',
];

const AOS_BY_REGION: Record<string, string[]> = {
  'F3 Jacksonville': [
    'Kernan Forest (Prov Squad)',
    'The Sandlot',
    'The Foundry',
    'The Island',
    'The Swamp',
    'The Pier',
  ],
  'F3 Tallahassee': [
    'The Fieldhouse',
    'The Citadel',
    'The Gauntlet',
  ],
  'F3 Orlando': [
    'The Fortress',
    'The Kingdom',
  ],
  'F3 First Coast': [
    'Julington Creek',
    'Nocatee',
  ],
  'F3 South Georgia': [
    'Valdosta',
  ],
};

export default function CreateGroupPage() {
  const [name, setName] = useState('');
  const [region, setRegion] = useState(REGIONS[0]);
  const [ao, setAo] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRegion = e.target.value;
    setRegion(selectedRegion);
    setAo('');
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Creating group...');

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage('You are not logged in. Redirecting to login...');
      setTimeout(() => router.push('/login'), 1500);
      return;
    }

    const { data: groupData, error: groupError } = await supabase
      .from('groups')
      .insert([
        { 
          name, 
          region, 
          location: region, 
          ao: ao || 'N/A', 
          q_id: user.id 
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
      router.push('/discovery');
    }, 1200);
  };

  return (
    <main className="max-w-md mx-auto p-4 pt-8">
      <h1 className="text-2xl font-black mb-6 tracking-tight">START A GROUP</h1>

      <form onSubmit={handleCreateGroup} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Group Name</label>
          <input 
            type="text" 
            required 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded focus:ring-black focus:border-black bg-white" 
            placeholder="e.g. Prov Squad Study" 
          />
        </div>

        {/* Region Dropdown */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">F3 Region</label>
          <select 
            value={region} 
            onChange={handleRegionChange}
            className="w-full p-3 border border-gray-300 rounded focus:ring-black focus:border-black bg-white"
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Optional AO Dropdown */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            AO (Area of Operation) <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <select 
            value={ao} 
            onChange={(e) => setAo(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:ring-black focus:border-black bg-white"
          >
            <option value="">-- None / Virtual / Rotates --</option>
            {AOS_BY_REGION[region]?.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          className="w-full bg-black text-white font-bold py-3 rounded text-lg active:bg-gray-800 transition-colors mt-4"
        >
          Establish Group
        </button>

        {message && <p className="text-center text-sm font-bold text-blue-600 mt-4">{message}</p>}
      </form>
    </main>
  );
}