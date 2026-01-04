import React, { useState, useRef, useEffect } from 'react';
import { parseThreatReport } from './services/geminiService';
import { ParseState } from './types';
import { ResultView } from './components/ResultView';
import { ApiKeyModal } from './components/ApiKeyModal';
import { SystemInstructionsModal } from './components/SystemInstructionsModal';
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
  Activity,
  ArrowRight
} from 'lucide-react';

// Tactical Loading Skeleton Component
const TacticalSkeleton = () => (
  <div className="w-full h-full flex flex-col items-center justify-center space-y-4 animate-pulse">
    <div className="w-full h-px bg-slate-800 rounded-none"></div>
    <div className="w-3/4 h-px bg-slate-800 rounded-none"></div>
    <div className="w-5/6 h-px bg-slate-800 rounded-none"></div>
    <div className="flex items-center space-x-2 mt-4 text-neon-pink font-mono text-xs tracking-widest uppercase">
      <Activity className="w-4 h-4 animate-bounce" />
      <span>Processing Intelligence...</span>
    </div>
  </div>
);

// Helper for Corner Brackets
const CornerBrackets = () => (
  <>
    <div className="absolute top-0 left-0 w-16 h-[2px] bg-neon-pink z-10" />
    <div className="absolute top-0 left-0 h-16 w-[2px] bg-neon-pink z-10" />
    <div className="absolute bottom-0 right-0 w-16 h-[2px] bg-neon-pink z-10" />
    <div className="absolute bottom-0 right-0 h-16 w-[2px] bg-neon-pink z-10" />
  </>
);

