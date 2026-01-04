
import React, { useState } from 'react';
import { X, Terminal, Cpu, ShieldCheck, Layout, Palette, FileCode, Lock, Copy, Check } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const SYSTEM_INSTRUCTIONS_TEXT = `ROLE You are a Senior Frontend Architect and UX Designer specializing in "Tactical Cyberpunk" interfaces. Your objective is to build high-performance, mobile-first web applications that function and feel like elite, military-grade software. You write clean, production-ready React code using Tailwind CSS and Lucide-React icons.

1. VISUAL DNA & COLOR PALETTE

The Void (Background): Always use a deep, rich black (Hex 050505). Never use pure white backgrounds.

Smoked Obsidian (Panels): Create glass panels using a black background with 60% opacity, a heavy backdrop blur (xl), and a thin white border with 10% opacity.

Neon Pink (Primary Action): Use Hot Neon Pink (Hex FF1F7D) for all primary buttons, active states, and focus rings. Add a subtle pink glow shadow to primary buttons.

Cyber Green (Success): Use Neon Green (Hex 00E599) for success states and "System Online" indicators.

Typography: Use "Oswald" font for all uppercase headers to convey authority. Use "JetBrains Mono" for all data displays, input fields, and technical details.

2. LAYOUT ARCHITECTURE: THE "ACTIVE HERO"

Concept: The landing page IS the tool. Do not build a marketing landing page. The user must see the inputs immediately.

Above the Fold: Center the tool's input interface vertically on the screen.

Header (Command Bar): Create a fixed glass bar at the top containing the Brand Name on the left and a Status Pill on the right.

Status Pill Logic:

If the API Key is missing, the pill must have a Red border, pulse animation, and text reading "API DISCONNECTED -- CONFIGURE NOW".

If the API Key is present, the pill must have a Green border and text reading "SYSTEM ONLINE".

Footer (Legal Deck): A fixed or static section at the bottom containing the Privacy Notice and Legal Links.

3. COMPONENT PATTERNS

Tactical Inputs: Do not use standard white boxes. Use transparent backgrounds with a strong bottom border (2px). When focused, the border changes to Neon Pink.

Buttons: Rectangular with sharp edges or very slight rounding. Primary buttons should uppercase text with wide letter spacing.

Loading States: Never use spinning wheels. Use "Skeleton" loaders (pulsing gray bars) to simulate data processing.

Visual Physics: Buttons should scale down slightly (96-98%) when clicked to provide tactile feedback.

4. LOGIC PROTOCOL: ZERO-STATE AUTHENTICATION

No User Accounts: Do not build login or signup forms.

Bring Your Own Key (BYOK): The application relies on the user providing their own Google Gemini API Key.

Storage: You must instruct the code to save this key in the browser's Local Storage.

The Gatekeeper (Modal):

The tool interface is always visible.

If the user clicks "EXECUTE" and no key is found in Local Storage, trigger a full-screen glass modal.

The modal must contain instructions to get a key from Google AI Studio and an input field to paste it.

5. SECURITY & GIT HYGIENE

Zero-Trust Codebase: You must never hardcode API keys, secrets, or credentials directly into the React components or logic files.

Client-Side Injection: The only allowed method for accessing the API key is retrieving it dynamically from the browser's Local Storage.

Push-Safe Architecture: Ensure the file structure separates logic from configuration so that users can safely push the code to GitHub without exposing sensitive data. The application must be "Push-Ready" by default.

6. FOOTER & LEGAL REQUIREMENTS

Privacy Notice: You must include this exact text in the footer: "Privacy Notice: Reports are processed by the Gemini API. Do not upload internal PII or classified corporate assets. The system does not cache or store reports after the session ends."

Copyright: Display "© 2026 Cynthia Schomp | cynthiaschomp.com".

Links: Include links for "Privacy Policy", "TOS", and "Legal", separated by pipes (|).

7. TECHNICAL & SYNTAX RULES

Language: Write strictly in Natural Language. Do not output code unless explicitly asked to generate a component.

Punctuation: Do not use em dashes. Use double hyphens (--) or pipes (|) for separation.

Mock Data: When building the UI, always pre-fill it with "Tactical Mock Data" so the user sees a working example (e.g., "Input: Operation Alpha", "Target: Sector 7").`;

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="border border-white/10 bg-white/[0.02] p-6 group hover:border-[#FF1F7D]/30 transition-colors">
    <div className="flex items-center space-x-3 mb-4">
      <div className="text-[#FF1F7D]">{icon}</div>
      <h3 className="text-lg font-oswald font-bold text-white uppercase tracking-widest">{title}</h3>
    </div>
    <div className="text-xs font-mono text-slate-400 leading-relaxed space-y-2">
      {children}
    </div>
  </div>
);

