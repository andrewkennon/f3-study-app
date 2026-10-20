'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Check, X, BookOpen, MessageSquare, Shield } from 'lucide-react';

const MEMBERS = [
  { id: '1', f3Name: 'Stat (Q)', checks: [true, true, true, true, true, true, true] },
  { id: '2', f3Name: 'Spock', checks: [true, true, false, true, true, true, true] },
  { id: '3', f3Name: 'Corner Kick', checks: [true, true, true, true, false, true, true] },
  { id: '4', f3Name: 'Nut-tella', checks: [false, true, true, true, true, true, false] },
  { id: '5', f3Name: 'Crabcakes', checks: [true, true, true, false, true, true, true] },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function GroupHomepage() {
  const [comments, setComments] = useState([
    { id: '1', author: 'Spock', text: 'Day 1 HIM connection hit hard on leadership. Good stuff.', time: '2h ago' },
    { id: '2', author: 'Corner Kick', text: 'Locked in for tomorrow morning. See you guys in the gloom.', time: '1h ago' },
  ]);
  const [newComment, setNewComment] = useState('');

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      { id: Date.now().toString(), author: 'Stat (Q)', text: newComment, time: 'Just now' }
    ]);
    setNewComment('');
  };

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Prov Squad Study</h1>
            <p className="text-xs text-gray-500 font-bold">F3 Jacksonville • Kernan Forest</p>
          </div>
          <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            <Shield size={12} /> Q: Stat
          </span>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-400 block font-bold uppercase">Active Track</span>
            <span className="text-sm font-bold text-gray-900">Being HIM (14 Days)</span>
          </div>
          <Link 
            href="/study" 
            className="bg-black text-white text-xs font-bold px-3 py-2 rounded flex items-center gap-1 active:bg-gray-800"
          >
            <BookOpen size={14} /> Read Today
          </Link>
        </div>
      </div>

      <section className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-sm font-black uppercase tracking-wide text-gray-700 mb-3 flex items-center gap-2">
          Accountability Board (Past 7 Days)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 text-xs font-bold text-gray-400 uppercase">Pax</th>
                {DAYS.map((d) => (
                  <th key={d} className="py-2 text-center text-xs font-bold text-gray-400 uppercase w-8">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MEMBERS.map((m) => (
                <tr key={m.id}>
                  <td className="py-3 text-xs font-bold text-gray-900 truncate max-w-[90px]">{m.f3Name}</td>
                  {m.checks.map((done, idx) => (
                    <td key={idx} className="py-3 text-center">
                      {done ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-700 rounded-full">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 text-red-600 rounded-full">
                          <X size={12} strokeWidth={3} />
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-sm font-black uppercase tracking-wide text-gray-700 mb-4 flex items-center gap-2">
          <MessageSquare size={16} /> Group Discussion
        </h2>

        <form onSubmit={handlePostComment} className="mb-6 space-y-2">
          <textarea
            rows={2}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share an insight or encouraging word..."
            className="w-full p-3 border border-gray-300 rounded text-sm focus:ring-black focus:border-black"
          />
          <button type="submit" className="w-full bg-black text-white font-bold py-2 rounded text-xs active:bg-gray-800">
            Post to Group
          </button>
        </form>

        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="p-3 bg-gray-50 border border-gray-200 rounded text-xs space-y-1">
              <div className="flex justify-between items-center font-bold">
                <span className="text-gray-900">{c.author}</span>
                <span className="text-gray-400 font-normal">{c.time}</span>
              </div>
              <p className="text-gray-700 leading-normal">{c.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}