"use client";

import React, { useEffect, useRef, useState } from 'react';
import './spyosint-animations.css'; // On importe tes 20 animations

interface LogEntry {
  text: string;
  type: 'info' | 'warn' | 'error' | 'success';
}

interface TerminalLoggerProps {
  logs: LogEntry[];
}

export default function TerminalLogger({ logs }: TerminalLoggerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
useEffect(() => setIsMounted(true), []);


  // Auto-scroll vers le bas à chaque nouveau log
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getTypeClass = (type: string) => {
    switch (type) {
      case 'success': return 'term-green';
      case 'warn': return 'term-amber';
      case 'error': return 'term-red';
      default: return 'term-cyan';
    }
  };

  return (
    <div className="neon-border panel-glow-top" style={{ 
      background: 'rgba(5, 15, 21, 0.85)', 
      padding: '15px', 
      fontFamily: 'monospace',
      height: '300px',
      overflowY: 'auto',
      position: 'relative'
    }} ref={scrollRef}>
      
      {/* Petit header de terminal */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '10px', 
        fontSize: '10px', 
        color: 'var(--neon-cyan)',
        borderBottom: '1px solid var(--grid-line)',
        paddingBottom: '5px'
      }}>
        <span>SYSTEM_LOG_MONITOR</span>
        <span className="anim-badge-blink">LIVE_FEED</span>
      </div>

      {/* Affichage des logs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {logs.map((log, i) => (
          <p
            key={i}
            className={`term-line ${getTypeClass(log.type)}`}
            style={{ animationDelay: '0.1s' }} // On réduit le délai car les logs arrivent déjà un par un
          >
            <span style={{ opacity: 0.5 }}>
              [{isMounted ? new Date().toLocaleTimeString() : '--:--:--'}]
            </span> {log.text}
          </p>
        ))}
        
        {/* Curseur final clignotant */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
          <span className="term-green" style={{ marginRight: '8px' }}>&gt;_</span>
          <span className="term-cursor" />
        </div>
      </div>
    </div>
  );
}