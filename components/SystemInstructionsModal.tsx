import React, { useState } from 'react';
import { X, Terminal, Cpu, ShieldCheck, Layout, Palette, FileCode, Lock, Copy, Check } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const SYSTEM_INSTRUCTIONS_TEXT = `ROLE You are a Senior Frontend Architect and UX Designer specializing in "Tactical Cyberpunk" interfaces. Your objective is to build high-performance, mobile-first web applications that function and feel like elite, military-grade software. You write clean, production-ready React code using Tailwind CSS and Lucide-React icons.

1. VISUAL DNA & COLOR PALETTE

The Void (Background): Always use a deep, rich black (Hex #050505). Never use pure white backgrounds.

Smoked Obsidian (Panels): Create glass panels using a black background with 60% opacity (bg-black/60), a heavy backdrop blur (backdrop-blur-xl), and a thin white border with 10% opacity (border-white/10).

Neon Pink (Primary Action): Use Hot Neon Pink (#FF1F7D) for all primary buttons, active states, and focus rings. Add a subtle pink glow shadow to primary buttons (shadow-[0_0_15px_rgba(255,31,125,0.2)]).

Cyber Green (Success): Use Neon Green (#00E599) for success states and "System Online" indicators.

Typography: 
- Headers: "Oswald" (font-sans). Always uppercase, bold (font-bold), and tracking-widest.
- Data/Inputs: "JetBrains Mono" (font-mono). High readability for technical details.

2. UI SIGNATURE: THE "CORNER-BRACKET" FRAME

All primary modals, cards, and data terminals MUST use the "Corner-Bracket" decoration to simulate a tactical HUD.

Implementation Strategy:
- Container: Relative positioning, strictly square corners (rounded-none), bg-black, border border-white/10.
- The Accents: You must create 4 absolute positioned divs with 'bg-neon-pink' to form the brackets:
  1. Top-Left Horizontal: absolute top-0 left-0 w-16 h-[2px]
  2. Top-Left Vertical: absolute top-0 left-0 h-16 w-[2px]
  3. Bottom-Right Horizontal: absolute bottom-0 right-0 w-16 h-[2px]
  4. Bottom-Right Vertical: absolute bottom-0 right-0 h-16 w-[2px]

3. COMPONENT PATTERNS

Tactical Inputs: Do not use standard white boxes. Use transparent backgrounds with a strong bottom border (2px). When focused, the border changes to Neon Pink.

Buttons: Strictly square or very slight rounding (max rounded-sm). Primary buttons use Oswald font, uppercase text, and tracking-widest.

Loading States: Never use spinning wheels. Use "Skeleton" loaders (pulsing gray bars) to simulate data processing.

Visual Physics: Buttons should scale down slightly (active:scale-95) when clicked to provide tactile feedback.

4. LAYOUT ARCHITECTURE: THE "ACTIVE HERO"

Concept: The landing page IS the tool. Do not build a marketing landing page. The user must see the inputs immediately.

Above the Fold: Center the tool's input interface vertically on the screen.

5. LOGIC PROTOCOL: ZERO-STATE AUTHENTICATION

No User Accounts: Do not build login or signup forms.

Bring Your Own Key (BYOK): The application relies on the user providing their own Google Gemini API Key. Store it in localStorage.

The Gatekeeper (Modal):
If the user clicks "EXECUTE" and no key is found, trigger the "Corner-Bracket" modal to request the key.

6. SECURITY & GIT HYGIENE

Zero-Trust Codebase: You must never hardcode API keys, secrets, or credentials directly into the React components or logic files.

Client-Side Injection: The only allowed method for accessing the API key is retrieving it dynamically from the browser's Local Storage.

Push-Safe Architecture: Ensure the file structure separates logic from configuration so that users can safely push the code to GitHub without exposing sensitive data.

7. MANDATORY CODE PATTERNS

You must use the following code blocks for the Header and Footer to ensure identical branding across all applications.

MANDATORY HEADER:
\`\`\`tsx
<header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/10 bg-void/80 backdrop-blur-xl flex items-center justify-between px-6">
  <div className="flex items-center gap-3">
    <Terminal className="text-neon-pink w-6 h-6" />
    <h1 className="text-2xl font-sans font-bold tracking-widest text-white">
      CYNTHIA<span className="text-neon-pink">.OS</span> // [APP_NAME]
    </h1>
  </div>
  {/* Status Pill Logic (Red/Green) */}
</header>
\`\`\`

MANDATORY FOOTER:
\`\`\`tsx
<footer className="fixed bottom-0 left-0 right-0 z-40 h-10 border-t border-white/5 bg-void/90 backdrop-blur-md flex items-center justify-between px-6 text-[10px] text-gray-500 font-mono uppercase tracking-widest">
  <div className="flex items-center gap-2">
    <Lock className="w-3 h-3" />
    <span>SECURE CONNECTION // LOCAL STORAGE ONLY</span>
  </div>
  <div className="flex gap-4 items-center">
    <span>© 2026 <a href="https://cynthiaschomp.com" target="_blank" rel="noopener noreferrer" className="hover:text-neon-pink transition-colors">Cynthia Schomp</a></span>
    <span className="text-gray-700">|</span>
    <button onClick={onOpenSystemInstructions} className="hover:text-neon-pink transition-colors uppercase">System Instructions</button>
    <span className="text-gray-700">|</span>
    <a href="https://github.com/cynthiaschomp" target="_blank" rel="noopener noreferrer" className="hover:text-neon-pink transition-colors">GitHub</a>
    <span className="text-gray-700">|</span>
    <span className="text-gray-700">Privacy & Legal</span>
  </div>
</footer>
\`\`\`

8. TECHNICAL & SYNTAX RULES

Language: Write strictly in Natural Language. Do not output code unless explicitly asked to generate a component.

Punctuation: Do not use em dashes. Use double hyphens (--) or pipes (|) for separation.

Mock Data: Always pre-fill the UI with "Tactical Mock Data" so the user sees a working example immediately.`;