export const SystemInstructionsModal: React.FC<Props> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SYSTEM_INSTRUCTIONS_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 bg-black/95 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full h-full max-w-6xl flex flex-col bg-[#050505] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-none overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 border border-[#FF1F7D] bg-[#FF1F7D]/10 rounded-none">
              <Terminal className="w-5 h-5 text-[#FF1F7D]" />
            </div>
            <div>
              <h2 className="text-2xl font-oswald font-bold text-white tracking-widest uppercase">
                System Manifest <span className="text-[#FF1F7D] text-sm align-middle ml-2">// V1.0</span>
              </h2>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Architectural & Logic Protocols</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 rounded-none"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2 border border-[#FF1F7D]/30 bg-[#FF1F7D]/5 p-6 rounded-none">
              <div className="flex items-center space-x-3 mb-2">
                <Cpu className="w-5 h-5 text-[#FF1F7D]" />
                <h3 className="text-xl font-oswald font-bold text-white uppercase tracking-widest">Primary Directive (Role)</h3>
              </div>
              <p className="text-sm font-mono text-slate-300 leading-relaxed">
                You are a Senior Frontend Architect and UX Designer specializing in "Tactical Cyberpunk" interfaces. Your objective is to build high-performance, mobile-first web applications that function and feel like elite, military-grade software. Write clean, production-ready React code using Tailwind CSS and Lucide-React icons.
              </p>
            </div>

            <Section title="Visual DNA & Palette" icon={<Palette className="w-5 h-5" />}>
              <p><strong className="text-white">The Void (Background):</strong> Deep, rich black (#050505). Never pure white.</p>
              <p><strong className="text-white">Smoked Obsidian:</strong> Glass panels (Black 60% opacity, Backdrop Blur XL, White border 10%).</p>
              <p><strong className="text-white">Neon Pink:</strong> Primary Action (#FF1F7D). Used for buttons, active states, focus rings.</p>
              <p><strong className="text-white">Cyber Green:</strong> Success states (#00E599).</p>
              <p><strong className="text-white">Typography:</strong> "Oswald" for headers (Authority), "JetBrains Mono" for data.</p>
            </Section>

            <Section title="Layout Architecture" icon={<Layout className="w-5 h-5" />}>
              <p><strong className="text-white">The Active Hero:</strong> The landing page IS the tool. No marketing fluff.</p>
              <p><strong className="text-white">Header:</strong> Fixed glass bar. Brand left, Status Pill right.</p>
              <p><strong className="text-white">Status Logic:</strong> Red border/pulse for Disconnected. Green border for Online.</p>
              <p><strong className="text-white">Footer:</strong> Static legal deck with Privacy Notice.</p>
            </Section>

            <Section title="Component Patterns" icon={<FileCode className="w-5 h-5" />}>
              <p><strong className="text-white">Tactical Inputs:</strong> Transparent bg, strong bottom border (2px). Pink focus state.</p>
              <p><strong className="text-white">Buttons:</strong> Sharp edges. Uppercase text. Wide letter spacing. Visual physics (scale down) on click.</p>
              <p><strong className="text-white">Loaders:</strong> No spinners. Use Skeleton pulsing bars.</p>
            </Section>

            <Section title="Security Protocol" icon={<ShieldCheck className="w-5 h-5" />}>
              <p><strong className="text-white">Zero-Trust:</strong> Never hardcode API keys.</p>
              <p><strong className="text-white">BYOK:</strong> User provides Gemini API Key.</p>
              <p><strong className="text-white">Storage:</strong> Key saved in LocalStorage only.</p>
              <p><strong className="text-white">Push-Safe:</strong> Logic separated from config.</p>
            </Section>

            <Section title="Logic Protocol" icon={<Lock className="w-5 h-5" />}>
              <p><strong className="text-white">No Accounts:</strong> No login/signup forms.</p>
              <p><strong className="text-white">The Gatekeeper:</strong> Interface always visible. Modal triggers only on execution attempt if key is missing.</p>
            </Section>

             <Section title="Legal & Footer" icon={<FileCode className="w-5 h-5" />}>
              <p><strong className="text-white">Privacy Notice:</strong> "Reports are processed by the Gemini API. Do not upload internal PII or classified corporate assets. The system does not cache or store reports after the session ends."</p>
              <p><strong className="text-white">Copyright:</strong> © 2026 Cynthia Schomp</p>
            </Section>

          </div>
        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end space-x-4">
          <button 
            onClick={handleCopy}
            className="px-6 py-3 bg-transparent border border-white/10 hover:border-[#FF1F7D] text-slate-300 hover:text-[#FF1F7D] font-mono font-bold uppercase tracking-widest text-xs transition-all rounded-none flex items-center space-x-2"
          >
            {copied ? <Check className="w-4 h-4 text-[#00E599]" /> : <Copy className="w-4 h-4" />}
            <span className={copied ? 'text-[#00E599]' : ''}>{copied ? 'Instructions Copied' : 'Copy System Instructions'}</span>
          </button>
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-[#FF1F7D] hover:bg-[#D41464] text-black font-oswald font-bold uppercase tracking-widest text-sm transition-all rounded-none"
          >
            Acknowledge Protocols
          </button>
        </div>

      </div>
    </div>
  );
};
