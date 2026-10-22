'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Shield, Lock, Globe, ArrowRight, UserPlus, LogIn } from 'lucide-react';

const DEFAULT_REGIONS = [
  'Jacksonville',
  'Tallahassee',
  'Orlando',
  'First Coast',
  'South Georgia',
];

const DEFAULT_AOS = [
  'Prov Squad',
  'Pool Party',
];

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [f3Name, setF3Name] = useState('');
  const [realName, setRealName] = useState('');
  const [region, setRegion] = useState('');
  const [homeAo, setHomeAo] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [regionsList, setRegionsList] = useState<string[]>(DEFAULT_REGIONS);
  const [aosList, setAosList] = useState<string[]>(DEFAULT_AOS);

  useEffect(() => {
    async function fetchExistingOptions() {
      const { data: groupData } = await supabase.from('groups').select('region, ao');
      const { data: profileData } = await supabase.from('profiles').select('region, home_ao');

      const fetchedRegions = new Set<string>(DEFAULT_REGIONS);
      const fetchedAos = new Set<string>(DEFAULT_AOS);

      groupData?.forEach((g) => {
        if (g.region) fetchedRegions.add(g.region);
        if (g.ao && g.ao !== 'N/A') fetchedAos.add(g.ao);
      });

      profileData?.forEach((p) => {
        if (p.region) fetchedRegions.add(p.region);
        if (p.home_ao) fetchedAos.add(p.home_ao);
      });

      setRegionsList(Array.from(fetchedRegions));
      setAosList(Array.from(fetchedAos));
    }
    fetchExistingOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    // Save profile details to localStorage robustly under multiple keys to guarantee persistence
    if (f3Name.trim()) {
      localStorage.setItem('pending_f3_name', f3Name.trim());
      localStorage.setItem('f3_name', f3Name.trim());
    }
    if (realName.trim()) {
      localStorage.setItem('pending_real_name', realName.trim());
      localStorage.setItem('real_name', realName.trim());
    }
    if (region.trim()) {
      localStorage.setItem('pending_region', region.trim());
      localStorage.setItem('region', region.trim());
    }
    if (homeAo.trim()) {
      localStorage.setItem('pending_home_ao', homeAo.trim());
      localStorage.setItem('home_ao', homeAo.trim());
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/discovery`,
      },
    });

    setLoading(false);
    if (!error) {
      setSubmitted(true);
    } else {
      alert('Error: ' + error.message);
    }
  };

  return (
    <main className="max-w-md mx-auto p-6 pt-12 min-h-screen flex flex-col justify-between">
      <div className="space-y-6">
        {/* Header & Welcome Message */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 bg-black text-white rounded-2xl shadow-md">
            <Shield size={28} />
          </div>
          <h1 className="text-2xl font-black tracking-tight">F3 Bible Study</h1>
          <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
            Welcome, PAX! Connect with your region, track daily reading accountability, and sharpen one another in faith and leadership.
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Create Account */}
        {!submitted && (
          <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                !isSignUp ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-black'
              }`}
            >
              <LogIn size={14} /> Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                isSignUp ? 'bg-black text-white shadow-sm' : 'text-gray-600 hover:text-black'
              }`}
            >
              <UserPlus size={14} /> Create Account
            </button>
          </div>
        )}

        {/* Form / Success State */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
          {submitted ? (
            <div className="text-center space-y-3 py-4">
              <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto font-black text-lg">
                ✓
              </div>
              <h2 className="text-sm font-black uppercase tracking-wider">Check Your Email</h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                We sent a secure magic link to <strong className="text-black">{email}</strong>. Click it to log in instantly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                      F3 Name (e.g. Stat, Spock)
                    </label>
                    <input
                      type="text"
                      required={isSignUp}
                      value={f3Name}
                      onChange={(e) => setF3Name(e.target.value)}
                      placeholder="Your F3 Name"
                      className="w-full px-3.5 py-3 border border-gray-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-black focus:border-black outline-none transition-all font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                      Real Name
                    </label>
                    <input
                      type="text"
                      required={isSignUp}
                      value={realName}
                      onChange={(e) => setRealName(e.target.value)}
                      placeholder="First & Last"
                      className="w-full px-3.5 py-3 border border-gray-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-black focus:border-black outline-none transition-all font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                        F3 Region
                      </label>
                      <input
                        type="text"
                        required={isSignUp}
                        list="region-options"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        placeholder="Type or select region..."
                        className="w-full px-3.5 py-3 border border-gray-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-black focus:border-black outline-none transition-all font-bold"
                      />
                      <datalist id="region-options">
                        {regionsList.map((r) => (
                          <option key={r} value={r} />
                        ))}
                      </datalist>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                        Home AO
                      </label>
                      <input
                        type="text"
                        list="ao-options"
                        value={homeAo}
                        onChange={(e) => setHomeAo(e.target.value)}
                        placeholder="Type or select AO..."
                        className="w-full px-3.5 py-3 border border-gray-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-black focus:border-black outline-none transition-all font-bold"
                      />
                      <datalist id="ao-options">
                        {aosList.map((a) => (
                          <option key={a} value={a} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-3 border border-gray-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-black focus:border-black outline-none transition-all font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2"
              >
                {loading ? 'Sending Link...' : <>{isSignUp ? 'Create Account & Send Link' : 'Sign In with Magic Link'} <ArrowRight size={14} /></>}
              </button>
            </form>
          )}
        </div>

        {/* Privacy Note */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2.5 text-xs text-gray-600">
          <p className="font-black text-[11px] text-gray-900 uppercase tracking-wide">Privacy Notice</p>
          <div className="flex items-start gap-2">
            <Lock size={14} className="text-gray-500 shrink-0 mt-0.5" />
            <span><strong>Private:</strong> Daily readings, accountability check-ins, and group discussion boards are strictly private to your approved group members.</span>
          </div>
          <div className="flex items-start gap-2">
            <Globe size={14} className="text-gray-500 shrink-0 mt-0.5" />
            <span><strong>Public:</strong> General mumblechatter and regional public boards are visible across the wider PAX community.</span>
          </div>
        </div>
      </div>

      <footer className="text-center text-[10px] text-gray-400 py-6">
        F3 Nation Peer Study PWA • Built for High-Impact Men
      </footer>
    </main>
  );
}