import React from 'react';
import { Check } from 'lucide-react';
import { ThemeId } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
}) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Wizard Academy Card */}
      <button
        type="button"
        onClick={() => onSelectTheme('wizard_academy')}
        className={`relative text-left p-4 rounded-2xl border transition-all overflow-hidden group cursor-pointer ${
          currentTheme === 'wizard_academy'
            ? 'border-amber-400 bg-amber-950/40 shadow-lg shadow-amber-950/30 ring-2 ring-amber-400/40'
            : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-900'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl">
              🪄
            </div>
            <div>
              <h4 className="font-serif-magic text-sm font-bold text-amber-200">
                Wizard Academy
              </h4>
              <p className="text-xs text-neutral-400">
                {t('themeWizardDesc')}
              </p>
            </div>
          </div>
          {currentTheme === 'wizard_academy' && (
            <span className="p-1 rounded-full bg-amber-400 text-neutral-950">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </span>
          )}
        </div>

        {/* Aesthetics preview tags */}
        <div className="mt-3 flex items-center gap-2 text-[10px] text-amber-300/80">
          <span>{t('themeWizardPalette')}</span>
          <span>&bull;</span>
          <span>{t('themeWizardTypography')}</span>
          <span>&bull;</span>
          <span>{t('themeWizardPersona')}</span>
        </div>
      </button>

      {/* Demon Hunter Card */}
      <button
        type="button"
        onClick={() => onSelectTheme('demon_hunter')}
        className={`relative text-left p-4 rounded-2xl border transition-all overflow-hidden group cursor-pointer ${
          currentTheme === 'demon_hunter'
            ? 'border-emerald-400 bg-emerald-950/40 shadow-lg shadow-emerald-950/30 ring-2 ring-emerald-400/40'
            : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-900'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl">
              ⚔️
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-200 tracking-wide">
                Demon Hunter
              </h4>
              <p className="text-xs text-neutral-400">
                {t('themeDemonHunterDesc')}
              </p>
            </div>
          </div>
          {currentTheme === 'demon_hunter' && (
            <span className="p-1 rounded-full bg-emerald-400 text-neutral-950">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </span>
          )}
        </div>

        {/* Aesthetics preview tags */}
        <div className="mt-3 flex items-center gap-2 text-[10px] text-emerald-300/80">
          <span>{t('themeDemonHunterPalette')}</span>
          <span>&bull;</span>
          <span>{t('themeDemonHunterMood')}</span>
          <span>&bull;</span>
          <span>{t('themeDemonHunterPersona')}</span>
        </div>
      </button>
    </div>
  );
};
