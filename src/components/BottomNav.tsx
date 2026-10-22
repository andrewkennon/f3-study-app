'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Compass, MessageSquare, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  // Do not show bottom nav on auth screens
  if (pathname === '/login' || pathname === '/signup') return null;

  const navItems = [
    { label: 'Groups', href: '/group', icon: Shield },
    { label: 'Discover', href: '/discovery', icon: Compass },
    { label: 'Chatter', href: '/mumblechatter', icon: MessageSquare },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black text-white border-t border-gray-800 z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/group' && pathname.startsWith('/group/'));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full text-[10px] font-bold transition-colors ${
                isActive ? 'text-white font-black' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'} />
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}