import React from 'react';
import { Rocket, Clock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

const ROADMAP_ITEMS = [
  {
    title: 'Auto Schedule Social Posts',
    desc: 'Schedule and auto-publish generated news posters to Instagram, LinkedIn, X/Twitter, and Facebook.',
    status: 'In Progress',
    eta: 'Q4 2026',
    icon: '🗓️'
  },
  {
    title: 'AI Multilingual Voiceover',
    desc: 'Generate studio-grade audio narration in English, Urdu, and Arabic for video news reels.',
    status: 'Coming Soon',
    eta: 'Q1 2027',
    icon: '🎙️'
  },
  {
    title: 'Multi-Slide Carousel Creator',
    desc: 'Turn long-form news reports into 5-slide Instagram carousel stories in 1 click.',
    status: 'Beta Testing',
    eta: 'Q4 2026',
    icon: '🎠'
  },
  {
    title: 'RSS & Google News Importer',
    desc: 'Auto-import breaking headlines from RSS feeds and trending Pakistani tech news sources.',
    status: 'Planned',
    eta: 'Q1 2027',
    icon: '📰'
  }
];

export default function RoadmapTab() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Rocket className="w-6 h-6 text-emerald-400" /> Future Roadmap & Modules
        </h1>
        <p className="text-xs text-slate-400">
          Preview upcoming features for automated social publishing, voiceovers, video cards, and RSS feeds
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ROADMAP_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className="glass-card rounded-3xl p-6 border border-white/10 space-y-4 hover:border-emerald-500/40 transition flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                  {item.status} ({item.eta})
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>

            <button className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs py-2.5 rounded-xl border border-white/10 transition">
              <span>Notify Me When Live</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
