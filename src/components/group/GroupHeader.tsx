'use client';

import Link from 'next/link';
import { ArrowLeft, Settings } from 'lucide-react';

interface GroupHeaderProps {
  groupId: string;
  groupName: string;
  isQ: boolean;
  pendingCount: number;
}

export function GroupHeader({ groupId, groupName, isQ, pendingCount }: GroupHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <Link href="/discovery" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
        <ArrowLeft size={18} />
      </Link>
      <h1 className="text-xl font-black tracking-tight">{groupName}</h1>
      {isQ ? (
        <div className="relative">
          <Link
            href={`/manage-group?groupId=${groupId}`}
            className="p-2.5 rounded-2xl bg-black text-white hover:bg-gray-800 flex items-center justify-center shadow-md transition-colors"
          >
            <Settings size={18} />
          </Link>
          {pendingCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white animate-pulse shadow-sm">
              {pendingCount}
            </span>
          )}
        </div>
      ) : (
        <div className="w-9" />
      )}
    </div>
  );
}