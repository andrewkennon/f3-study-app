'use client';
import { useState } from 'react';
import { MessageSquare, Heart, BookPlus, Send } from 'lucide-react';

type Board = 'requests' | 'prayer' | 'general';

export default function MumblechatterPage() {
  const [activeBoard, setActiveBoard] = useState<Board>('general');
  const [posts, setPosts] = useState([
    { id: '1', board: 'prayer', author: 'Spock', content: 'Prayers for Saigon Sam recovering from knee surgery this week.', time: '3h ago' },
    { id: '2', board: 'general', author: 'Nut-tella', content: 'Great workout this morning at Prov Squad. Hard work in the gloom.', time: '5h ago' },
    { id: '3', board: 'requests', author: 'Crabcakes', content: 'Looking for a 7-day study focused on fatherhood for our AO.', time: '1d ago' },
  ]);
  const [newPost, setNewPost] = useState('');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setPosts([
      { id: Date.now().toString(), board: activeBoard, author: 'Stat', content: newPost, time: 'Just now' },
      ...posts
    ]);
    setNewPost('');
  };

  const filteredPosts = posts.filter((p) => p.board === activeBoard);

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      <h1 className="text-2xl font-black tracking-tight">MUMBLECHATTER</h1>

      <div className="grid grid-cols-3 gap-1 bg-gray-200 p-1 rounded-lg text-center text-xs font-bold">
        <button
          onClick={() => setActiveBoard('general')}
          className={`py-2 rounded transition-all flex items-center justify-center gap-1 ${
            activeBoard === 'general' ? 'bg-white text-black shadow-sm' : 'text-gray-600'
          }`}
        >
          <MessageSquare size={14} /> General
        </button>
        <button
          onClick={() => setActiveBoard('prayer')}
          className={`py-2 rounded transition-all flex items-center justify-center gap-1 ${
            activeBoard === 'prayer' ? 'bg-white text-black shadow-sm' : 'text-gray-600'
          }`}
        >
          <Heart size={14} /> Prayer
        </button>
        <button
          onClick={() => setActiveBoard('requests')}
          className={`py-2 rounded transition-all flex items-center justify-center gap-1 ${
            activeBoard === 'requests' ? 'bg-white text-black shadow-sm' : 'text-gray-600'
          }`}
        >
          <BookPlus size={14} /> Studies
        </button>
      </div>

      <form onSubmit={handleCreatePost} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
        <textarea
          rows={2}
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder={`Post to ${activeBoard.toUpperCase()} board...`}
          className="w-full p-3 border border-gray-300 rounded text-sm focus:ring-black focus:border-black"
        />
        <button type="submit" className="w-full bg-black text-white font-bold py-2 rounded text-xs flex items-center justify-center gap-1 active:bg-gray-800">
          <Send size={14} /> Post Message
        </button>
      </form>

      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <p className="text-center text-gray-400 text-xs py-8">No posts in this board yet. Be the first!</p>
        ) : (
          filteredPosts.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-black">{p.author}</span>
                <span className="text-gray-400 font-normal">{p.time}</span>
              </div>
              <p className="text-sm text-gray-800 leading-normal">{p.content}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}