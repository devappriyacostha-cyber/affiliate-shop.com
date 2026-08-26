"use client";

import React, { useState } from 'react';
import { login } from '../actions';
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await login(password);
      if (res.success) {
        // ඉතා වැදගත්: Middleware එක මගින් අලුත් Cookie එක හඳුනා ගැනීමට 
        // සම්පූර්ණ පිටුවම Refresh කර (Hard Redirect) Dashboard එකට යවයි.
        window.location.href = '/admin';
      } else {
        setStatus('error');
        alert("වැරදි මුරපදයක්! (Invalid Passkey)");
      }
    } catch (err) {
      setStatus('error');
      alert("සම්බන්ධතාවයේ දෝෂයකි. නැවත උත්සාහ කරන්න.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      {/* Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="bg-[#0f0f0f] p-10 rounded-[40px] border border-white/5 w-full max-w-sm text-center shadow-2xl relative z-10">
        {/* Lock Icon Section */}
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-2xl shadow-orange-900/20 transform rotate-3 hover:rotate-0 transition-transform duration-500">
          <Lock className="text-white w-10 h-10" />
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Encrypted Login</h1>
          <div className="flex items-center justify-center gap-2 text-white/40">
            <ShieldCheck size={12} className="text-orange-500" />
            <p className="text-[10px] font-black tracking-[0.2em] uppercase">Authorized Access Only</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2 text-left">
            <label className="text-orange-500/80 text-[10px] font-black uppercase tracking-widest ml-1">Secure Passkey</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all text-center tracking-[0.5em] placeholder:tracking-normal font-bold"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-5 rounded-2xl transition-all duration-300 active:scale-95 border border-orange-500 shadow-xl shadow-orange-900/10 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                VERIFYING...
              </span>
            ) : (
              'ACCESS DASHBOARD'
            )}
          </button>
        </form>

        {status === 'error' && (
          <div className="mt-6 flex items-center justify-center gap-2 text-red-500 text-xs font-bold animate-pulse">
            <AlertCircle size={14} />
            ACCESS DENIED
          </div>
        )}
      </div>
    </div>
  );
}
