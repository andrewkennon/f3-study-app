'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Login Error: ${error.message}`);
      setLoading(false);
      return;
    }

    setMessage('Success! Logging in...');
    setTimeout(() => {
      router.push('/group');
      router.refresh();
    }, 800);
  };

  return (
    <main className="max-w-md mx-auto p-4 pt-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2">F3 BIBLE STUDY</h1>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Iron Sharpens Iron</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded text-sm focus:ring-black focus:border-black bg-white"
              placeholder="pax@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded text-sm focus:ring-black focus:border-black bg-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-bold py-3 rounded text-sm active:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'LOG IN'}
          </button>
        </form>

        {message && (
          <p className="text-center text-xs font-bold text-blue-600 border-t border-gray-100 pt-3">{message}</p>
        )}

        <div className="pt-4 border-t border-gray-100 text-center space-y-3">
          <p className="text-xs text-gray-500 font-bold">New to F3 Study?</p>
          <Link
            href="/signup"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-black font-bold py-3 rounded text-sm border border-gray-300 transition-colors"
          >
            CREATE ACCOUNT
          </Link>
        </div>
      </div>
    </main>
  );
}