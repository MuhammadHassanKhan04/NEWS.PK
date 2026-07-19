import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { History, Search, Star, Trash2, Wand2, Sparkles, ArrowRight } from 'lucide-react';

export default function HistoryTab() {
  const { history, deletePoster, toggleFavorite, setCurrentPoster, setActiveTab } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(item => {
    return item.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (item.company && item.company.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleOpenStudio = (poster) => {
    setCurrentPoster(poster);
    setActiveTab('studio');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-400" /> Saved News Posters History
          </h1>
          <p className="text-xs text-slate-400">Search, favorite, re-edit, or export past generated news posters</p>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search headline..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full glass-input rounded-xl pl-9 pr-4 py-2 text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredHistory.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-white/10 space-y-4 max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Saved Posters Yet</h3>
          <p className="text-xs text-slate-400">Generations will automatically be saved to your history here.</p>
          <button
            onClick={() => setActiveTab('generate')}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs px-5 py-3 rounded-2xl shadow transition"
          >
            <span>Create News Poster</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Grid of Posters */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl border border-white/10 overflow-hidden group hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Box */}
              <div className="relative aspect-[4/5] overflow-hidden bg-slate-950">
                <img
                  src={item.imageUrl}
                  alt={item.headline}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Favorite Toggle */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className={`p-1.5 rounded-full backdrop-blur border transition ${
                      item.favorite ? 'bg-amber-500/30 text-amber-400 border-amber-500/50' : 'bg-black/60 text-slate-400 border-white/10'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>

                {/* Overlay Text */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                    {item.headline}
                  </h3>
                </div>
              </div>

              {/* Footer */}
              <div className="p-3.5 bg-slate-950/60 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">{item.date}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenStudio(item)}
                    className="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black font-bold text-xs px-3 py-1 rounded-lg border border-emerald-500/30 transition flex items-center gap-1"
                  >
                    <Wand2 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => deletePoster(item.id)}
                    className="p-1 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
