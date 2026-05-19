import { RailsLogo } from './ui/Logo';
import KivoA11yToggle from './kivo/KivoA11yToggle';
import KivoLanguageSwitcher from './kivo/KivoLanguageSwitcher';
import KivoTooltip from './kivo/KivoTooltip';
import { useTranslation } from '../hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <>
    <footer className="text-white bg-[#050505] border-white/10 border-t pt-16 pr-6 pb-16 pl-6 relative z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-black to-neutral-900 border border-white/20 flex items-center justify-center text-white">
                <RailsLogo className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bricolage font-semibold">STELLAR RAILS</h2>
            </div>
            <p className="text-white/50 max-w-xs leading-relaxed">
              {t('footer.made_with')}
            </p>
          </div>

          <div className="flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="/#modules" className="hover:text-white transition-colors">{t('nav.modules')}</a>
            <a href="/#platform" className="hover:text-white transition-colors">{t('nav.how_it_works')}</a>
            <a href="/investidores" className="hover:text-white transition-colors">{t('nav.investors')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('nav.contact')}</a>
          </div>
        </div>

        <div className="w-full mt-24 overflow-hidden flex justify-center items-center pointer-events-none select-none">
          <h1
            className="text-[12vw] leading-none text-white/5 whitespace-nowrap italic tracking-tighter"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Stellar Global Rails
          </h1>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/40 gap-4">
          <p>© 2026 AKS</p>
          <div className="flex items-center gap-6">
            <KivoLanguageSwitcher />
            <KivoA11yToggle />
          </div>
        </div>
      </footer>
    </>
  );
}