'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [f3Name, setF3Name] = useState('');
  const [realName, setRealName] = useState(''); // Stores Hospital Name in real_name column
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    // 1. Create Auth Account with user metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          f3_name: f3Name.trim(),
          real_name: realName.trim(),
        },
      },
    });

    if (authError) {
      setMessage(`Signup Error: ${authError.message}`);
      setLoading(false);
      return;
    }

    // 2. Upsert Profile Data into profiles table to ensure row exists and updates cleanly
    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').upsert(
        [
          {
            id: authData.user.id,
            f3_name: f3Name.trim(),
            real_name: realName.trim(), // Hospital Name stored cleanly
            email: email.trim(),
          },
        ],
        { onConflict: 'id' }
      );

      if (profileError) {
        setMessage(`Profile Error: ${profileError.message}`);
        setLoading(false);
        return;
      }
    }

    setMessage('Account created! Redirecting to group directory...');
    setTimeout(() => {
      router.push('/discovery');
      router.refresh();
    }, 1200);
  };

  return (
    <main className="max-w-md mx-auto p-4 pt-8 pb-24">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-black tracking-tight mb-1">JOIN F3 STUDY</h1>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Create Your Account</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">F3 Name</label>
            <input
              type="text"
              required
              value={f3Name}
              onChange={(e) => setF3Name(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded text-sm focus:ring-black focus:border-black bg-white font-bold"
              placeholder="e.g. Stat"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Hospital Name</label>
            <input
              type="text"
              required
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded text-sm focus:ring-black focus:border-black bg-white font-bold"
              placeholder="e.g. Andrew Kennon"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Your real name is kept private and only visible to Qs for verification.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded text-sm focus:ring-black focus:border-black bg-white font-bold"
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
              className="w-full p-3 border border-gray-300 rounded text-sm focus:ring-black focus:border-black bg-white font-bold"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-bold py-3 rounded text-sm active:bg-gray-800 transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating Account...' : 'REGISTER PAX'}
          </button>
        </form>

        {message && (
          <p className="text-center text-xs font-bold text-blue-600 border-t border-gray-100 pt-3">{message}</p>
        )}

        <div className="pt-3 border-t border-gray-100 text-center">
          <Link href="/login" className="text-xs font-bold text-gray-500 hover:text-black">
            Already have an account? Log In
          </Link>
        </div>
      </div>
    </main>
  );
}