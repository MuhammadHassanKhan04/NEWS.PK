import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, User, Mail, Lock, Sparkles, Check, Key } from 'lucide-react';

export function AuthModal({ isOpen, onClose }) {
  const { user, setUser } = useApp();
  const [tab, setTab] = useState('login'); // login, register, forgot
  const [email, setEmail] = useState('ali@newspilot.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Ali Computers');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      email,
      name: name || 'Ali Computers',
      isLoggedIn: true
    }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl p-8 max-w-md w-full border border-white/10 relative space-y-6 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Welcome to NewsPilot AI</h2>
          <p className="text-xs text-slate-400">Sign in to sync your brand kit & poster history across devices</p>
        </div>

        {/* Google OAuth Quick Button */}
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-black font-extrabold text-xs py-3 rounded-2xl shadow transition"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-white/10" />
          <span className="bg-[#090d16] px-3 text-[10px] text-slate-500 uppercase font-bold tracking-wider absolute">or email</span>
        </div>

        {/* Email Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input rounded-xl pl-9 pr-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input rounded-xl pl-9 pr-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs py-3 rounded-2xl shadow-lg transition"
          >
            Sign In to Workspace
          </button>
        </form>
      </div>
    </div>
  );
}

export function KeyModal({ isOpen, onClose }) {
  const { apiKey, saveApiKey } = useApp();
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveApiKey(keyInput);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel rounded-3xl p-8 max-w-md w-full border border-white/10 relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Google Gemini API Key</h2>
            <p className="text-xs text-slate-400">Enable real-time AI news parsing & image prompt generation</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">API Key</label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full glass-input rounded-xl px-4 py-2.5 text-xs text-white font-mono"
            />
          </div>

          <p className="text-[10px] text-slate-500">
            Note: If no API key is entered, NewsPilot AI automatically uses its high-speed smart NLP extraction engine.
          </p>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs py-3 rounded-2xl transition flex items-center justify-center gap-2"
          >
            {saved ? <Check className="w-4 h-4" /> : <Key className="w-4 h-4" />}
            <span>{saved ? 'Key Saved Successfully!' : 'Save Gemini API Key'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
