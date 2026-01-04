
import React from 'react';
import { ShieldAlert, ExternalLink, Key, X } from 'lucide-react';

interface StepProps {
  number: string;
  title: string;
  children: React.ReactNode;
}

const Step: React.FC<StepProps> = ({ number, title, children }) => (
  <div className="flex space-x-5 group">
    <div className="flex-shrink-0 w-10 h-10 border border-white/20 bg-black/50 flex items-center justify-center text-sm font-oswald font-bold text-[#FF1F7D] group-hover:border-[#FF1F7D] transition-colors">
      {number}
    </div>
    <div className="pt-1">
      <h4 className="text-sm font-oswald font-bold text-white uppercase tracking-widest mb-1 group-hover:text-[#FF1F7D] transition-colors">{title}</h4>
      <div className="text-xs font-mono text-slate-400 leading-relaxed">
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="max-w-md w-full bg-[#050505] border border-white/10 shadow-[0_0_50px_rgba(255,31,125,0.1)] animate-in zoom-in-95 duration-200 relative">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-[#FF1F7D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        <div className="px-8 py-8 border-b border-white/10 flex items-center space-x-4">
          <div className="p-2 border border-[#FF1F7D] bg-[#FF1F7D]/10">
            <ShieldAlert className="w-6 h-6 text-[#FF1F7D]" />
          </div>
          <h2 className="text-2xl font-oswald font-bold text-white tracking-widest uppercase">
            Authentication
          </h2>
        </div>
        
        <div className="p-8 space-y-8">
          <div className="space-y-6">
            <Step number="01" title="Acquire Credentials">
              <p>Navigate to <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-[#FF1F7D] hover:underline decoration-1 underline-offset-4 inline-flex items-center">Google AI Studio <ExternalLink className="w-3 h-3 ml-1" /></a> to generate your API Key.</p>
            </Step>
            
            <Step number="02" title="Verify Access">
              <p>Ensure your project is linked to a <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-[#FF1F7D] hover:underline decoration-1 underline-offset-4 inline-flex items-center">Paid Billing Account <ExternalLink className="w-3 h-3 ml-1" /></a>.</p>
            </Step>
            
            <Step number="03" title="Authorize System">
              <p>Execute the secure handshake below to persist your credentials locally.</p>
            </Step>
          </div>

          <div className="pt-4 space-y-4">
            <button 
              onClick={onActivate}
              className="w-full py-4 bg-[#FF1F7D] text-white hover:bg-[#D41464] font-oswald font-bold text-sm uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(255,31,125,0.4)] flex items-center justify-center space-x-3"
            >
              <Key className="w-4 h-4" />
              <span>Initiate Handshake</span>
            </button>
            <button 
              onClick={() => (onClose ? onClose() : (window as any).location.reload())}
              className="w-full py-3 bg-transparent border border-white/10 hover:border-white/30 text-slate-400 hover:text-white font-mono font-bold text-xs uppercase tracking-widest transition-all"
            >
              Cancel Protocol
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
