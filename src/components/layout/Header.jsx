import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Search, 
  Globe, 
  Key, 
  User, 
  Bell, 
  Check, 
  PlusCircle,
  Zap
} from 'lucide-react';

export default function Header({ onOpenAuth, onOpenKeyModal }) {
  const { setActiveTab, apiKey, user } = useApp();
  const [selectedLang, setSelectedLang] = useState('English 🇬🇧');

  const languages = [
    { code: 'En', label: 'English 🇬🇧' },
    { code: 'Ur', label: 'Urdu 🇵🇰' },
    { code: 'Ar', label: 'Arabic 🇸🇦' },
    { code: 'Hi', label: 'Hindi 🇮🇳' }
  ];

  return (
    <header className="h-16 bg-[#090d16]/70 backdrop-blur-xl border-b border-white/10 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-72">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search news, templates, history..."
            className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/50 transition"
          />
        </div>
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center gap-3">
        {/* Gemini API Key Status Pill */}
        <button
          onClick={onOpenKeyModal}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
            apiKey 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>{apiKey ? 'Gemini Key Saved' : 'Add Gemini API Key'}</span>
          {apiKey && <Check className="w-3 h-3 text-emerald-400" />}
        </button>

        {/* Quick Language Switcher */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 bg-slate-900/80 border border-white/10 px-3 py-1.5 rounded-xl text-xs text-slate-300 hover:text-white transition">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{selectedLang}</span>
          </button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-1 w-36 bg-slate-900 border border-white/10 rounded-xl shadow-xl p-1 hidden group-hover:block z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.label)}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 transition"
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications Icon */}
        <button className="p-2 text-slate-400 hover:text-white bg-slate-900/80 border border-white/10 rounded-xl relative transition">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 bg-emerald-400 rounded-full absolute top-1.5 right-1.5 animate-pulse" />
        </button>

        {/* Quick Generate Action Button */}
        <button
          onClick={() => setActiveTab('generate')}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Poster</span>
        </button>

        {/* Auth / Login Modal Trigger */}
        <button
          onClick={onOpenAuth}
          className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 border border-white/10 px-3 py-1.5 rounded-xl text-xs text-slate-200 transition"
        >
          <User className="w-4 h-4 text-emerald-400" />
          <span>{user.isLoggedIn ? 'Account' : 'Login'}</span>
        </button>
      </div>
    </header>
  );
}
