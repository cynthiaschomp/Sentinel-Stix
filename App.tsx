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
  Loader2,
  Cpu,
  RefreshCcw,
  Lock,
  Key,
  Info
} from 'lucide-react';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
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
          error: errorMessage || "Extraction engine failed to process the request.", 
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
    <div className="min-h-screen flex flex-col bg-[#0b0f1a] selection:bg-blue-500/30 selection:text-blue-200">
      {showKeyModal && (
        <ApiKeyModal 
          onActivate={handleActivate} 
          onClose={() => setShowKeyModal(false)} 
        />
      )}
      
      <header className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-tr from-blue-700 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center">
                SENTINEL<span className="text-blue-500 ml-1">STIX</span>
              </h1>
              <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-0.5">
                <Cpu className="w-3 h-3 mr-1 text-blue-500" /> Powered by Gemini 3 Pro
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
             <div 
               onClick={() => setShowKeyModal(true)}
               className={`hidden sm:flex items-center space-x-2 text-[10px] font-bold px-3 py-1.5 border rounded-full cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                 hasKey 
                 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                 : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
               }`}
             >
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse mr-1 ${hasKey ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
              {hasKey ? 'API SYSTEM ONLINE' : 'API DISCONNECTED - CONFIGURE NOW'}
            </div>
            <button className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg">
              <History className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">
                <Lock className="w-3 h-3" /> Secure Analyst Console
              </div>
              <h2 className="text-3xl font-black text-white leading-tight">Elite <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">CTI Parsing</span></h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                Paste unstructured threat intel from blogs, forums, or reports. Our reasoning engine extracts compliant STIX 2.1 entities instantly.
              </p>
            </div>

            <div className="bg-[#1e293b]/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm group hover:border-blue-500/30 transition-all duration-500">
              <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#0f172a]/60">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Intel Feed</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button onClick={loadExample} className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition uppercase tracking-wider">Sample</button>
                  <div className="w-px h-3 bg-slate-800"></div>
                  <button onClick={handleClear} className="text-[10px] font-bold text-rose-500 hover:text-rose-400 transition uppercase tracking-wider">Clear</button>
                </div>
              </div>
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Securely paste your RAW report here for extraction..."
                className="w-full h-[380px] p-8 bg-transparent text-slate-200 placeholder-slate-700 focus:outline-none resize-none font-mono text-xs leading-relaxed custom-scrollbar"
              />

              <div className="p-6 border-t border-slate-800 bg-[#0f172a]/60 flex items-center justify-between">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".txt,.md,.json" className="hidden" />
                <div className="flex space-x-2">
                  <button onClick={() => fileInputRef.current?.click()} className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700" title="Upload Text File">
                    <CloudUpload className="w-5 h-5" />
                  </button>
                  <button onClick={() => setShowKeyModal(true)} className={`p-2.5 rounded-xl transition-all border ${hasKey ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-300'}`} title="Configure API Key">
                    <Key className="w-5 h-5" />
                  </button>
                </div>

                <button 
                  onClick={handleParse}
                  disabled={state.isParsing || !inputText.trim()}
                  className={`flex-1 ml-4 py-3.5 rounded-2xl font-black flex items-center justify-center space-x-3 transition-all tracking-wider uppercase text-xs ${
                    state.isParsing || !inputText.trim() 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-700/20 active:scale-[0.98]'
                  }`}
                >
                  {state.isParsing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Reasoning engine active...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Process Report</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex items-start space-x-3">
              <Info className="w-4 h-4 text-slate-500 mt-0.5" />
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                <span className="text-slate-400 font-bold uppercase mr-1">Privacy Notice:</span> Reports are processed by the Gemini API. Do not upload internal PII or classified corporate assets. The system does not cache or store reports after the session ends.
              </p>
            </div>

            {state.error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 flex items-start space-x-4 animate-in slide-in-from-left duration-500">
                <div className="bg-rose-500/20 p-2 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-rose-500 uppercase tracking-wider">Engine Fault</h3>
                  <p className="text-xs text-rose-300/80 mt-1 font-medium leading-relaxed">{state.error}</p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 h-full min-h-[600px]">
            {state.result ? (
              <ResultView data={state.result} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl p-10 bg-slate-900/10 opacity-60">
                <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center mb-6">
                  <RefreshCcw className="w-8 h-8 text-slate-700 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-slate-500 uppercase tracking-widest">Awaiting Extraction</h3>
                <p className="text-slate-600 text-sm mt-2 text-center max-w-xs">
                  Upload or paste a threat report to see detailed STIX extraction and visualization.
                </p>
                {!hasKey && (
                  <button onClick={() => setShowKeyModal(true)} className="mt-6 text-xs font-bold text-blue-400 hover:underline flex items-center uppercase tracking-widest">
                    <Key className="w-3 h-3 mr-2" /> Activate Engine First
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-12 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="text-xs font-bold text-slate-500 border-l-2 border-blue-600 pl-4 py-1">
              SENTINEL-STIX OPS <br/>
              <span className="text-slate-600 uppercase tracking-widest text-[9px]">Zero-Trust Intelligence Environment</span>
            </div>
          </div>
          <div className="flex space-x-8 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            <a href="https://oasis-open.github.io/cti-documentation/stix/intro.html" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">STIX 2.1 Specs</a>
            <a href="https://attack.mitre.org/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">MITRE ATT&CK</a>
            <a href="https://ai.google.dev/gemini-api/docs" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">API Docs</a>
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;