import React from 'react';
import { Award, Sparkles, Check, Flame, Shield, Star, Lock } from 'lucide-react';
import { Badge, ThemeId, User } from '../types';
import { INITIAL_BADGES } from '../data/promptsAndThemes';
import { useLanguage } from '../context/LanguageContext';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  theme: ThemeId;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  user,
  theme,
}) => {
  if (!isOpen) return null;

  const { language, t, getBadge } = useLanguage();
  const badges = INITIAL_BADGES;
  const isWizard = theme === 'wizard_academy';

  // Calculate level progress
  const nextLevelXp = user.level * 250;
  const currentLevelBaseXp = (user.level - 1) * 250;
  const levelProgress = Math.min(
    100,
    Math.max(0, Math.round(((user.xp - currentLevelBaseXp) / 250) * 100))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div
          className={`p-6 border-b flex items-center justify-between transition-colors ${
            isWizard
              ? 'bg-amber-950/40 border-amber-900/40'
              : 'bg-emerald-950/40 border-emerald-900/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                isWizard ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}
            >
              {isWizard ? '🏆' : '⚔️'}
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {t('badgesModalTitle')}
              </h3>
              <p className="text-xs text-neutral-400">
                {t('badgesModalSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Level & XP Banner */}
        <div className="p-6 border-b border-neutral-800 bg-neutral-950/60 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">
                {language === 'ja'
                  ? `ランク ${user.level}: ${isWizard ? '見習い魔導士' : '癸（みずのと）の剣士'}`
                  : language === 'en'
                  ? `Level ${user.level}: ${isWizard ? 'Apprentice Mage' : 'Mizunoto Slayer'}`
                  : `Tingkat ${user.level}: ${isWizard ? 'Penyihir Magang' : 'Pemburu Mizunoto'}`}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                {user.xp} XP
              </span>
            </div>
            <span className="text-neutral-400">
              {language === 'ja'
                ? `ランク ${user.level + 1} まで (${user.xp % 250}/250 XP)`
                : language === 'en'
                ? `Toward Level ${user.level + 1} (${user.xp % 250}/250 XP)`
                : `Menuju Tingkat ${user.level + 1} (${user.xp % 250}/250 XP)`}
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-neutral-800 overflow-hidden">
            <div
              style={{ width: `${levelProgress}%` }}
              className={`h-full rounded-full transition-all duration-500 ${
                isWizard ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
            />
          </div>
        </div>

        {/* Circular Badges Grid */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {badges.map((badge) => {
              const localizedBadge = getBadge(badge.id, badge.name, badge.description);
              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-3xl border flex flex-col items-center text-center transition-all ${
                    badge.unlocked
                      ? isWizard
                        ? 'bg-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-950/20'
                        : 'bg-emerald-950/30 border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                      : 'bg-neutral-950/40 border-neutral-800 opacity-60'
                  }`}
                >
                  {/* Strict Circular Shape for Achievement Badge as requested in PRD */}
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-3 shadow-md relative ${
                      badge.unlocked
                        ? isWizard
                          ? 'bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 text-neutral-950 ring-4 ring-amber-400/20'
                          : 'bg-gradient-to-tr from-emerald-600 via-teal-400 to-emerald-300 text-neutral-950 ring-4 ring-emerald-400/20'
                        : 'bg-neutral-800 text-neutral-500 ring-2 ring-neutral-700'
                    }`}
                  >
                    {badge.unlocked ? badge.icon : <Lock className="w-6 h-6 text-neutral-500" />}

                    {badge.unlocked && (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-neutral-900 border border-emerald-500 text-emerald-400 flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <h5 className="font-bold text-xs text-white mb-1 leading-tight">
                    {localizedBadge.name}
                  </h5>
                  <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2">
                    {localizedBadge.description}
                  </p>

                  {badge.unlocked && badge.unlockedAt && (
                    <span className="text-[9px] text-amber-300/80 mt-2 font-mono">
                      {language === 'ja' ? '獲得: ' : language === 'en' ? 'Unlocked ' : 'Terbuka '}{badge.unlockedAt}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            {language === 'ja' ? '閉じる' : language === 'en' ? 'Close' : 'Tutup'}
          </button>
        </div>
      </div>
    </div>
  );
};
