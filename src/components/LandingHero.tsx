import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Lock,
  ArrowRight,
  UserCheck,
  CheckCircle,
  LogIn,
  UserPlus,
  Key,
  Shield,
} from 'lucide-react';
import { ThemeId, User } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LandingHeroProps {
  theme: ThemeId;
  user: User;
  onStartWriting: () => void;
  onOpenParent: () => void;
  onSwitchTheme: (t: ThemeId) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  theme,
  user,
  onStartWriting,
  onOpenParent,
  onSwitchTheme,
  onOpenAuth,
}) => {
  const isWizard = theme === 'wizard_academy';
  const { language, t } = useLanguage();

  // Assets
  const wizardImg = '/src/assets/images/wizard_academy_bg_1790244331928.jpg';
  const demonImg = '/src/assets/images/demon_hunter_bg_1790244350805.jpg';

  return (
    <div className="space-y-10 pb-6">
      {/* Top Banner: Prominent Login & Registration Options Bar on Landing Page */}
      <div className="p-4 sm:p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {language === 'ja' ? 'アカウント＆セッション管理' : language === 'en' ? 'Account & JWT Session' : 'Akses Akun & Sesi JWT'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                {t('connected')}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {language === 'ja' ? '登録済みアカウントでログイン、または強力なパスワードで新規作成。' : language === 'en' ? 'Sign in with an existing account or register a new one with strong password protection.' : 'Masuk dengan akun terdaftar atau buat akun baru dengan validasi kata sandi kuat.'}
            </p>
          </div>
        </div>

        {/* Dual Primary Auth Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => onOpenAuth('login')}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700/90 border border-neutral-700 text-neutral-200 text-xs font-bold flex items-center justify-center gap-2 transition-all hover:text-white cursor-pointer active:scale-95"
          >
            <LogIn className="w-4 h-4 text-amber-400" />
            <span>{t('navLogin')}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenAuth('register')}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('navRegister')}</span>
          </button>
        </div>
      </div>

      {/* Hero Banner Container */}
      <div className="relative rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-2xl">
        {/* Background Image with Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={isWizard ? wizardImg : demonImg}
            alt={isWizard ? 'Wizard Academy' : 'Demon Hunter'}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25 filter blur-[1px] transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl space-y-6">
          {/* Metadata Discipline: Unboxed Text with Separators */}
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> {language === 'ja' ? 'AES-256 暗号化' : language === 'en' ? 'Client AES-256' : 'Enkripsi Klien AES-256'}
            </span>
            <span aria-hidden="true">&middot;</span>
            <span>{language === 'ja' ? '子ども・若者向け魔導書' : language === 'en' ? 'Youth Digital Grimoire' : 'Digital Journal Anak & Remaja'}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{t('navParent')}</span>
          </div>

          <h1
            className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] ${
              isWizard ? 'font-serif-magic' : ''
            }`}
          >
            {language === 'ja'
              ? isWizard
                ? '心をつづる秘密の魔導書。すべての言葉が魔法に変わる。'
                : '心の鬼を斬り、強さと勇気をこのページに刻め。'
              : language === 'en'
              ? isWizard
                ? 'A Secret Sanctuary for Your Spells & Innermost Reflections'
                : 'Slay Your Worries, Forge True Strength on Every Page'
              : isWizard
              ? 'Ruang Rahasia untuk Setiap Mantra & Refleksi Jiwamu'
              : 'Tebas Kegelisahan, Temukan Kekuatan di Setiap Halaman'}
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
            {language === 'ja'
              ? isWizard
                ? 'Magic Journalは魔法学園をテーマにしたデジタル日記帳。端末内AES-256暗号化で、誰にも見られず素直な想いを綴ることができます。'
                : '勇敢な冒険者のための鬼狩り日記。日々の感情を呼吸法で整え、挑戦を記録してバッジを獲得しよう。プライバシーは完全保護されます。'
              : language === 'en'
              ? isWizard
                ? 'Magic Journal is an interactive grimoire set in an enchanted wizard academy. Your entries are sealed with AES-256 before leaving your browser—pour your heart out safely.'
                : 'Forged for brave souls on an epic quest. Track emotional breathing forms, conquer daily demons, and earn badges with guaranteed zero-knowledge privacy.'
              : isWizard
              ? 'Magic Journal adalah buku harian digital interaktif bertema fantasi akademi sihir. Catatanmu disegel dengan enkripsi AES-256 sebelum meninggalkan perangkatmu—bebas curhat tanpa takut dibaca siapapun.'
              : 'Ditempa untuk jiwa pemberani yang menyukai petualangan. Gunakan jurus pernapasan untuk melacak suasana hati, hadapi tantangan harian, dan raih lencana pencapaian dengan privasi terlindungi penuh.'}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onStartWriting}
              className={`px-6 py-3.5 rounded-2xl font-bold text-sm text-neutral-950 shadow-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${
                isWizard
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-110 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 shadow-emerald-500/20'
              }`}
            >
              <span>{t('startWritingBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenParent}
              className="px-5 py-3.5 rounded-2xl font-semibold text-sm text-neutral-200 bg-neutral-900/90 border border-neutral-700 hover:bg-neutral-800 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>{t('parentPortalBtn')}</span>
            </button>

            <button
              onClick={() => onOpenAuth('login')}
              className="px-4 py-3.5 rounded-2xl font-semibold text-sm text-neutral-300 hover:text-white bg-transparent border border-neutral-800 hover:border-neutral-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-neutral-400" />
              <span>{t('switchAccount')}</span>
            </button>
          </div>

          {/* Proof Adjacency: Trust Badges */}
          <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap items-center gap-6 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              {language === 'ja' ? 'JWT ＆ Bcrypt 暗号化認証' : language === 'en' ? 'JWT & Bcrypt Hashed Passwords' : 'Sesi JWT & Sandi Ter-hash Bcrypt'}
            </span>
            <span className="flex items-center gap-1.5 text-neutral-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              {language === 'ja' ? '完全ゼロ知識 AES-256' : language === 'en' ? '0% Data Leaks (Zero-Knowledge AES-256)' : '0% Kebocoran Data (Zero-Knowledge AES-256)'}
            </span>
            <span className="flex items-center gap-1.5 text-neutral-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              {language === 'ja' ? '3日間連続早期見守り検知' : language === 'en' ? '3-Day Early Mood Detection' : 'Deteksi Dini Mood 3 Hari'}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Value Proposition Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Secure Auth & AES-256 */}
        <div className="p-5 sm:p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-3 hover:border-neutral-700 transition-all">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl">
            🔒
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white">{t('feat1Title')}</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {t('feat1Desc')}
          </p>
        </div>

        {/* Card 2: Share with Parents */}
        <div className="p-5 sm:p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-3 hover:border-pink-500/40 transition-all">
          <div className="w-11 h-11 rounded-2xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 text-xl">
            💌
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white">{t('feat3Title')}</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {t('feat3Desc')}
          </p>
        </div>

        {/* Card 3: Friend Collaboration */}
        <div className="p-5 sm:p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-3 hover:border-emerald-500/40 transition-all">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl">
            🤝
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white">{t('feat4Title')}</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {t('feat4Desc')}
          </p>
        </div>

        {/* Card 4: Parent Portal & Alerts */}
        <div className="p-5 sm:p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-3 hover:border-cyan-500/40 transition-all">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl">
            📊
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white">{t('earlyAlertTitle')}</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {t('parentPortalSubtitle')}
          </p>
        </div>
      </div>
    </div>
  );
};
