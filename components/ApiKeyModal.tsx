
import React from 'react';
import { ShieldAlert, ExternalLink, Key, X } from 'lucide-react';

interface StepProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

const Step: React.FC<StepProps> = ({ number, title, children }) => (
  <div className="flex space-x-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-black text-blue-400">
      {number}
    </div>
    <div className="pt-1">
      <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">{title}</h4>
      <div className="text-xs text-slate-500 leading-relaxed">
        {children}
      </div>
    </div>
  </div>
);

interface Props {
  onActivate: () => void;
  onClose?: () => void;
}

export const ApiKeyModal: React.FC<Props> = ({ onActivate, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/95 backdrop-blur-md">
      <div className="max-w-md w-full bg-[#0f172a] border border-blue-500/30 rounded-3xl shadow-2xl shadow-blue-500/10 overflow-hidden animate-in zoom-in-95 duration-300 relative">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex items-center space-x-4">
          <div className="bg-white/20 p-2 rounded-xl">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight uppercase">System Activation</h2>
        </div>
        
        <div className="p-8 space-y-6">
          <p className="text-slate-400 text-sm leading-relaxed">
            Sentinel-STIX requires a valid Gemini API key to access the deep reasoning extraction engine. Follow these steps to activate the parser:
          </p>

          <div className="space-y-4">
            <Step number="1" title="Generate API Key">
              <p>Go to <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center">Google AI Studio <ExternalLink className="w-3 h-3 ml-1" /></a> and create a new API key.</p>
            </Step>
            
            <Step number="2" title="Enable Billing">
              <p>Ensure your project is linked to a <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center">Paid Billing Account <ExternalLink className="w-3 h-3 ml-1" /></a>.</p>
            </Step>
            
            <Step number="3" title="Link Account">
              <p>Click the button below and select your project to finalize the secure handshake.</p>
            </Step>
          </div>

          <div className="pt-4 space-y-4">
            <button 
              onClick={onActivate}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-blue-900/40 active:scale-[0.98] flex items-center justify-center space-x-3"
            >
              <Key className="w-5 h-5" />
              <span>Activate System</span>
            </button>
            <button 
              onClick={() => (onClose ? onClose() : (window as any).location.reload())}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
            >
              Explore First (Read-Only)
            </button>
            <p className="text-[10px] text-slate-500 text-center mt-4 font-bold uppercase tracking-tighter">
              Secure AES-256 Platform Handshake Required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
