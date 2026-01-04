
import React from 'react';
import { IndicatorType } from '../types';

interface Props {
  type: string;
}

export const IndicatorBadge: React.FC<Props> = ({ type }) => {
  const getColors = () => {
    switch (type) {
      case 'ipv4-addr': return 'bg-blue-900/20 text-blue-400 border-blue-500/30';
      case 'domain-name': return 'bg-purple-900/20 text-purple-400 border-purple-500/30';
      case 'url': return 'bg-emerald-900/20 text-emerald-400 border-emerald-500/30';
      case 'file-hash-sha256':
      case 'file-hash-sha1':
      case 'file-hash-md5': return 'bg-orange-900/20 text-orange-400 border-orange-500/30';
      default: return 'bg-slate-800 text-slate-400 border-slate-600';
    }
  };

  return (
    <span className={`px-2 py-0.5 border text-[9px] font-mono font-bold uppercase tracking-wider ${getColors()}`}>
      {type.replace('file-hash-', '')}
    </span>
  );
};