const App: React.FC = () => {
  const [inputText, setInputText] = useState('Input: Operation Alpha\nTarget: Sector 7\n\nSuspected APT activity detected originating from 192.168.1.5 and beaconing to malicious-domain[.]com.'); 
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
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
    <div className="min-h-screen flex flex-col selection:bg-neon-pink/30 selection:text-pink-100 bg-void pb-20">
      {showKeyModal && (
        <ApiKeyModal 
          onActivate={handleActivate} 
          onClose={() => setShowKeyModal(false)} 
        />
      )}

      {showInstructions && (
        <SystemInstructionsModal onClose={() => setShowInstructions(false)} />
      )}
      
      {/* MANDATORY HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/10 bg-void/80 backdrop-blur-xl flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Terminal className="text-neon-pink w-6 h-6" />
          <h1 className="text-2xl font-sans font-bold tracking-widest text-white">
            CYNTHIA<span className="text-neon-pink">.OS</span> // SENTINEL-STIX
          </h1>
        </div>
        
        <div 
           onClick={() => !hasKey && setShowKeyModal(true)}
           className={`hidden sm:flex items-center space-x-2 text-[10px] font-mono font-bold px-4 py-1.5 border rounded-none cursor-pointer transition-all hover:scale-95 active:scale-90 ${
             hasKey 
             ? 'bg-cyber-green/5 border-cyber-green/30 text-cyber-green' 
             : 'bg-red-500/5 border-red-500/30 text-red-500 animate-pulse'
           }`}
         >
          <div className={`w-1.5 h-1.5 rounded-full mr-2 ${hasKey ? 'bg-cyber-green' : 'bg-red-500'}`}></div>
          {hasKey ? 'SYSTEM ONLINE' : 'API DISCONNECTED -- CONFIGURE'}
        </div>
      </header>

      {/* Main Layout: The Active Hero */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-24 space-y-8 pb-10">
        
        {/* Massive Hero Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-4 mb-10 animate-in slide-in-from-top-10 fade-in duration-700">
           <div className="text-[10px] font-mono font-bold text-neon-pink tracking-[0.3em] uppercase bg-neon-pink/5 px-3 py-1 border border-neon-pink/20">
              Tactical Intelligence Interface
           </div>
           <h1 className="text-6xl md:text-8xl font-sans font-bold text-white uppercase tracking-tighter leading-none">
              INTEL <span className="text-neon-pink">EXTRACTION</span>
           </h1>
           <p className="max-w-xl text-xs font-mono text-slate-500 leading-relaxed uppercase tracking-wide">
              Deploy generative AI to semantically map unstructured threat reports <br className="hidden md:block" /> to STIX 2.1 entities.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Tactical Input Console */}
          <div className="lg:col-span-5 space-y-6">

            {/* Corner Bracket Frame for Input */}
            <div className="relative rounded-none bg-black border border-white/10 group">
              <CornerBrackets />
              
              <div className="relative z-20 bg-black/60 backdrop-blur-xl">
                 <div className="flex items-center justify-between p-3 border-b border-white/10">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-neon-pink" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Input Stream</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={loadExample}
                      className="text-[10px] font-mono font-bold text-neon-pink hover:text-white transition uppercase tracking-wider"
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
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="ENTER THREAT REPORT OR PASTE DATA..."
                  className="w-full h-[400px] p-6 bg-transparent text-slate-300 placeholder-slate-600 focus:outline-none resize-none font-mono text-xs leading-relaxed custom-scrollbar border-b-2 border-transparent focus:border-neon-pink transition-colors duration-300"
                />

                <div className="p-4 border-t border-white/10 flex items-center justify-between gap-4">
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".txt,.md,.json" className="hidden" />
                  
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 bg-transparent border border-white/10 hover:border-neon-pink text-slate-400 hover:text-neon-pink transition-all rounded-none"
                      title="Upload"
                    >
                      <CloudUpload className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Primary Action Button */}
                  <button 
                    onClick={handleParse}
                    disabled={state.isParsing || !inputText.trim()}
                    className={`flex-1 py-3 px-6 font-sans font-bold text-sm tracking-[0.1em] uppercase transition-all duration-100 flex items-center justify-between group rounded-none border shadow-[0_0_15px_rgba(255,31,125,0.2)] active:scale-95 ${
                      state.isParsing || !inputText.trim() 
                      ? 'bg-black border-white/10 text-slate-600 cursor-not-allowed shadow-none' 
                      : 'bg-black border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-black'
                    }`}
                  >
                    {state.isParsing ? (
                      <span className="animate-pulse">PROCESSING...</span>
                    ) : (
                      <>
                        <span>EXECUTE</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {state.error && (
              <div className="bg-red-900/10 border-l-2 border-red-500 p-4 animate-in slide-in-from-left duration-300">
                <h3 className="text-xs font-sans font-bold text-red-500 uppercase tracking-wider mb-1">System Fault</h3>
                <p className="text-xs font-mono text-red-400/80">{state.error}</p>
              </div>
            )}
          </div>

          {/* Right Panel: Output Console */}
          <div className="lg:col-span-7 h-full min-h-[600px] relative">
            {/* Corner Bracket Frame for Output */}
             <div className="relative rounded-none bg-black border border-white/10 h-full min-h-[600px] flex flex-col">
              <CornerBrackets />
              <div className="relative z-20 h-full flex flex-col bg-black/60 backdrop-blur-xl">
                {state.isParsing ? (
                  <div className="flex-1 flex items-center justify-center">
                      <TacticalSkeleton />
                  </div>
                ) : state.result ? (
                  <ResultView data={state.result} />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/5 bg-white/[0.01]">
                    <div className="w-20 h-20 border border-white/5 flex items-center justify-center mb-6 rounded-none">
                      <Activity className="w-8 h-8 text-slate-800" />
                    </div>
                    <h3 className="text-xl font-sans font-bold text-slate-700 uppercase tracking-widest">Awaiting Command</h3>
                    {!hasKey && (
                      <button 
                        onClick={() => setShowKeyModal(true)}
                        className="mt-6 text-xs font-mono font-bold text-neon-pink hover:underline flex items-center uppercase tracking-widest"
                      >
                        <Key className="w-3 h-3 mr-2" /> Initialize Key
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MANDATORY FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 h-10 border-t border-white/5 bg-void/90 backdrop-blur-md flex items-center justify-between px-6 text-[10px] text-gray-500 font-mono uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Lock className="w-3 h-3" />
          <span>SECURE CONNECTION // LOCAL STORAGE ONLY</span>
        </div>
        <div className="flex gap-4 items-center hidden sm:flex">
          <span>© 2026 <a href="https://cynthiaschomp.com" target="_blank" rel="noopener noreferrer" className="hover:text-neon-pink transition-colors">Cynthia Schomp</a></span>
          <span className="text-gray-700">|</span>
          <button onClick={() => setShowInstructions(true)} className="hover:text-neon-pink transition-colors uppercase">System Instructions</button>
          <span className="text-gray-700">|</span>
          <a href="https://github.com/cynthiaschomp" target="_blank" rel="noopener noreferrer" className="hover:text-neon-pink transition-colors">GitHub</a>
          <span className="text-gray-700">|</span>
          <span className="text-gray-700">Privacy & Legal</span>
        </div>
      </footer>
    </div>
  );
};

export default App;