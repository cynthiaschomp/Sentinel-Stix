
import React, { useState, useRef, useEffect } from 'react';
import { parseThreatReport } from './services/geminiService';
import { ParseState } from './types';
import { ResultView } from './components/ResultView';
import { ApiKeyModal } from './components/ApiKeyModal';
import { 
  ShieldCheck, 
  Zap, 
  History, 
  FileText, 
  CloudUpload,
  AlertCircle,
  Cpu,
  Lock,
  Key,
  Info,
  Terminal,
  Activity
} from 'lucide-react';

// Tactical Loading Skeleton Component
const TacticalSkeleton = () => (
  <div className="w-full h-full flex flex-col items-center justify-center space-y-4 animate-pulse">
    <div className="w-full h-2 bg-slate-800/50 rounded-none"></div>
    <div className="w-3/4 h-2 bg-slate-800/50 rounded-none"></div>
    <div className="w-5/6 h-2 bg-slate-800/50 rounded-none"></div>
    <div className="flex items-center space-x-2 mt-4 text-[#FF1F7D] font-mono text-xs tracking-widest uppercase">
      <Activity className="w-4 h-4 animate-bounce" />
      <span>Processing Intelligence...</span>
    </div>
  </div>
);

const App: React.FC = () => {
  const [inputText, setInputText] = useState('Input: Operation Alpha\nTarget: Sector 7\n\nSuspected APT activity detected originating from 192.168.1.5 and beaconing to malicious-domain[.]com.'); // Tactical Mock Data
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [state, setState] = useState<ParseState>({
    isParsing: false,
    error: null,
    result: null
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkApiKeyStatus = async () => {
      const aistudio = (window as any).aistudio;
      if (aistudio) {
        const keySelected = await aistudio.hasSelectedApiKey();
        setHasKey(keySelected);
      }
    };
    checkApiKeyStatus();
  }, []);

  const handleActivate = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      await aistudio.openSelectKey();
      setHasKey(true);
      setShowKeyModal(false);
    }
  };

  const handleParse = async () => {
    if (!inputText.trim()) return;

    const aistudio = (window as any).aistudio;
    const keySelected = aistudio ? await aistudio.hasSelectedApiKey() : false;
    
    if (!keySelected) {
      setShowKeyModal(true);
      return;
    }

    setState(prev => ({ ...prev, isParsing: true, error: null }));
    try {
      const result = await parseThreatReport(inputText);
      setState({ isParsing: false, error: null, result });
    } catch (err: any) {
      const errorMessage = err.message || "";
      if (errorMessage.includes("Requested entity was not found")) {
        setHasKey(false);
        setShowKeyModal(true);
        setState({ isParsing: false, error: "Authentication failed. Please re-select your API key.", result: null });
      } else {
        setState({ 
          isParsing: false, 
          error: errorMessage || "Extraction engine failed. Verify input integrity.", 
          result: null 
        });
      }
    }
  };

  const handleClear = () => {
    setInputText('');
    setState({ isParsing: false, error: null, result: null });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          setInputText(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const loadExample = () => {
    setInputText(`APT-41 (Barium) Campaign Targeting Healthcare Sector
    
We are tracking a series of compromises attributed to the Chinese threat actor APT-41. The campaign began in early August 2024, focusing on sensitive medical research institutions.

The group is employing a customized version of the "ShadowLink" backdoor. We've identified several persistence mechanisms including registry modification for auto-run.

Attackers are utilizing T1566 (Phishing) for initial access, followed by T1059.001 (Command and Scripting Interpreter: PowerShell) for lateral movement and data staging.

Indicators of Compromise:
C2 Infrastructure:
- secure.health-research-portal.org (Domain)
- 45.138.22.109 (Primary Beacon)
- dev-ops.cloud-service-api.com (Staging)

File Hashes:
ShadowLink.exe: 672e35f99148d2f2d9c1f6d929b0a8274d43e5c7a0c9e8d7b6a5f4e3d2c1b0a9 (SHA-256)
Dropper_v2.dll: a9b8c7d6e5f43210987654321fedcba0 (MD5)

Potential Victims Identified:
- Medico Corp
- Saint Luke Research Hospital
- Global Pharm Group`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] selection:bg-[#FF1F7D]/30 selection:text-pink-100">
      {showKeyModal && (
        <ApiKeyModal 
          onActivate={handleActivate} 
          onClose={() => setShowKeyModal(false)} 
        />
      )}
      
      {/* Header (Command Bar) */}
      <header className="border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 border border-[#FF1F7D]/50 bg-[#FF1F7D]/10">
              <ShieldCheck className="w-6 h-6 text-[#FF1F7D]" />
            </div>
            <div>
              <h1 className="text-2xl font-oswald font-bold tracking-tight text-white uppercase flex items-center">
                CYNTHIA<span className="text-[#FF1F7D] ml-1">.OS</span>
              </h1>
              <div className="flex items-center text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                <Cpu className="w-3 h-3 mr-1 text-[#FF1F7D]" /> Tactical CTI // Gemini 3 Pro
              </div>
            </div>
          </div>
          
          {/* Status Pill Logic */}
          <div className="flex items-center space-x-6">
             <div 
               onClick={() => setShowKeyModal(true)}
               className={`hidden sm:flex items-center space-x-2 text-[10px] font-mono font-bold px-4 py-1.5 border cursor-pointer transition-all hover:scale-95 active:scale-90 ${
                 hasKey 
                 ? 'bg-[#00E599]/10 border-[#00E599] text-[#00E599] shadow-[0_0_10px_rgba(0,229,153,0.2)]' 
                 : 'bg-red-500/10 border-red-500 text-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.2)]'
               }`}
             >
              <div className={`w-1.5 h-1.5 rounded-none mr-2 ${hasKey ? 'bg-[#00E599]' : 'bg-red-500'}`}></div>
              {hasKey ? 'SYSTEM ONLINE' : 'API DISCONNECTED -- CONFIGURE NOW'}
            </div>
            <button className="text-slate-500 hover:text-[#FF1F7D] transition-colors">
              <History className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout: The Active Hero */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Panel: Tactical Input Console */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#FF1F7D] uppercase tracking-widest mb-1">
                <Lock className="w-3 h-3" /> Secure Channel
              </div>
              <h2 className="text-4xl font-oswald font-bold text-white uppercase leading-none">
                Intel <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF1F7D] to-purple-600">Extraction</span>
              </h2>
            </div>

            {/* Smoked Obsidian Panel */}
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden group">
              <div className="flex items-center justify-between p-3 border-b border-white/10 bg-black/40">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-[#FF1F7D]" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Raw Data Input</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={loadExample}
                    className="text-[10px] font-mono font-bold text-[#FF1F7D] hover:text-white transition uppercase tracking-wider"
                  >
                    Load Mock
                  </button>
                  <div className="w-px h-3 bg-white/10"></div>
                  <button 
                    onClick={handleClear}
                    className="text-[10px] font-mono font-bold text-slate-500 hover:text-white transition uppercase tracking-wider"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              {/* Tactical Input */}
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="AWAITING INPUT..."
                  className="w-full h-[400px] p-6 bg-transparent text-slate-300 placeholder-slate-700 focus:outline-none resize-none font-mono text-xs leading-relaxed custom-scrollbar border-b-2 border-transparent focus:border-[#FF1F7D] transition-colors duration-300"
                />
              </div>

              <div className="p-5 border-t border-white/10 bg-black/40 flex items-center justify-between">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".txt,.md,.json" className="hidden" />
                <div className="flex space-x-3">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 bg-transparent border border-white/10 hover:border-[#FF1F7D] text-slate-400 hover:text-[#FF1F7D] transition-all active:scale-95"
                    title="Upload"
                  >
                    <CloudUpload className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowKeyModal(true)}
                    className={`p-3 border transition-all active:scale-95 ${hasKey ? 'border-[#00E599]/30 text-[#00E599]' : 'border-white/10 text-slate-400 hover:border-[#FF1F7D]'}`}
                    title="Config"
                  >
                    <Key className="w-5 h-5" />
                  </button>
                </div>

                {/* Primary Action Button */}
                <button 
                  onClick={handleParse}
                  disabled={state.isParsing || !inputText.trim()}
                  className={`flex-1 ml-6 py-4 font-oswald font-bold text-sm tracking-[0.1em] uppercase transition-all duration-100 flex items-center justify-center space-x-3 ${
                    state.isParsing || !inputText.trim() 
                    ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-white/5' 
                    : 'bg-[#FF1F7D] text-white hover:bg-[#D41464] active:scale-[0.98] shadow-[0_0_20px_rgba(255,31,125,0.3)]'
                  }`}
                >
                  {state.isParsing ? (
                    <span className="animate-pulse">EXECUTION IN PROGRESS...</span>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      <span>EXECUTE PARSE</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-3 opacity-60">
              <Info className="w-4 h-4 text-slate-500 mt-0.5" />
              <p className="text-[10px] text-slate-500 font-mono leading-relaxed">
                PRIVACY NOTICE: Reports processed securely via Gemini API. No server-side retention.
              </p>
            </div>

            {state.error && (
              <div className="bg-red-900/10 border-l-2 border-red-500 p-4 animate-in slide-in-from-left duration-300">
                <h3 className="text-xs font-oswald font-bold text-red-500 uppercase tracking-wider mb-1">System Fault</h3>
                <p className="text-xs font-mono text-red-400/80">{state.error}</p>
              </div>
            )}
          </div>

          {/* Right Panel: Output Console */}
          <div className="lg:col-span-7 h-full min-h-[600px]">
            {state.isParsing ? (
               <div className="h-full bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                  <TacticalSkeleton />
               </div>
            ) : state.result ? (
              <ResultView data={state.result} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 bg-white/[0.02] opacity-50">
                <div className="w-24 h-24 border border-white/10 flex items-center justify-center mb-6">
                  <Activity className="w-10 h-10 text-slate-700" />
                </div>
                <h3 className="text-xl font-oswald font-bold text-slate-600 uppercase tracking-widest">Awaiting Command</h3>
                {!hasKey && (
                  <button 
                    onClick={() => setShowKeyModal(true)}
                    className="mt-6 text-xs font-mono font-bold text-[#FF1F7D] hover:underline flex items-center uppercase tracking-widest"
                  >
                    <Key className="w-3 h-3 mr-2" /> Initialize Key
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer (Legal Deck) */}
      <footer className="border-t border-white/10 py-8 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] text-slate-500 font-mono">
             <span className="block mb-2 text-slate-400">Privacy Notice: Reports are processed by the Gemini API. Do not upload internal PII or classified corporate assets. The system does not cache or store reports after the session ends.</span>
             <span>© 2026 Cynthia Schomp | cynthiaschomp.com</span>
          </div>
          <div className="flex space-x-4 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-[#FF1F7D] transition-colors">Privacy Policy</a>
            <span className="text-slate-700">|</span>
            <a href="#" className="hover:text-[#FF1F7D] transition-colors">TOS</a>
            <span className="text-slate-700">|</span>
            <a href="#" className="hover:text-[#FF1F7D] transition-colors">Legal</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