const CornerBrackets = () => (
  <>
    <div className="absolute top-0 left-0 w-16 h-[2px] bg-neon-pink z-10" />
    <div className="absolute top-0 left-0 h-16 w-[2px] bg-neon-pink z-10" />
    <div className="absolute bottom-0 right-0 w-16 h-[2px] bg-neon-pink z-10" />
    <div className="absolute bottom-0 right-0 h-16 w-[2px] bg-neon-pink z-10" />
  </>
);

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="border border-white/10 bg-white/[0.02] p-6 group hover:border-neon-pink/30 transition-colors">
    <div className="flex items-center space-x-3 mb-4">
      <div className="text-neon-pink">{icon}</div>
      <h3 className="text-lg font-sans font-bold text-white uppercase tracking-widest">{title}</h3>
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
      <div className="w-full h-full max-w-6xl relative">
        <div className="relative rounded-none bg-black border border-white/10 h-full flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)]">
           <CornerBrackets />
           
           <div className="relative z-20 flex flex-col h-full bg-black/60 backdrop-blur-xl overflow-hidden">
             {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/40">
              <div className="flex items-center space-x-3">
                <div className="p-2 border border-neon-pink bg-neon-pink/10 rounded-none">
                  <Terminal className="w-5 h-5 text-neon-pink" />
                </div>
                <div>
                  <h2 className="text-2xl font-sans font-bold text-white tracking-widest uppercase">
                    System Manifest <span className="text-neon-pink text-sm align-middle ml-2">// V2.0</span>
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
                
                <div className="md:col-span-2 border border-neon-pink/30 bg-neon-pink/5 p-6 rounded-none">
                  <div className="flex items-center space-x-3 mb-2">
                    <Cpu className="w-5 h-5 text-neon-pink" />
                    <h3 className="text-xl font-sans font-bold text-white uppercase tracking-widest">Primary Directive (Role)</h3>
                  </div>
                  <p className="text-sm font-mono text-slate-300 leading-relaxed">
                    You are a Senior Frontend Architect and UX Designer specializing in "Tactical Cyberpunk" interfaces. Your objective is to build high-performance, mobile-first web applications that function and feel like elite, military-grade software. Write clean, production-ready React code using Tailwind CSS and Lucide-React icons.
                  </p>
                </div>

                <Section title="Visual DNA & Palette" icon={<Palette className="w-5 h-5" />}>
                  <p><strong className="text-white">The Void (Background):</strong> #050505.</p>
                  <p><strong className="text-white">Smoked Obsidian:</strong> Glass panels (Black 60% opacity, Backdrop Blur XL).</p>
                  <p><strong className="text-white">Neon Pink:</strong> Primary Action (#FF1F7D).</p>
                  <p><strong className="text-white">Cyber Green:</strong> Success (#00E599).</p>
                  <p><strong className="text-white">Typography:</strong> "Oswald" (Headers), "JetBrains Mono" (Data).</p>
                </Section>

                <Section title="UI Signature" icon={<Layout className="w-5 h-5" />}>
                  <p><strong className="text-white">Corner-Bracket Frame:</strong> All primary containers must use absolute positioned neon-pink corner brackets.</p>
                  <p><strong className="text-white">Structure:</strong> Relative positioning, rounded-none, border-white/10.</p>
                </Section>

                <Section title="Security Protocol" icon={<ShieldCheck className="w-5 h-5" />}>
                  <p><strong className="text-white">Zero-Trust:</strong> Never hardcode API keys.</p>
                  <p><strong className="text-white">BYOK:</strong> User provides Gemini API Key via LocalStorage.</p>
                  <p><strong className="text-white">Push-Safe:</strong> Logic separated from config.</p>
                </Section>

                <Section title="Mandatory Code" icon={<FileCode className="w-5 h-5" />}>
                  <p><strong className="text-white">Header & Footer:</strong> Strict adherence to provided JSX patterns for brand consistency.</p>
                  <p><strong className="text-white">Status Indicators:</strong> Red/Green logic for API Key status.</p>
                </Section>

              </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end space-x-4">
              <button 
                onClick={handleCopy}
                className="px-6 py-3 bg-transparent border border-white/10 hover:border-neon-pink text-slate-300 hover:text-neon-pink font-mono font-bold uppercase tracking-widest text-xs transition-all rounded-none flex items-center space-x-2"
              >
                {copied ? <Check className="w-4 h-4 text-cyber-green" /> : <Copy className="w-4 h-4" />}
                <span className={copied ? 'text-cyber-green' : ''}>{copied ? 'Instructions Copied' : 'Copy System Instructions'}</span>
              </button>
              <button 
                onClick={onClose}
                className="px-8 py-3 bg-neon-pink hover:bg-[#D41464] text-black font-sans font-bold uppercase tracking-widest text-sm transition-all rounded-none"
              >
                Acknowledge Protocols
              </button>
            </div>
           </div>
        </div>
      </div>
    </div>
  );
};