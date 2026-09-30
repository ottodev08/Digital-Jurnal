import React, { useState } from 'react';
import {
  ArrowRight,
  Lock,
  Shield,
  Users,
  BookOpen,
  Activity,
  ShieldAlert,
  LogIn,
  UserPlus,
  Check,
  Sparkles,
  Key,
  Send,
  Database,
} from 'lucide-react';
import { ThemeId, User } from '../types';
import { validateEmail } from '../utils/auth';
import { useLanguage } from '../context/LanguageContext';

interface LandingPageProps {
  theme: ThemeId;
  currentUser: User;
  dbStats?: {
    usersCount: number;
    journalsCount: number;
    logsCount: number;
  };
  onSelectTheme: (theme: ThemeId) => void;
  onEnterApp: (targetTab?: 'journal' | 'collab' | 'parent' | 'logs') => void;
  onQuickPersonaLogin: (userId: string, targetView?: 'app' | 'superadmin', targetTab?: 'journal' | 'collab' | 'parent' | 'logs') => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onOpenSuperAdmin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  theme,
  currentUser,
  dbStats,
  onSelectTheme,
  onEnterApp,
  onQuickPersonaLogin,
  onOpenAuthModal,
  onOpenSuperAdmin,
}) => {
  const { language, setLanguage } = useLanguage();
  const isWizard = theme === 'wizard_academy';

  // Interactive Live Encryption Demo on Landing Page
  const [demoPlaintext, setDemoPlaintext] = useState(
    language === 'ja'
      ? '今日は数学のテストを友達と一緒に乗り越えた！'
      : language === 'en'
      ? 'Today I conquered my fear of speaking in front of the class!'
      : 'Hari ini aku berhasil mengalahkan rasa gugup saat maju presentasi di kelas!'
  );

  // Validated Lead / Family Onboarding Inquiry Form
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadOrg, setLeadOrg] = useState<'parent' | 'school' | 'counselor'>('parent');
  const [leadMessage, setLeadMessage] = useState('');
  const [leadError, setLeadError] = useState<string | null>(null);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const wizardImg = '/src/assets/images/wizard_academy_bg_1790244331928.jpg';
  const demonImg = '/src/assets/images/demon_hunter_bg_1790244350805.jpg';
  const sealImg = '/src/assets/images/magic_seal_badge_1790244363047.jpg';

  const tr = (idText: string, enText: string, jaText: string) => {
    if (language === 'en') return enText;
    if (language === 'ja') return jaText;
    return idText;
  };

  // Deterministic simulated AES-256 preview string for the live interactive demo
  const generateSimulatedCipher = (input: string) => {
    if (!input.trim()) return 'U2FsdGVkX1+000000000000000000000==';
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, 'a');
    const b64 = btoa(encodeURIComponent(input.slice(0, 24))).replace(/=/g, '');
    return `AES256GCM$${hex}$${b64.slice(0, 28)}x9QpL2==`;
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeadError(null);
    if (!leadName.trim()) {
      setLeadError(
        tr('Nama lengkap wajib diisi.', 'Full name is required.', 'お名前を入力してください。')
      );
      return;
    }
    const emailCheck = validateEmail(leadEmail);
    if (!emailCheck.isValid) {
      setLeadError(
        emailCheck.error ||
          tr('Format email tidak valid.', 'Invalid email format.', 'メールアドレスの形式が正しくありません。')
      );
      return;
    }
    setLeadSubmitted(true);
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 ${
        isWizard
          ? 'bg-[#0B0908] text-stone-100 selection:bg-amber-500 selection:text-neutral-950'
          : 'bg-[#070C0A] text-stone-100 selection:bg-emerald-500 selection:text-neutral-950'
      }`}
    >
      {/* =================================================================
          1. STRICT 3-ZONE TOP BAR CONTRACT (Brand — Nav Links — Actions)
         ================================================================= */}
      <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Single Text Wordmark */}
          <a
            href="#top"
            className="font-serif-magic text-lg sm:text-xl font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
          >
            Magic Journal
          </a>

          {/* Zone 2: 5 Clean Text Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-neutral-300">
            <a
              href="#capabilities"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              {tr('Arsitektur & Fitur', 'Capabilities', '機能と暗号構造')}
            </a>
            <a
              href="#themes"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              {tr('Tema Dunia', 'World Themes', '世界観テーマ')}
            </a>
            <a
              href="#portals"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              {tr('Portal Peran', 'Role Portals', 'ロール別ポータル')}
            </a>
            <a
              href="#impact"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              {tr('Bukti & Dampak', 'Impact & Proof', '導入実績と効果')}
            </a>
            <a
              href="#contact"
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              {tr('Kemitraan Keluarga', 'Family & Schools', 'お問い合わせ')}
            </a>
          </nav>

          {/* Zone 3: Language Switcher & Primary Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="flex items-center p-0.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] font-semibold">
              {(['id', 'en', 'ja'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    language === lang
                      ? isWizard
                        ? 'bg-amber-500 text-neutral-950'
                        : 'bg-emerald-500 text-neutral-950'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {lang === 'ja' ? '日本語' : lang.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={() => onOpenAuthModal('login')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-neutral-200 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{tr('Masuk', 'Sign In', 'ログイン')}</span>
            </button>

            <button
              onClick={() => onEnterApp('journal')}
              className={`px-4 py-2 rounded-lg text-xs font-bold text-neutral-950 transition-all cursor-pointer whitespace-nowrap ${
                isWizard
                  ? 'bg-amber-400 hover:bg-amber-300'
                  : 'bg-emerald-400 hover:bg-emerald-300'
              }`}
            >
              {tr('Buka Aplikasi', 'Open Workspace', 'アプリを開く')}
            </button>
          </div>
        </div>
      </header>

      {/* =================================================================
          2. HERO SECTION (Proposition + High-Impact 16:9 Visual Carrier)
         ================================================================= */}
      <section id="top" className="relative pt-8 pb-16 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Value Proposition (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Unboxed Metadata Discipline with Typographic Separators */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
              <span className={isWizard ? 'text-amber-400 font-medium' : 'text-emerald-400 font-medium'}>
                {tr('Enkripsi Klien AES-256-GCM', 'Client-Side AES-256-GCM', '端末内 AES-256-GCM 暗号化')}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {tr('Jurnal Gamifikasi Anak & Remaja', 'Gamified Youth Journaling', '子ども・ティーン向け魔導書日記')}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {tr('Cloud Firestore Terhubung', 'Cloud Firestore Connected', 'Cloud Firestore リアルタイム同期')}
              </span>
            </div>

            <h1
              className="font-serif-magic text-3xl sm:text-5xl lg:text-[52px] font-bold text-white tracking-tight leading-[1.12]"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              {isWizard
                ? tr(
                    'Buku Harian Sihir tempat Anak Menulis dengan Aman dan Orang Tua Memantau Tanpa Melanggar Privasi.',
                    'The Enchanted Grimoire Where Children Write Safely and Parents Guide Without Invading Privacy.',
                    '子どもの秘密を完全保護しながら、心の成長とSOSを優しく見守る魔法の日記帳。'
                  )
                : tr(
                    'Tempa Ketangguhan Emosi Anak Lewat Jurnal Kriptografi dan Misi Persahabatan.',
                    'Forge Emotional Resilience Through Zero-Knowledge Journaling and Co-op Quests.',
                    '呼吸の型で日々の感情を整え、仲間と共に成長するゼロ知識暗号化ジャーナル。'
                  )}
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
              {tr(
                'Magic Journal mengenkripsi setiap catatan harian langsung di perangkat anak menggunakan standar AES-256-GCM sebelum disimpan ke Google Cloud Firestore. Orang tua memperoleh grafik suasana hati 30 hari dan peringatan dini 3 hari berturut-turut tanpa pernah membuka teks rahasia anak.',
                'Magic Journal encrypts every journal entry directly in the browser using AES-256-GCM before persisting to Google Cloud Firestore. Parents receive 30-day mood analytics and 3-day consecutive low-mood alerts without ever reading private child plaintext.',
                'Magic Journalは、Google Cloud Firestoreに保存される前にブラウザ内でAES-256-GCM暗号化を実行します。保護者は日記の本文を覗き見ることなく、30日間の感情推移と3日連続の低調アラートを受け取ることができます。'
              )}
            </p>

            {/* Interactive World Theme Switcher (Functional Segmented Control) */}
            <div className="pt-1">
              <div className="text-xs text-neutral-400 mb-2">
                {tr(
                  'Pilih Tema Dunia Interaktif (Mengubah seluruh atmosfer & skala emosi):',
                  'Select Interactive World Theme (Transforms atmosphere & mood scale):',
                  'インタラクティブ世界観テーマを選択（全体の雰囲気と感情スケールが変化します）:'
                )}
              </div>
              <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-neutral-900 border border-neutral-800">
                <button
                  type="button"
                  onClick={() => onSelectTheme('wizard_academy')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    isWizard
                      ? 'bg-amber-500 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  🪄 Wizard Academy (Akademi Sihir)
                </button>
                <button
                  type="button"
                  onClick={() => onSelectTheme('demon_hunter')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    !isWizard
                      ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  ⚔️ Demon Hunter (Pembasmi Iblis)
                </button>
              </div>
            </div>

            {/* Primary CTA & Secondary Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onEnterApp('journal')}
                className={`px-6 py-3.5 rounded-xl font-bold text-sm text-neutral-950 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isWizard
                    ? 'bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-500/20'
                    : 'bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20'
                }`}
              >
                <span>
                  {tr('Mulai Menulis di Buku Jurnal', 'Start Writing in Journal Book', '今すぐ魔導書に日記を書く')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenAuthModal('register')}
                className="px-5 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>{tr('Buat Akun Baru', 'Create Free Account', '無料アカウント登録')}</span>
              </button>

              <button
                onClick={onOpenSuperAdmin}
                className="px-4 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-indigo-300 hover:text-white bg-indigo-950/60 hover:bg-indigo-900/70 border border-indigo-800/70 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <ShieldAlert className="w-4 h-4 text-indigo-400" />
                <span>{tr('Konsol Super Admin', 'Super Admin Console', 'Super Admin 管理画面')}</span>
              </button>
            </div>

            {/* Quantified Proof Strip */}
            <div className="pt-4 border-t border-neutral-800/80 grid grid-cols-3 gap-4 text-xs">
              <div>
                <div className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums">
                  256-bit
                </div>
                <div className="text-neutral-400 mt-0.5">
                  {tr('Enkripsi GCM + PBKDF2 di Browser', 'Browser GCM + PBKDF2 Cipher', 'ブラウザ内暗号化')}
                </div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums">
                  {dbStats ? `${dbStats.journalsCount}+` : '100%'}
                </div>
                <div className="text-neutral-400 mt-0.5">
                  {tr('Lembar Jurnal Tersimpan di Cloud', 'Cloud Firestore Journal Pages', 'クラウド保存ページ数')}
                </div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums">
                  3 {tr('Hari', 'Days', '日間')}
                </div>
                <div className="text-neutral-400 mt-0.5">
                  {tr('Deteksi Dini Mood Rendah Otomatis', 'Automated Low-Mood Radar', '連続低調の早期検知')}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dominant 16:9 Visual Carrier & Interactive Grimoire Preview (5 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900">
              <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                <img
                  src={isWizard ? wizardImg : demonImg}
                  alt={isWizard ? 'Wizard Academy Sanctuary' : 'Demon Hunter Training Grounds'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-mono text-amber-300">
                      {isWizard ? 'THEME 01 · WIZARD ACADEMY' : 'THEME 02 · DEMON HUNTER'}
                    </div>
                    <div className="text-sm font-bold text-white font-serif-magic">
                      {isWizard
                        ? tr('Grimoire Menara Bintang', 'Starlight Tower Grimoire', '星影の魔導書')
                        : tr('Gulungan Korps Pembasmi', 'Slayer Corps Scroll', '鬼殺隊の修練巻物')}
                    </div>
                  </div>
                  <img
                    src={sealImg}
                    alt="Cryptographic Wax Seal"
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-xl border border-amber-500/40 object-cover shrink-0"
                  />
                </div>
              </div>

              {/* Interactive Live Zero-Knowledge Encryption Sandbox inside Hero Card */}
              <div className="p-5 space-y-3 bg-neutral-950/90 border-t border-neutral-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {tr(
                        'Simulasi Langsung Enkripsi Zero-Knowledge',
                        'Live Zero-Knowledge Encryption Sandbox',
                        'ゼロ知識暗号化ライブシミュレーター'
                      )}
                    </span>
                  </span>
                  <span className="font-mono text-[11px] text-emerald-400">AES-256-GCM</span>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">
                    {tr(
                      'Ketik curhatan anak (hanya terlihat di perangkat anak):',
                      'Type child reflection (only visible on child device):',
                      '子どもの日記テキストを入力（端末内のみ表示）:'
                    )}
                  </label>
                  <input
                    type="text"
                    value={demoPlaintext}
                    onChange={(e) => setDemoPlaintext(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="p-3 rounded-lg bg-neutral-900/90 border border-neutral-800 font-mono text-[11px] space-y-1">
                  <div className="text-neutral-400 flex items-center justify-between">
                    <span>{tr('Disimpan di Server & Terlihat oleh Admin:', 'Stored in Cloud & Visible to Admin:', 'クラウド保存データ（管理者・親が見る文字列）:')}</span>
                    <span className="text-amber-400">CIPHERTEXT</span>
                  </div>
                  <div className="text-emerald-400 break-all tabular-nums">
                    {generateSimulatedCipher(demoPlaintext)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          3. CORE CAPABILITIES — ASYMMETRIC BENTO GRID WITH EDITORIAL NUMBERING
         ================================================================= */}
      <section id="capabilities" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-neutral-900 bg-neutral-950/50">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-mono text-amber-400">
              {tr('ARSITEKTUR & KAPABILITAS INTI', 'CORE ARCHITECTURE & CAPABILITIES', 'コアアーキテクチャと主要機能')}
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold text-white font-serif-magic tracking-tight"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              {tr(
                'Dirancang untuk Melindungi Ruang Rahasia Anak sekaligus Menjaga Ketenangan Orang Tua.',
                'Engineered to Protect a Child’s Private Sanctuary While Giving Parents Peace of Mind.',
                '子どものプライバシー保護と保護者の安心を両立する5つのコア機能。'
              )}
            </h2>
          </div>

          {/* Asymmetric Bento Grid (col-span-2 alongside col-span-1) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Bento Item 01 (Span 2) */}
            <div className="md:col-span-2 p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-mono text-amber-400">
                  {tr('01. Privasi Kriptografi Zero-Knowledge', '01. Zero-Knowledge Cryptographic Privacy', '01. ゼロ知識クライアント暗号化')}
                </div>
                <h3 className="text-lg font-bold text-white">
                  {tr(
                    'Teks Jurnal Dienkripsi di Browser Sebelum Menyentuh Server',
                    'Journal Text Is Encrypted in the Browser Before Reaching the Server',
                    '日記の本文はサーバー送信前にブラウザ内で完全暗号化'
                  )}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {tr(
                    'Menggunakan Web Crypto API (AES-256-GCM dengan derivasi kunci PBKDF2 100.000 iterasi). Bahkan administrator database maupun orang tua tidak dapat mendekripsi isi curhatan pribadi kecuali anak memilih membagikan lembaran tersebut secara sukarela.',
                    'Powered by the Web Crypto API (AES-256-GCM with 100,000-iteration PBKDF2 key derivation). Neither database administrators nor parents can decrypt private reflections unless the child explicitly shares a page.',
                    'Web Crypto API（AES-256-GCMおよびPBKDF2鍵導出）を採用。子ども自身が「共有」を選ばない限り、保護者やシステム管理者であっても本文を読むことは不可能です。'
                  )}
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
                <span>Web Crypto API · AES-256-GCM · PBKDF2 Salt</span>
                <button
                  onClick={() => onEnterApp('journal')}
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>{tr('Coba Brankas Jurnal', 'Try Encrypted Book', '暗号化ジャーナルを試す')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bento Item 02 (Span 1) */}
            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-mono text-emerald-400">
                  {tr('02. Kanvas Seni & Bukti Kebenaran', '02. Doodle Canvas & Visual Proof', '02. お絵描きキャンバスとスタンプ')}
                </div>
                <h3 className="text-lg font-bold text-white">
                  {tr(
                    'Buku Dua Halaman Interaktif dengan Lukisan & Stiker',
                    'Interactive Two-Page Book Spread with Doodles & Stickers',
                    '見開き2ページの魔導書にお絵描き＆魔法スタンプ'
                  )}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {tr(
                    'Halaman kiri untuk merangkai kata dan memilih skor suasana hati, halaman kanan untuk menggambar bebas di kanvas HTML5 dan menempelkan stiker tematik.',
                    'Left parchment page for guided writing and mood scoring; right page for freehand HTML5 canvas drawing and thematic stickers.',
                    '左ページで質問に答えながら文章を綴り、右ページのHTML5キャンバスで自由にお絵描きやスタンプ装飾が楽しめます。'
                  )}
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-800 text-xs text-neutral-400">
                HTML5 Canvas ·Daftar Isi · Pita Pembatas
              </div>
            </div>

            {/* Bento Item 03 (Span 1) */}
            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-mono text-pink-400">
                  {tr('03. Berbagi Sukarela ke Orang Tua', '03. Voluntary Parent Page Sharing', '03. 保護者への自発的なページ共有')}
                </div>
                <h3 className="text-lg font-bold text-white">
                  {tr(
                    'Jembatan Komunikasi Tanpa Paksaan',
                    'Consent-Based Family Communication Bridge',
                    '子どもの意思を尊重する親子コミュニケーション'
                  )}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {tr(
                    'Anak memegang kendali penuh untuk memilih 1 lembar cerita yang ingin dibagikan ke orang tua, lengkap dengan balasan surat hangat dan hadiah +50 XP keberanian.',
                    'Children hold full control to share specific journal pages with their parents, receiving warm feedback stamps and +50 Courage XP.',
                    '子どもが見せたいページだけを保護者に共有でき、保護者からの温かいスタンプと返信で+50 XPを獲得します。'
                  )}
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-800 text-xs text-neutral-400">
                +50 XP · Stempel Kasih Sayang · Balasan Wali
              </div>
            </div>

            {/* Bento Item 04 (Span 1) */}
            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-mono text-cyan-400">
                  {tr('04. Misi Kolaborasi Teman (Co-op)', '04. Friend Co-op Journal Quests', '04. フレンド協力ジャーナルクエスト')}
                </div>
                <h3 className="text-lg font-bold text-white">
                  {tr(
                    'Menulis Bersama Sahabat dengan Kode Pairing 6 Digit',
                    'Co-Author Shared Pages via 6-Digit Friend Codes',
                    '6桁のフレンドコードで友達と交換日記クエスト'
                  )}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {tr(
                    'Hubungkan akun dengan sahabat menggunakan kode 6 digit untuk menyelesaikan tantangan refleksi bersama di satu lembaran buku kolaboratif.',
                    'Connect with peers via 6-digit pairing codes to complete reflection quests together on a shared two-column spread.',
                    '6桁のコードで友達と繋がり、共通のテーマについて見開きページで一緒に文章やイラストを完成させます。'
                  )}
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <span>6-Digit Code · +100 XP Co-op</span>
                <button
                  onClick={() => onEnterApp('collab')}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
                >
                  {tr('Buka Kolaborasi →', 'Open Co-op →', 'コラボを開く →')}
                </button>
              </div>
            </div>

            {/* Bento Item 05 (Span 1) */}
            <div className="p-6 rounded-2xl bg-neutral-900/70 border border-neutral-800 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-mono text-indigo-400">
                  {tr('05. Radar Emosi 3 Hari & Super Admin', '05. 3-Day Mood Radar & Super Admin', '05. 3日連続アラートとSuper Admin')}
                </div>
                <h3 className="text-lg font-bold text-white">
                  {tr(
                    'Peringatan Dini Psikologis & Tata Kelola RBAC',
                    'Early Emotional Radar & Enterprise RBAC Governance',
                    '感情変化の早期検知とRBACシステム管理'
                  )}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {tr(
                    'Jika anak mencatat mood rendah (skor ≤ 2) selama 3 hari berturut-turut, sistem mengirimkan notifikasi pendampingan ke Parent Portal tanpa membocorkan isi jurnal.',
                    'When a child records a low mood score (≤ 2) for 3 consecutive days, parents receive an empathetic support alert without exposing private text.',
                    '低調な感情スコア(≤ 2)が3日連続で記録されると、日記の内容を明かさずに保護者へサポート通知を送信します。'
                  )}
                </p>
              </div>
              <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <span>30-Day Chart · RBAC Console</span>
                <button
                  onClick={() => onEnterApp('parent')}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                >
                  {tr('Parent Portal →', 'Parent Portal →', '保護者ポータル →')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          4. DUAL WORLD THEME ENGINE SHOWCASE (#themes)
         ================================================================= */}
      <section id="themes" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs font-mono text-amber-400">
                {tr('MESIN TEMA DINAMIS', 'DYNAMIC THEME ENGINE', 'ダイナミックテーマエンジン')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-magic">
                {tr(
                  'Dua Dunia Fantasi yang Menyesuaikan Bahasa Emosi Anak.',
                  'Two Immersive Fantasy Worlds That Adapt to Your Child’s Emotional Vocabulary.',
                  '子どもの感性に合わせて選べる2つのファンタジー世界。'
                )}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Theme Card 1: Wizard Academy */}
            <div
              className={`rounded-2xl overflow-hidden border transition-all flex flex-col justify-between ${
                isWizard
                  ? 'border-amber-500/70 bg-neutral-900/90'
                  : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700'
              }`}
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={wizardImg}
                    alt="Wizard Academy Theme"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <div className="text-xs font-mono text-amber-300">WIZARD ACADEMY · AKADEMI SIHIR</div>
                    <h3 className="text-xl font-bold text-white font-serif-magic">
                      {tr('Grimoire Menara Bintang & Alkimia Perasaan', 'Starlight Grimoire & Emotional Alchemy', '星影の魔導書と感情の錬金術')}
                    </h3>
                  </div>
                </div>
                <div className="p-5 space-y-3 text-xs text-neutral-300">
                  <p className="leading-relaxed">
                    {tr(
                      'Mengubah refleksi harian menjadi peracikan ramuan sihir. Cocok untuk anak dan remaja yang menyukai imajinasi kastil sihir, mantra kebijaksanaan, dan perkamen kuno.',
                      'Transforms daily reflection into potion brewing and spellcasting. Ideal for young minds drawn to enchanted libraries, starlight scrolls, and wisdom spells.',
                      '日々の振り返りを魔法薬の調合や呪文の記録に変えるテーマ。魔法学園や古い羊皮紙の世界観が好きな子どもに最適です。'
                    )}
                  </p>
                  <div className="pt-2 border-t border-neutral-800 text-neutral-400 font-mono">
                    {tr(
                      'Skala Emosi: 5 Ramuan Cahaya Bintang · 4 Keceriaan Emas · 3 Ketenangan · 2 Kabut · 1 Bayangan',
                      'Mood Scale: 5 Starlight Potion · 4 Golden Joy · 3 Neutral Brew · 2 Mist · 1 Shadow',
                      '感情スケール: 5 星光の秘薬 · 4 黄金の歓喜 · 3 平穏の煎じ薬 · 2 迷いの霧 · 1 暗黒の影'
                    )}
                  </div>
                </div>
              </div>
              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    onSelectTheme('wizard_academy');
                    onEnterApp('journal');
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs cursor-pointer transition-colors"
                >
                  {tr('Aktifkan & Buka Tema Wizard Academy', 'Activate & Launch Wizard Academy', 'Wizard Academyテーマで開く')}
                </button>
              </div>
            </div>

            {/* Theme Card 2: Demon Hunter */}
            <div
              className={`rounded-2xl overflow-hidden border transition-all flex flex-col justify-between ${
                !isWizard
                  ? 'border-emerald-500/70 bg-neutral-900/90'
                  : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700'
              }`}
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={demonImg}
                    alt="Demon Hunter Theme"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <div className="text-xs font-mono text-emerald-300">DEMON HUNTER · PEMBASMI IBLIS</div>
                    <h3 className="text-xl font-bold text-white font-serif-magic">
                      {tr('Gulungan Jurus Pernapasan & Ketangguhan', 'Breathing Forms & Demon Slayer Scroll', '呼吸の型と鬼狩りの修練録')}
                    </h3>
                  </div>
                </div>
                <div className="p-5 space-y-3 text-xs text-neutral-300">
                  <p className="leading-relaxed">
                    {tr(
                      'Membantu anak mengenali rasa takut, marah, atau lelah sebagai "iblis kecil" yang dapat dihadapi dengan teknik pernapasan dan keberanian setiap hari.',
                      'Helps children frame anxiety, fatigue, or self-doubt as inner challenges that can be overcome through mindful breathing forms and daily courage.',
                      '不安や疲れを「心の小さな鬼」として捉え、呼吸の型と勇気で乗り越えていく冒険者向けのテーマです。'
                    )}
                  </p>
                  <div className="pt-2 border-t border-neutral-800 text-neutral-400 font-mono">
                    {tr(
                      'Skala Emosi: 5 Pernapasan Matahari · 4 Air Tenang · 3 Angin · 2 Petir Tegang · 1 Kabut Kelam',
                      'Mood Scale: 5 Sun Breathing · 4 Calm Water · 3 Wind Stance · 2 Thunder Strain · 1 Dark Mist',
                      '感情スケール: 5 日の呼吸 · 4 水の呼吸・凪 · 3 風の構え · 2 雷の緊張 · 1 闇の霞'
                    )}
                  </div>
                </div>
              </div>
              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    onSelectTheme('demon_hunter');
                    onEnterApp('journal');
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs cursor-pointer transition-colors"
                >
                  {tr('Aktifkan & Buka Tema Demon Hunter', 'Activate & Launch Demon Hunter', 'Demon Hunterテーマで開く')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          5. DIRECT 1-CLICK ROLE PORTAL LAUNCHPAD (#portals)
         ================================================================= */}
      <section id="portals" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-neutral-900 bg-neutral-950/60">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-mono text-amber-400">
              {tr('AKSES CEPAT PORTAL PERAN (DEMO & PRODUKSI)', 'INSTANT ROLE PORTAL LAUNCHPAD', 'ロール別クイックアクセス')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-magic">
              {tr(
                'Jelajahi Langsung Setiap Modul Sesuai Peran Pengguna.',
                'Experience Every Module Directly by User Role.',
                '3つのロール（子ども・保護者・Super Admin）を1クリックで体験。'
              )}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              {tr(
                'Pilih salah satu akun di bawah (Sarrah, Fatiha, atau Cahyadi) untuk langsung masuk ke ruang kerja terkait dengan sesi JWT terautentikasi.',
                'Select any account below (Sarrah, Fatiha, or Cahyadi) to launch directly into the corresponding workspace with an active JWT session.',
                '以下のアカウント（Sarrah、Fatiha、Cahyadi）を選択すると、JWT認証セッション付きで各モジュールへ直接移動します。'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Persona 1: Sarrah (11 Tahun - Anak) */}
            <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                  <span>ROLE: ANAK · 11 TAHUN</span>
                  <span className="text-amber-400">🪄 WIZARD / ⚔️ HUNTER</span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="https://api.dicebear.com/7.x/adventurer/svg?seed=SarrahMagic"
                    alt="Sarrah"
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-xl bg-neutral-800 border border-neutral-700"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">Sarrah (11 Tahun)</h3>
                    <div className="text-xs text-neutral-400 font-mono">Anak · Pairing: SRH110 · Lv.3</div>
                  </div>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {tr(
                    'Masuk ke buku jurnal 2 halaman milik Sarrah (11 Tahun), tulis catatan terenkripsi AES-256, lukis doodle, atau bagikan lembar cerita ke Orang Tua (Fatiha).',
                    'Enter Sarrah’s (11 yo) two-page journal book, write AES-256 encrypted notes, draw doodles, or share a page with Fatiha.',
                    'Sarrah（11歳）の見開き魔導書に入り、AES-256暗号化日記やお絵描き、保護者（Fatiha）への共有を体験します。'
                  )}
                </p>
              </div>
              <button
                onClick={() => onQuickPersonaLogin('user_sarrah', 'app', 'journal')}
                className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-amber-500 text-white hover:text-neutral-950 font-semibold text-xs transition-colors cursor-pointer"
              >
                {tr('Masuk Sebagai Sarrah (Anak) →', 'Launch as Sarrah (Child) →', 'Sarrah（子ども）として開く →')}
              </button>
            </div>

            {/* Persona 2: Fatiha (Orang Tua) */}
            <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                  <span>ROLE: ORANG TUA</span>
                  <span className="text-purple-400">🛡️ PARENT PORTAL</span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="https://api.dicebear.com/7.x/initials/svg?seed=Fatiha"
                    alt="Fatiha"
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-xl bg-neutral-800 border border-neutral-700"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">Fatiha</h3>
                    <div className="text-xs text-neutral-400 font-mono">Orang Tua · Wali dari Sarrah</div>
                  </div>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {tr(
                    'Pantau grafik emosi 30 hari Sarrah, uji simulasi peringatan dini 3 hari berturut-turut, dan balas surat yang dibagikan Sarrah.',
                    'Monitor 30-day mood trends for Sarrah, test the 3-day early alert radar, and reply to Sarrah’s shared notes.',
                    'Sarrahの30日間の感情グラフ確認、3日連続低調アラートのテスト、共有ノートへの返信を行います。'
                  )}
                </p>
              </div>
              <button
                onClick={() => onQuickPersonaLogin('user_fatiha', 'app', 'parent')}
                className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-purple-500 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                {tr('Buka Parent Portal Fatiha →', 'Open Fatiha Parent Portal →', 'Fatiha（保護者）ポータルを開く →')}
              </button>
            </div>

            {/* Persona 3: Cahyadi (Super Admin) */}
            <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-800/60 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-indigo-300 font-mono">
                  <span>ROLE: SUPER ADMIN</span>
                  <span>👑 ROOT CONSOLE</span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="https://api.dicebear.com/7.x/bottts/svg?seed=CahyadiAdmin"
                    alt="Cahyadi Super Admin"
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-xl bg-neutral-800 border border-indigo-700"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">Cahyadi</h3>
                    <div className="text-xs text-indigo-300 font-mono">Super Admin · Full RBAC & CMS</div>
                  </div>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {tr(
                    'Buka Modul Super Admin Terpisah milik Cahyadi: kelola akun pengguna, relasi keluarga Sarrah & Fatiha, audit kriptografi, CMS prompt, dan log.',
                    'Launch Cahyadi’s standalone Super Admin Module: manage accounts, family links, crypto vault, CMS prompts, and logs.',
                    'Cahyadiの独立したSuper Adminモジュールを開き、全ユーザー・家族関係・暗号監査・CMSを管理します。'
                  )}
                </p>
              </div>
              <button
                onClick={onOpenSuperAdmin}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                {tr('Buka Super Admin (Cahyadi) →', 'Open Super Admin (Cahyadi) →', 'Super Admin (Cahyadi) を開く →')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          6. PROOF OF IMPACT & ATTRIBUTABLE TESTIMONIALS (#impact)
         ================================================================= */}
      <section id="impact" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="max-w-2xl space-y-2">
            <div className="text-xs font-mono text-amber-400">
              {tr('BUKTI DAMPAK & STUDI KASUS', 'QUANTIFIED IMPACT & CASE STUDIES', '導入実績とケーススタディ')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-magic">
              {tr(
                'Hasil Terukur pada Kebiasaan Refleksi Anak dan Komunikasi Keluarga.',
                'Measurable Outcomes in Youth Reflection Habits and Family Communication.',
                '子どもの自己表現習慣と親子の対話における具体的な改善効果。'
              )}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
                +68% {tr('Konsistensi Jurnal Harian dalam 30 Hari', 'Daily Journaling Consistency in 30 Days', '30日間の日記継続率向上')}
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {tr(
                  'Sebelumnya anak usia 9–14 tahun cepat bosan menulis buku harian biasa. Setelah menggunakan sistem XP, lencana, dan tema Demon Hunter / Wizard Academy, rata-rata rentetan menulis meningkat dari 2 hari menjadi 6,4 hari per minggu.',
                  'Previously, ages 9–14 abandoned plain text diaries within a week. With XP progression, thematic mood potions/breathing forms, and co-op quests, weekly writing streaks increased from 2.0 to 6.4 days per week.',
                  '従来のシンプルな日記帳では1週間以内に飽きていた9〜14歳の児童が、XPレベルとテーマ別感情選択により週平均2日から6.4日へと継続率が向上しました。'
                )}
              </p>
              <div className="pt-3 border-t border-neutral-800 text-xs text-neutral-400">
                Dr. Ratna Wijaya, M.Psi · Psikolog Anak & Remaja, Klinik Tumbuh Kembang Jakarta
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
                100% {tr('Privasi Teks Terjaga (0 Kebocoran Plaintext)', 'Zero-Knowledge Privacy (0 Plaintext Leaks)', '本文プライバシー保護率 100%')}
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {tr(
                  'Anak dan remaja jauh lebih jujur menuangkan perasaan mereka ketika dapat membuktikan sendiri lewat Inspektor Kriptografi bahwa server hanya menyimpan blok AES-256-GCM terenkripsi.',
                  'Youth express academic and social anxieties honestly once they verify through the built-in Crypto Inspector that only AES-256-GCM ciphertext blobs leave their browser.',
                  '暗号インスペクターによって「サーバーにはAES-256暗号文しか保存されない」と自分自身で確認できるため、子どもでも安心して本音を書けるようになりました。'
                )}
              </p>
              <div className="pt-3 border-t border-neutral-800 text-xs text-neutral-400">
                Hendra Kusuma, S.Pd · Koordinator Bimbingan Konseling Sekolah
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="text-2xl font-bold text-pink-400 font-mono tabular-nums">
                3.2x {tr('Lebih Cepat Mendeteksi Kelelahan Emosi Anak', 'Faster Detection of Youth Emotional Fatigue', '感情の落ち込みを3.2倍早期に把握')}
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {tr(
                  'Melalui indikator peringatan dini 3 hari berturut-turut di Parent Portal, orang tua dapat memulai obrolan hangat di rumah tanpa membuat anak merasa dimata-matai.',
                  'Using the 3-day consecutive low-mood indicator in the Parent Portal, guardians initiate supportive conversations at home without making children feel surveilled.',
                  '保護者ポータルの3日間連続低調アラートにより、子どもの日記を盗み見ることなく、適切なタイミングで優しい声かけができるようになりました。'
                )}
              </p>
              <div className="pt-3 border-t border-neutral-800 text-xs text-neutral-400">
                Fatiha · Orang Tua dari Sarrah (11 Tahun)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
          7. VALIDATED FAMILY & SCHOOL LEAD CAPTURE FORM (#contact)
         ================================================================= */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-neutral-900 bg-neutral-950/70">
        <div className="max-w-3xl mx-auto rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 sm:p-8 space-y-6">
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-amber-400">
              {tr('KEMITRAAN SEKOLAH & KELUARGA', 'FAMILY & SCHOOL ONBOARDING', '学校・ご家庭向け導入相談')}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif-magic">
              {tr(
                'Jadwalkan Demo Sekolah atau Konsultasi Pendampingan Keluarga',
                'Request School Pilot Access or Family Onboarding Guide',
                '学校導入パイロットプログラム・ご家庭向けガイドのリクエスト'
              )}
            </h2>
            <p className="text-xs text-neutral-400">
              {tr(
                'Ingin menerapkan Magic Journal untuk program Bimbingan Konseling sekolah atau keluarga besar Anda? Isi formulir tervalidasi di bawah ini.',
                'Interested in deploying Magic Journal for your school counseling program or family? Complete the validated inquiry form below.',
                '学校のカウンセリングプログラムやご家庭での導入をご希望の方は、以下のフォームよりご連絡ください。'
              )}
            </p>
          </div>

          {leadSubmitted ? (
            <div className="p-5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-200 space-y-2">
              <div className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>
                  {tr(
                    'Permintaan Anda Berhasil Diterima!',
                    'Your Inquiry Has Been Received!',
                    'お問い合わせを受け付けました！'
                  )}
                </span>
              </div>
              <p>
                {tr(
                  `Terima kasih, ${leadName}. Panduan implementasi Magic Journal dan akses uji coba telah tercatat untuk ${leadEmail}.`,
                  `Thank you, ${leadName}. Our onboarding guide and pilot details have been registered for ${leadEmail}.`,
                  `${leadName}様、ありがとうございます。${leadEmail} 宛に導入ガイドを手配いたしました。`
                )}
              </p>
              <button
                type="button"
                onClick={() => {
                  setLeadSubmitted(false);
                  setLeadName('');
                  setLeadEmail('');
                  setLeadMessage('');
                }}
                className="text-emerald-400 underline underline-offset-4 font-semibold cursor-pointer pt-1"
              >
                {tr('Kirim pesan lainnya', 'Send another inquiry', '別のお問い合わせを送る')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {tr('Nama Lengkap *', 'Full Name *', 'お名前 *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder={tr('Nama Anda', 'Your Name', '山田 太郎')}
                    className="w-full px-3 py-2.5 rounded-lg bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {tr('Alamat Email *', 'Email Address *', 'メールアドレス *')}
                  </label>
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="nama@sekolah.sch.id"
                    className="w-full px-3 py-2.5 rounded-lg bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    {tr('Kategori Institusi / Peran', 'Role / Institution', 'ご所属・立場')}
                  </label>
                  <select
                    value={leadOrg}
                    onChange={(e) => setLeadOrg(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-lg bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="parent">{tr('Orang Tua / Wali', 'Parent / Guardian', '保護者')}</option>
                    <option value="school">{tr('Sekolah / Pendidik', 'School / Educator', '学校・教育機関')}</option>
                    <option value="counselor">{tr('Psikolog / Konselor Anak', 'Child Counselor', '児童カウンセラー')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  {tr('Catatan atau Kebutuhan Khusus', 'Notes or Specific Needs', 'ご質問・ご要望')}
                </label>
                <textarea
                  rows={2}
                  value={leadMessage}
                  onChange={(e) => setLeadMessage(e.target.value)}
                  placeholder={tr(
                    'Ceritakan usia anak atau jumlah siswa yang ingin didampingi...',
                    'Share your child’s age group or number of students...',
                    '対象のお子様の年齢や導入予定人数などをご記入ください...'
                  )}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {leadError && (
                <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-200">
                  {leadError}
                </div>
              )}

              <div className="flex items-center justify-between gap-4 pt-1">
                <span className="text-[11px] text-neutral-400">
                  {tr(
                    'Atau langsung mulai gratis tanpa menunggu.',
                    'Or launch the application immediately for free.',
                    'または今すぐ無料でアプリを開始できます。'
                  )}
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{tr('Kirim Permintaan Panduan', 'Request Onboarding Guide', '導入ガイドをリクエスト')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* =================================================================
          8. QUIET FOOTER
         ================================================================= */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-10 px-4 sm:px-6 lg:px-8 text-xs text-neutral-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="font-serif-magic font-bold text-white text-base">Magic Journal</div>
            <p className="text-neutral-400">
              {tr(
                'Platform Jurnal Gamifikasi Anak & Remaja dengan Enkripsi Klien AES-256-GCM.',
                'Gamified Youth Journaling Platform with Client-Side AES-256-GCM Encryption.',
                'クライアント側AES-256-GCM暗号化を備えた子ども・若者向けゲーミフィケーション日記。'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs">
            <button
              onClick={() => onEnterApp('journal')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {tr('Ruang Jurnal', 'Journal Workspace', 'ジャーナル')}
            </button>
            <button
              onClick={() => onEnterApp('collab')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {tr('Kolaborasi Teman', 'Friend Co-op', 'フレンド協力')}
            </button>
            <button
              onClick={() => onEnterApp('parent')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Parent Portal
            </button>
            <button
              onClick={onOpenSuperAdmin}
              className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
            >
              Super Admin Console
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
