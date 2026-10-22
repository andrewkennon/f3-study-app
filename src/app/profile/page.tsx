'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Bell, LogOut, MapPin, Edit3, Save, X } from 'lucide-react';
import Link from 'next/link';

interface Profile {
  f3_name: string;
  real_name: string;
  region: string;
  home_ao: string;
}

interface Notification {
  id: string;
  day_number: number | null;
  is_read: boolean;
  created_at: string;
  group_id: string;
  groups: { name: string };
  sender: { f3_name: string; real_name: string };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string>('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form states
  const [f3Name, setF3Name] = useState('');
  const [realName, setRealName] = useState('');
  const [region, setRegion] = useState('');
  const [homeAo, setHomeAo] = useState('');

  useEffect(() => {
    async function loadProfileAndNotifications() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email || '');

      // Check localStorage fallbacks from signup
      const localF3 = localStorage.getItem('f3_name') || localStorage.getItem('pending_f3_name');
      const localReal = localStorage.getItem('real_name') || localStorage.getItem('pending_real_name');
      const localRegion = localStorage.getItem('region') || localStorage.getItem('pending_region');
      const localAo = localStorage.getItem('home_ao') || localStorage.getItem('pending_home_ao');

      // Fetch Profile Details from Supabase
      let { data: profileData } = await supabase
        .from('profiles')
        .select('f3_name, real_name, region, home_ao')
        .eq('id', user.id)
        .single();

      // If profile is missing or shows default 'Pax' while localStorage has data, sync it immediately
      if ((!profileData || profileData.f3_name === 'Pax' || !profileData.real_name) && (localF3 || localReal)) {
        const payload = {
          id: user.id,
          email: user.email,
          f3_name: localF3 || profileData?.f3_name || 'Pax',
          real_name: localReal || profileData?.real_name || '',
          region: localRegion || profileData?.region || 'Jacksonville',
          home_ao: localAo || profileData?.home_ao || 'Prov Squad',
        };
        await supabase.from('profiles').upsert([payload], { onConflict: 'id' });
        profileData = payload;
      }

      if (profileData) {
        setProfile(profileData as any);
        setF3Name(profileData.f3_name || localF3 || user.user_metadata?.f3_name || '');
        setRealName(profileData.real_name || localReal || user.user_metadata?.real_name || '');
        setRegion(profileData.region || localRegion || user.user_metadata?.region || 'Jacksonville');
        setHomeAo(profileData.home_ao || localAo || user.user_metadata?.home_ao || '');
      } else {
        const defaultF3 = localF3 || user.user_metadata?.f3_name || 'Pax';
        const defaultReal = localReal || user.user_metadata?.real_name || '';
        const defaultRegion = localRegion || user.user_metadata?.region || 'Jacksonville';
        const defaultAo = localAo || user.user_metadata?.home_ao || '';

        setProfile({ f3_name: defaultF3, real_name: defaultReal, region: defaultRegion, home_ao: defaultAo });
        setF3Name(defaultF3);
        setRealName(defaultReal);
        setRegion(defaultRegion);
        setHomeAo(defaultAo);
      }

      // Fetch Tag Mentions
      const { data: notifData } = await supabase
        .from('notifications')
        .select(`
          id, day_number, is_read, created_at, group_id,
          groups (name),
          sender:sender_id (f3_name, real_name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (notifData) setNotifications(notifData as any);

      setLoading(false);
    }

    loadProfileAndNotifications();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const profilePayload = {
      id: user.id,
      f3_name: f3Name.trim(),
      real_name: realName.trim(),
      region: region.trim(),
      home_ao: homeAo.trim(),
      email: user.email || email,
    };

    const { error } = await supabase
      .from('profiles')
      .upsert([profilePayload], { onConflict: 'id' });

    setSaving(false);
    if (error) {
      alert('Error updating profile: ' + error.message);
    } else {
      setProfile({
        f3_name: f3Name.trim(),
        real_name: realName.trim(),
        region: region.trim(),
        home_ao: homeAo.trim(),
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  if (loading) {
    return <p className="text-center text-xs font-bold text-gray-400 py-12 uppercase">Loading Profile...</p>;
  }

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-tight">MY PROFILE</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-gray-100 hover:bg-gray-200 text-black text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
        >
          {isEditing ? <><X size={14} /> Cancel</> : <><Edit3 size={14} /> Edit Profile</>}
        </button>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="bg-black text-white p-3 rounded-full">
            <User size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black">{profile?.f3_name || profile?.real_name || 'Pax'}</h2>
            <p className="text-xs font-bold text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin size={12} /> {profile?.region || 'Jacksonville'} {profile?.home_ao ? `(${profile.home_ao})` : ''}
            </p>
          </div>
        </div>
        <div className="pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-1">
          <p><strong>Real Name:</strong> {profile?.real_name || 'Not Set'}</p>
          <p><strong>Email:</strong> {email || 'Not Set'}</p>
        </div>
      </div>

      {/* Conditional Edit Profile Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Edit3 size={16} className="text-black" />
            <h2 className="font-black text-xs uppercase tracking-wider text-black">Update Your Information</h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">F3 Name</label>
            <input
              type="text"
              value={f3Name}
              onChange={(e) => setF3Name(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs bg-white focus:ring-black focus:border-black font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">Real Name</label>
            <input
              type="text"
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs bg-white focus:ring-black focus:border-black font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">F3 Region</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs bg-white focus:ring-black focus:border-black font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">Home AO</label>
              <input
                type="text"
                value={homeAo}
                onChange={(e) => setHomeAo(e.target.value)}
                placeholder="e.g. Prov Squad"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-xs bg-white focus:ring-black focus:border-black font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-black text-white py-3 rounded-lg font-black text-xs uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            {saving ? 'Saving...' : <><Save size={14} /> Save Changes</>}
          </button>
        </form>
      )}

      {/* Mentions & Notifications Center */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-black" />
          <h3 className="text-xs font-black uppercase tracking-wider">Mentions & Activity</h3>
        </div>

        <div className="space-y-2">
          {notifications.length === 0 ? (
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-center text-xs text-gray-400">
              No mentions yet. When a Pax tags you with @, it will appear here.
            </div>
          ) : (
            notifications.map((n) => {
              const targetHref = n.day_number
                ? `/study?day=${n.day_number}`
                : `/group/${n.group_id}`;

              return (
                <Link
                  key={n.id}
                  href={targetHref}
                  onClick={() => markAsRead(n.id)}
                  className={`block p-3.5 rounded-xl border transition-all text-xs ${
                    n.is_read
                      ? 'bg-white border-gray-200 text-gray-700'
                      : 'bg-black text-white border-black font-bold shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-black">
                      {n.sender?.f3_name || 'A Pax'} tagged you
                    </span>
                    <span className="text-[10px] opacity-75">
                      {new Date(n.created_at).toLocaleDateString([], { month: 'numeric', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="mt-1 opacity-90">
                    In <strong>{n.groups?.name || 'Mumblechatter'}</strong> {n.day_number ? `(Day ${n.day_number})` : ''}
                  </p>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="w-full py-3 bg-red-50 text-red-700 font-bold text-xs rounded-xl border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
      >
        <LogOut size={16} /> Sign Out
      </button>
    </main>
  );
}