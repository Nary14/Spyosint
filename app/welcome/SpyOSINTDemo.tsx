// SpyOSINT — Exemple d'utilisation des animations
// import './spyosint-animations.css' dans ce fichier ou dans ton _app.tsx

import './spyosint-animations.css'

export default function SpyOSINTDemo() {
  return (
    // 1. SCANLINES + BEAM SWEEP sur le wrapper principal
    <div className="scanlines beam-sweep" style={{ background: 'var(--bg-dark)', minHeight: '100vh', padding: '24px', position: 'relative' }}>

      {/* GRID de fond */}
      <div className="hud-grid" />

      {/* 4. FLICKER sur le logo */}
      <h1 className="anim-flicker anim-glow-cyan" style={{ fontFamily: 'monospace', letterSpacing: '4px', color: 'var(--neon-cyan)' }}>
        SPY<span style={{ color: 'var(--neon-green)' }}>OSINT</span>
      </h1>

      {/* 5. GLITCH double couche */}
      <h2
        className="anim-glitch-full"
        data-text="TARGET LOCKED"
        style={{ color: 'var(--neon-red)', fontFamily: 'monospace', marginTop: '16px' }}
      >
        TARGET LOCKED
      </h2>

      {/* 7. STATUS DOTS */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '16px', fontFamily: 'monospace', fontSize: '11px', color: 'var(--neon-cyan)' }}>
        <span className="status-dot dot-green" /> SYS ONLINE
        <span className="status-dot dot-amber" /> VPN ACTIVE
        <span className="status-dot dot-red" />   TARGET LOCKED
      </div>

      {/* 8. BADGE BLINK */}
      <div
        className="anim-badge-blink"
        style={{ marginTop: '16px', display: 'inline-block', border: '1px solid var(--neon-red)', color: 'var(--neon-red)', padding: '2px 10px', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '2px' }}
      >
        ⚠ SURVEILLANCE ACTIVE
      </div>

      {/* 9. PANEL TOP LINE GLOW */}
      <div
        className="panel-glow-top neon-border"
        style={{ marginTop: '24px', background: 'var(--bg-panel)', padding: '16px' }}
      >

        {/* 16. AVATAR SCAN */}
        <div className="avatar-scan" style={{ width: '64px', height: '64px', border: '1px solid var(--neon-cyan)', background: 'var(--bg-card)', marginBottom: '12px' }}>
          <span style={{ fontSize: '28px', display: 'block', textAlign: 'center', lineHeight: '64px' }}>👤</span>
        </div>

        {/* 12. SIGNAL BARS */}
        <div className="signal-bars" style={{ marginBottom: '12px' }}>
          <span /><span /><span /><span /><span />
        </div>

        {/* 14. SCAN PROGRESS */}
        <div className="scan-progress">
          <div className="scan-fill" />
        </div>
      </div>

      {/* 10. RADAR */}
      <div className="radar" style={{ marginTop: '24px' }}>
        <div className="radar-ring" />
        <div className="radar-ring" />
        <div className="radar-ring" />
        <div className="radar-sweep" />
        <span className="radar-blip" style={{ top: '20px', left: '45px' }} />
        <span className="radar-blip" style={{ top: '45px', left: '18px', animationDelay: '1s' }} />
      </div>

      {/* 11. MAP MARKERS */}
      <div style={{ position: 'relative', width: '300px', height: '100px', background: 'var(--bg-card)', marginTop: '24px' }}>
        <div className="map-marker marker-cyan" style={{ top: '40px', left: '80px' }} />
        <div className="map-marker marker-red"  style={{ top: '35px', left: '180px' }} />
      </div>

      {/* 13. TERMINAL LINES (stagger via animationDelay) */}
      <div style={{ marginTop: '24px', background: 'var(--bg-panel)', padding: '12px', fontFamily: 'monospace' }}>
        {[
          { text: '> INIT OSINT SCAN [TARGET: GHOST_X]', cls: 'term-green' },
          { text: '> QUERYING SHODAN API...',             cls: 'term-cyan'  },
          { text: '✓ 3 OPEN PORTS DETECTED',              cls: 'term-green' },
          { text: '⚠ EMAIL FOUND IN 2 LEAKS',             cls: 'term-amber' },
          { text: '⚠ VPN DETECTED (NL EXIT)',              cls: 'term-red'   },
        ].map((line, i) => (
          <p
            key={i}
            className={`term-line ${line.cls}`}
            style={{ animationDelay: `${i * 0.8}s` }}
          >
            {line.text}
          </p>
        ))}
        <span className="term-cursor" />
      </div>

      {/* 19. TYPEWRITER */}
      <p
        className="typewriter"
        style={{ '--chars': 22, marginTop: '16px', color: 'var(--neon-cyan)', fontFamily: 'monospace' } as React.CSSProperties}
      >
        ANALYZING TARGET DATA...
      </p>

      {/* 17. INTEL CARDS avec hover */}
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {['SOCIAL MEDIA', 'EMAIL TRACE', 'IP ANALYSIS'].map((label) => (
          <div
            key={label}
            className="intel-card neon-border"
            style={{ padding: '8px 14px', background: 'var(--bg-panel)', fontFamily: 'monospace', fontSize: '10px', color: 'var(--neon-cyan)', letterSpacing: '2px' }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* 18. STAGGER FADE IN */}
      {['MODULE A', 'MODULE B', 'MODULE C'].map((m, i) => (
        <div
          key={m}
          className="fade-in"
          style={{ animationDelay: `${i * 0.2}s`, marginTop: '8px', color: 'var(--neon-green)', fontFamily: 'monospace', fontSize: '11px' }}
        >
          ▶ {m} LOADED
        </div>
      ))}

      {/* 15. MARQUEE */}
      <div className="marquee-wrap" style={{ marginTop: '24px', borderTop: '1px solid var(--border-glow)', paddingTop: '8px' }}>
        <span className="marquee-inner">
          SCANNING OSINT SOURCES... ANALYZING METADATA... CROSS-REFERENCING DB... GEOLOCATION MATCH FOUND... REPORT READY...
        </span>
      </div>

    </div>
  )
}
