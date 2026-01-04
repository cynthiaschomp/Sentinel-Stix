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
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

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
    a.download = `stix-bundle-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button onClick={() => setView('visual')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition uppercase tracking-wider ${view === 'visual' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:text-white'}`}>Dashboard</button>
          <button onClick={() => setView('json')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition uppercase tracking-wider ${view === 'json' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-400 hover:text-white'}`}>STIX JSON</button>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsDefanged(!isDefanged)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition border text-xs font-bold ${isDefanged ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
          >
            {isDefanged ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{isDefanged ? 'DE-FANGED' : 'RAW INTEL'}</span>
          </button>
          
          <button onClick={copyToClipboard} className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition border border-slate-700">
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span className="text-xs font-bold">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button onClick={downloadJson} className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition shadow-lg shadow-blue-900/20">
            <Download className="w-4 h-4" />
            <span className="text-xs font-bold">Download JSON</span>
          </button>
        </div>
      </div>

      {view === 'visual' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <EntityCard icon={<Shield className="text-blue-400" />} title="Actors" count={data.threat_actors.length} items={data.threat_actors.map(a => a.name || 'Unknown')} />
              <EntityCard icon={<Target className="text-rose-400" />} title="Victims" count={data.victims.length} items={data.victims.map(v => v.name || 'Unknown')} />
              <EntityCard icon={<Bug className="text-emerald-400" />} title="Malware" count={data.malware.length} items={data.malware.map(m => m.name || 'Unknown')} />
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-semibold">Techniques (MITRE ATT&CK)</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.ttps.map((ttp, idx) => (
                  <div key={idx} className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl">
                    <span className="text-xs font-bold bg-amber-900/40 text-amber-400 px-2 py-0.5 rounded border border-amber-800">{ttp.technique_id}</span>
                    <h4 className="text-sm font-bold text-slate-200 mt-2">{ttp.technique_name}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ttp.description}</p>
                  </div>
                ))}
                {data.ttps.length === 0 && <div className="col-span-full py-6 text-center text-slate-500 italic text-sm">No specific TTPs identified.</div>}
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold">Network & File Indicators</h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-slate-500 uppercase text-xs font-bold tracking-widest border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Value</th>
                      <th className="px-4 py-3 text-right">Valid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {data.indicators.map((indicator, idx) => {
                      const displayValue = isDefanged ? defangIndicator(indicator.value) : indicator.value;
                      const isValid = validateIndicator(indicator.type as IndicatorType, indicator.value);
                      return (
                        <tr key={idx} className="hover:bg-slate-800/20 transition group">
                          <td className="px-4 py-4"><IndicatorBadge type={indicator.type} /></td>
                          <td className="px-4 py-4 font-mono text-slate-300 text-xs break-all">{displayValue}</td>
                          <td className="px-4 py-4 text-right">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${isValid ? 'bg-emerald-900/30 text-emerald-400' : 'bg-rose-900/30 text-rose-400'}`}>
                              {isValid ? <Check className="w-2.5 h-2.5 mr-1" /> : '!'} {isValid ? 'YES' : 'NO'}
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
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Indicator Mix</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                      {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155' }} itemStyle={{ color: '#f1f5f9', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-10 border-t border-slate-800 pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Link className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Relationships</h3>
                </div>
                <div className="space-y-3">
                  {data.relationships.map((rel, idx) => (
                    <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] group hover:border-blue-500/30 transition">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-400 font-bold truncate max-w-[80px]">{rel.source}</span>
                        <span className="px-1.5 py-0.5 bg-slate-800 rounded text-[9px] text-slate-400 uppercase">{rel.relationship_type}</span>
                        <span className="text-rose-400 font-bold truncate max-w-[80px]">{rel.target}</span>
                      </div>
                    </div>
                  ))}
                  {data.relationships.length === 0 && <div className="text-center text-slate-500 text-xs py-4">None.</div>}
                </div>
              </div>
            </div>

            <div className="p-5 bg-blue-900/10 border border-blue-500/20 rounded-2xl">
              <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center">
                <Shield className="w-3 h-3 mr-1" /> Security Alert
              </h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Manually verify all indicators. Use isolated sandbox environments for analysis.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative bg-slate-950 rounded-2xl border border-slate-800 p-8 font-mono text-sm overflow-auto max-h-[700px]">
          <pre className="text-emerald-500 leading-relaxed whitespace-pre-wrap">
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
  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col h-full hover:border-slate-700 transition">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <div className="p-1.5 bg-slate-800 rounded-lg">{icon}</div>
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</h4>
      </div>
      <span className="bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded text-xs font-bold">{count}</span>
    </div>
    <div className="flex flex-wrap gap-1.5">
      {items.slice(0, 4).map((item, i) => (
        <span key={i} className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-800/50 truncate max-w-full">{item}</span>
      ))}
      {items.length > 4 && <span className="text-[9px] font-bold text-slate-600 self-center">+{items.length - 4} more</span>}
    </div>
  </div>
);