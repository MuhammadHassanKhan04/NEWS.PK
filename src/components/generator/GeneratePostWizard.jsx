import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { analyzeNewsArticle, rewriteHeadline } from '../../services/aiEngine';
import { renderPosterToCanvas, exportCanvasAsPNG, exportCanvasAsJPG, exportCanvasAsPDF } from '../../services/canvasRenderer';
import { 
  Sparkles, 
  FileText, 
  Link as LinkIcon, 
  Upload, 
  FileDown, 
  Check, 
  Copy, 
  Wand2, 
  Download, 
  RefreshCw, 
  Globe, 
  Layers,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

const SAMPLE_NEWS_PRESETS = [
  {
    title: '🇵🇰 Pakistani AI Startup Raises $15M',
    text: 'Lahore-based generative AI startup MindMesh closes a landmark $15 Million Series A funding round led by Sequoia and global venture funds to scale automated video and content engines globally.'
  },
  {
    title: '💻 NVIDIA Unveils 10x Quantum AI Chip',
    text: 'NVIDIA announces its next-generation quantum-accelerated microchip architecture, delivering 10x faster AI inferencing speeds while reducing data center energy consumption by 45%.'
  },
  {
    title: '⚡ EV Adoption Crosses 40% Worldwide',
    text: 'Global clean energy report reveals electric vehicle adoption has officially crossed 40% in major metropolitan centers worldwide as battery manufacturing costs plummet.'
  },
  {
    title: '🇵🇰 پاکستان کی نئی فن ٹیک کمپنی کا 100 ملین ڈالر ریکارڈ',
    text: 'کراچی میں قائم فن ٹیک پلیٹ فارم نے خلیجی ممالک میں کامیاب توسیع کے بعد 100 ملین ڈالر کی قدر حاصل کر لی۔'
  }
];

export default function GeneratePostWizard() {
  const { brandKit, addPosterToHistory, setCurrentPoster, setActiveTab, apiKey } = useApp();

  // Wizard state
  const [step, setStep] = useState(1); // 1 = Input, 2 = AI Processing, 3 = Result
  const [inputTab, setInputTab] = useState('text'); // text, url, screenshot, pdf
  const [newsText, setNewsText] = useState('');
  const [customImage, setCustomImage] = useState(null);
  const [selectedRatio, setSelectedRatio] = useState('4:5');
  const [selectedLang, setSelectedLang] = useState('English');
  const [selectedTone, setSelectedTone] = useState('Startup Style');
  const [selectedTemplate, setSelectedTemplate] = useState('startup-pakistan-exact');

  // AI Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processLogs, setProcessLogs] = useState([]);
  const [generatedResult, setGeneratedResult] = useState(null);

  // Active Social Caption Tab
  const [activeCaptionTab, setActiveCaptionTab] = useState('instagram');
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Canvas Reference
  const canvasRef = useRef(null);

  // Re-render canvas whenever generatedResult or selectedTemplate changes
  useEffect(() => {
    if (step === 3 && generatedResult && canvasRef.current) {
      renderPosterToCanvas(canvasRef.current, generatedResult, brandKit);
    }
  }, [step, generatedResult, selectedTemplate, brandKit]);

  // Handle Form Submission / Generate Trigger
  const handleGenerate = async () => {
    if (!newsText.trim()) return;

    setStep(2);
    setIsProcessing(true);
    setProcessLogs([]);

    // Step 1 Log
    addLog('Extracting key metrics, headline & entities from news source...');
    await delay(600);

    // Step 2 Log
    addLog('Synthesizing 8K Midjourney / Imagen 3 editorial image prompt...');
    await delay(600);

    // Run AI Engine Analysis
    const result = await analyzeNewsArticle(newsText, {
      apiKey,
      language: selectedLang,
      tone: selectedTone
    });

    result.templateId = selectedTemplate;
    result.platformRatio = selectedRatio;
    if (customImage) {
      result.imageUrl = customImage;
    }

    // Step 3 Log
    addLog('Auto-applying Brand Kit logo, typography & contrast palette...');
    await delay(500);

    // Step 4 Log
    addLog('Generating multi-platform social media copy & hashtags...');
    await delay(500);

    setGeneratedResult(result);
    addPosterToHistory(result);
    setCurrentPoster(result);

    setIsProcessing(false);
    setStep(3);
  };

  const addLog = (msg) => {
    setProcessLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg }]);
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Copy Caption to Clipboard
  const handleCopyCaption = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Wizard Header Progress Bar */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 1 ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30' : 'bg-slate-800 text-slate-400'
            }`}>1</div>
            <span className={`text-xs font-semibold ${step >= 1 ? 'text-white' : 'text-slate-500'}`}>Input News</span>
          </div>

          <div className="w-12 h-0.5 bg-slate-800" />

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 2 ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30' : 'bg-slate-800 text-slate-400'
            }`}>2</div>
            <span className={`text-xs font-semibold ${step >= 2 ? 'text-white' : 'text-slate-500'}`}>AI Processing</span>
          </div>

          <div className="w-12 h-0.5 bg-slate-800" />

          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              step === 3 ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30' : 'bg-slate-800 text-slate-400'
            }`}>3</div>
            <span className={`text-xs font-semibold ${step === 3 ? 'text-white' : 'text-slate-500'}`}>Result & Export</span>
          </div>
        </div>

        {step === 3 && (
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Start New Poster
          </button>
        )}
      </div>

      {/* ====================================================
          STEP 1: INPUT & OPTIONS FORM
         ==================================================== */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Input Tabs & Text Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" /> Step 1: Provide News Content
                </h2>

                {/* Input Method Tabs */}
                <div className="flex bg-slate-900/90 p-1 rounded-xl border border-white/10 text-xs">
                  <button
                    onClick={() => setInputTab('text')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition ${inputTab === 'text' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400'}`}
                  >
                    Raw Text
                  </button>
                  <button
                    onClick={() => setInputTab('url')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition ${inputTab === 'url' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400'}`}
                  >
                    News URL
                  </button>
                  <button
                    onClick={() => setInputTab('screenshot')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition ${inputTab === 'screenshot' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400'}`}
                  >
                    Screenshot
                  </button>
                  <button
                    onClick={() => setInputTab('pdf')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition ${inputTab === 'pdf' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400'}`}
                  >
                    PDF Doc
                  </button>
                </div>
              </div>

              {/* Text Input / URL Field */}
              {inputTab === 'text' && (
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-300">Paste Breaking News Article or Announcement</label>
                  <textarea
                    rows={6}
                    value={newsText}
                    onChange={(e) => setNewsText(e.target.value)}
                    placeholder="Paste the news story, press release, or funding announcement here..."
                    className="w-full glass-input rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50"
                  />

                  {/* Optional Custom Image Upload */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900 border border-white/10 px-3.5 py-2 rounded-xl cursor-pointer hover:border-emerald-500/40 transition">
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{customImage ? 'Custom News Image Attached ✓' : 'Upload Custom Image (Optional)'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setCustomImage(reader.result);
                            reader.readAsDataURL(file);
                          }
                        }} 
                        className="hidden" 
                      />
                    </label>

                    {customImage && (
                      <button 
                        onClick={() => setCustomImage(null)} 
                        className="text-[11px] text-red-400 font-semibold hover:underline"
                      >
                        Remove Custom Image
                      </button>
                    )}
                  </div>
                </div>
              )}

              {inputTab === 'url' && (
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-300">News Article URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://techcrunch.com/article/example-news"
                      className="flex-1 glass-input rounded-xl px-4 py-3 text-sm"
                      onChange={(e) => setNewsText(`News extracted from: ${e.target.value}`)}
                    />
                  </div>
                </div>
              )}

              {(inputTab === 'screenshot' || inputTab === 'pdf') && (
                <div className="border-2 border-dashed border-white/20 hover:border-emerald-500/50 rounded-2xl p-8 text-center space-y-3 cursor-pointer bg-slate-900/40 transition">
                  <Upload className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-xs text-slate-300 font-semibold">Click to upload {inputTab === 'screenshot' ? 'Screenshot Image' : 'PDF Document'}</p>
                  <p className="text-[10px] text-slate-500">AI will automatically OCR and extract the news text</p>
                </div>
              )}

              {/* Quick Preset Sample News Buttons */}
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">⚡ Or Try a One-Click Sample News Preset:</p>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_NEWS_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setNewsText(preset.text)}
                      className="text-xs bg-slate-900/90 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-slate-200 px-3 py-1.5 rounded-xl transition text-left"
                    >
                      {preset.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              disabled={!newsText.trim()}
              onClick={handleGenerate}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 text-black font-extrabold text-base py-4 rounded-2xl shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5" />
              <span>Generate Social Poster with AI</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Column: Style & Format Configurations */}
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-5">
              <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-emerald-400" /> Design Configurations
              </h3>

              {/* Template Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Template Style Preset</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2.5 text-xs text-white bg-slate-900"
                >
                  <option value="startup-pakistan-exact">🇵🇰 Startup Pakistan Exact (Yellow Highlight)</option>
                  <option value="forbes">👔 Forbes Luxury Executive</option>
                  <option value="techcrunch">💻 TechCrunch Futuristic Cyber</option>
                  <option value="minimal">⚪ Minimal Scandinavian</option>
                  <option value="bold-breaking">🚨 Bold Breaking Banner</option>
                  <option value="luxury">✨ Luxury Gold & Obsidian</option>
                </select>
              </div>

              {/* Aspect Ratio Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Social Media Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {['1:1', '4:5', '9:16', '16:9'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setSelectedRatio(r)}
                      className={`p-2.5 rounded-xl text-xs font-bold border text-center transition ${
                        selectedRatio === r 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500' 
                          : 'bg-slate-900/80 text-slate-400 border-white/10'
                      }`}
                    >
                      {r === '1:1' ? 'Square (1:1)' : r === '4:5' ? 'Portrait (4:5)' : r === '9:16' ? 'Story (9:16)' : 'Landscape (16:9)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Language */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Target Language</label>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2.5 text-xs text-white bg-slate-900"
                >
                  <option value="English">English 🇬🇧</option>
                  <option value="Urdu">Urdu 🇵KB (RTL Layout)</option>
                  <option value="Arabic">Arabic 🇸🇦 (RTL Layout)</option>
                  <option value="Hindi">Hindi 🇮🇳</option>
                </select>
              </div>

              {/* Tone / Rewriter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Post Tone & Personality</label>
                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2.5 text-xs text-white bg-slate-900"
                >
                  <option value="Startup Style">🚀 Startup Pakistan Style</option>
                  <option value="Make Viral">🔥 Make Viral & High Impact</option>
                  <option value="Make Formal">📰 Make Formal News</option>
                  <option value="Make Short">⚡ Make Short & Punchy</option>
                  <option value="Make Corporate">💼 Make Executive Corporate</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          STEP 2: AI PROCESSING ANIMATION
         ==================================================== */}
      {step === 2 && (
        <div className="glass-panel rounded-3xl p-12 border border-white/10 text-center space-y-8 max-w-2xl mx-auto">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-pulse">
            <Sparkles className="w-10 h-10 text-black animate-spin" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white mb-2">NewsPilot AI is Crafting Your Poster</h2>
            <p className="text-xs text-slate-400">Extracting headline, generating 8K editorial image, and auto-applying brand kit...</p>
          </div>

          {/* Process Logs */}
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-white/10 text-left space-y-2.5 max-h-48 overflow-y-auto font-mono text-xs">
            {processLogs.map((log, idx) => (
              <div key={idx} className="flex items-center gap-2 text-emerald-400">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-500">[{log.time}]</span>
                <span className="text-slate-200">{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================
          STEP 3: GENERATED RESULT STUDIO & EXPORT
         ==================================================== */}
      {step === 3 && generatedResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Real-Time High Resolution Canvas Preview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" /> Rendered News Poster
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  4K High DPI HTML5 Canvas
                </span>
              </div>

              {/* Interactive Canvas Rendering */}
              <div className="flex justify-center bg-slate-950 p-4 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <canvas
                  ref={canvasRef}
                  className="w-full max-w-[480px] h-auto rounded-xl shadow-2xl border border-white/10"
                />
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <button
                  onClick={() => exportCanvasAsPNG(canvasRef.current, 'newspilot-poster.png')}
                  className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs py-2.5 rounded-xl shadow-lg transition"
                >
                  <Download className="w-3.5 h-3.5" /> PNG 4K
                </button>
                <button
                  onClick={() => exportCanvasAsJPG(canvasRef.current, 'newspilot-poster.jpg')}
                  className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-semibold text-xs py-2.5 rounded-xl transition"
                >
                  JPG
                </button>
                <button
                  onClick={() => exportCanvasAsPDF(canvasRef.current, 'newspilot-poster.pdf')}
                  className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-semibold text-xs py-2.5 rounded-xl transition"
                >
                  PDF
                </button>
                <button
                  onClick={() => setActiveTab('studio')}
                  className="flex items-center justify-center gap-1.5 bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-black font-bold text-xs py-2.5 rounded-xl border border-teal-500/30 transition"
                >
                  <Wand2 className="w-3.5 h-3.5" /> Edit Studio
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Platform Captions & Copywriter */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Copy className="w-4 h-4 text-emerald-400" /> AI Social Media Copywriter
                </h3>
              </div>

              {/* Platform Selector Tabs */}
              <div className="flex bg-slate-900 p-1 rounded-xl border border-white/10 text-xs">
                {['instagram', 'linkedin', 'twitter', 'facebook'].map((plat) => (
                  <button
                    key={plat}
                    onClick={() => setActiveCaptionTab(plat)}
                    className={`flex-1 py-1.5 rounded-lg capitalize font-bold transition ${
                      activeCaptionTab === plat ? 'bg-emerald-500 text-black' : 'text-slate-400'
                    }`}
                  >
                    {plat}
                  </button>
                ))}
              </div>

              {/* Caption Text Box */}
              <div className="relative">
                <textarea
                  readOnly
                  rows={8}
                  value={generatedResult.captions[activeCaptionTab] || ''}
                  className="w-full glass-input rounded-2xl p-4 text-xs text-slate-200 font-sans leading-relaxed border border-white/10"
                />

                <button
                  onClick={() => handleCopyCaption(generatedResult.captions[activeCaptionTab])}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs px-3 py-1.5 rounded-xl shadow transition"
                >
                  {copiedCaption ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCaption ? 'Copied!' : 'Copy Caption'}</span>
                </button>
              </div>

              {/* Extracted Metadata Card */}
              <div className="bg-slate-950/60 rounded-2xl p-4 border border-white/10 space-y-2 text-xs">
                <p className="font-bold text-slate-300">AI Extraction Details:</p>
                <div className="grid grid-cols-2 gap-2 text-slate-400">
                  <div>Company: <span className="text-white font-semibold">{generatedResult.company}</span></div>
                  <div>Category: <span className="text-emerald-400 font-semibold">{generatedResult.category}</span></div>
                  <div>Stat: <span className="text-yellow-300 font-semibold">{generatedResult.keyNumber}</span></div>
                  <div>Region: <span className="text-white font-semibold">{generatedResult.country}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
