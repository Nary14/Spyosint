// app/dashboard/layout.tsx
"use client"

import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      {/* SIDEBAR */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* ZONE DE CONTENU - On utilise w-full et on retire les max-w */}
      <div 
        className={`transition-all duration-300 min-h-screen flex flex-col ${collapsed ? "pl-16" : "pl-64"}`}
      >
        {/* HEADER - Justifié à droite pour les coins */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-end px-8 bg-black/80 backdrop-blur-md border-b border-emerald-500/10">
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/50 px-4 py-1.5 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <div className="flex flex-col items-end text-right">
              <span className="text-[9px] text-emerald-500/70 font-mono uppercase">Solde</span>
              <span className="text-base font-mono font-black text-emerald-400 leading-none">1,250</span>
            </div>
            <div className="h-7 w-7 bg-emerald-500 rounded flex items-center justify-center shadow-[0_0_10px_#10b981]">
              <span className="text-black font-bold text-xs">$</span>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT - Prend 100% de la largeur restante */}
        <main className="p-8 w-full flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}