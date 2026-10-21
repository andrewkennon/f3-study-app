'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';

interface StudyTrack {
  id: string;
  title: string;
  total_days: number;
}

export default function MasterStudiesPage() {
  const [studies, setStudies] = useState<StudyTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudies() {
      const { data } = await supabase.from('master_studies').select('*');
      if (data) setStudies(data);
      setLoading(false);
    }
    loadStudies();
  }, []);

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      <h1 className="text-2xl font-black tracking-tight">BIBLE STUDY TRACKS</h1>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-xs text-gray-400 font-bold uppercase py-8">Loading Library...</p>
        ) : studies.length === 0 ? (
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-3">
            <h3 className="text-lg font-black">Being HIM</h3>
            <p className="text-xs text-gray-600 leading-normal">
              A 14-day foundational study on Christian leadership, vulnerability, and holding each other accountable in the gloom and in life.
            </p>
            <div className="pt-2 flex justify-between items-center text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1"><Calendar size={14} /> 14 Days</span>
              <Link href="/study?day=1" className="bg-black text-white px-3 py-2 rounded flex items-center gap-1">
                Start Study <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ) : (
          studies.map((s) => (
            <div key={s.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-black">{s.title}</h3>
                <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded border border-gray-200">
                  {s.total_days} Days
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-normal">
                Master Bible study track for F3 small groups and personal study.
              </p>
              <div className="pt-2 border-t border-gray-100 flex justify-end">
                <Link href="/study?day=1" className="bg-black text-white text-xs font-bold px-3 py-2 rounded flex items-center gap-1">
                  Preview Study <BookOpen size={14} />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}