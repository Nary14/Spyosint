'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X , Eye} from 'lucide-react';
import './spyosint-animations.css';
import TerminalLogger from './TerminalLogger';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [animateHero, setAnimateHero] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([
    { text: ">>> SpyOSINT SYSTEM READY. STANDBY FOR UPLINK...", type: 'info' as const},
  ]);
  
  const [mounted, setMounted] = useState(false);

  const { ref: featuresRef, isVisible: featuresVisible } = useIntersectionObserver();
  const { ref: aboutRef, isVisible: aboutVisible } = useIntersectionObserver();
  const { ref: ctaRef, isVisible: ctaVisible } = useIntersectionObserver();

  useEffect(() => {
    setMounted(true);
    setAnimateHero(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    const tasks = [
      { t: "Bypassing Firewall...", ty: 'warn', d: 2000 },
      { t: "Connection Established: NODE_ALPHA", ty: 'success', d: 4000 },
      { t: "Injecting OSINT Crawler...", ty: 'info', d: 5500 },
    ];
    tasks.forEach(task => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, { text: task.t, type: task.ty as any }]);
      }, task.d);
    });
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCommencer = () => router.push('/auth');
  const blobAnimationDelays = ['0s', '0.7s', '1.4s', '0.35s', '1.05s'];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden">
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'border-b border-slate-800 bg-slate-950/95 backdrop-blur-md' : 'border-b border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/')}>
            <div className="relative flex items-center justify-center w-9 h-9 transform group-hover:scale-110 transition-transform duration-300">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md animate-pulse"></div>

              {/* oeil icon */}
              <Eye
                size={28}
                className="text-blue-400 animate-eye-blink relative z-10"
                strokeWidth={2}
              />
              </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent">SpyOSINT</h1>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-slate-400 hover:text-blue-400 transition-colors duration-300">Fonctionnalités</a>
            <a href="#about" className="text-slate-400 hover:text-blue-400 transition-colors duration-300">À propos</a>
            <Button onClick={handleCommencer} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50">
              Connexion
            </Button>
          </div>
          <button className="md:hidden p-2 hover:bg-slate-900 rounded-lg transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900/50 backdrop-blur-md animate-slide-down">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-slate-400 hover:text-blue-400 py-2 transition-colors">Fonctionnalités</a>
              <a href="#about" className="block text-slate-400 hover:text-blue-400 py-2 transition-colors">À propos</a>
              <Button onClick={handleCommencer} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white">Connexion</Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 md:py-0">
        <div className="absolute inset-0 -z-10">
          {[
            { top: '20px', left: '40px', size: 72, color: 'blue', delay: blobAnimationDelays[0] },
            { top: 'auto', bottom: '20px', right: '40px', size: 72, color: 'blue', delay: blobAnimationDelays[1] },
            { top: '50%', left: '50%', size: 96, color: 'slate', delay: 'null' },
            { top: '80px', right: '80px', size: 56, color: 'blue', delay: blobAnimationDelays[2], opacity: '15' },
            { bottom: '100px', left: '20%', size: 64, color: 'blue', delay: blobAnimationDelays[3], opacity: '15' },
          ].map((blob, idx) => (
            <div
              key={idx}
              className={`absolute rounded-full blur-3xl ${blob.color === 'blue' ? 'bg-blue-500' : blob.color === 'blue' ? 'bg-blue-500' : 'bg-slate-900'} animate-float`}
              style={{
                width: `${blob.size * 4}px`, height: `${blob.size * 4}px`,
                top: blob.top || 'auto', bottom: blob.bottom || 'auto',
                left: blob.left || 'auto', right: blob.right || 'auto',
                opacity: blob.opacity ? `0.${blob.opacity}` : blob.color === 'slate' ? '0.5' : '0.2',
                animationDelay: blob.delay || '0s',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-0 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className={`space-y-8 ${animateHero ? 'animate-slide-up' : 'opacity-0'}`}>
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
                <span className="text-blue-400 font-semibold text-sm">Intelligence Collective</span>
              </div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-balance leading-tight">
                Bienvenue sur{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-400 to-blue-400 animate-pulse-scale">SpyOSINT</span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-400 text-balance font-light">Plateforme de renseignement et d'investigation en sources ouvertes</p>
            </div>
            <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
              Découvrez la puissance de l'investigation en sources ouvertes. SpyOSINT vous permet de collecter, analyser et visualiser des données publiques pour obtenir des insights pertinents et actionnables.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={handleCommencer} className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 active:scale-95">
                <span className="flex items-center gap-2">Commencer<span className="group-hover:translate-x-1 transition-transform">→</span></span>
              </Button>
              <Button className="group border border-slate-700 hover:bg-slate-900 text-slate-50 font-semibold py-3 px-8 rounded-lg text-lg bg-transparent transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20" variant="outline">
                <span className="flex items-center gap-2">En savoir plus<span className="group-hover:rotate-45 transition-transform">✦</span></span>
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800">
              {[{ value: '500K+', label: 'Données' }, { value: '24/7', label: 'Monitoring' }, { value: '99.9%', label: 'Uptime' }].map((stat, idx) => (
                <div key={idx} className="text-center group hover:animate-bounce-soft transition-all duration-300">
                  <div className="text-2xl md:text-3xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">{stat.value}</div>
                  <div className="text-xs md:text-sm text-slate-500 group-hover:text-slate-400 transition-colors">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual*/}
          <div className={`relative hidden md:block ${animateHero ? 'animate-slide-down' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-500/20 rounded-2xl blur-3xl animate-glow"></div>
            <div className="relative rounded-2xl overflow-hidden" style={{ height: '650px' }}>
              {mounted ? (
                /* @ts-ignore */
                <spline-viewer
                  url="https://prod.spline.design/lxRe1qvW635C1TAA/scene.splinecode"
                  style={{ width: '140%', height: '140%' , marginLeft: '-10%', marginTop: '-20%', transform: 'scale(0.7)', transformOrigin: 'center'}}
                />
              ) : (
                <div className="w-full h-full bg-slate-900/50 flex items-center justify-center">
                   <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className={`py-20 md:py-32 border-t border-slate-800 transition-opacity duration-1000 ${featuresVisible ? 'opacity-100' : 'opacity-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-4">
              <span className="text-blue-400 font-semibold text-sm">Nos Fonctionnalités</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-balance mb-4">Pourquoi choisir SPYOSINT ?</h3>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Des outils puissants conçus pour les enquêteurs modernes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: 'Recherche avancée', description: 'Accédez à des outils de recherche sophistiqués pour explorer les sources publiques.', color: 'from-blue-500/20 to-blue-600/10', hoverColor: 'hover:from-blue-500/30 hover:to-blue-600/20' },
              { title: 'Analyse en temps réel', description: "Analysez les données à mesure qu'elles se mettent à jour et détectez les tendances.", color: 'from-blue-500/20 to-blue-600/10', hoverColor: 'hover:from-blue-500/30 hover:to-blue-600/20' },
              { title: 'Interface intuitive', description: 'Une plateforme conçue pour être facile à utiliser, même pour les débutants.', color: 'from-purple-500/20 to-purple-600/10', hoverColor: 'hover:from-purple-500/30 hover:to-purple-600/20' },
              { title: 'Visualisation avancée', description: 'Transformez les données complexes en graphiques compréhensibles.', color: 'from-cyan-500/20 to-cyan-600/10', hoverColor: 'hover:from-cyan-500/30 hover:to-cyan-600/20' },
              { title: 'Alertes personnalisées', description: 'Recevez des notifications instantanées pour les informations importantes.', color: 'from-orange-500/20 to-orange-600/10', hoverColor: 'hover:from-orange-500/30 hover:to-orange-600/20' },
              { title: 'Intégrations robustes', description: 'Connectez vos outils préférés et automatisez vos workflows.', color: 'from-pink-500/20 to-pink-600/10', hoverColor: 'hover:from-pink-500/30 hover:to-pink-600/20' },
            ].map((feature, idx) => (
              <div key={idx} className={`group bg-gradient-to-br ${feature.color} ${feature.hoverColor} border border-slate-800 hover:border-slate-700 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50 hover:translate-y-[-4px] cursor-pointer ${featuresVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: featuresVisible ? `${idx * 0.1}s` : '0s' }}>

                <h4 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">{feature.title}</h4>
                <p className="text-slate-400 group-hover:text-slate-300 transition-colors">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" ref={aboutRef} className={`py-20 md:py-32 border-t border-slate-800 transition-opacity duration-1000 ${aboutVisible ? 'opacity-100' : 'opacity-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className={`space-y-6 ${aboutVisible ? 'animate-slide-up' : 'opacity-0'}`}>
              <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full">
                <span className="text-blue-400 font-semibold text-sm">À Propos</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-balance">Transformez l'information en intelligence</h3>
              <p className="text-lg text-slate-400 leading-relaxed">SPYOSINT est la plateforme de référence pour les professionnels du renseignement en sources ouvertes. Créée pour les enquêteurs modernes, elle combine puissance analytique et simplicité d'utilisation.</p>
              <ul className="space-y-3">
                {['Sécurité renforcée', 'Données en temps réel', 'Support 24/7'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-all duration-300 group cursor-pointer">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:scale-150 transition-transform"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className={`relative hidden md:block ${aboutVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              {/* Lueur d'ambiance bleue en fond */}
              <div className="absolute inset-0 bg-blue-500/5 rounded-2xl blur-3xl"></div>
  
              <div className="relative space-y-4">
                {/* ON INJECTE TON TERMINAL ICI */}
                <TerminalLogger logs={terminalLogs} />

                {/* Panneau de stats rapide (en utilisant tes classes CSS) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="neon-border bg-slate-900/80 p-3 backdrop-blur-md">
                    <p className="text-[9px] text-slate-500 font-mono mb-1">CRAWLER_SPEED</p>
                    <div className="scan-progress h-[2px]">
                      <div className="scan-fill" style={{ animationDuration: '1.5s' }} />
                    </div>
                  </div>
                  <div className="neon-border bg-slate-900/80 p-3 backdrop-blur-md flex justify-between items-center">
                    <span className="text-[9px] text-slate-500 font-mono">STATUS</span>
                    <span className="anim-flicker text-blue-400 text-[10px] font-bold">SECURE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className={`py-20 md:py-32 border-t border-slate-800 transition-opacity duration-1000 ${ctaVisible ? 'opacity-100' : 'opacity-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`group bg-gradient-to-r from-blue-500/10 via-slate-900/50 to-blue-500/10 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-8 md:p-16 text-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 relative overflow-hidden ${ctaVisible ? 'animate-slide-up' : 'opacity-0'}`}>
            <h3 className="text-3xl md:text-5xl font-bold mb-4 text-balance text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-400">Prêt à commencer votre investigation ?</h3>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">Créez un compte SpyOSINT et commencez à explorer les sources ouvertes dès maintenant. C'est gratuit et facile à mettre en place.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleCommencer} className="group/btn bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-10 rounded-lg text-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105 active:scale-95">
                <span className="flex items-center gap-2 justify-center">S'inscrire maintenant<span className="group-hover/btn:translate-x-1 transition-transform">→</span></span>
              </Button>
              <Button className="group/btn border border-slate-700 hover:border-blue-500/50 text-slate-50 font-semibold py-3 px-10 rounded-lg text-lg bg-transparent transition-all duration-300 hover:bg-slate-900/50" variant="outline">
                Voir la démo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-gradient-to-t from-slate-900/50 to-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex items-center justify-center w-6 h-6 transform group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md animate-pulse"></div>

                  {/* oeil icon */}
                  <Eye
                    size={28}
                    className="text-blue-400 animate-eye-blink relative z-10"
                    strokeWidth={2}
                  />
                </div>
                <span className="text-lg font-bold">SpyOSINT</span>
              </div>
              <p className="text-sm text-slate-500">Intelligence en sources ouvertes</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-slate-300">Produit</h4>
              <ul className="space-y-2 text-sm">{['Fonctionnalités', 'Tarifs', 'Documentation'].map((link) => (<li key={link}><a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">{link}</a></li>))}</ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-slate-300">Entreprise</h4>
              <ul className="space-y-2 text-sm">{['À propos', 'Blog', 'Carrières'].map((link) => (<li key={link}><a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">{link}</a></li>))}</ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-slate-300">Légal</h4>
              <ul className="space-y-2 text-sm">{['Confidentialité', 'Conditions', 'Cookies'].map((link) => (<li key={link}><a href="#" className="text-slate-500 hover:text-blue-400 transition-colors">{link}</a></li>))}</ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-slate-500">© 2026 SpyOSINT. Tous droits réservés.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              {['Twitter', 'GitHub', 'LinkedIn'].map((social) => (<a key={social} href="https://github.com/Nary14" className="text-slate-500 hover:text-blue-400 transition-colors text-sm">{social}</a>))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}