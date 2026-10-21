'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Compass } from 'lucide-react';

export default function GroupIndex() {
  const router = useRouter();

  useEffect(() => {
    async function routeToActiveGroup() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Look up the first group this user is an approved member of
      const { data: membership } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .limit(1)
        .single();

      if (membership && membership.group_id) {
        // Forward them into their locked group room
        router.push(`/group/${membership.group_id}`);
      } else {
        // If they aren't in a group yet, send them to the discovery directory
        router.push('/discovery');
      }
    }

    routeToActiveGroup();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-400 space-y-3">
      <Compass size={32} className="animate-spin-slow opacity-50" />
      <span className="text-xs font-bold uppercase tracking-widest">Locating Your Group...</span>
    </div>
  );
}