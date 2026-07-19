import React, { useRef, useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { renderPosterToCanvas, exportCanvasAsPNG, exportCanvasAsJPG, exportCanvasAsPDF } from '../../services/canvasRenderer';
import { 
  Wand2, 
  Download, 
  Upload, 
  Type, 
  Sliders, 
  Palette, 
  Sparkles,
  Layers,
  Check,
  MoveVertical
} from 'lucide-react';

export default function CanvasStudio() {
  const { currentPoster, setCurrentPoster, brandKit, addPosterToHistory } = useApp();
  const canvasRef = useRef(null);

  // Manual Editor Fields
  const [headline, setHeadline] = useState(currentPoster.headline || '');
  const [highlightWords, setHighlightWords] = useState(currentPoster.highlightWords || '');
  const [textOffsetY, setTextOffsetY] = useState(currentPoster.textOffsetY || 0);
  const [imageUrl, setImageUrl] = useState(currentPoster.imageUrl || '');
  const [platformRatio, setPlatformRatio] = useState(currentPoster.platformRatio || '4:5');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Handle Manual Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Re-render Canvas on every change
  useEffect(() => {
    const updatedPoster = {
      ...currentPoster,
      headline,
      highlightWords,
      textOffsetY,
      imageUrl,
      platformRatio,
      isManualMode: true,
      templateId: 'manual'
    };
    if (canvasRef.current) {
      renderPosterToCanvas(canvasRef.current, updatedPoster, brandKit);
    }
  }, [headline, highlightWords, textOffsetY, imageUrl, platformRatio, brandKit]);

  const handleSavePoster = () => {
    const newPoster = {
      headline,
      highlightWords,
      textOffsetY,
      imageUrl,
      platformRatio,
      category: 'MANUAL POST',
      company: brandKit.brandName || 'NewsPilot AI',
      country: 'Global 🌐',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      templateId: 'manual',
      isManualMode: true,
      captions: {
        instagram: `🚀 ${headline}\n\n#NewsPilot #News`,
        linkedin: `Breaking: ${headline}`,
        twitter: `⚡ ${headline.substring(0, 100)}`,
        facebook: `📰 ${headline}`
      }
    };
    addPosterToHistory(newPoster);
    setCurrentPoster(newPoster);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-emerald-400" /> Manual Post Studio
          </h1>
          <p className="text-xs text-slate-400">
            Upload custom background image, type headline, adjust vertical text position, and specify highlight words.
          </p>
        </div>

        {/* Action Buttons Header */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSavePoster}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg transition"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{savedSuccess ? 'Saved to History!' : 'Save Poster'}</span>
          </button>
          <button
            onClick={() => exportCanvasAsPNG(canvasRef.current, 'newspilot-poster.png')}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-semibold text-xs px-3.5 py-2.5 rounded-xl transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" /> Export PNG 4K
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Manual Controls Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-5">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" /> Manual Layer Controls
            </h3>

            {/* 1. Upload Background Image */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>1. Background News Image</span>
                <span className="text-[10px] text-slate-500">JPG, PNG, WebP</span>
              </label>

              <label className="w-full border-2 border-dashed border-white/15 hover:border-emerald-500/50 rounded-2xl p-4 text-center cursor-pointer bg-slate-950 flex flex-col items-center gap-2 transition">
                <Upload className="w-6 h-6 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">Click to Upload Background Photo</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {/* 2. Headline Text */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-emerald-400" /> 2. Headline Text
              </label>
              <textarea
                rows={3}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Type your news headline text here..."
                className="w-full glass-input rounded-2xl p-3 text-xs text-white"
              />
            </div>

            {/* 3. Text Vertical Position Slider (Move Text Up / Down) */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <MoveVertical className="w-3.5 h-3.5 text-emerald-400" /> Headline Vertical Position ({textOffsetY > 0 ? `+${textOffsetY}px Down` : textOffsetY < 0 ? `${textOffsetY}px Up` : 'Default Center'})
                </span>
                {textOffsetY !== 0 && (
                  <button onClick={() => setTextOffsetY(0)} className="text-[10px] text-emerald-400 font-bold hover:underline">
                    Reset
                  </button>
                )}
              </div>
              <input
                type="range"
                min="-250"
                max="250"
                value={textOffsetY}
                onChange={(e) => setTextOffsetY(parseInt(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* 4. Highlight Words Input */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-yellow-400" /> 4. Specific Words to Highlight (Yellow Box)
              </label>
              <input
                type="text"
                value={highlightWords}
                onChange={(e) => setHighlightWords(e.target.value)}
                placeholder="Comma separated words (e.g. 17, Ikotek Solutions)"
                className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white"
              />
              <p className="text-[10px] text-slate-400">
                Type exact words to highlight. Leave blank for 100% white text.
              </p>
            </div>

            {/* 5. Aspect Ratio Selector */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-xs font-semibold text-slate-300">Social Media Size</label>
              <div className="grid grid-cols-2 gap-2">
                {['4:5', '1:1', '9:16', '16:9'].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setPlatformRatio(ratio)}
                    className={`p-2 rounded-xl text-xs font-bold border text-center transition ${
                      platformRatio === ratio 
                        ? 'bg-emerald-500 text-black border-emerald-500' 
                        : 'bg-slate-900 text-slate-400 border-white/10'
                    }`}
                  >
                    {ratio === '4:5' ? 'Portrait (4:5)' : ratio === '1:1' ? 'Square (1:1)' : ratio === '9:16' ? 'Story (9:16)' : 'Landscape (16:9)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live High Resolution Canvas Render */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="glass-panel rounded-3xl p-6 border border-white/10 w-full flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" /> Live Studio Canvas ({platformRatio})
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                4K High DPI Output
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-white/10 shadow-2xl max-w-[480px] w-full flex justify-center">
              <canvas
                ref={canvasRef}
                className="w-full h-auto rounded-xl border border-white/10 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
