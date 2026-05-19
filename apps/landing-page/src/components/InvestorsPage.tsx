import { useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

export default function InvestorsPage() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-32 relative z-0">
      <div className="fixed inset-0 z-[-1] bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial_gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>
      
      <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up text-center">
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-sm uppercase tracking-widest">
          {/* @ts-ignore */}
          <iconify-icon icon="solar:chart-square-linear"></iconify-icon>
          {t('investors.hero.badge')}
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bricolage font-medium text-white mb-6 leading-tight max-w-4xl mx-auto">
          {t('investors.hero.title')}
        </h1>
        <p className="text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
          {t('investors.hero.subtitle')}
        </p>
      </section>

      <section className="px-6 max-w-6xl mx-auto mb-32 gs-fade-up">
        <h2 className="text-3xl md:text-5xl font-bricolage text-center text-white mb-16">
          {t('investors.thesis.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-2xl mb-6 text-white/80">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:chart-square-linear"></iconify-icon>
            </div>
            <h3 className="text-xl text-white font-medium mb-4">{t('investors.thesis.market.title')}</h3>
            <p className="text-white/60 leading-relaxed">
              {t('investors.thesis.market.desc')}
            </p>
          </div>

          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-2xl mb-6 text-white/80">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:settings-linear"></iconify-icon>
            </div>
            <h3 className="text-xl text-white font-medium mb-4">{t('investors.thesis.product.title')}</h3>
            <p className="text-white/60 leading-relaxed">
              {t('investors.thesis.product.desc')}
            </p>
          </div>

          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-2xl mb-6 text-white/80">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:wad-of-money-linear"></iconify-icon>
            </div>
            <h3 className="text-xl text-white font-medium mb-4">{t('investors.thesis.model.title')}</h3>
            <p className="text-white/60 leading-relaxed">
              {t('investors.thesis.model.desc')}
            </p>
          </div>

          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-2xl mb-6 text-white/80">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:rocket-linear"></iconify-icon>
            </div>
            <h3 className="text-xl text-white font-medium mb-4">{t('investors.thesis.traction.title')}</h3>
            <p className="text-white/60 leading-relaxed">
              {t('investors.thesis.traction.desc')}
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 max-w-6xl mx-auto mb-32 gs-fade-up">
        <h2 className="text-3xl md:text-5xl font-bricolage text-center text-white mb-16">
          {t('investors.opportunity.title')}
        </h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 p-8 bg-neutral-900 border border-white/5 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full group-hover:bg-blue-500/20 transition-colors"></div>
            <p className="text-white/40 font-mono text-sm uppercase tracking-widest mb-4">{t('investors.opportunity.tam.title')}</p>
            <h3 className="text-5xl md:text-6xl font-medium text-white mb-4">US$ 120T<span className="text-2xl text-white/50">/ano</span></h3>
            <p className="text-white/60">{t('investors.opportunity.tam.desc')}</p>
          </div>
          <div className="flex-1 p-8 bg-neutral-900 border border-white/5 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full group-hover:bg-emerald-500/20 transition-colors"></div>
            <p className="text-white/40 font-mono text-sm uppercase tracking-widest mb-4">{t('investors.opportunity.sam.title')}</p>
            <h3 className="text-5xl md:text-6xl font-medium text-white mb-4">US$ 860B<span className="text-2xl text-white/50">/ano</span></h3>
            <p className="text-white/60">{t('investors.opportunity.sam.desc')}</p>
          </div>
          <div className="flex-1 p-8 bg-neutral-900 border border-white/5 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full group-hover:bg-purple-500/20 transition-colors"></div>
            <p className="text-white/40 font-mono text-sm uppercase tracking-widest mb-4">{t('investors.opportunity.som.title')}</p>
            <h3 className="text-5xl md:text-6xl font-medium text-white mb-4">US$ 25B<span className="text-2xl text-white/50">/ano</span></h3>
            <p className="text-white/60">{t('investors.opportunity.som.desc')}</p>
          </div>
        </div>
      </section>

      <section className="px-6 max-w-6xl mx-auto mb-32 gs-fade-up">
        <h2 className="text-3xl md:text-5xl font-bricolage text-center text-white mb-16">
          {t('investors.monetization.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 font-medium text-xl">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:sale-linear"></iconify-icon>
            </div>
            <h4 className="text-xl font-medium text-white mb-3">{t('investors.monetization.fee.title')}</h4>
            <p className="text-emerald-400 font-mono font-bold text-lg mb-4">0.1% a 0.5%</p>
            <p className="text-white/60 text-sm leading-relaxed">{t('investors.monetization.fee.desc')}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 font-medium text-xl">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:server-linear"></iconify-icon>
            </div>
            <h4 className="text-xl font-medium text-white mb-3">{t('investors.monetization.saas.title')}</h4>
            <p className="text-emerald-400 font-mono font-bold text-lg mb-4">US$ 150 - 5.000/mês</p>
            <p className="text-white/60 text-sm leading-relaxed">{t('investors.monetization.saas.desc')}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 font-medium text-xl">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:box-linear"></iconify-icon>
            </div>
            <h4 className="text-xl font-medium text-white mb-3">{t('investors.monetization.hardware.title')}</h4>
            <p className="text-emerald-400 font-mono font-bold text-lg mb-4">Terminal + MDR</p>
            <p className="text-white/60 text-sm leading-relaxed">{t('investors.monetization.hardware.desc')}</p>
          </div>
        </div>
      </section>

      <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up">
        <h2 className="text-3xl md:text-5xl font-bricolage text-center text-white mb-16">
          {t('investors.roadmap.title')}
        </h2>
        
        <div className="flex flex-col gap-4 relative">
          <div className="absolute left-6 md:left-[50%] top-0 bottom-0 w-px bg-white/10"></div>
          
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center group">
            <div className="md:text-right pr-12 order-2 md:order-1 hidden md:block">
              <span className="text-emerald-500 font-mono tracking-widest text-sm uppercase">{t('investors.roadmap.now.label')}</span>
            </div>
            <div className="absolute left-6 md:left-[50%] w-3 h-3 -translate-x-1.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10"></div>
            <div className="pl-16 md:pl-12 order-1 md:order-2">
              <span className="text-emerald-500 font-mono tracking-widest text-sm uppercase md:hidden block mb-2">{t('investors.roadmap.now.label_mobile')}</span>
              <h4 className="text-xl text-white font-medium mb-2">{t('investors.roadmap.now.title')}</h4>
              <p className="text-white/50">{t('investors.roadmap.now.desc')}</p>
            </div>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-8">
            <div className="md:text-right pr-12 order-2 md:order-1 hidden md:block">
              <span className="text-white/40 font-mono tracking-widest text-sm uppercase">{t('investors.roadmap.phase1.label')}</span>
            </div>
            <div className="absolute left-6 md:left-[50%] w-3 h-3 -translate-x-1.5 rounded-full bg-white/20 z-10"></div>
            <div className="pl-16 md:pl-12 order-1 md:order-2">
              <span className="text-white/40 font-mono tracking-widest text-sm uppercase md:hidden block mb-2">{t('investors.roadmap.phase1.label_mobile')}</span>
              <h4 className="text-xl text-white font-medium mb-2">{t('investors.roadmap.phase1.title')}</h4>
              <p className="text-white/50">{t('investors.roadmap.phase1.desc')}</p>
            </div>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-8">
            <div className="md:text-right pr-12 order-2 md:order-1 hidden md:block">
              <span className="text-white/40 font-mono tracking-widest text-sm uppercase">{t('investors.roadmap.phase2.label')}</span>
            </div>
            <div className="absolute left-6 md:left-[50%] w-3 h-3 -translate-x-1.5 rounded-full bg-white/20 z-10"></div>
            <div className="pl-16 md:pl-12 order-1 md:order-2">
              <span className="text-white/40 font-mono tracking-widest text-sm uppercase md:hidden block mb-2">{t('investors.roadmap.phase2.label_mobile')}</span>
              <h4 className="text-xl text-white font-medium mb-2">{t('investors.roadmap.phase2.title')}</h4>
              <p className="text-white/50">{t('investors.roadmap.phase2.desc')}</p>
            </div>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-8">
            <div className="md:text-right pr-12 order-2 md:order-1 hidden md:block">
              <span className="text-white/40 font-mono tracking-widest text-sm uppercase">{t('investors.roadmap.phase3.label')}</span>
            </div>
            <div className="absolute left-6 md:left-[50%] w-3 h-3 -translate-x-1.5 rounded-full bg-white/20 z-10"></div>
            <div className="pl-16 md:pl-12 order-1 md:order-2">
              <span className="text-white/40 font-mono tracking-widest text-sm uppercase md:hidden block mb-2">{t('investors.roadmap.phase3.label_mobile')}</span>
              <h4 className="text-xl text-white font-medium mb-2">{t('investors.roadmap.phase3.title')}</h4>
              <p className="text-white/50">{t('investors.roadmap.phase3.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 max-w-6xl mx-auto mb-32 gs-fade-up">
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bricolage text-white mb-6">
              {t('investors.team.title')}
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-6">
              {t('investors.team.desc')}
            </p>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3 text-white/80">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> {t('investors.team.contractease')}
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div> {t('investors.team.onyx')}
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div> {t('investors.team.quilovolt')}
              </li>
              <li className="flex items-center gap-3 text-white/80">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div> {t('investors.team.saude360')}
              </li>
            </ul>
            <p className="text-white/60 text-lg leading-relaxed mt-6">
              {t('investors.team.interop_desc')}
            </p>
          </div>
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
            <div className="aspect-square bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center p-6 text-center">
              <div className="text-4xl mb-3 border border-white/20 w-16 h-16 rounded-full flex items-center justify-center text-white/80">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:code-circle-linear" width="32"></iconify-icon>
              </div>
              <p className="text-white font-medium">{t('investors.team.engineering')}</p>
              <p className="text-white/40 text-xs mt-1">{t('investors.team.engineering_desc')}</p>
            </div>
            <div className="aspect-square bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center p-6 text-center">
              <div className="text-4xl mb-3 border border-white/20 w-16 h-16 rounded-full flex items-center justify-center text-white/80">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:case-linear" width="32"></iconify-icon>
              </div>
              <p className="text-white font-medium">{t('investors.team.business')}</p>
              <p className="text-white/40 text-xs mt-1">{t('investors.team.business_desc')}</p>
            </div>
            <div className="aspect-square bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center p-6 text-center">
              <div className="text-4xl mb-3 border border-white/20 w-16 h-16 rounded-full flex items-center justify-center text-white/80">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:target-linear" width="32"></iconify-icon>
              </div>
              <p className="text-white font-medium">{t('investors.team.gtm')}</p>
              <p className="text-white/40 text-xs mt-1">{t('investors.team.gtm_desc')}</p>
            </div>
            <div className="aspect-square bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center justify-center p-6 text-center">
              <div className="text-4xl mb-3 border border-white/20 w-16 h-16 rounded-full flex items-center justify-center text-white/80">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:cup-first-linear" width="32"></iconify-icon>
              </div>
              <p className="text-white font-medium">{t('investors.team.traction')}</p>
              <p className="text-white/40 text-xs mt-1">{t('investors.team.traction_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 max-w-6xl mx-auto mb-32 gs-fade-up">
        <h2 className="text-3xl md:text-5xl font-bricolage text-center text-white mb-16">
          {t('investors.ask.title')} <span className="text-white/30">{t('investors.ask.seed_round')}</span>
        </h2>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/3">
              <h3 className="text-5xl md:text-7xl font-medium text-white mb-2">{t('investors.ask.funding')}</h3>
              <p className="text-emerald-400 font-mono uppercase tracking-widest text-sm mb-6">{t('investors.ask.funding_meta')}</p>
              <p className="text-white/80 leading-relaxed mb-6">{t('investors.ask.desc')}</p>
              <div className="inline-flex items-center gap-2 text-white/50 text-sm font-mono bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                {t('investors.ask.safe_equity')}
              </div>
            </div>
            <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/40 backdrop-blur border border-white/10 p-6 rounded-2xl md:col-span-2 lg:col-span-1">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-medium">{t('investors.ask.alloc_eng')}</span>
                  <span className="text-emerald-400 font-mono font-bold">40%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-3">
                  <div className="bg-emerald-500 w-[40%] h-full"></div>
                </div>
                <p className="text-white/50 text-sm">{t('investors.ask.alloc_eng_desc')}</p>
              </div>
              <div className="bg-black/40 backdrop-blur border border-white/10 p-6 rounded-2xl md:col-span-2 lg:col-span-1">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-medium">{t('investors.ask.alloc_legal')}</span>
                  <span className="text-emerald-400 font-mono font-bold">25%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-3">
                  <div className="bg-emerald-500 w-[25%] h-full"></div>
                </div>
                <p className="text-white/50 text-sm">{t('investors.ask.alloc_legal_desc')}</p>
              </div>
              <div className="bg-black/40 backdrop-blur border border-white/10 p-6 rounded-2xl md:col-span-2 lg:col-span-1">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-medium">{t('investors.ask.alloc_gtm')}</span>
                  <span className="text-emerald-400 font-mono font-bold">25%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-3">
                  <div className="bg-emerald-500 w-[25%] h-full"></div>
                </div>
                <p className="text-white/50 text-sm">{t('investors.ask.alloc_gtm_desc')}</p>
              </div>
              <div className="bg-black/40 backdrop-blur border border-white/10 p-6 rounded-2xl md:col-span-2 lg:col-span-1">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-medium">{t('investors.ask.alloc_opex')}</span>
                  <span className="text-emerald-400 font-mono font-bold">10%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-3">
                  <div className="bg-emerald-500 w-[10%] h-full"></div>
                </div>
                <p className="text-white/50 text-sm">{t('investors.ask.alloc_opex_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 max-w-5xl mx-auto text-center gs-fade-up">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-10 py-5 bg-white text-black rounded-full font-medium text-lg hover:bg-neutral-200 transition-colors">
            {t('investors.ask.cta_talk')}
          </button>
          <button className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-full font-medium hover:bg-white/10 transition-colors">
            {t('investors.ask.cta_deck')}
          </button>
        </div>
      </section>
    </div>
  );
}
