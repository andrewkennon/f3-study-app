'use client';

import Link from 'next/link';
import { BookOpen, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';

interface PaceStatusBannerProps {
  studyTitle: string;
  studySlug: string;
  targetDay: number;
  totalDays: number;
  daysBehind: number;
  userNextDay: number;
}

export function PaceStatusBanner({
  studyTitle,
  studySlug,
  targetDay,
  totalDays,
  daysBehind,
  userNextDay,
}: PaceStatusBannerProps) {
  return (
    <div className="bg-black text-white p-5 rounded-xl space-y-4 shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Active Track</span>
          <h2 className="text-xl font-black">{studyTitle}</h2>
        </div>
        <span className="bg-gray-800 text-gray-200 text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
          <Calendar size={12} /> Day {targetDay} of {totalDays}
        </span>
      </div>

      <div className="pt-3 border-t border-gray-800 flex justify-between items-center">
        <div className="text-xs">
          <p className="text-gray-400 font-bold text-[10px] uppercase">Your Status</p>
          {daysBehind <= 0 ? (
            <p className="text-green-400 font-black flex items-center gap-1">
              <CheckCircle2 size={14} /> Caught Up!
            </p>
          ) : (
            <p className="text-amber-400 font-black flex items-center gap-1">
              <AlertCircle size={14} /> {daysBehind} {daysBehind === 1 ? 'Day' : 'Days'} Behind
            </p>
          )}
        </div>

        <Link
          href={`/study?study=${studySlug}&day=${userNextDay}`}
          className="bg-white text-black font-black text-xs px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5"
        >
          Read Day {userNextDay} <BookOpen size={14} />
        </Link>
      </div>
    </div>
  );
}