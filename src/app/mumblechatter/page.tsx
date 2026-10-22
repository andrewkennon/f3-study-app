'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Shield, Send } from 'lucide-react';

interface Post {
  id: string;
  category: 'Prayer' | 'Study' | 'General';
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    f3_name: string;
    real_name: string;
    region: string;
  };
}

interface PaxProfile {
  id: string;
  f3_name: string;
  real_name: string;
  region: string;
}

export default function MumblechatterPage() {
  const [tab, setTab] = useState<'Prayer' | 'Study' | 'General'>('Prayer');
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPax, setAllPax] = useState<PaxProfile[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userF3Name, setUserF3Name] = useState<string>('Pax');
  const [mentionSearch, setMentionSearch] = useState('');
  const [showMentionBox, setShowMentionBox] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);

        const { data: profile } = await supabase
          .from('profiles')
          .select('f3_name, real_name')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserF3Name(profile.f3_name || profile.real_name || 'Pax');
        }
      }

      // Fetch region Pax profiles for @ tagging
      const { data: paxList } = await supabase
        .from('profiles')
        .select('id, f3_name, real_name, region');
      if (paxList) setAllPax(paxList as any);

      fetchPosts();
    }

    init();
  }, [tab]);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('mumblechatter_posts')
      .select(`
        id, category, content, created_at, user_id,
        profiles (f3_name, real_name, region)
      `)
      .eq('category', tab)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data as any);
    }
    setLoading(false);
  };

  const handleInputChange = (value: string) => {
    setNewPostContent(value);
    const lastWord = value.split(' ').pop() || '';
    if (lastWord.startsWith('@')) {
      setMentionSearch(lastWord.slice(1).toLowerCase());
      setShowMentionBox(true);
    } else {
      setShowMentionBox(false);
    }
  };

  const selectMention = (f3Name: string) => {
    const words = newPostContent.split(' ');
    words.pop();
    setNewPostContent([...words, `@${f3Name} `].join(' '));
    setShowMentionBox(false);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !currentUserId) return;

    setPosting(true);

    const { data: newPost, error } = await supabase
      .from('mumblechatter_posts')
      .insert([
        {
          user_id: currentUserId,
          user_name: userF3Name,
          category: tab,
          content: newPostContent.trim(),
        },
      ])
      .select()
      .single();

    if (error) {
      alert(`Error creating post: ${error.message}`);
    } else {
      // Trigger notifications for tagged Pax
      const matches = newPostContent.match(/@(\w+)/g);
      if (matches) {
        const taggedNames = matches.map((m) => m.slice(1).toLowerCase());
        const taggedUsers = allPax.filter((p) =>
          taggedNames.includes((p.f3_name || '').toLowerCase())
        );

        for (const tagged of taggedUsers) {
          if (tagged.id !== currentUserId) {
            await supabase.from('notifications').insert([
              {
                user_id: tagged.id,
                sender_id: currentUserId,
                comment_id: newPost?.id,
              },
            ]);
          }
        }
      }

      setNewPostContent('');
      setShowMentionBox(false);
      fetchPosts();
    }

    setPosting(false);
  };

  const filteredPax = allPax.filter((p) =>
    (p.f3_name || '').toLowerCase().includes(mentionSearch)
  );

  return (
    <main className="max-w-md mx-auto p-4 pt-6 pb-24 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black tracking-tight">MUMBLECHATTER</h1>
        <span className="bg-black text-white text-[10px] font-black px-2.5 py-1 rounded-md flex items-center gap-1">
          <Shield size={10} /> Region-Wide
        </span>
      </div>

      {/* Category Toggle Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-gray-200 p-1 rounded-lg text-center text-xs font-bold">
        {(['Prayer', 'Study', 'General'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setTab(cat)}
            className={`py-2 rounded transition-all ${
              tab === cat ? 'bg-white text-black shadow-sm' : 'text-gray-600 hover:text-black'
            }`}
          >
            {cat === 'Prayer' ? 'Prayer Requests' : cat === 'Study' ? 'Study Requests' : 'General'}
          </button>
        ))}
      </div>

      {/* New Post Input Form with @ Tag Autocomplete */}
      <form onSubmit={handleCreatePost} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3 relative">
        {showMentionBox && filteredPax.length > 0 && (
          <div className="absolute bottom-14 left-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-36 overflow-y-auto p-1">
            {filteredPax.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => selectMention(p.f3_name || 'Pax')}
                className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-gray-100 rounded flex justify-between"
              >
                <span>{p.f3_name || p.real_name}</span>
                <span className="text-[10px] text-gray-400">({p.region || 'F3 Jacksonville'})</span>
              </button>
            ))}
          </div>
        )}

        <textarea
          value={newPostContent}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={`Post a ${tab === 'Prayer' ? 'prayer request' : tab === 'Study' ? 'study request' : 'message'} or tag @Pax...`}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg text-xs bg-white focus:ring-black focus:border-black resize-none"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={posting || !newPostContent.trim()}
            className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 disabled:opacity-50 flex items-center gap-1.5"
          >
            {posting ? 'Posting...' : 'Post'} <Send size={12} />
          </button>
        </div>
      </form>

      {/* Posts Stream */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-xs font-bold text-gray-400 py-8 uppercase">Loading Posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-xs text-gray-400 py-8">
            No posts in {tab} yet. Be the first to share!
          </p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black">
                  {post.profiles?.f3_name || post.profiles?.real_name || 'Pax'}
                  <span className="text-[10px] text-gray-500 font-normal ml-1">
                    ({post.profiles?.region || 'F3 Jacksonville'})
                  </span>
                </span>
                <span className="text-[10px] text-gray-400">
                  {new Date(post.created_at).toLocaleDateString([], { month: 'numeric', day: 'numeric' })}
                </span>
              </div>
              <p className="text-xs text-gray-800 leading-relaxed">{post.content}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}