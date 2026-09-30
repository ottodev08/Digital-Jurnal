import React from 'react';
import {
  Sparkles,
  Sword,
  Shield,
  Award,
  Activity,
  LogOut,
  LogIn,
  UserPlus,
  Key,
  Users,
  Globe,
} from 'lucide-react';
import { ThemeId, User } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  user: User;
  theme: ThemeId;
  activeTab: 'journal' | 'collab' | 'parent' | 'logs';
  onSelectTab: (tab: 'journal' | 'collab' | 'parent' | 'logs') => void;
  onOpenIndex?: () => void;
  onOpenBadges: () => void;
  onToggleTheme: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  theme,
  activeTab,
  onSelectTab,
  onOpenIndex,
  onOpenBadges,
  onToggleTheme,
  onOpenAuth,
  onLogout,
}) => {
  const isWizard = theme === 'wizard_academy';
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => (onOpenIndex ? onOpenIndex() : onSelectTab('journal'))}
          className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer shrink-0"
          title={language === 'ja' ? 'インデックスページへ戻る' : language === 'en' ? 'Back to Index Page' : 'Kembali ke Halaman Index (Landing Page)'}
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition-transform group-hover:scale-105 ${
              isWizard
                ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
            }`}
          >
            {isWizard ? '🪄' : '⚔️'}
          </div>
          <div className="flex flex-col">
            <span className="font-serif-magic text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors leading-tight">
              Magic Journal
            </span>
            <span className="text-[9px] text-neutral-400 font-mono tracking-wider">
              {isWizard ? 'Wizard Academy' : 'Demon Hunter'}
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-neutral-400">
          {onOpenIndex && (
            <button
              onClick={onOpenIndex}
              className="transition-colors whitespace-nowrap hover:text-white cursor-pointer"
            >
              {language === 'ja' ? 'ホーム (Index)' : language === 'en' ? 'Home (Index)' : 'Beranda (Index)'}
            </button>
          )}
          <button
            onClick={() => onSelectTab('journal')}
            className={`transition-colors whitespace-nowrap hover:text-white cursor-pointer ${
              activeTab === 'journal' ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : ''
            }`}
          >
            {t('navJournal')}
          </button>
          <button
            onClick={() => onSelectTab('collab')}
            className={`transition-colors whitespace-nowrap hover:text-white flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'collab' ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : ''
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            {t('navCollab')}
          </button>
          <button
            onClick={() => onSelectTab('parent')}
            className={`transition-colors whitespace-nowrap hover:text-white flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'parent' ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : ''
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            {t('navParent')}
          </button>
          <button
            onClick={() => onSelectTab('logs')}
            className={`transition-colors whitespace-nowrap hover:text-white flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'logs' ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : ''
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            {t('navAudit')}
          </button>
          {user.role === 'child' && (
            <button
              onClick={onOpenBadges}
              className="transition-colors whitespace-nowrap hover:text-white flex items-center gap-1 text-amber-300 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              {t('navBadges')}
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Actions (Language Switcher, Theme Toggle, & User Session) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Tri-Language Segmented Switcher (ID / EN / 日本語) */}
          <div className="flex items-center rounded-xl bg-neutral-900 border border-neutral-800 p-0.5 text-[11px] font-bold shadow-inner">
            <button
              onClick={() => setLanguage('id')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                language === 'id'
                  ? isWizard
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'bg-emerald-500 text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Bahasa Indonesia"
            >
              ID
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                language === 'en'
                  ? isWizard
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'bg-emerald-500 text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ja')}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                language === 'ja'
                  ? isWizard
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'bg-emerald-500 text-black shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="日本語 (Japanese)"
            >
              日本語
            </button>
          </div>

          {/* Instant Dynamic Theme Engine Toggle */}
          <button
            onClick={onToggleTheme}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all shadow-sm cursor-pointer shrink-0 ${
              isWizard
                ? 'bg-amber-950/60 border-amber-700/60 text-amber-300 hover:bg-amber-900/60'
                : 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/60'
            }`}
            title="Wizard Academy vs Demon Hunter"
          >
            {isWizard ? <span>🪄 Wizard</span> : <span>⚔️ Hunter</span>}
          </button>

          {/* User Button / Switcher */}
          <button
            onClick={() => onOpenAuth('login')}
            className="flex items-center gap-2 p-1.5 sm:pr-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer shrink-0"
            title={t('switchAccount')}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-lg bg-neutral-800 object-cover"
            />
            <div className="text-left hidden xl:block">
              <div className="text-[11px] font-bold text-white truncate max-w-[85px]">
                {user.name.split(' ')[0]}
              </div>
              <div className="text-[9px] text-neutral-400 font-mono capitalize">
                {user.role === 'child' ? t('childRole') : t('parentRole')}
              </div>
            </div>
          </button>

          {/* Logout Action */}
          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-neutral-900 hover:bg-red-950/50 border border-neutral-800 hover:border-red-800 text-neutral-400 hover:text-red-300 transition-colors cursor-pointer shrink-0"
            title={t('navLogout')}
            aria-label={t('navLogout')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
