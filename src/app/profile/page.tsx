'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Bell, LogOut, MapPin } from 'lucide-react';
import Link from 'next/link';

interface Profile {
  f3_name: string;
  real_name: string;
  region: string;
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

  useEffect(() => {
    async function loadProfileAndNotifications() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setEmail(user.email || '');

      // Fetch Profile Details
      const { data: profileData } = await supabase
        .from('profiles')
        .select('f3_name, real_name, region')
        .eq('id', user.id)
        .single();

      if (profileData) setProfile(profileData as any);

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
      <h1 className="text-2xl font-black tracking-tight">MY PROFILE</h1>

      {/* Profile Card */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="bg-black text-white p-3 rounded-full">
            <User size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black">{profile?.f3_name || profile?.real_name || 'Stat'}</h2>
            <p className="text-xs font-bold text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin size={12} /> {profile?.region || 'F3 Jacksonville'}
            </p>
          </div>
        </div>
        <div className="pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-1">
          <p><strong>Real Name:</strong> {profile?.real_name || 'Not Set'}</p>
          <p><strong>Email:</strong> {email || 'Not Set'}</p>
        </div>
      </div>

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