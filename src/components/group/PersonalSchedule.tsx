'use client';

import Link from 'next/link';

interface DayItem {
  dayNumber: number;
  dateString: string;
}

interface PersonalScheduleProps {
  daysArray: DayItem[];
  userCompletedDays: number[];
  targetDay: number;
  studySlug: string;
}

export function PersonalSchedule({
  daysArray,
  userCompletedDays,
  targetDay,
  studySlug,
}: PersonalScheduleProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-black uppercase text-gray-500 tracking-wider">Your Reading Schedule</h3>
      <div className="grid grid-cols-7 gap-1.5">
        {daysArray.map((d) => {
          const isDone = userCompletedDays.includes(d.dayNumber);
          const isPastOrToday = d.dayNumber <= targetDay;

          const bgClass = isDone
            ? 'bg-green-700 text-white border-green-800 hover:bg-green-800'
            : isPastOrToday
            ? 'bg-red-600 text-white border-red-700 hover:bg-red-700'
            : 'bg-white text-gray-900 border-gray-200 hover:border-gray-400';

          return (
            <Link
              key={d.dayNumber}
              href={`/study?study=${studySlug}&day=${d.dayNumber}`}
              className={`p-2 rounded-lg border text-center flex items-center justify-center transition-all shadow-sm ${bgClass}`}
              title={`Day ${d.dayNumber} - ${d.dateString}`}
            >
              <span className="text-xs font-black">{d.dateString}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}