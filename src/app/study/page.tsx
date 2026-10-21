'use client';
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchESVScripture } from '@/lib/esv';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ day?: string; group_id?: string }>;
}

export default function DailyStudyPage({ searchParams }: PageProps) {
  const resolvedParams = use(searchParams);
  const currentDay = parseInt(resolvedParams.day || '1', 10);
  const groupId = resolvedParams.group_id || '';

  const [scriptureHtml, setScriptureHtml] = useState('<p class="text-gray-400">Loading scripture...</p>');
  const [scriptureRef, setScriptureRef] = useState('Proverbs 27:17');
  const [himConnection, setHimConnection] = useState('As iron sharpens iron, so one man sharpens another.');
  const [optionalDeepDive, setOptionalDeepDive] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDayData() {
      const { data: { user } } = await supabase.auth.getUser();

      // Fetch study reading content
      const { data: reading } = await supabase
        .from('daily_readings')
        .select('*')
        .eq('day_number', currentDay)
        .single();

      if (reading) {
        setScriptureRef(reading.scripture_reference);
        setHimConnection(reading.him_connection);
        setOptionalDeepDive(reading.optional_deep_dive || '');
        const html = await fetchESVScripture(reading.scripture_reference);
        setScriptureHtml(html);
      } else {
        const html = await fetchESVScripture('Proverbs 27:17');
        setScriptureHtml(html);
      }

      // Check if current user already completed this day
      if (user && groupId) {
        const { data: doneRecord } = await supabase
          .from('accountability')
          .select('id')
          .eq('user_id', user.id)
          .eq('group_id', groupId)
          .eq('day_number', currentDay)
          .single();

        if (doneRecord) setIsCompleted(true);
      }
      setLoading(false);
    }

    loadDayData();
  }, [currentDay, groupId]);

  const handleMarkDone = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !groupId) return;

    const { error } = await supabase.from('accountability').insert([
      { user_id: user.id, group_id: groupId, day_number: currentDay }
    ]);

    if (!error) {
      setIsCompleted(true);
    }
  };

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Being HIM</span>
        <span className="text-xs font-bold bg-black text-white px-2 py-0.5 rounded">Day {currentDay} of 14</span>
      </div>

      <section className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-6">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-3">{scriptureRef} (ESV)</h2>
        <div 
          className="prose prose-sm max-w-none text-gray-900 leading-relaxed [&_sup]:text-[10px] [&_sup]:font-bold [&_sup]:text-gray-500 [&_sup]:mr-0.5" 
          dangerouslySetInnerHTML={{ __html: scriptureHtml }} 
        />
        <p className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 leading-tight">
          Scripture quotations marked &ldquo;ESV&rdquo; are from the ESV&reg; Bible (The Holy Bible, English Standard Version&reg;), &copy; 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.
        </p>
      </section>

      <section className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-6 space-y-4">
        <div>
          <h3 className="text-lg font-black tracking-tight mb-2">HIM Connection</h3>
          <p className="text-gray-800 leading-normal text-sm">{himConnection}</p>
        </div>

        {optionalDeepDive && (
          <div className="pt-3 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Optional Deep Dive</h4>
            <p className="text-gray-600 text-xs italic leading-normal">{optionalDeepDive}</p>
          </div>
        )}
      </section>

      <div className="bg-gray-100 p-3 rounded border border-gray-200 text-xs text-gray-600 mb-6 italic text-center">
        These devotionals were created by AI. The best reference for the Bible is the Bible.
      </div>

      {/* Done Button with State Lock */}
      <button 
        type="button" 
        onClick={handleMarkDone}
        disabled={isCompleted || loading}
        className={`w-full font-black py-4 rounded-lg shadow-md text-xl flex items-center justify-center gap-2 transition-all ${
          isCompleted 
            ? 'bg-gray-200 text-gray-500 cursor-default' 
            : 'bg-green-700 hover:bg-green-800 text-white active:scale-[0.99]'
        }`}
      >
        <CheckCircle size={24} />
        {isCompleted ? 'COMPLETED' : 'DONE'}
      </button>

      <div className="flex justify-between items-center pt-6 text-sm font-bold">
        {currentDay > 1 ? (
          <Link href={`/study?day=${currentDay - 1}&group_id=${groupId}`} className="text-black hover:underline flex items-center gap-1">
            <ChevronLeft size={16} /> Previous
          </Link>
        ) : (
          <span className="text-gray-300 flex items-center gap-1 cursor-not-allowed">
            <ChevronLeft size={16} /> Previous
          </span>
        )}

        {currentDay < 14 ? (
          <Link href={`/study?day=${currentDay + 1}&group_id=${groupId}`} className="text-black hover:underline flex items-center gap-1">
            Next Day <ChevronRight size={16} />
          </Link>
        ) : (
          <span className="text-gray-300 flex items-center gap-1 cursor-not-allowed">
            Next Day <ChevronRight size={16} />
          </span>
        )}
      </div>
    </main>
  );
}