import React from 'react';
import { useApp } from '../../context/AppContext';

export default function Header() {
  const { user } = useApp();

  return (
    <header className="h-16 border-b border-white/10 bg-[#090d16]/70 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <span className="text-xs font-extrabold text-slate-200 uppercase tracking-widest bg-slate-900 border border-white/10 px-3 py-1 rounded-xl">
          {user.workspace}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-slate-900 border border-white/10 px-3 py-1.5 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-300 font-bold">NewsPilot Active</span>
        </div>
      </div>
    </header>
  );
}
