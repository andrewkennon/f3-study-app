'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [f3Name, setF3Name] = useState('');
  const [realName, setRealName] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Creating account...');

    // 1. Create the secure user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setMessage(authError.message);
      return;
    }

    // 2. Save the F3 Name and Real Name to the profiles table
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { id: authData.user.id, f3_name: f3Name, real_name: realName }
        ]);

      if (profileError) {
        setMessage(`Profile Error: ${profileError.message}`);
        return;
      }

      setMessage('Success! Your F3 profile is registered.');
    }
  };

  return (
    <main className="max-w-md mx-auto p-4 pt-8">
      <h1 className="text-2xl font-black mb-6 tracking-tight">JOIN THE APP</h1>

      <form onSubmit={handleSignup} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">F3 Name</label>
          <input 
            type="text" required value={f3Name} onChange={(e) => setF3Name(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded focus:ring-black focus:border-black" 
            placeholder="e.g. Stat" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Real Name / Organization</label>
          <input 
            type="text" required value={realName} onChange={(e) => setRealName(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded focus:ring-black focus:border-black" 
            placeholder="e.g. Andrew Kennon" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
          <input 
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded focus:ring-black focus:border-black" 
            placeholder="Your private email" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
          <input 
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded focus:ring-black focus:border-black" 
            placeholder="Minimum 6 characters" 
          />
        </div>

        <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded text-lg active:bg-gray-800 transition-colors mt-4">
          Sign Up
        </button>

        {message && <p className="text-center text-sm font-bold text-blue-600 mt-4">{message}</p>}
      </form>
    </main>
  );
}