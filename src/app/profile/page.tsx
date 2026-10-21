'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Shield, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = Router = useRouter();
  const [profile, setProfile] = useState<{ f3_name?: string; real_name?: string; email?: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('f3_name, real_name')
        .eq('id', user.id)
        .single();

      setProfile({
        f3_name: data?.f3_name || 'N/A',
        real_name: data?.real_name || 'N/A',
        email: user.email,
      });
      setLoading(false);
    }

    loadProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return <main className="max-w-md mx-auto p-4 text-center text-xs font-bold text-gray-400 py-12">Loading Profile...</main>;
  }

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      <h1 className="text-2xl font-black tracking-tight">MY PROFILE</h1>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="bg-black text-white p-3 rounded-full">
            <User size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black">{profile.f3_name}</h2>
            <p className="text-xs text-gray-500 font-bold">F3 Name</p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <p className="text-gray-400 font-bold uppercase">Hospital Name</p>
            <p className="font-bold text-gray-800 text-sm mt-0.5">{profile.real_name}</p>
          </div>
          <div>
            <p className="text-gray-400 font-bold uppercase">Email Address</p>
            <p className="font-bold text-gray-800 text-sm mt-0.5">{profile.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white font-bold text-xs py-3 rounded flex items-center justify-center gap-2 mt-4"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </main>
  );
}