'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Home, BookOpen, MessageSquare, Compass, LogOut } from 'lucide-react';

export default function BottomNav() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-around items-center z-50 max-w-md mx-auto">
      <Link href="/group" className="flex flex-col items-center text-gray-600 hover:text-black">
        <Home size={20} />
        <span className="text-[10px] font-bold mt-1">Home</span>
      </Link>
      <Link href="/study" className="flex flex-col items-center text-gray-600 hover:text-black">
        <BookOpen size={20} />
        <span className="text-[10px] font-bold mt-1">Study</span>
      </Link>
      <Link href="/mumblechatter" className="flex flex-col items-center text-gray-600 hover:text-black">
        <MessageSquare size={20} />
        <span className="text-[10px] font-bold mt-1">Chatter</span>
      </Link>
      <Link href="/discovery" className="flex flex-col items-center text-gray-600 hover:text-black">
        <Compass size={20} />
        <span className="text-[10px] font-bold mt-1">Discover</span>
      </Link>
      <button 
        onClick={handleLogout}
        className="flex flex-col items-center text-red-600 hover:text-red-800 transition-colors"
      >
        <LogOut size={20} />
        <span className="text-[10px] font-bold mt-1">Logout</span>
      </button>
    </nav>
  );
}