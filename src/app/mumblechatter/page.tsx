'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageSquare, Send } from 'lucide-react';

interface Post {
  id: string;
  user_name: string;
  category: string;
  content: string;
  created_at: string;
}

export default function MumblechatterPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [category, setCategory] = useState('Prayer Request');
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
        category,
        content: newPost,
      },
    ]);

    if (!error) {
      setNewPost('');
      fetchPosts();
    }
  };

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      <h1 className="text-2xl font-black tracking-tight">PUBLIC MUMBLECHATTER</h1>

      {/* Post Form */}
      <form onSubmit={handlePost} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 text-xs font-bold"
        >
          <option value="Prayer Request">Prayer Request</option>
          <option value="Praise Report">Praise Report</option>
          <option value="Study Discussion">Study Discussion</option>
          <option value="General">General</option>
        </select>

        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share a prayer request or message with the Pax..."
          className="w-full p-3 border border-gray-300 rounded-lg text-sm h-24 focus:ring-black focus:border-black"
        />

        <button
          type="submit"
          className="w-full bg-black text-white font-bold text-xs py-2.5 rounded flex items-center justify-center gap-2"
        >
          <Send size={14} /> Post Message
        </button>
      </form>

      {/* Feed */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-xs text-gray-400 font-bold uppercase py-8">Loading Messages...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-xs text-gray-400 py-8">No messages posted yet.</p>
        ) : (
          posts.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-black text-sm">{p.user_name}</span>
                <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-200">
                  {p.category}
                </span>
              </div>
              <p className="text-xs text-gray-700 leading-normal">{p.content}</p>
              <p className="text-[10px] text-gray-400 text-right">
                {new Date(p.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}