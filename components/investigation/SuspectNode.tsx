import { Handle, Position } from '@xyflow/react';

export default function SuspectNode({ data }: any) {
  return (
    <div className="relative p-2 bg-[#fdfdfd] shadow-2xl border border-gray-300 w-44 rotate-1 hover:rotate-0 transition-transform group cursor-grab active:cursor-grabbing">
      
      {/* L'épingle rouge (Déco) */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.4)] z-10 before:content-[''] before:absolute before:inset-1 before:bg-red-400 before:rounded-full before:opacity-50" />
      
      {/* --- POINTS DE CONNEXION (Vrais fils rouges) --- */}
      {/* On les place AU-DESSUS de tout avec z-50 */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!w-4 !h-4 !bg-transparent !border-none !z-50 !cursor-crosshair"
        style={{ top: '-12px', left: '50%', transform: 'translateX(-50%)' }} 
      />
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!w-4 !h-4 !bg-red-600 !border-2 !border-white !rounded-full !z-50 !cursor-crosshair hover:!scale-125 transition-transform"
        style={{ bottom: '-8px' }}
      />

      {/* Reste du contenu (Photo & Étiquette) */}
      <div className="aspect-square bg-slate-900 overflow-hidden mb-3 grayscale group-hover:grayscale-0 transition-all border border-black/5">
        {data.image ? (
          <img src={data.image} alt={data.label} className="object-cover w-full h-full opacity-90" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-emerald-500/20">
             <span className="font-mono text-[8px] tracking-tighter">NO_VISUAL_DATA</span>
          </div>
        )}
      </div>

      <div className="px-1 py-1 border-t border-dashed border-gray-200">
        <p className="text-slate-900 font-serif italic text-sm leading-tight text-center truncate px-1">
          {data.label}
        </p>
        <div className="mt-2 flex justify-center">
          <span className="text-[7px] font-black uppercase tracking-[0.2em] text-red-600 border border-red-200 px-1 rounded-sm bg-red-50">
            {data.status || 'CLASSIFIED'}
          </span>
        </div>
      </div>
    </div>
  );
}