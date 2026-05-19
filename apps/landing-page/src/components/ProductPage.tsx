import { productsData } from '../data/content';
import { motion, useScroll, useSpring, useTransform, AnimatePresence, useReducedMotion } from 'motion/react';
import { useState, useEffect } from 'react';
import MagneticButton from './ui/MagneticButton';
import { useTranslation } from '../hooks/useTranslation';
import SpotlightCard from './ui/SpotlightCard';
import CoreSimulator from './simulators/CoreSimulator';
import FeatureVisualizer from './simulators/FeatureVisualizer';
import KivoTemplateGallery from './kivo/KivoTemplateGallery';
import KivoMCPDemo from './kivo/KivoMCPDemo';
import AgentCard from './kivo/AgentCard';
import ComparisonTable from './kivo/ComparisonTable';

interface Props {
  slug?: string;
}

export default function ProductPage({ slug }: Props) {
  const { t, lang } = useTranslation();
  const productData = productsData.find((p) => p.id === slug || p.path.split('/').pop() === slug);
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // 52. Popups/Modais Cinéticos Avançados
  type ModalData = { id: string; title: string; description: string; icon: string; type: 'feature' | 'agent' };
  const [activeModal, setActiveModal] = useState<ModalData | null>(null);
  
  // 31. Profile State (Dual Experience)
  const [profile, setProfile] = useState<'ceo' | 'dev'>('ceo');

  useEffect(() => {
    const currentProfile = localStorage.getItem('kivo_profile') || 'ceo';
    setProfile(currentProfile as 'ceo' | 'dev');

    const handleProfileChange = (e: CustomEvent) => {
      setProfile(e.detail);
    };

    window.addEventListener('kivo_profile_change', handleProfileChange as EventListener);
    return () => window.removeEventListener('kivo_profile_change', handleProfileChange as EventListener);
  }, []);
  
  // 33. Botão Copy-to-Clipboard Mágico
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const snippet = productData.apiSnippet || { method: 'POST', endpoint: `/v1/${slug}/init`, body: '{"amount": 5000, "currency": "BRL"}' };
    navigator.clipboard.writeText(`curl -X ${snippet.method} https://api.kivo.com.br${snippet.endpoint} \\
  -H "Authorization: Bearer sk_test_123" \\
  -d '${snippet.body}'`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 25. Mouse Trail State
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // 47. Esqueletos de Carregamento (Skeletons)
  const [isSimulatingLoad, setIsSimulatingLoad] = useState(true);
  useEffect(() => {
    setIsSimulatingLoad(true);
    const timer = setTimeout(() => setIsSimulatingLoad(false), 600);
    return () => clearTimeout(timer);
  }, [slug]);

  // 49. Atalhos de Teclado (KBD Bindings)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (profile === 'dev' && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'c') {
        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
          e.preventDefault();
          handleCopy();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [profile, slug]);

  // 45. Redução de Movimento (Prefers-Reduced-Motion)
  const shouldReduceMotion = useReducedMotion();
  
  // 27. Hero Parallax (disabled if reduced motion)
  const yHeroText = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 300]);
  const yHeroBox = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 100]);

  if (!productData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-3xl mb-4">{t('product.not_found')}</h1>
          <a href="/" className="text-emerald-500 hover:underline">{t('product.back_to_home')}</a>
        </div>
      </div>
    );
  }

  const { color, icon, name, tagline, solution, features, aiAgents, forWhom, techDetails, faq } = productData;

  // Variável para shadow multi-camada no botão
  const premiumButtonShadow = `0 4px 14px 0 rgba(0,0,0,0.39), inset 0 1px 0 0 rgba(255,255,255,0.2), 0 0 20px 0 ${color}40`;

  return (
    <div className="min-h-screen bg-black overflow-hidden pb-32 relative">
      {/* 25. Mouse Trail (Rastro de Luz) */}
      <div 
        className={`fixed w-32 h-32 rounded-full pointer-events-none z-50 mix-blend-screen transition-transform duration-75 ease-linear ${shouldReduceMotion ? 'hidden' : ''}`}
        style={{ 
          transform: `translate(${mousePos.x - 64}px, ${mousePos.y - 64}px)`,
          background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
          filter: 'blur(10px)'
        }}
      />

      {/* 15. Holographic Noise Pattern Global */}
      <div className="fixed inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none z-40"></div>

      {/* 3. Scroll Spy Progress Bar */}
      <motion.div 
        className="fixed left-0 top-0 bottom-0 w-1 origin-top z-50 hidden xl:block" 
        style={{ scaleY, backgroundColor: color }} 
      />

      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[60vh] blur-[150px] opacity-20 pointer-events-none" style={{ backgroundColor: color }}></div>

      {/* Nav spacing & Hero */}
      <div className="relative pt-48 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* 2. Breadcrumbs Translúcidos (Moved here and removed fixed) */}
          <div className="hidden md:flex items-center gap-2 mb-12 text-xs font-medium text-white/40 tracking-wider">
            <a href="/" className="hover:text-white transition-colors">HOME</a>
            <span className="opacity-30">/</span>
            <a href="/#products" className="hover:text-white transition-colors">PRODUTOS</a>
            <span className="opacity-30">/</span>
            <span className="text-white" style={{ color }}>{name.toUpperCase()}</span>
          </div>
          {/* Back button for mobile */}
          <a href="/#products" className="md:hidden inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            <span className="text-sm">{t('product.back_to_products')}</span>
          </a>

          {/* Hero */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ y: yHeroText }}>
              {/* 9. Social Metrics / Proof & 19. Badge LIVE */}
              <div className="flex flex-col items-center md:items-start gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-2 py-1 rounded-full border border-white/10 bg-white/5 me-2">
                    <div className={`w-2 h-2 rounded-full ${shouldReduceMotion ? '' : 'animate-pulse'}`} style={{ backgroundColor: color }}></div>
                    <span className="text-[10px] font-bold tracking-widest text-white/80">LIVE</span>
                  </div>
                  
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-neutral-800 flex items-center justify-center overflow-hidden">
                        {/* 42. Dynamic Imports de Media (loading=lazy) */}
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" loading="lazy" className="w-full h-full object-cover opacity-80 grayscale hover:grayscale-0 transition-all duration-300" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-white/40 uppercase tracking-widest font-mono">
                  Trusted by <span className="text-white font-bold">10k+</span> ops
                </div>
              </div>

              {/* Product Badge (The Logo) */}
              <div className="flex justify-center md:justify-start mb-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5" style={{ boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 20px ${color}10` }}>
                  {/* @ts-ignore */}
                  <iconify-icon icon={icon} width="20" style={{ color }}></iconify-icon>
                  <span className="text-sm font-medium text-white/90">{name}</span>
                  {/* 36. Indicadores de Status da API */}
                  <AnimatePresence>
                    {profile === 'dev' && (
                      <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 0 }} exit={{ opacity: 0, width: 0 }} className="flex items-center gap-2 border-l border-white/20 ps-3 ms-1 overflow-hidden whitespace-nowrap">
                        <div className={`w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] ${shouldReduceMotion ? '' : 'animate-pulse'}`}></div>
                        <span className="text-xs font-mono text-emerald-400">API: 99.99%</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Hero Text & Buttons */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={profile}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex flex-col items-center md:items-start"
                >
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bricolage font-semibold text-white leading-tight mb-6 tracking-tighter text-center md:text-left">
                    {profile === 'dev' && slug === 'kivopay' ? "Infraestrutura financeira unificada via API." : tagline}
                  </h1>
                  <p className="text-xl text-white/70 leading-[1.8] max-w-xl font-light mb-8 text-center md:text-left">
                    {profile === 'dev' 
                      ? "Integre pagamentos, liquidação e contas escrow em minutos com nossa API RESTful. Sandboxes dedicados e webhooks em tempo real." 
                      : solution.description}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    {profile === 'dev' ? (
                      <MagneticButton className="w-full sm:w-auto px-6 py-3 rounded-full border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] font-medium transition-all flex items-center justify-center gap-2">
                        {/* @ts-ignore */}
                        <iconify-icon icon="solar:document-text-linear" width="20"></iconify-icon>
                        Documentação da API
                      </MagneticButton>
                    ) : (
                      <MagneticButton className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        Falar com Vendas
                      </MagneticButton>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Visual Abstract Box vs Terminal Mockup - Parallax Slower */}
            <motion.div 
              style={{ y: yHeroBox }}
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.8, delay: 0.2 }} 
              className="relative aspect-square md:aspect-auto md:h-[500px] rounded-[2.5rem] bg-gradient-to-br from-white/5 to-white/[0.01] border border-white/10 overflow-hidden flex items-center justify-center group"
            >
              <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay z-0"></div>
              
              <AnimatePresence mode="wait">
                {profile === 'dev' ? (
                  <motion.div
                    key="terminal"
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-4 rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-10 flex flex-col"
                  >
                    {/* MacOS Top Bar */}
                    <div className="h-10 bg-[#111] border-b border-white/5 flex items-center px-4 justify-between">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                      </div>
                      <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                        {slug}-init.sh
                      </div>
                      <button 
                        onClick={handleCopy}
                        className="text-white/40 hover:text-white transition-colors relative"
                        title="Copy to clipboard"
                      >
                        <AnimatePresence mode="wait">
                          {copied ? (
                            <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-emerald-400">
                              {/* @ts-ignore */}
                              <iconify-icon icon="solar:check-circle-linear" width="16"></iconify-icon>
                            </motion.div>
                          ) : (
                            <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                              {/* @ts-ignore */}
                              <iconify-icon icon="solar:copy-linear" width="16"></iconify-icon>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {/* 33. Magic Copy Glow */}
                        {copied && <div className="absolute inset-0 bg-emerald-400 blur-md animate-ping opacity-50"></div>}
                      </button>
                    </div>
                    {/* 34. Syntax Highlighting Profundo */}
                    <div className="p-6 font-mono text-sm leading-loose overflow-x-auto text-left relative flex-1">
                      <div className="text-white/30 absolute start-4 select-none flex flex-col items-end w-4">
                        <span>1</span><span>2</span><span>3</span><span>4</span>
                      </div>
                      <div className="ps-6">
                        {productData.apiSnippet ? (
                          <>
                            <div><span className="text-pink-500">curl</span> <span className="text-white/60">-X {productData.apiSnippet.method}</span> <span className="text-emerald-300">https://api.kivo.com.br{productData.apiSnippet.endpoint}</span> \</div>
                            <div><span className="text-white/60">-H</span> <span className="text-yellow-200">"Authorization: Bearer sk_test_123"</span> \</div>
                            <div><span className="text-white/60">-d</span> <span className="text-yellow-200">'{productData.apiSnippet.body}'</span></div>
                          </>
                        ) : (
                          <>
                            <div><span className="text-pink-500">curl</span> <span className="text-white/60">-X POST</span> <span className="text-emerald-300">https://api.kivo.com.br/v1/{slug}/init</span> \</div>
                            <div><span className="text-white/60">-H</span> <span className="text-yellow-200">"Authorization: Bearer sk_test_123"</span> \</div>
                            <div><span className="text-white/60">-d</span> <span className="text-yellow-200">'{'{'}"amount": 5000, "currency": "BRL"{'}'}'</span></div>
                          </>
                        )}
                      </div>
                      <div className="mt-8 border-t border-white/5 pt-4">
                        <div className="text-white/30 text-xs mb-2">// Response 200 OK</div>
                        <div className="text-emerald-400/80">
                          {'{'}<br/>
                          &nbsp;&nbsp;"status": "success",<br/>
                          &nbsp;&nbsp;"id": "txn_89xLp2"<br/>
                          {'}'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="visual"
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                  >
                    {/* Visualizer Decorations */}
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-1000 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at center, ${color} 1px, transparent 1px)`, backgroundSize: '24px 24px' }}></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#000_70%)] pointer-events-none"></div>

                    {/* Fixed Central Glow */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] opacity-30 pointer-events-none ${shouldReduceMotion ? '' : 'animate-pulse'}`} style={{ backgroundColor: color }}></div>
                    
                    {/* Fixed Central Icon Box */}
                    <div className={`relative w-32 h-32 rounded-3xl border border-white/20 bg-black/60 backdrop-blur-2xl flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-transform duration-700 ${shouldReduceMotion ? '' : 'group-hover:scale-110'}`}>
                      {/* @ts-ignore */}
                      <iconify-icon icon={icon} width="64" style={{ color }}></iconify-icon>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        {/* 4. Hero Bottom Fade */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
      </div>

      {/* Main Interactive Core Simulator Component */}
      <div className="w-full px-6 pb-24 relative z-10">
         <CoreSimulator slug={slug} color={color} />
      </div>

      {/* 5. SVG Geometric Divider */}
      <div className="w-full flex justify-center opacity-20 mb-8">
        <svg width="100%" height="2" viewBox="0 0 100 2" preserveAspectRatio="none">
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor={color} />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <rect width="100%" height="2" fill="url(#line-gradient)" />
        </svg>
      </div>

      {/* Integrated Features */}
      {features && features.length > 0 && (
        <div className="py-24 relative">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 flex items-end justify-between">
              <div>
                {/* 18. Dynamic Text Gradients */}
                <h2 className="text-3xl font-bricolage mb-4 tracking-tight" style={{ 
                  backgroundImage: `linear-gradient(to right, #ffffff, ${color}, #ffffff)`,
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  backgroundSize: '200% auto',
                  animation: 'shimmer 8s linear infinite'
                }}>
                  {t('product.integrated_features')}
                </h2>
                <p className="text-white/40">{t('product.capabilities_title')}</p>
              </div>
              
              {/* 8. Esvaziamento do Carga Cognitiva & 24. MagneticButton Expandido */}
              {features.length > 3 && (
                <div className="hidden md:block">
                  <MagneticButton 
                    onClick={() => setShowAllFeatures(!showAllFeatures)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-white/30 text-white/60 hover:text-white transition-all text-sm font-medium"
                  >
                    {showAllFeatures ? 'Mostrar Menos' : 'Ver Todas'}
                    {/* @ts-ignore */}
                    <iconify-icon icon={showAllFeatures ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} width="16"></iconify-icon>
                  </MagneticButton>
                </div>
              )}
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(showAllFeatures ? features : features.slice(0, 6)).map((feat, i) => (
                <motion.div key={feat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="h-full">
                  {/* 12. Inner Glow Borders */}
                  {isSimulatingLoad ? (
                    <SpotlightCard className="p-8 h-full bg-[#050505] border-white/5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/5 animate-pulse" style={{ backgroundColor: color + '10' }}></div>
                      <div className="w-12 h-12 rounded-xl bg-white/10 animate-pulse mb-6"></div>
                      <div className="w-3/4 h-6 bg-white/10 rounded animate-pulse mb-3"></div>
                      <div className="w-full h-4 bg-white/10 rounded animate-pulse mb-2"></div>
                      <div className="w-2/3 h-4 bg-white/10 rounded animate-pulse mb-6"></div>
                      <div className="w-24 h-6 bg-white/10 rounded-full animate-pulse"></div>
                    </SpotlightCard>
                  ) : (
                    <SpotlightCard className="p-8 h-full group bg-[#050505] border-white/5 hover:border-white/10 transition-colors relative overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/50 cursor-pointer" onClick={() => setActiveModal({ id: feat.id, title: feat.name, description: feat.description, icon: feat.icon, type: 'feature' })}>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ backgroundImage: `radial-gradient(circle at top right, ${color}15, transparent 70%)` }}></div>
                      <div className="relative z-10">
                        {/* 20. Isolamento de cor: icon começa grayscale e ganha cor */}
                        <div className="w-12 h-12 rounded-xl bg-[#0a0a0a] border border-white/5 flex items-center justify-center mb-6 text-white/60 group-hover:text-white transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                          {/* @ts-ignore */}
                          <iconify-icon icon={feat.icon} width="24" className="grayscale group-hover:grayscale-0 transition-all duration-500" style={{ color: 'inherit' }}></iconify-icon>
                        </div>
                        <h3 className="text-xl font-medium text-white mb-3 tracking-tight">{feat.name}</h3>
                        {/* 46. WCAG AAA */}
                        <p className="text-sm text-white/60 leading-[1.8] mb-6 font-light">
                          {/* 37. Glossário Dinâmico: Text scramble trick if dev mode */}
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={profile}
                              initial={{ opacity: 0, filter: "blur(4px)" }}
                              animate={{ opacity: 1, filter: "blur(0px)" }}
                              exit={{ opacity: 0, filter: "blur(4px)" }}
                              transition={{ duration: 0.3 }}
                            >
                              {feat.description}
                            </motion.span>
                          </AnimatePresence>
                        </p>
                        <div className="inline-block px-3 py-1 rounded-full bg-[#0a0a0a] border border-white/5 text-[10px] uppercase tracking-widest text-white/60 backdrop-blur-sm">
                          ex-{feat.originModule}
                        </div>
                      </div>
                    </SpotlightCard>
                  )}
                </motion.div>
              ))}
            </div>
            
            {/* Mobile View All Button */}
            {features.length > 3 && (
              <div className="mt-8 flex justify-center md:hidden">
                <button 
                  onClick={() => setShowAllFeatures(!showAllFeatures)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-white/10 bg-white/5 text-white/80 transition-all text-sm font-medium"
                >
                  {showAllFeatures ? 'Mostrar Menos' : 'Ver Todas Features'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Kivo-specific sections: Templates, MCP, Comparison */}
      {slug === 'kivopay' && (
        <>
          {/* Section 1: SDK M2M Templates Gallery */}
          <div className="py-32 border-t border-white/5 relative">
            <div className="max-w-6xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <h2 className="text-5xl lg:text-6xl font-bricolage font-bold text-white mb-6">
                  Ready-to-Use Templates
                </h2>
                <p className="text-xl text-white/60 max-w-3xl">
                  Start building M2M payment solutions with pre-configured templates. Each includes architecture diagrams, code examples, and real-world scenarios.
                </p>
              </motion.div>
              <KivoTemplateGallery />
            </div>
          </div>

          {/* Section 2: MCP for Autonomous Agents */}
          <div className="py-32 border-t border-white/5 relative">
            <div className="max-w-6xl mx-auto px-6">
              <KivoMCPDemo />
            </div>
          </div>

          {/* Section 3: Stellar vs Fiat Comparison */}
          <div className="py-32 border-t border-white/5 bg-white/[0.01] relative">
            <div className="max-w-6xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <h2 className="text-5xl lg:text-6xl font-bricolage font-bold text-white mb-6">
                  Why Stellar for M2M?
                </h2>
                <p className="text-xl text-white/60 max-w-3xl">
                  Traditional payment networks are built for humans. M2M needs different properties: instant settlement, zero intermediaries, atomic guarantees, and programmable conditions.
                </p>
              </motion.div>

              <ComparisonTable
                rows={[
                  {
                    label: 'Latency',
                    fiat: '24-48 hours',
                    stellar: '3-5 seconds'
                  },
                  {
                    label: 'Cost per transaction',
                    fiat: '$15-50',
                    stellar: '$0.00001'
                  },
                  {
                    label: 'Programmability',
                    fiat: 'None',
                    stellar: 'Full (Soroban)'
                  },
                  {
                    label: 'Intermediaries',
                    fiat: '4-7 (correspondent banks)',
                    stellar: '0 (peer-to-peer)'
                  },
                  {
                    label: 'Atomic guarantee',
                    fiat: 'No (clearing takes days)',
                    stellar: 'Yes (ledger finality)'
                  },
                  {
                    label: 'Payment conditions',
                    fiat: 'Not supported',
                    stellar: 'Supported (x402 protocol)'
                  }
                ]}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-16 p-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
              >
                <h3 className="text-2xl font-semibold text-white mb-6">Why Machines Care</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <span className="text-emerald-400">✓</span> Speed
                    </h4>
                    <p className="text-white/60 text-sm">
                      In 3-5 seconds, payment is final and irreversible. No clearing risk or settlement delays.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <span className="text-emerald-400">✓</span> Cost
                    </h4>
                    <p className="text-white/60 text-sm">
                      Micropayments become viable at $0.00001 per transaction instead of $15-50.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <span className="text-emerald-400">✓</span> Autonomy
                    </h4>
                    <p className="text-white/60 text-sm">
                      Machines transact without waiting for banks or intermediaries. True P2P settlement.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                      <span className="text-emerald-400">✓</span> Logic
                    </h4>
                    <p className="text-white/60 text-sm">
                      Conditional payments execute automatically when conditions are met. Smart contracts native.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}

      {/* AI Agents */}
      {aiAgents && aiAgents.length > 0 && (
        <div className="py-24 border-t border-white/5 relative">
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
              <h2 className="text-3xl font-bricolage text-white mb-4 tracking-tight">Agentes de IA</h2>
              <p className="text-white/40">Inteligência artificial nativa do produto.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {aiAgents.map((agent, i) => (
                <motion.div key={agent.id} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  {/* 17. Refrações Vidro Curvo */}
                  <SpotlightCard className="flex flex-col sm:flex-row gap-6 p-8 h-full rounded-[2rem] bg-white/[0.01] backdrop-blur-2xl border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] transition-shadow cursor-pointer" onClick={() => setActiveModal({ id: agent.id, title: agent.title, description: agent.description, icon: agent.icon, type: 'agent' })}>
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#030303] border border-white/10 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,1)] relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20" style={{ backgroundColor: color, filter: 'blur(10px)' }}></div>
                      {/* @ts-ignore */}
                      <iconify-icon icon={agent.icon} width="28" style={{ color }} className="relative z-10 drop-shadow-lg"></iconify-icon>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-white mb-3 tracking-tight">{agent.title}</h3>
                      <p className="text-white/40 leading-[1.8] text-sm font-light">{agent.description}</p>
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tech Details - Scrollytelling */}
      <div className="py-32 border-t border-white/5 bg-white/[0.01] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 relative items-start">
            
            {/* Sticky Left Column */}
            <motion.div 
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              viewport={{ once: true }} 
              className="md:w-1/3 md:sticky md:top-40"
            >
              <h2 className="text-4xl md:text-5xl font-bricolage text-white mb-6 leading-tight">{t('product.under_the_hood')}</h2>
              <p className="text-white/40 leading-relaxed text-lg">{techDetails.description}</p>
            </motion.div>

            {/* Scrolling Right Column */}
            <div className="md:w-2/3 flex flex-col gap-32 pt-8 md:pt-0">
              
              {/* Tech Points as Large Cards */}
              <div className="space-y-8">
                {techDetails.points.map((pt, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 40 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="p-8 md:p-10 rounded-[2rem] bg-[#050505] border border-white/5 glass-card relative overflow-hidden"
                  >
                    {/* Inner highlight */}
                    <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] pointer-events-none"></div>
                    
                    <div className="flex items-start gap-6 relative z-10">
                      {/* 16. Wireframes Iluminados (Subtle neon frame around number) */}
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-black shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] border" style={{ borderColor: `${color}40`, boxShadow: `0 0 20px ${color}20, inset 0 1px 2px rgba(255,255,255,0.1)` }}>
                        <span className="text-base font-mono font-bold" style={{ color }}>0{i + 1}</span>
                      </div>
                      <p className="text-white/80 leading-[1.8] text-lg font-light">{pt}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* For Whom target audience */}
              <div>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                  <h3 className="text-2xl font-bricolage text-white mb-8 border-b border-white/10 pb-4">{t('product.for_whom')}</h3>
                </motion.div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {forWhom.map((who, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      whileInView={{ opacity: 1, scale: 1 }} 
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="p-6 rounded-xl bg-[#0a0a0a] border border-white/5 text-white/60 text-sm hover:border-white/20 transition-colors flex items-center gap-3"
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></div>
                      {who}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-24 border-t border-white/5 mb-24 md:mb-0">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl font-bricolage text-white mb-4">{t('product.faq')}</h2>
          </motion.div>

          <div className="space-y-4">
            {faq.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.1 }} 
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-white font-medium group-hover:text-emerald-400 transition-colors">{item.question}</h4>
                    <motion.div animate={{ rotate: isOpen ? 45 : 0 }} className="text-white/20 group-hover:text-white/50 origin-center text-xl leading-none">
                      +
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="overflow-hidden"
                      >
                        <p className="text-white/40 text-sm leading-[1.8] font-light">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 10. Sticky Mobile CTA com Multi-layer Shadow (14) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full p-4 z-50">
        <div className="bg-[#050505]/90 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col">
            <span className="text-white font-medium text-sm tracking-tight">{name}</span>
            <span className="text-white/40 text-xs">Acessar sistema</span>
          </div>
          <button 
            className="px-6 py-2.5 rounded-xl text-black font-medium text-sm hover:scale-105 transition-all" 
            style={{ 
              backgroundColor: color,
              boxShadow: premiumButtonShadow
            }}
          >
            Entrar
          </button>
        </div>
      </div>

      {/* 51. & 52. Popups Cinéticos e Simuladores Animados */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setActiveModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
            >
              {/* Close Button */}
              <button onClick={() => setActiveModal(null)} className="absolute top-6 right-6 text-white/50 hover:text-white z-50 bg-black/50 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:close-circle-linear" width="24"></iconify-icon>
              </button>
              
              {/* Left: Content */}
              <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at top left, ${color}, transparent 60%)` }}></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                    {/* @ts-ignore */}
                    <iconify-icon icon={activeModal.icon} width="24" style={{ color }}></iconify-icon>
                  </div>
                  <div className="inline-block px-3 py-1 mb-4 rounded-full bg-white/[0.02] border border-white/5 text-[10px] uppercase tracking-widest text-white/40">
                    {activeModal.type === 'agent' ? 'Agente de Inteligência' : 'Feature Principal'}
                  </div>
                  <h2 className="text-3xl font-bricolage font-semibold text-white mb-4 leading-tight">{activeModal.title}</h2>
                  <p className="text-white/60 leading-[1.8] font-light">{activeModal.description}</p>
                </div>
              </div>
              
              {/* Right: Simulator */}
              <div className="flex-1 p-8 md:p-12 bg-black/50 relative flex flex-col items-center justify-center min-h-[300px]">
                 <FeatureVisualizer id={activeModal.id} type={activeModal.type} icon={activeModal.icon} color={color} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
