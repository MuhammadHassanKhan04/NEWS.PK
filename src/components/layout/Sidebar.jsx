import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Sparkles, 
  Wand2, 
  Sliders, 
  History, 
  LogOut,
  Zap
} from 'lucide-react';

export default function Sidebar() {
  const { activeTab, setActiveTab, user, brandKit } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'generate', label: 'AI News Generator', icon: Sparkles, badge: 'AI' },
    { id: 'studio', label: 'Manual Editor', icon: Wand2 },
    { id: 'brandkit', label: 'Brand Kit & Settings', icon: Sliders },
    { id: 'history', label: 'Saved History', icon: History }
  ];

  return (
    <aside className="w-64 bg-[#090d16]/90 border-r border-white/10 flex flex-col justify-between p-4 min-h-screen sticky top-0 backdrop-blur-xl z-30">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h1 className="font-extrabold text-lg tracking-wider text-white">NEWS<span className="text-emerald-400">PILOT</span></h1>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">AI</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">News Poster Engine</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold ${
                    isActive ? 'bg-black text-emerald-400' : 'bg-white/10 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Credits & User Info */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="bg-slate-900 border border-white/10 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-300 font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400" /> AI Credits
            </span>
            <span className="text-emerald-400 font-mono font-bold">{user.credits} / 100</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all" 
              style={{ width: `${(user.credits / 100) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center text-xs font-extrabold shadow">
              NP
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-200 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
