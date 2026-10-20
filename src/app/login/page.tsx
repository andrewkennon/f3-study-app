'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Logging in...');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Login Error: ${error.message}`);
      return;
    }

    setMessage('Success! Redirecting...');
    setTimeout(() => {
      router.push('/create-group');
    }, 1000);
  };

  return (
    <main className="max-w-md mx-auto p-4 pt-8">
      <h1 className="text-2xl font-black mb-6 tracking-tight">LOG IN</h1>

      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
          <input 
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded focus:ring-black focus:border-black" 
            placeholder="Your registered email" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
          <input 
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded focus:ring-black focus:border-black" 
          />
        </div>

        <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded text-lg active:bg-gray-800 transition-colors mt-4">
          Log In
        </button>

        {message && <p className="text-center text-sm font-bold text-blue-600 mt-4">{message}</p>}
      </form>
    </main>
  );
}