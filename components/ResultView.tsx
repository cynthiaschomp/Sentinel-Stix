import React, { useState } from 'react';
import { ExtractionResult, IndicatorType } from '../types';
import { IndicatorBadge } from './IndicatorBadge';
import { validateIndicator } from '../utils/validation';
import { defangIndicator } from '../utils/security';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Shield, Target, Bug, Activity, Copy, Check, Download, BookOpen, Link, Eye, EyeOff } from 'lucide-react';

interface Props {
  data: ExtractionResult;
}

export const ResultView: React.FC<Props> = ({ data }) => {
  const [view, setView] = useState<'visual' | 'json'>('visual');
  const [copied, setCopied] = useState(false);
  const [isDefanged, setIsDefanged] = useState(true);

  const indicatorCounts = data.indicators.reduce((acc: any, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(indicatorCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ['#FF1F7D', '#00E599', '#8b5cf6', '#3b82f6', '#f59e0b', '#ef4444'];

  const copyToClipboard = () => {
    const output = isDefanged 
      ? JSON.stringify({
          ...data,
          indicators: data.indicators.map(i => ({ ...i, value: defangIndicator(i.value) }))
        }, null, 2)
      : JSON.stringify(data, null, 2);
    
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinel-intel-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 p-6 h-full overflow-y-auto custom-scrollbar">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex bg-black/40 border border-white/10 p-0.5">
          <button 
            onClick={() => setView('visual')}
            className={`px-6 py-2 text-[10px] font-mono font-bold transition uppercase tracking-widest ${view === 'visual' ? 'bg-neon-pink text-black' : 'text-slate-500 hover:text-white'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setView('json')}
            className={`px-6 py-2 text-[10px] font-mono font-bold transition uppercase tracking-widest ${view === 'json' ? 'bg-neon-pink text-black' : 'text-slate-500 hover:text-white'}`}
          >
            JSON
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsDefanged(!isDefanged)}
            className={`flex items-center space-x-2 px-4 py-2 transition border text-[10px] font-mono font-bold uppercase tracking-wider ${
              isDefanged ? 'bg-cyber-green/5 border-cyber-green/50 text-cyber-green' : 'bg-red-500/5 border-red-500/50 text-red-500'
            }`}
          >
            {isDefanged ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            <span>{isDefanged ? 'SAFE MODE' : 'LIVE FIRE'}</span>
          </button>
          
          <button 
            onClick={copyToClipboard}
            className="flex items-center space-x-2 px-4 py-2 bg-transparent hover:bg-white/5 border border-white/10 text-slate-300 transition active:scale-95"
          >
            {copied ? <Check className="w-3 h-3 text-cyber-green" /> : <Copy className="w-3 h-3" />}
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">{copied ? 'COPIED' : 'COPY'}</span>
          </button>
          <button 
            onClick={downloadJson}
            className="flex items-center space-x-2 px-4 py-2 bg-neon-pink hover:bg-[#D41464] text-black transition shadow-[0_0_10px_rgba(255,31,125,0.2)] active:scale-95"
          >
            <Download className="w-3 h-3" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">EXPORT</span>
          </button>
        </div>
      </div>

      {view === 'visual' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            {/* Top Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <EntityCard icon={<Shield className="text-[#3b82f6]" />} title="Threat Actors" count={data.threat_actors.length} items={data.threat_actors.map(a => a.name || 'Unknown')} />
              <EntityCard icon={<Target className="text-neon-pink" />} title="Targets" count={data.victims.length} items={data.victims.map(v => v.name || 'Unknown')} />
              <EntityCard icon={<Bug className="text-cyber-green" />} title="Malware" count={data.malware.length} items={data.malware.map(m => m.name || 'Unknown')} />
            </div>

            {/* TTPs Panel */}
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-6 rounded-none">
              <div className="flex items-center space-x-2 mb-4 border-b border-white/5 pb-2">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-sans font-bold text-white uppercase tracking-widest">Tactics & Techniques</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.ttps.map((ttp, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/5 p-4 hover:border-neon-pink/50 transition group rounded-none">
                    <span className="text-[10px] font-mono font-bold bg-neon-pink/20 text-neon-pink px-2 py-0.5 border border-neon-pink/30">{ttp.technique_id}</span>
                    <h4 className="text-xs font-bold text-slate-200 mt-2 font-mono">{ttp.technique_name}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 font-mono">{ttp.description}</p>
                  </div>
                ))}
                {data.ttps.length === 0 && <div className="col-span-full py-6 text-center text-slate-600 font-mono text-xs uppercase">No TTPs Identified</div>}
              </div>
            </div>

            {/* Indicators Panel */}
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-6 rounded-none">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <h3 className="text-sm font-sans font-bold text-white uppercase tracking-widest">Detected Indicators</h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-slate-500 uppercase text-[10px] font-mono font-bold tracking-widest border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Value</th>
                      <th className="px-4 py-3 text-right">Integrity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.indicators.map((indicator, idx) => {
                      const displayValue = isDefanged ? defangIndicator(indicator.value) : indicator.value;
                      const isValid = validateIndicator(indicator.type as IndicatorType, indicator.value);
                      return (
                        <tr key={idx} className="hover:bg-white/[0.02] transition group">
                          <td className="px-4 py-3"><IndicatorBadge type={indicator.type} /></td>
                          <td className="px-4 py-3 font-mono text-slate-300 text-xs break-all group-hover:text-neon-pink transition-colors">{displayValue}</td>
                          <td className="px-4 py-3 text-right">
                            <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${isValid ? 'text-cyber-green' : 'text-red-500'}`}>
                              {isValid ? <Check className="w-3 h-3 mr-1" /> : '!'} {isValid ? 'VERIFIED' : 'INVALID'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Charts & Graphs */}
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-6 rounded-none">
              <h3 className="text-xs font-sans font-bold text-slate-400 uppercase tracking-widest mb-6">Telemetry</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#050505', borderRadius: '0px', border: '1px solid #333' }} 
                      itemStyle={{ color: '#fff', fontSize: '10px', fontFamily: 'JetBrains Mono' }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Link className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-sans font-bold text-slate-400 uppercase tracking-widest">Graph Linkages</h3>
                </div>
                <div className="space-y-2">
                  {data.relationships.map((rel, idx) => (
                    <div key={idx} className="p-3 bg-white/[0.02] border border-white/5 text-[10px] font-mono group hover:border-neon-pink/30 transition rounded-none">
                      <div className="flex items-center justify-between">
                        <span className="text-[#3b82f6] font-bold truncate max-w-[80px]">{rel.source}</span>
                        <span className="text-slate-500 uppercase tracking-tighter">--[{rel.relationship_type}]--</span>
                        <span className="text-neon-pink font-bold truncate max-w-[80px]">{rel.target}</span>
                      </div>
                    </div>
                  ))}
                  {data.relationships.length === 0 && <div className="text-center text-slate-600 font-mono text-[10px] uppercase">No Linkages Found</div>}
                </div>
              </div>
            </div>

            <div className="p-5 border border-neon-pink/20 bg-neon-pink/5 rounded-none">
              <h4 className="text-[10px] font-sans font-bold text-neon-pink uppercase tracking-widest mb-2 flex items-center">
                <Shield className="w-3 h-3 mr-1" /> Operational Security
              </h4>
              <p className="text-[10px] font-mono text-slate-500 leading-relaxed">
                Indicators are de-fanged by default. Exercise extreme caution when handling live malware hashes.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-8 font-mono text-xs overflow-auto max-h-[700px] custom-scrollbar rounded-none">
          <pre className="text-cyber-green leading-relaxed whitespace-pre-wrap">
            {JSON.stringify(isDefanged ? {
              ...data,
              indicators: data.indicators.map(i => ({ ...i, value: defangIndicator(i.value) }))
            } : data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

const EntityCard = ({ icon, title, count, items }: { icon: React.ReactNode, title: string, count: number, items: string[] }) => (
  <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-5 flex flex-col h-full hover:border-neon-pink/50 transition group rounded-none">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <div className="p-1.5 bg-white/5 rounded-none">{icon}</div>
        <h4 className="text-xs font-sans font-bold text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{title}</h4>
      </div>
      <span className="bg-white/10 text-white px-2 py-0.5 text-[10px] font-mono font-bold border border-white/10 rounded-none">{count}</span>
    </div>
    <div className="flex flex-wrap gap-1.5">
      {items.slice(0, 4).map((item, i) => (
        <span key={i} className="text-[10px] font-mono font-bold bg-white/[0.02] text-slate-300 px-2 py-1 border border-white/10 truncate max-w-full group-hover:border-neon-pink/30 transition-colors rounded-none">{item}</span>
      ))}
      {items.length > 4 && <span className="text-[9px] font-mono font-bold text-slate-600 self-center">+{items.length - 4}</span>}
    </div>
  </div>
);