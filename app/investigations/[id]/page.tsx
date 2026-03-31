"use client"

import React, { useCallback, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ReactFlow, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Connection, 
  Node, 
  Edge, 
  Background, 
  Controls 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { 
  ChevronLeft, 
  Save, 
  Plus, 
  Trash2, 
  ImageIcon, 
  StickyNote, 
  Newspaper, 
  Map as MapIcon, 
  Upload, 
  Link as LinkIcon,
  Layers
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SuspectNode from '@/components/investigation/SuspectNode';
import { PostItNode, ArticleNode, MapNode } from '@/components/investigation/EvidenceNodes';

// Configuration des types de nœuds personnalisés
const nodeTypes = { 
  suspect: SuspectNode, 
  postit: PostItNode, 
  article: ArticleNode, 
  map: MapNode 
};

export default function InvestigationBoard() {
  const { id } = useParams();
  const router = useRouter();
  
  // États de React Flow
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  
  // États du formulaire de création
  const [selectedType, setSelectedType] = useState<'suspect' | 'postit' | 'article' | 'map'>('suspect');
  const [formData, setFormData] = useState({ label: "", image: "" });

  // 1. CHARGEMENT AUTOMATIQUE DES DONNÉES SAUVEGARDÉES
  useEffect(() => {
    const savedData = localStorage.getItem(`spyosint_investigation_${id}`);
    if (savedData) {
      try {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedData);
        setNodes(savedNodes || []);
        setEdges(savedEdges || []);
      } catch (e) {
        console.error("Erreur de lecture des archives locales", e);
      }
    }
  }, [id, setNodes, setEdges]);

  // 2. FONCTION DE SAUVEGARDE LOCALE
  const saveBoard = () => {
    const dataToSave = { nodes, edges };
    localStorage.setItem(`spyosint_investigation_${id}`, JSON.stringify(dataToSave));
    alert("SYSTÈME : Données d'enquête archivées avec succès.");
  };

  // Gestion de l'upload local (Conversion Base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Ajout d'une nouvelle preuve sur le board
  const addEvidence = () => {
    const newId = `node_${Math.random().toString(36).substr(2, 9)}`;
    const newNode: Node = {
      id: newId,
      type: selectedType,
      position: { x: 400, y: 200 },
      data: { 
        label: formData.label || (selectedType === 'postit' ? "Note..." : "Preuve sans nom"), 
        image: formData.image || null,
        status: 'ANALYZED' 
      },
    };
    setNodes((nds) => nds.concat(newNode));
    setFormData({ label: "", image: "" }); // Reset formulaire
  };

  // Suppression des éléments sélectionnés
  const deleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((node) => !node.selected));
    setEdges((eds) => eds.filter((edge) => !edge.selected));
  }, [setNodes, setEdges]);

  // Logique de connexion (fil rouge d'investigation)
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ 
        ...params, 
        type: 'straight', 
        style: { stroke: '#dc2626', strokeWidth: 3, filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' } 
    }, eds)),
    [setEdges]
  );

  return (
    <main className="h-screen w-screen bg-[#0a0a0b] flex flex-col overflow-hidden fixed inset-0">
      
      {/* BARRE SUPÉRIEURE (HEADER) */}
      <header className="h-14 border-b border-white/5 bg-black/80 flex items-center justify-between px-6 z-50 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white/50 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </Button>
          <div className="flex flex-col border-l border-white/10 pl-4">
            <span className="text-blue-500 font-mono text-[9px] tracking-[0.3em] uppercase italic leading-none">SpyOSINT_Wall</span>
            <span className="text-white font-mono text-xs font-bold tracking-tighter uppercase leading-tight">CASE_#{id?.toString().slice(0, 8)}</span>
          </div>
        </div>
        <div className="flex gap-3">
            <Button onClick={deleteSelected} variant="ghost" className="text-red-500 text-[10px] font-mono tracking-widest hover:bg-red-500/10 h-9">
                <Trash2 size={14} className="mr-2" /> EFFACER_SÉLECTION
            </Button>
            <Button 
                onClick={saveBoard}
                className="bg-yellow-600 hover:bg-yellow-500 text-black font-black text-[10px] tracking-widest px-6 shadow-lg shadow-yellow-900/10 h-9 transition-all active:scale-95"
            >
                <Save size={14} className="mr-2" /> SAUVEGARDER
            </Button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0 overflow-hidden">
        
        {/* SIDEBAR D'OUTILS (ARSENAL) */}
        <aside className="w-80 border-r border-white/5 bg-black/60 backdrop-blur-xl p-6 flex flex-col gap-6 z-40 shrink-0 overflow-y-auto shadow-2xl">
          <h2 className="text-blue-500 font-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
            <Layers size={14} /> Arsenal_Tactique
          </h2>
          
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'suspect', icon: ImageIcon, color: 'bg-blue-600', label: 'Photo' },
              { id: 'postit', icon: StickyNote, color: 'bg-yellow-600 text-black', label: 'Note' },
              { id: 'article', icon: Newspaper, color: 'bg-slate-600', label: 'Rapport' },
              { id: 'map', icon: MapIcon, color: 'bg-red-600', label: 'Carte' }
            ].map((type) => (
              <Button 
                key={type.id}
                variant={selectedType === type.id ? 'default' : 'outline'}
                className={`h-12 border-white/10 transition-all ${selectedType === type.id ? type.color : 'hover:bg-white/5 opacity-40 hover:opacity-100'}`}
                onClick={() => setSelectedType(type.id as any)}
                title={type.label}
              >
                <type.icon size={20} />
              </Button>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="space-y-2">
              <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest leading-none">
                {selectedType === 'postit' ? 'Détails de la note' : 'Titre / Identification'}
              </label>
              <Input 
                value={formData.label}
                onChange={(e) => setFormData({...formData, label: e.target.value})}
                placeholder={selectedType === 'postit' ? "Écrivez ici..." : "Nom ou objet..."}
                className="bg-black/60 border-white/10 text-xs text-white h-11 focus:ring-1 focus:ring-blue-500/50"
              />
            </div>

            {selectedType !== 'postit' && (
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center justify-between leading-none">
                    Média Visuel
                    <span className="text-[7px] text-emerald-500 font-bold">URL ou FICHIER</span>
                </label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <LinkIcon size={12} className="absolute left-3 top-3.5 text-white/30" />
                        <Input 
                            placeholder="Lien..." 
                            value={formData.image}
                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                            className="bg-black/60 border-white/10 text-[10px] pl-8 text-white font-mono h-11"
                        />
                    </div>
                    <label className="cursor-pointer bg-white/5 border border-white/10 w-11 h-11 rounded hover:bg-blue-600/20 transition-colors flex items-center justify-center group">
                        <Upload size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
                        <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                    </label>
                </div>
              </div>
            )}

            <Button onClick={addEvidence} className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black h-12 tracking-[0.2em] mt-4 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
              <Plus size={16} className="mr-2" /> AJOUTER AU TABLEAU
            </Button>
          </div>
        </aside>

        {/* MURDER BOARD (ZONE DE LIÈGE) */}
        <section className="flex-1 relative bg-[#221711] overflow-hidden">
          {/* Texture de liège réaliste */}
          <div 
            className="absolute inset-0 opacity-25 pointer-events-none z-0" 
            style={{ 
                backgroundImage: "url('https://www.transparenttextures.com/patterns/cork-board.png')",
                backgroundRepeat: 'repeat' 
            }} 
          />

          <div className="absolute inset-0 z-10">
            <ReactFlow 
                nodes={nodes} 
                edges={edges} 
                onNodesChange={onNodesChange} 
                onEdgesChange={onEdgesChange} 
                onConnect={onConnect} 
                nodeTypes={nodeTypes} 
                colorMode="dark" 
                fitView
            >
                <Background color="#000" gap={60} size={1} style={{ opacity: 0.05 }} />
                <Controls className="bg-slate-900 border-white/10 fill-emerald-500" />
            </ReactFlow>
          </div>
          
          {/* Cadre de bordure en bois sombre */}
          <div className="absolute inset-0 pointer-events-none border-[14px] border-[#3e2723] shadow-[inset_0_0_120px_rgba(0,0,0,0.9)] z-20" />
          <div className="absolute inset-[14px] pointer-events-none border border-black/30 z-20" />
        </section>
      </div>
    </main>
  );
}