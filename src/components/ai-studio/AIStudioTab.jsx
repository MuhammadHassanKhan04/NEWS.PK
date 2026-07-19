import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Copy, Check, Sliders, Image as ImageIcon } from 'lucide-react';

export default function AIStudioTab() {
  const [scene, setScene] = useState('High-Tech Cyber Studio');
  const [lighting, setLighting] = useState('Dramatic Volumetric Rim Light');
  const [camera, setCamera] = useState('85mm Portrait Lens f/1.4');
  const [mood, setMood] = useState('Deep Emerald Green & Metallic Gold');
  const [copied, setCopied] = useState(false);

  const generatedPrompt = `Editorial 3D magazine cover artwork illustrating breaking tech news. Scene setting: ${scene}. Lighting: ${lighting}. Camera & Lens: ${camera}. Color Palette & Mood: ${mood}. Photorealistic, ultra-detailed, 8K resolution, zero text inside image, no watermarks, professional business journal quality --ar 1:1 --v 6.0`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" /> AI Image Prompt Studio
        </h1>
        <p className="text-xs text-slate-400">
          Synthesize 8K photorealistic editorial prompts optimized for Google Imagen 3 and Midjourney v6
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Sliders className="w-4 h-4 text-emerald-400" /> Prompt Parameters
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Environment & Scene</label>
            <select
              value={scene}
              onChange={(e) => setScene(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white bg-slate-900"
            >
              <option value="High-Tech Cyber Studio">High-Tech Cyber Studio</option>
              <option value="Executive Boardroom Desk">Executive Boardroom Desk</option>
              <option value="Futuristic Smart City Skyline">Futuristic Smart City Skyline</option>
              <option value="Clean Energy Wind Farm">Clean Energy Wind Farm</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Lighting Setup</label>
            <select
              value={lighting}
              onChange={(e) => setLighting(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white bg-slate-900"
            >
              <option value="Dramatic Volumetric Rim Light">Dramatic Volumetric Rim Light</option>
              <option value="Soft Golden Hour Sunburst">Soft Golden Hour Sunburst</option>
              <option value="Electric Cyber Neon Glow">Electric Cyber Neon Glow</option>
              <option value="Cinematic Studio Softbox">Cinematic Studio Softbox</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Camera & Focal Length</label>
            <select
              value={camera}
              onChange={(e) => setCamera(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white bg-slate-900"
            >
              <option value="85mm Portrait Lens f/1.4">85mm Portrait Lens f/1.4</option>
              <option value="24mm Wide Architectural Lens">24mm Wide Architectural Lens</option>
              <option value="100mm Macro Chip Detail">100mm Macro Chip Detail</option>
            </select>
          </div>
        </div>

        {/* Generated Output Box */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-white/10 pb-3">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Synthesized 8K Prompt
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                Imagen 3 Ready
              </span>
            </h3>

            <textarea
              readOnly
              rows={7}
              value={generatedPrompt}
              className="w-full glass-input rounded-2xl p-4 text-xs font-mono text-emerald-300 leading-relaxed"
            />
          </div>

          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs py-3 rounded-xl shadow-lg transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Prompt to Clipboard!' : 'Copy Prompt for Imagen / Midjourney'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
