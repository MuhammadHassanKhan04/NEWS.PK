import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutTemplate, Sparkles, Check, ArrowRight } from 'lucide-react';

const TEMPLATE_PRESETS = [
  {
    id: 'startup-pakistan-exact',
    name: 'Startup Pakistan Exact Original',
    badge: 'Exact Layout',
    desc: 'Full-bleed news photo, top-left brand logo, bottom vignette gradient, yellow text highlight boxes & social bar.',
    color: '#ffc800',
    bgSample: 'linear-gradient(135deg, #ffc800 0%, #000000 100%)'
  },
  {
    id: 'forbes',
    name: 'Forbes Luxury Executive',
    badge: 'Executive',
    desc: 'Double gold border stroke, serif headlines, luxury editorial layout.',
    color: '#d4af37',
    bgSample: 'linear-gradient(135deg, #0a0a0c 0%, #1c1917 100%)'
  },
  {
    id: 'techcrunch',
    name: 'TechCrunch Cyber',
    badge: 'Tech',
    desc: 'Neon green accents, space grotesk mono tags, futuristic dark grid aesthetic.',
    color: '#00ff66',
    bgSample: 'linear-gradient(135deg, #050a0e 0%, #0f172a 100%)'
  },
  {
    id: 'minimal',
    name: 'Minimal Scandinavian',
    badge: 'Clean',
    desc: 'Ample whitespace, subtle border framing, ultra-modern sans-serif.',
    color: '#38bdf8',
    bgSample: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
  },
  {
    id: 'bold-breaking',
    name: 'Bold Breaking Flash',
    badge: 'Urgent',
    desc: 'Crimson red top banner, high intensity news flash typography.',
    color: '#ef4444',
    bgSample: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)'
  },
  {
    id: 'luxury',
    name: 'Luxury Gold & Obsidian',
    badge: 'VIP',
    desc: 'Polished gold accents, geometric frame lines, premium serif typography.',
    color: '#eab308',
    bgSample: 'linear-gradient(135deg, #050505 0%, #171717 100%)'
  }
];

export default function TemplatesTab() {
  const { setCurrentPoster, setActiveTab } = useApp();

  const handleSelectTemplate = (templateId) => {
    setCurrentPoster(prev => ({ ...prev, templateId }));
    setActiveTab('generate');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-emerald-400" /> Templates Gallery
          </h1>
          <p className="text-xs text-slate-400">
            Choose from iconic news publishing formats: Startup Pakistan Exact (Yellow Highlight), Forbes, TechCrunch & more
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATE_PRESETS.map((tmpl) => (
          <div
            key={tmpl.id}
            className="glass-card rounded-3xl border border-white/10 overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300 group"
          >
            {/* Visual Sample Box */}
            <div
              className="h-44 p-6 flex flex-col justify-between relative overflow-hidden"
              style={{ background: tmpl.bgSample }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase text-black"
                  style={{ backgroundColor: tmpl.color }}
                >
                  {tmpl.badge}
                </span>
                <Sparkles className="w-4 h-4 text-white/40" />
              </div>

              <div>
                <p className="text-xs font-mono font-bold text-white/60 mb-1">// {tmpl.id.toUpperCase()}</p>
                <h3 className="text-lg font-extrabold text-white group-hover:translate-x-1 transition-transform">
                  {tmpl.name}
                </h3>
              </div>
            </div>

            {/* Content & Action */}
            <div className="p-5 space-y-4 bg-slate-950/60 border-t border-white/5">
              <p className="text-xs text-slate-400 leading-relaxed">{tmpl.desc}</p>
              
              <button
                onClick={() => handleSelectTemplate(tmpl.id)}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-emerald-500 text-slate-200 hover:text-black font-extrabold text-xs py-2.5 rounded-xl border border-white/10 hover:border-emerald-500 transition shadow"
              >
                <span>Use This Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
