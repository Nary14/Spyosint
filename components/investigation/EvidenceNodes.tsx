import React from 'react';
import { Handle, Position } from '@xyflow/react';

// POST-IT : Simple, focus sur le texte
export const PostItNode = ({ data }: any) => (
  <div className="bg-[#fef08a] p-4 shadow-xl border-l-4 border-yellow-500 -rotate-1 w-44 min-h-[120px] text-slate-800 font-serif italic text-sm ring-1 ring-black/5 flex items-center justify-center text-center">
    <Handle type="target" position={Position.Top} className="!opacity-0" />
    {data.label}
    <Handle type="source" position={Position.Bottom} className="!opacity-0" />
  </div>
);

// ARTICLE : Style coupure de presse avec image
export const ArticleNode = ({ data }: any) => (
  <div className="bg-white p-3 shadow-2xl border border-gray-300 w-64 rotate-1">
    <div className="border-b border-black mb-2 flex justify-between items-center px-1 text-black">
      <span className="text-[7px] font-black uppercase tracking-tighter">OSINT_REPORT</span>
      <span className="text-[6px] font-mono opacity-50 uppercase">Ref_2026</span>
    </div>
    {data.image && (
      <img src={data.image} className="w-full h-32 object-cover mb-2 grayscale contrast-125 border border-black/10" alt="Evidence" />
    )}
    <p className="text-[10px] font-bold uppercase leading-tight font-sans text-black">{data.label}</p>
    <Handle type="target" position={Position.Top} className="!bg-red-600 !w-2 !h-2" />
    <Handle type="source" position={Position.Bottom} className="!bg-red-600 !w-2 !h-2" />
  </div>
);

// MAP : Rendu satellite avec radar
export const MapNode = ({ data }: any) => (
  <div className="bg-[#1a1a1b] p-1 shadow-2xl border-2 border-[#3e2723] w-80 h-52 relative group overflow-hidden flex flex-col">
    <Handle type="target" position={Position.Top} className="!bg-red-600 !z-50" />
    <div className="flex-1 bg-slate-900 relative overflow-hidden">
        {data.image ? (
            <img src={data.image} className="w-full h-full object-cover opacity-90" alt="Satellite" />
        ) : (
            <div className="w-full h-full flex items-center justify-center border border-dashed border-emerald-500/20">
                <span className="text-[8px] font-mono text-emerald-500 animate-pulse uppercase">Awaiting_Sat_Feed...</span>
            </div>
        )}
        <div className="absolute top-4 right-4 bg-red-600 w-3 h-3 rounded-full shadow-[0_0_12px_red] animate-ping z-10" />
    </div>
    <div className="bg-black/95 p-2 border-t border-red-500/40">
        <p className="text-[9px] font-mono text-white truncate uppercase tracking-[0.2em]">{data.label || 'Target_Area'}</p>
    </div>
    <Handle type="source" position={Position.Bottom} className="!bg-red-600 !z-50" />
  </div>
);