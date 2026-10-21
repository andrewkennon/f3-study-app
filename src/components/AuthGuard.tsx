'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Allow access to login and signup pages
      const isAuthPage = pathname === '/login' || pathname === '/signup';

      if (!session && !isAuthPage) {
        router.push('/login'); // Bounce unauthenticated users to login
      } else {
        setLoading(false); // Unlock the screen
      }
    };

    checkUser();
  }, [pathname, router]);

  // Brief loading screen while checking the lock
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
        Verifying Pax...
      </div>
    );
  }

  return <>{children}</>;
}