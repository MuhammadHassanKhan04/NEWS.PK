import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Upload, 
  Check, 
  Sliders, 
  Globe, 
  Share2, 
  Maximize2, 
  Layout, 
  Palette 
} from 'lucide-react';

export default function BrandKitTab() {
  const { brandKit, setBrandKit } = useApp();
  const [saveNotification, setSaveNotification] = useState(false);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandKit(prev => ({ ...prev, logo: reader.result }));
        triggerNotice();
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerNotice = () => {
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 2000);
  };

  const toggleSocialIcon = (key) => {
    setBrandKit(prev => ({
      ...prev,
      socialIcons: {
        ...prev.socialIcons,
        [key]: !prev.socialIcons?.[key]
      }
    }));
    triggerNotice();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-emerald-400" /> Poster Brand Settings
          </h1>
          <p className="text-xs text-slate-400">
            Upload your logo, set logo size/position, and select which social media icons appear on every generated post.
          </p>
        </div>

        {saveNotification && (
          <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl text-xs font-bold animate-bounce">
            <Check className="w-4 h-4" /> Settings Saved!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Card: Logo Settings */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Upload className="w-4 h-4 text-emerald-400" /> Logo & Placement
          </h3>

          {/* Current Logo Preview & Upload */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-slate-900 border border-white/10 p-2 flex items-center justify-center">
                <img src={brandKit.logo} alt="Logo" className="max-h-full max-w-full object-contain" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">{brandKit.brandName || 'Startup Pakistan'}</p>
                <p className="text-[10px] text-slate-400">PNG, SVG, JPG</p>
              </div>
            </div>

            <label className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs px-3.5 py-2 rounded-xl cursor-pointer transition shadow">
              Upload Logo
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>

          {/* Logo Position Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-emerald-400" /> Logo Screen Position
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'top-left', label: 'Top-Left ↖' },
                { id: 'top-right', label: 'Top-Right ↗' },
                { id: 'bottom-left', label: 'Bottom-Left ↙' },
                { id: 'bottom-right', label: 'Bottom-Right ↘' }
              ].map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => {
                    setBrandKit({ ...brandKit, logoPosition: pos.id });
                    triggerNotice();
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold border text-center transition ${
                    brandKit.logoPosition === pos.id 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' 
                      : 'bg-slate-900/80 text-slate-400 border-white/10'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          {/* Logo Size Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" /> Logo Size ({brandKit.logoSize || 80}px)
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="130"
              value={brandKit.logoSize || 80}
              onChange={(e) => {
                setBrandKit({ ...brandKit, logoSize: parseInt(e.target.value) });
                triggerNotice();
              }}
              className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Right Card: Social Icons & Highlight Color */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Share2 className="w-4 h-4 text-emerald-400" /> Social Icons & Highlight Box Color
          </h3>

          {/* Social Icons Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Display Social Icons on Poster Footer:</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'facebook', label: 'Facebook (f)' },
                { key: 'instagram', label: 'Instagram (📷)' },
                { key: 'twitter', label: 'X / Twitter (𝕏)' },
                { key: 'linkedin', label: 'LinkedIn (in)' },
                { key: 'youtube', label: 'YouTube (▶)' },
                { key: 'website', label: 'Website (www)' }
              ].map((icon) => {
                const isChecked = brandKit.socialIcons?.[icon.key] !== false;
                return (
                  <button
                    key={icon.key}
                    onClick={() => toggleSocialIcon(icon.key)}
                    className={`p-2.5 rounded-xl text-xs font-bold border flex items-center justify-between transition ${
                      isChecked ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' : 'bg-slate-900/80 text-slate-500 border-white/10'
                    }`}
                  >
                    <span>{icon.label}</span>
                    {isChecked && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Word Highlight Box Color */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-emerald-400" /> Main Word Highlight Box Color
            </label>
            <div className="flex items-center gap-3">
              {[
                { name: 'Yellow', hex: '#ffc800' },
                { name: 'Emerald', hex: '#10b981' },
                { name: 'Cyan', hex: '#00e5ff' },
                { name: 'Red', hex: '#ef4444' }
              ].map((c) => (
                <button
                  key={c.hex}
                  onClick={() => {
                    setBrandKit({ ...brandKit, accentColor: c.hex });
                    triggerNotice();
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition ${
                    brandKit.accentColor === c.hex ? 'border-white bg-slate-800' : 'border-white/10 bg-slate-950'
                  }`}
                >
                  <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.hex }} />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
