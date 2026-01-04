
import React from 'react';
import { IndicatorType } from '../types';

interface Props {
  type: string;
}

export const IndicatorBadge: React.FC<Props> = ({ type }) => {
  const getColors = () => {
    switch (type) {
      case 'ipv4-addr': return 'bg-blue-900/40 text-blue-300 border-blue-700';
      case 'domain-name': return 'bg-purple-900/40 text-purple-300 border-purple-700';
      case 'url': return 'bg-emerald-900/40 text-emerald-300 border-emerald-700';
      case 'file-hash-sha256':
      case 'file-hash-sha1':
      case 'file-hash-md5': return 'bg-orange-900/40 text-orange-300 border-orange-700';
      default: return 'bg-slate-800 text-slate-300 border-slate-600';
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded border text-xs font-medium uppercase tracking-wider ${getColors()}`}>
      {type.replace('file-hash-', '')}
    </span>
  );
};
