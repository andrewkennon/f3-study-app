'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { CheckCircle2, Circle, ArrowLeft, ExternalLink } from 'lucide-react';
import { StudyAccordions } from './StudyAccordions';
import { StudyDiscussion } from './StudyDiscussion';
import { STUDY_CONTENT } from '@/lib/studiesData';

function StudyContent() {
  const searchParams = useSearchParams();
  const dayParam = searchParams.get('day');
  const studyParam = searchParams.get('study') || 'being-him';
  const dayNumber = dayParam ? parseInt(dayParam, 10) : 1;

  const [userId, setUserId] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [userRegion, setUserRegion] = useState<string>('F3 Jacksonville');
  const [members, setMembers] = useState<any[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  
  const [esvText, setEsvText] = useState<string>('Loading scripture...');
  const [loadingEsv, setLoadingEsv] = useState(true);

  const currentStudy = STUDY_CONTENT[studyParam] || STUDY_CONTENT['being-him'];
  const dayData = currentStudy[dayNumber] || currentStudy[1];
  const esvChapterUrl = `https://www.esv.org/${dayData.book}+${dayData.chapter}/`;

  useEffect(() => {
    async function loadStudyData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: profile } = await supabase.from('profiles').select('region').eq('id', user.id).single();
      if (profile?.region) setUserRegion(profile.region);

      const { data: membership } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .limit(1)
        .single();

      if (membership) {
        setGroupId(membership.group_id);

        const { data: acc } = await supabase
          .from('accountability')
          .select('completed')
          .eq('group_id', membership.group_id)
          .eq('user_id', user.id)
          .eq('day_number', dayNumber)
          .single();

        if (acc) setIsCompleted(acc.completed);

        const { data: memberData } = await supabase
          .from('group_members')
          .select('user_id, profiles(f3_name, real_name, region)')
          .eq('group_id', membership.group_id)
          .eq('status', 'approved');

        if (memberData) setMembers(memberData);
        fetchComments(membership.group_id);
      }
    }

    loadStudyData();
  }, [dayNumber, studyParam]);

  useEffect(() => {
    async function fetchScripture() {
      if (!dayData?.verseRef) return;
      
      setLoadingEsv(true);
      
      try {
        // Switched to HTML endpoint to get proper superscript verse tags without brackets
        const params = new URLSearchParams({
          q: dayData.verseRef,
          'include-passage-references': 'false',
          'include-footnotes': 'false',
          'include-headings': 'false',
          'include-short-copyright': 'false',
          'include-audio-link': 'false',
          'include-css-link': 'false'
        });

        const response = await fetch(`https://api.esv.org/v3/passage/html/?${params.toString()}`, {
          headers: {
            'Authorization': `Token ${process.env.NEXT_PUBLIC_ESV_API_KEY}`
          }
        });

        const data = await response.json();
        
        if (data.passages && data.passages.length > 0) {
          setEsvText(data.passages[0]);
        } else {
          setEsvText('Could not load scripture text.');
        }
      } catch (error) {
        console.error('Error fetching ESV text:', error);
        setEsvText('Error loading scripture text from ESV API.');
      } finally {
        setLoadingEsv(false);
      }
    }

    fetchScripture();
  }, [dayData?.verseRef]);

  const fetchComments = async (activeGroupId: string) => {
    const { data: commentList } = await supabase
      .from('group_comments')
      .select('id, parent_id, content, created_at, user_id, profiles(f3_name, real_name, region)')
      .eq('group_id', activeGroupId)
      .order('created_at', { ascending: false });

    if (commentList) {
      const commentIds = commentList.map((c) => c.id);
      if (commentIds.length > 0) {
        const { data: reactionsData } = await supabase.from('comment_reactions').select('comment_id, emoji').in('comment_id', commentIds);
        const reactionMap: Record<string, Record<string, number>> = {};
        if (reactionsData) {
          reactionsData.forEach((r: any) => {
            if (!reactionMap[r.comment_id]) reactionMap[r.comment_id] = {};
            reactionMap[r.comment_id][r.emoji] = (reactionMap[r.comment_id][r.emoji] || 0) + 1;
          });
        }
        setComments(commentList.map((c: any) => ({ ...c, reactions: reactionMap[c.id] || {} })));
      } else {
        setComments(commentList);
      }
    }
  };

  const toggleCompletion = async () => {
    if (!userId) return;
    if (!groupId) {
      alert('Please join an F3 study group from the Discovery Hub to track accountability.');
      return;
    }

    const nextState = !isCompleted;
    setIsCompleted(nextState);

    const { data: existing } = await supabase
      .from('accountability')
      .select('id')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .eq('day_number', dayNumber)
      .single();

    let error;
    if (existing) {
      const res = await supabase.from('accountability').update({ completed: nextState }).eq('id', existing.id);
      error = res.error;
    } else {
      const res = await supabase.from('accountability').insert([{ group_id: groupId, user_id: userId, day_number: dayNumber, completed: nextState }]);
      error = res.error;
    }

    if (error) {
      console.error('Error saving accountability:', error.message);
      setIsCompleted(!nextState);
    }
  };

  const backHref = groupId ? `/group/${groupId}` : '/group';

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      <div className="flex justify-between items-center">
        <Link href={backHref} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <span className="text-xs font-black uppercase tracking-widest text-gray-500">
          {studyParam === 'godly-man' ? 'Godly Man' : 'Being HIM'}
        </span>
        <span className="bg-black text-white text-xs font-bold px-2.5 py-1 rounded-md">Day {dayNumber}</span>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="border-b border-gray-100 pb-2 flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
              {dayData.verseRef} (ESV)
            </span>
            <h2 className="text-lg font-black tracking-tight mt-0.5">{dayData.title}</h2>
          </div>
          <a
            href={esvChapterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-gray-600 hover:text-black flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded-md transition-colors shrink-0"
          >
            Full Chapter <ExternalLink size={12} />
          </a>
        </div>
        
        {loadingEsv ? (
          <p className="text-base text-gray-400 font-bold animate-pulse">Fetching exact verses...</p>
        ) : (
          <div 
            className="text-base md:text-lg font-serif leading-relaxed text-gray-900 [&_p]:mb-4 [&_sup]:text-[10px] [&_sup]:font-sans [&_sup]:text-gray-500 [&_sup]:mr-0.5"
            dangerouslySetInnerHTML={{ __html: esvText }}
          />
        )}
        
        <div className="pt-2 text-[10px] text-gray-400 leading-normal border-t border-gray-100">
          Scripture quotations marked “ESV” are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.{' '}
          <Link href="/copyright" className="underline font-bold hover:text-black">
            View full ESV® copyright notice
          </Link>.
        </div>
      </div>

      <button
        onClick={toggleCompletion}
        className={`w-full py-4 rounded-xl font-black text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 ${
          isCompleted ? 'bg-green-700 text-white hover:bg-green-800' : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {isCompleted ? <><CheckCircle2 size={20} /> COMPLETED</> : <><Circle size={20} /> MARK COMPLETED</>}
      </button>

      <StudyAccordions
        himConnection={dayData.himConnection}
        context={dayData.context}
        wordStudy={dayData.wordStudy}
      />

      <StudyDiscussion
        dayNumber={dayNumber}
        userId={userId}
        groupId={groupId}
        userRegion={userRegion}
        members={members}
        comments={comments}
        onRefreshComments={fetchComments}
      />
    </main>
  );
}

export default function StudyPage() {
  return (
    <Suspense fallback={<p className="text-center text-xs font-bold text-gray-400 py-12 uppercase">Loading Study...</p>}>
      <StudyContent />
    </Suspense>
  );
}