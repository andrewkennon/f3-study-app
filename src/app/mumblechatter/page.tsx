'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, MessageSquare } from 'lucide-react';

interface Post {
  id: string;
  user_name: string;
  category: string;
  content: string;
  created_at: string;
}

export default function MumblechatterPage() {
  const [activeTab, setActiveTab] = useState<'Prayer Requests' | 'Study Requests' | 'General'>('Prayer Requests');
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('mumblechatter_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('f3_name, real_name')
      .eq('id', user.id)
      .single();

    const authorName = profile?.f3_name || profile?.real_name || 'Pax';

    const { error } = await supabase.from('mumblechatter_posts').insert([
      {
        user_id: user.id,
        user_name: authorName,
        category: activeTab,
        content: newPost.trim(),
      },
    ]);

    if (!error) {
      setNewPost('');
      fetchPosts();
    }
  };

  // Filter feed based on active tab selection
  const filteredPosts = posts.filter((p) => {
    if (activeTab === 'Prayer Requests') {
      return p.category === 'Prayer Requests' || p.category === 'Prayer Request';
    }
    if (activeTab === 'Study Requests') {
      return p.category === 'Study Requests' || p.category === 'Study Discussion';
    }
    return p.category === 'General' || (!p.category);
  });

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      <h1 className="text-2xl font-black tracking-tight">MUMBLECHATTER</h1>

      {/* CATEGORY TOGGLE TABS */}
      <div className="grid grid-cols-3 gap-1 bg-gray-200 p-1 rounded-lg text-center text-xs font-bold">
        <button
          onClick={() => setActiveTab('Prayer Requests')}
          className={`py-2 rounded transition-all ${
            activeTab === 'Prayer Requests' ? 'bg-white text-black shadow-sm' : 'text-gray-600'
          }`}
        >
          Prayer
        </button>
        <button
          onClick={() => setActiveTab('Study Requests')}
          className={`py-2 rounded transition-all ${
            activeTab === 'Study Requests' ? 'bg-white text-black shadow-sm' : 'text-gray-600'
          }`}
        >
          Study
        </button>
        <button
          onClick={() => setActiveTab('General')}
          className={`py-2 rounded transition-all ${
            activeTab === 'General' ? 'bg-white text-black shadow-sm' : 'text-gray-600'
          }`}
        >
          General
        </button>
      </div>

      {/* COMPACT POST INPUT FORM */}
      <form onSubmit={handlePost} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder={`Post to ${activeTab}...`}
          className="w-full p-3 border border-gray-300 rounded-lg text-xs h-20 focus:ring-black focus:border-black"
        />

        <button
          type="submit"
          className="w-full bg-black text-white font-bold text-xs py-2.5 rounded flex items-center justify-center gap-2 active:bg-gray-800"
        >
          <Send size={14} /> Post to {activeTab}
        </button>
      </form>

      {/* FILTERED FEED */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-xs text-gray-400 font-bold uppercase py-8">Loading Feed...</p>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center space-y-1">
            <MessageSquare size={20} className="mx-auto text-gray-400 mb-1" />
            <p className="text-xs font-bold text-gray-500">No posts under {activeTab} yet.</p>
            <p className="text-[10px] text-gray-400">Be the first Pax to share a message above!</p>
          </div>
        ) : (
          filteredPosts.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-black text-sm text-gray-900">{p.user_name}</span>
                <span className="text-[10px] text-gray-400 font-bold">
                  {new Date(p.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-gray-700 leading-normal">{p.content}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}