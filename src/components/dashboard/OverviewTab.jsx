import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  ArrowRight, 
  Wand2, 
  Sliders, 
  History, 
  Layers, 
  CheckCircle2, 
  Zap 
} from 'lucide-react';

export default function OverviewTab() {
  const { setActiveTab, history, brandKit, setCurrentPoster } = useApp();

  const handleEditPoster = (poster) => {
    setCurrentPoster(poster);
    setActiveTab('studio');
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/60 border border-emerald-500/30 p-8 shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-4">
            <Zap className="w-3.5 h-3.5" /> NewsPilot AI Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
            AI & Manual <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-yellow-300">Social News Poster Studio</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Upload your brand logo once in Brand Kit. Generate news posters automatically using AI, or design custom posters manually in Studio.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setActiveTab('generate')}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold px-6 py-3 rounded-2xl shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5" />
              <span>AI News Generator</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => setActiveTab('studio')}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-white/15 text-slate-200 font-semibold px-5 py-3 rounded-2xl transition"
            >
              <Wand2 className="w-4 h-4 text-emerald-400" />
              <span>Manual Post Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Saved Posters</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">{history.length}</p>
          <p className="text-xs text-slate-400 mt-1">Saved in History</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Brand Kit</span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-base font-bold text-white flex items-center gap-2">
            <span>{brandKit.brandName || 'NewsPilot AI'}</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">Logo & Social Icons Configured</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">AI Poster Engine</span>
            <div className="w-8 h-8 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-base font-bold text-white">Full-Text NLP Summarizer</p>
          <p className="text-xs text-yellow-300 mt-1">Yellow Main Word Highlights</p>
        </div>
      </div>
    </div>
  );
}
