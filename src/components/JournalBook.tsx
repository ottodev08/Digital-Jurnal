import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  BookMarked,
  Sparkles,
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Calendar,
  PenLine,
  Bookmark,
  Layers,
  RefreshCw,
  Eye,
  Flame,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
  Heart,
  Users,
  Share2,
  MessageCircleHeart,
  Send,
} from 'lucide-react';
import { ThemeId, JournalEntry, User, ParentShare } from '../types';
import {
  WIZARD_MOODS,
  DEMON_HUNTER_MOODS,
  WIZARD_PROMPTS,
  DEMON_HUNTER_PROMPTS,
  WIZARD_STICKERS,
  DEMON_HUNTER_STICKERS,
  MoodOption,
} from '../data/promptsAndThemes';
import { encryptJournalText, decryptJournalText } from '../utils/crypto';
import { authFetch } from '../utils/auth';
import { useLanguage } from '../context/LanguageContext';
import { DoodleCanvas } from './DoodleCanvas';
import { CryptoInspectorModal } from './CryptoInspectorModal';
import { ShareWithParentModal } from './ShareWithParentModal';
import { FriendCollaborationView } from './FriendCollaborationView';

interface JournalBookProps {
  user: User;
  theme: ThemeId;
  journals: JournalEntry[];
  onJournalCreated: (journal: JournalEntry, updatedUser: User) => void;
}

export const JournalBook: React.FC<JournalBookProps> = ({
  user,
  theme,
  journals,
  onJournalCreated,
}) => {
  const { language, t, prompts: localizedPrompts, getMood, getStickerLabel } = useLanguage();
  const isWizard = theme === 'wizard_academy';
  const moods = isWizard ? WIZARD_MOODS : DEMON_HUNTER_MOODS;
  const prompts = isWizard ? localizedPrompts.wizard : localizedPrompts.demonHunter;
  const stickers = isWizard ? WIZARD_STICKERS : DEMON_HUNTER_STICKERS;

  // Book Navigation Modes: 'write' | 'read' | 'toc' | 'shares' | 'collab'
  const [bookMode, setBookMode] = useState<'write' | 'read' | 'toc' | 'shares' | 'collab'>('write');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Parent Sharing State
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [parentShares, setParentShares] = useState<ParentShare[]>([]);

  // Fetch Parent Shares on mount & refresh
  const fetchParentShares = async () => {
    try {
      const res = await authFetch('/api/parent-shares');
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setParentShares(data);
      }
    } catch (err) {
      console.error('Failed to load parent shares', err);
    }
  };

  useEffect(() => {
    fetchParentShares();
  }, []);

  // Form State (Left Page)
  const [selectedMood, setSelectedMood] = useState<MoodOption>(moods[1]);
  const [promptIndex, setPromptIndex] = useState(0);
  const [journalText, setJournalText] = useState('');
  const [encryptionPin, setEncryptionPin] = useState('1234');
  const [showPin, setShowPin] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(stickers[0]?.emoji || '✨');
  const [doodleDataUrl, setDoodleDataUrl] = useState<string | null>(null);
  const [showDoodleCanvas, setShowDoodleCanvas] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getMoodEmoji = (score: number) => {
    if (score === 5) return isWizard ? '✨' : '🔥';
    if (score === 4) return isWizard ? '🧪' : '🌊';
    if (score === 3) return isWizard ? '🍵' : '🍃';
    if (score === 2) return isWizard ? '🌫️' : '⚡';
    return isWizard ? '🌑' : '🩸';
  };

  // Reader Mode State
  const [decryptionPins, setDecryptionPins] = useState<Record<string, string>>({});
  const [decryptedTexts, setDecryptedTexts] = useState<Record<string, string>>({});
  const [decryptErrors, setDecryptErrors] = useState<Record<string, string>>({});

  // Crypto Inspector
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [activeInspectorPayload, setActiveInspectorPayload] = useState<any>(null);

  const currentPrompt = prompts[promptIndex % prompts.length];

  const handleNextPrompt = () => {
    setPromptIndex((prev) => (prev + 1) % prompts.length);
  };

  const triggerConfetti = () => {
    if (isWizard) {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#9333EA', '#F59E0B', '#F3E8FF'],
      });
    } else {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#06B6D4', '#EF4444', '#F59E0B'],
      });
    }
  };

  const handleSaveToBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!journalText.trim() && !doodleDataUrl) {
      setErrorMessage(t('bookSaveErrorValidation'));
      return;
    }

    if (!encryptionPin.trim()) {
      setErrorMessage(
        language === 'ja'
          ? '魔導書にAES-256封印を施すため、暗号化PINを入力してください。'
          : language === 'en'
          ? 'Secret PIN is required to apply the client-side AES-256 seal.'
          : 'PIN/Kunci rahasia diperlukan agar segel enkripsi AES-256 dapat dipasang.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Client-Side AES-256-GCM Encryption
      const encryptedPayload = await encryptJournalText(journalText, encryptionPin);
      setActiveInspectorPayload(encryptedPayload);

      // 2. Persist to Backend REST API (Saves permanently to Cloud Firestore)
      const res = await authFetch('/api/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moodScore: selectedMood.score,
          moodLabel: selectedMood.name,
          promptQuestion: currentPrompt,
          encryptedContent: encryptedPayload,
          doodleDataUrl: doodleDataUrl || undefined,
          sticker: selectedSticker || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t('bookSaveErrorGeneral'));
      }

      triggerConfetti();

      const createdEntry: JournalEntry = {
        ...data.journal,
        decryptedText: journalText,
      };

      onJournalCreated(createdEntry, data.updatedUser);

      // Reset form
      setJournalText('');
      setDoodleDataUrl(null);
      setShowDoodleCanvas(false);

      // Automatically switch to reader mode to view newly added page
      setCurrentPageIndex(0);
      setBookMode('read');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(t('bookSaveErrorGeneral'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnlockPage = async (journal: JournalEntry) => {
    const pin = decryptionPins[journal.id] || '1234';
    try {
      setDecryptErrors((prev) => ({ ...prev, [journal.id]: '' }));
      const plain = await decryptJournalText(journal.encryptedContent, pin);
      setDecryptedTexts((prev) => ({ ...prev, [journal.id]: plain }));
    } catch {
      setDecryptErrors((prev) => ({
        ...prev,
        [journal.id]: t('incorrectPin'),
      }));
    }
  };

  // Current journal for read mode
  const currentJournal = journals[currentPageIndex] || null;

  return (
    <div className="space-y-4">
      {/* Top Book Controls & Mode Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${
              isWizard ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}
          >
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              {language === 'ja'
                ? isWizard
                  ? '秘密の魔導書（魔法学園）'
                  : '鬼狩りの見聞録'
                : language === 'en'
                ? isWizard
                  ? 'Private Grimoire (Wizard Academy)'
                  : 'Demon Hunter Chronicles'
                : isWizard
                ? 'Grimoire Pribadi (Wizard Academy)'
                : 'Buku Catatan Pemburu Iblis'}
            </h2>
            <div className="text-[10px] text-neutral-400">
              {language === 'ja' ? '冒険者: ' : language === 'en' ? 'Author: ' : 'Milik: '}
              <strong className="text-neutral-200">{user.name}</strong> &bull;{' '}
              {journals.length} {t('journalsCountLabel')}
            </div>
          </div>
        </div>

        {/* View Segmented Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-black/40 rounded-xl border border-neutral-800">
          <button
            onClick={() => setBookMode('write')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              bookMode === 'write'
                ? isWizard
                  ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                  : 'bg-emerald-500 text-neutral-950 shadow-md font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>{t('bookTabWrite')}</span>
          </button>

          <button
            onClick={() => setBookMode('read')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              bookMode === 'read'
                ? isWizard
                  ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                  : 'bg-emerald-500 text-neutral-950 shadow-md font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>{t('bookTabRead')} ({journals.length})</span>
          </button>

          <button
            onClick={() => setBookMode('toc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              bookMode === 'toc'
                ? isWizard
                  ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                  : 'bg-emerald-500 text-neutral-950 shadow-md font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t('bookTabIndex')}</span>
          </button>

          <button
            onClick={() => setBookMode('shares')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              bookMode === 'shares'
                ? 'bg-pink-600 text-white shadow-md font-bold'
                : 'text-pink-300 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>{t('bookTabShares')} {parentShares.length > 0 ? `(${parentShares.length})` : ''}</span>
          </button>

          <button
            onClick={() => setBookMode('collab')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              bookMode === 'collab'
                ? isWizard
                  ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                  : 'bg-emerald-500 text-neutral-950 shadow-md font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t('bookTabCollab')}</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PHYSICAL JOURNAL BOOK CONTAINER (Open Book 2-Page Spread)     */}
      {/* ============================================================== */}
      <div className="relative mx-auto w-full transition-all">
        {/* Exterior Book Cover / Hardback Leather Outer Frame */}
        <div
          className={`relative rounded-3xl p-3 sm:p-5 shadow-2xl transition-all border-4 ${
            isWizard
              ? 'bg-gradient-to-br from-[#2b0e0e] via-[#1a0a0a] to-[#2e1208] border-[#78350f] shadow-[#000000]/80'
              : 'bg-gradient-to-br from-[#062419] via-[#091a13] to-[#041710] border-[#065f46] shadow-[#000000]/80'
          }`}
        >
          {/* Brass Book Corner Protectors */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400/80 rounded-tl-xl pointer-events-none" />
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400/80 rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400/80 rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400/80 rounded-br-xl pointer-events-none" />

          {/* Hanging Satin Bookmark Ribbon */}
          <div
            className={`absolute top-0 right-16 sm:right-28 z-30 w-5 sm:w-6 h-12 sm:h-16 shadow-lg rounded-b-md flex items-end justify-center pb-1 ${
              isWizard
                ? 'bg-gradient-to-b from-red-800 to-amber-700 border-x border-amber-500/40 text-amber-200'
                : 'bg-gradient-to-b from-emerald-800 to-teal-700 border-x border-emerald-400/40 text-emerald-200'
            }`}
            title={t('bookBookmarkRibbon')}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
          </div>

          {/* Book Interior Parchment Spreads (Left & Right Pages) */}
          <div className="relative grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-inner border border-amber-900/40 bg-[#fbf7ee] text-neutral-900 min-h-[580px]">
            {/* Center Spine Crease & Shadow Overlay */}
            <div className="hidden lg:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 z-20 pointer-events-none bg-gradient-to-r from-black/25 via-black/40 to-black/25 opacity-70" />

            {/* Central Sewn Stitching Markers on Spine */}
            <div className="hidden lg:flex flex-col justify-around absolute inset-y-6 left-1/2 -translate-x-1/2 z-25 pointer-events-none items-center">
              <span className="w-1 h-3 bg-amber-900/40 rounded-full" />
              <span className="w-1 h-3 bg-amber-900/40 rounded-full" />
              <span className="w-1 h-3 bg-amber-900/40 rounded-full" />
              <span className="w-1 h-3 bg-amber-900/40 rounded-full" />
              <span className="w-1 h-3 bg-amber-900/40 rounded-full" />
            </div>

            {/* ============================================================== */}
            {/* VIEW MODE 1: WRITE SPREAD (2 Pages: Form Kiri + Visual Kanan)  */}
            {/* ============================================================== */}
            {bookMode === 'write' && (
              <>
                {/* ----------------- LEFT PAGE: Writing Canvas ----------------- */}
                <div className="relative p-5 sm:p-7 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-amber-900/20 bg-gradient-to-br from-[#fcf9f2] to-[#f5eedc]">
                  {/* Watermark / Header of Page */}
                  <div className="flex items-center justify-between border-b border-amber-800/20 pb-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{isWizard ? '📜' : '🎋'}</span>
                      <span className="text-[11px] font-bold font-serif-magic uppercase tracking-wider text-amber-950">
                        {isWizard ? t('bookWizardPageTitle') : t('bookHunterPageTitle')}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-amber-900/70 font-semibold">
                      {language === 'ja' ? 'P. ' : language === 'en' ? 'P. ' : 'Hal. '} {journals.length + 1} &bull; {new Date().toLocaleDateString(language === 'ja' ? 'ja-JP' : language === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  <form onSubmit={handleSaveToBook} className="space-y-4 flex-1 flex flex-col justify-between">
                    {/* Step 1: Mood Alchemical Stamp Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                          {isWizard ? t('bookStep1MoodWizard') : t('bookStep1MoodHunter')}
                        </label>
                        <span className="text-[10px] font-serif-magic text-amber-800 font-bold">
                          {getMood(selectedMood.score, selectedMood.name)} ({selectedMood.score}/5)
                        </span>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5">
                        {moods.map((m) => {
                          const isSelected = selectedMood.score === m.score;
                          return (
                            <button
                              key={m.score}
                              type="button"
                              onClick={() => setSelectedMood(m)}
                              className={`p-1.5 sm:p-2 rounded-xl text-center transition-all flex flex-col items-center justify-center border cursor-pointer ${
                                isSelected
                                  ? isWizard
                                    ? 'bg-amber-600/20 border-amber-700 shadow-md ring-2 ring-amber-600 font-bold text-amber-950 scale-105'
                                    : 'bg-emerald-600/20 border-emerald-700 shadow-md ring-2 ring-emerald-600 font-bold text-emerald-950 scale-105'
                                  : 'bg-amber-100/60 border-amber-900/10 hover:bg-amber-200/60 text-amber-900/80'
                              }`}
                            >
                              <span className="text-xl sm:text-2xl">{getMoodEmoji(m.score)}</span>
                              <span className="text-[10px] truncate max-w-full font-serif-magic mt-0.5">
                                {getMood(m.score, m.name).split(/[:：]/)[0]}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 2: Prompt Box */}
                    <div className="p-3 rounded-xl bg-amber-100/70 border border-amber-800/20 relative group">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase text-amber-900 mb-1">
                        <span>{t('promptQuestionLabel')}:</span>
                        <button
                          type="button"
                          onClick={handleNextPrompt}
                          className="hover:text-amber-700 font-mono text-[10px] flex items-center gap-1 cursor-pointer underline underline-offset-2"
                        >
                          <RefreshCw className="w-3 h-3" /> {t('refreshPrompt')}
                        </button>
                      </div>
                      <p className="text-xs font-serif-magic italic font-bold text-amber-950 leading-relaxed">
                        &ldquo;{currentPrompt}&rdquo;
                      </p>
                    </div>

                    {/* Step 3: Lined Notebook Page Writing Area */}
                    <div className="space-y-1 flex-1 flex flex-col">
                      <div className="flex items-center justify-between text-[11px] text-amber-900 font-bold">
                        <span>
                          {t('bookStep2Write')}
                        </span>
                        <span className="font-mono text-[10px] text-amber-800/80">
                          {journalText.length} {t('bookCharCountUnit')}
                        </span>
                      </div>

                      <div className="relative flex-1 min-h-[160px] rounded-xl p-3 bg-white/80 border border-amber-900/20 shadow-inner">
                        {/* Faint Red Margin Line */}
                        <div className="absolute top-0 bottom-0 left-6 w-[1.5px] bg-red-400/40 pointer-events-none" />

                        <textarea
                          value={journalText}
                          onChange={(e) => setJournalText(e.target.value)}
                          placeholder={t('reflectionPlaceholder')}
                          className="w-full h-full pl-6 pr-2 bg-transparent text-xs sm:text-sm text-neutral-900 leading-[26px] resize-none focus:outline-none font-serif-magic placeholder-neutral-400"
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(transparent, transparent 25px, rgba(120, 53, 15, 0.12) 26px)',
                            backgroundAttachment: 'local',
                          }}
                        />

                        {/* Visual Sticker Pinned on Top Right Corner */}
                        {selectedSticker && (
                          <div
                            className="absolute top-2 right-2 text-3xl select-none filter drop-shadow-md transform rotate-6 pointer-events-none"
                            title={t('chooseSticker')}
                          >
                            {selectedSticker}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Step 4: Secret PIN / Wax Seal Lock */}
                    <div className="p-2.5 rounded-xl bg-amber-950/10 border border-amber-900/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">🔒</span>
                        <div>
                          <div className="font-bold text-amber-950 text-[11px]">
                            {t('encryptionKeyTitle')}
                          </div>
                          <div className="text-[10px] text-amber-900/80">
                            {t('encryptionKeyDesc')}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 bg-white/90 px-2 py-1 rounded-lg border border-amber-900/30">
                        <Key className="w-3.5 h-3.5 text-amber-900" />
                        <span className="text-[10px] font-bold text-amber-900">PIN:</span>
                        <input
                          type={showPin ? 'text' : 'password'}
                          value={encryptionPin}
                          onChange={(e) => setEncryptionPin(e.target.value)}
                          className="w-12 text-center text-xs font-mono font-bold text-amber-950 focus:outline-none"
                          maxLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPin(!showPin)}
                          className="text-amber-800 hover:text-amber-950 p-0.5 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {errorMessage && (
                      <div className="p-2 bg-red-100 border border-red-300 rounded-lg text-xs text-red-800 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                        isWizard
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white'
                          : 'bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>{t('savingJournal')}</span>
                        </>
                      ) : (
                        <>
                          {isWizard ? <Sparkles className="w-3.5 h-3.5" /> : <Flame className="w-3.5 h-3.5" />}
                          <span>{t('saveJournalBtn')}</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* ----------------- RIGHT PAGE: Interactive Canvas & Magic Seals ----------------- */}
                <div className="relative p-5 sm:p-7 flex flex-col justify-between bg-gradient-to-bl from-[#fcf9f2] to-[#f5eedc]">
                  {/* Header of Right Page */}
                  <div className="flex items-center justify-between border-b border-amber-800/20 pb-2 mb-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold font-serif-magic uppercase tracking-wider text-amber-950">
                      <span>🎨</span>
                      <span>{t('bookArtPageTitle')}</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-900/70 font-semibold">
                      {language === 'ja' ? 'P. ' : language === 'en' ? 'P. ' : 'Hal. '} {journals.length + 2} {t('bookArtPageNumber')}
                    </span>
                  </div>

                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    {/* Sticker Palette to Stick on Page */}
                    <div>
                      <div className="text-[11px] font-bold text-amber-900 mb-1.5">
                        {t('bookStickerPaletteTitle')}
                      </div>
                      <div className="flex flex-wrap gap-2 p-2 rounded-xl bg-white/70 border border-amber-900/10">
                        {stickers.map((stk) => (
                          <button
                            key={stk.id}
                            type="button"
                            onClick={() => setSelectedSticker(stk.emoji)}
                            className={`w-9 h-9 text-xl rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                              selectedSticker === stk.emoji
                                ? 'bg-amber-200 border-2 border-amber-700 scale-110 shadow-sm'
                                : 'hover:bg-amber-100 hover:scale-105'
                            }`}
                            title={getStickerLabel(stk.id, stk.label)}
                          >
                            {stk.emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Embedded Doodle Section */}
                    <div className="space-y-2 flex-1 flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-900">
                          {t('bookDoodleSectionTitle')}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowDoodleCanvas(!showDoodleCanvas)}
                          className="text-[10px] font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
                        >
                          {showDoodleCanvas ? t('bookHideCanvas') : t('bookOpenCanvas')}
                        </button>
                      </div>

                      {showDoodleCanvas ? (
                        <div className="p-3 bg-white/90 rounded-xl border border-amber-900/20 shadow-inner flex-1 flex flex-col">
                          <DoodleCanvas
                            theme={theme}
                            onSaveDoodle={(url) => {
                              setDoodleDataUrl(url);
                              setShowDoodleCanvas(false);
                            }}
                            initialDoodle={doodleDataUrl || undefined}
                          />
                        </div>
                      ) : (
                        <div
                          onClick={() => setShowDoodleCanvas(true)}
                          className="flex-1 min-h-[160px] rounded-xl border-2 border-dashed border-amber-800/30 bg-amber-50/50 hover:bg-amber-100/50 transition-colors flex flex-col items-center justify-center p-4 text-center cursor-pointer group"
                        >
                          {doodleDataUrl ? (
                            <div className="space-y-2">
                              <img
                                src={doodleDataUrl}
                                alt={t('bookSavedDoodle')}
                                className="max-h-28 rounded-lg border border-amber-800/30 mx-auto shadow-sm"
                              />
                              <div className="text-[10px] font-bold text-amber-900 group-hover:underline">
                                {t('bookClickToEditDoodle')}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <div className="w-10 h-10 rounded-full bg-amber-200/60 flex items-center justify-center text-xl mx-auto group-hover:scale-110 transition-transform">
                                🖌️
                              </div>
                              <div className="text-xs font-bold text-amber-950 font-serif-magic">
                                {t('bookTouchToDraw')}
                              </div>
                              <div className="text-[10px] text-amber-800/80 max-w-xs">
                                {t('bookTouchToDrawSub')}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Educational Security Explanation Inside Book */}
                    <div className="p-3 rounded-xl bg-amber-950/10 border border-amber-900/20 space-y-1 text-left">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>{t('bookPrivacyGuaranteeTitle')}</span>
                      </div>
                      <p className="text-[11px] text-amber-900/90 leading-relaxed font-serif-magic">
                        {t('bookPrivacyGuaranteeDesc')}
                      </p>
                    </div>
                  </div>

                  {/* Page Footer */}
                  <div className="pt-3 border-t border-amber-900/10 flex items-center justify-between text-[10px] font-mono text-amber-900/60">
                    <span>Magic Journal Book &bull; {t('bookEditionYear')}</span>
                    <span>{t('bookSavedInFirestore')}</span>
                  </div>
                </div>
              </>
            )}

            {/* ============================================================== */}
            {/* VIEW MODE 2: READ SPREAD (Flipbook Halaman demi Halaman)       */}
            {/* ============================================================== */}
            {bookMode === 'read' && (
              <>
                {journals.length === 0 ? (
                  <div className="col-span-2 p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[460px]">
                    <div className="w-16 h-16 rounded-full bg-amber-200/50 flex items-center justify-center text-3xl">
                      📖
                    </div>
                    <h3 className="text-base font-bold text-amber-950 font-serif-magic">
                      {t('bookEmptyReadTitle')}
                    </h3>
                    <p className="text-xs text-amber-900/80 max-w-md">
                      {t('bookEmptyReadDesc')}
                    </p>
                    <button
                      onClick={() => setBookMode('write')}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <PenLine className="w-4 h-4" />
                      <span>{t('startFirstEntry')}</span>
                    </button>
                  </div>
                ) : currentJournal ? (
                  <>
                    {/* LEFT PAGE OF READER: Text & Decryption */}
                    <div className="relative p-5 sm:p-7 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-amber-900/20 bg-gradient-to-br from-[#fcf9f2] to-[#f5eedc]">
                      <div>
                        {/* Page Header */}
                        <div className="flex items-center justify-between border-b border-amber-800/20 pb-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{currentJournal.sticker || '📜'}</span>
                            <div>
                              <div className="text-xs font-bold text-amber-950 font-serif-magic">
                                {getMood(currentJournal.moodScore, currentJournal.moodLabel)}
                              </div>
                              <div className="text-[10px] text-amber-900/70 font-mono">
                                {t('bookScoreEmosi')}: {currentJournal.moodScore}/5
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-[10px] font-mono text-amber-900 font-bold">
                              {language === 'ja' ? `ページ ${currentPageIndex + 1} / ${journals.length}` : language === 'en' ? `Page ${currentPageIndex + 1} of ${journals.length}` : `Halaman ${currentPageIndex + 1} dari ${journals.length}`}
                            </div>
                            <div className="text-[10px] text-amber-900/60">
                              {new Date(currentJournal.createdAt).toLocaleDateString(language === 'ja' ? 'ja-JP' : language === 'en' ? 'en-US' : 'id-ID', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Prompt */}
                        <div className="p-2.5 rounded-xl bg-amber-100/60 border border-amber-900/10 mb-3">
                          <div className="text-[10px] font-mono font-bold uppercase text-amber-900 mb-0.5">
                            {t('promptQuestionLabel')}:
                          </div>
                          <p className="text-xs font-serif-magic italic font-bold text-amber-950">
                            &ldquo;{currentJournal.promptQuestion}&rdquo;
                          </p>
                        </div>

                        {/* Page Content: Locked vs Unlocked */}
                        {currentJournal.decryptedText || decryptedTexts[currentJournal.id] ? (
                          <div className="p-4 rounded-xl bg-white/80 border border-amber-900/20 shadow-inner min-h-[220px]">
                            <div className="flex items-center justify-between text-[10px] text-emerald-800 font-bold border-b border-amber-900/10 pb-1 mb-2">
                              <span className="flex items-center gap-1">
                                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                                {t('bookDecryptedBadge')}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-neutral-900 leading-[26px] font-serif-magic whitespace-pre-wrap">
                              {currentJournal.decryptedText || decryptedTexts[currentJournal.id]}
                            </p>
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-amber-100/80 border border-amber-900/20 text-center space-y-3 min-h-[220px] flex flex-col items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-amber-600/20 text-amber-800 flex items-center justify-center text-xl">
                              🔒
                            </div>
                            <div>
                              <div className="text-xs font-bold text-amber-950 font-serif-magic">
                                {t('decryptPromptTitle')}
                              </div>
                              <p className="text-[11px] text-amber-900/80 max-w-xs mt-0.5">
                                {t('decryptPromptDesc')}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                type="password"
                                placeholder="PIN..."
                                value={decryptionPins[currentJournal.id] ?? '1234'}
                                onChange={(e) =>
                                  setDecryptionPins((prev) => ({
                                    ...prev,
                                    [currentJournal.id]: e.target.value,
                                  }))
                                }
                                className="w-20 px-2 py-1.5 rounded-lg border border-amber-900/30 text-xs font-mono text-center bg-white"
                                maxLength={6}
                              />
                              <button
                                onClick={() => handleUnlockPage(currentJournal)}
                                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm cursor-pointer"
                              >
                                {t('unlockEntryBtn')}
                              </button>
                            </div>

                            {decryptErrors[currentJournal.id] && (
                              <div className="text-[10px] text-red-700 font-medium">
                                {t('incorrectPin')}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Parent Sharing Card & Action */}
                        <div className="mt-3 pt-3 border-t border-amber-900/15">
                          {(() => {
                            const matchedShare = parentShares.find(
                              (ps) => ps.journalId === currentJournal.id
                            );
                            return (
                              <div className="space-y-2">
                                {matchedShare && (
                                  <div className="p-2.5 rounded-xl bg-pink-100/90 border border-pink-300 text-pink-950 space-y-1 shadow-xs">
                                    <div className="flex items-center justify-between text-xs font-bold text-pink-900">
                                      <span className="flex items-center gap-1">
                                        <Heart className="w-3.5 h-3.5 text-pink-600 fill-pink-500" />
                                        {t('sharedWithParentBadge')}
                                      </span>
                                      {matchedShare.parentReaction && (
                                        <span
                                          className="px-2 py-0.5 rounded-full bg-white text-sm shadow-xs border border-pink-200"
                                          title={t('parentStampHeading')}
                                        >
                                          {matchedShare.parentReaction}
                                        </span>
                                      )}
                                    </div>
                                    {matchedShare.childNote && (
                                      <p className="text-[11px] text-pink-900/80 italic font-serif-magic">
                                        {t('bookParentNoteLabel')}: &ldquo;{matchedShare.childNote}&rdquo;
                                      </p>
                                    )}
                                    {matchedShare.parentReply ? (
                                      <div className="pt-1 mt-1 border-t border-pink-200 text-xs">
                                        <span className="text-[10px] uppercase font-bold text-pink-800 block">
                                          {t('parentReplyHeading')}:
                                        </span>
                                        <p className="font-serif-magic italic font-bold text-pink-950">
                                          &ldquo;{matchedShare.parentReply}&rdquo;
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="text-[10px] text-pink-700 font-mono">
                                        {t('waitingForParentReply')}
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="flex items-center justify-between gap-2">
                                  <button
                                    onClick={() => setShareModalOpen(true)}
                                    className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
                                    title={t('bookShareVolunteerTooltip')}
                                  >
                                    <Heart className="w-3.5 h-3.5 fill-white" />
                                    <span>
                                      {matchedShare
                                        ? t('bookUpdateLetterBtn')
                                        : language === 'ja'
                                        ? '💌 保護者に届ける (+50 XP)'
                                        : language === 'en'
                                        ? '💌 Share with Parents (+50 XP)'
                                        : '💌 Bagikan ke Orang Tua (+50 XP)'}
                                    </span>
                                  </button>

                                  <button
                                    onClick={() => setBookMode('shares')}
                                    className="text-[11px] font-bold text-pink-800 hover:text-pink-950 underline cursor-pointer"
                                  >
                                    {t('bookViewAllLetters')}
                                  </button>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Pagination Controls */}
                      <div className="flex items-center justify-between pt-3 border-t border-amber-900/10 mt-4">
                        <button
                          onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
                          disabled={currentPageIndex === 0}
                          className="px-3 py-1.5 rounded-lg border border-amber-900/20 bg-amber-100/60 hover:bg-amber-200/60 disabled:opacity-40 text-xs font-bold text-amber-950 flex items-center gap-1 cursor-pointer"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>{t('readPreviousPage')}</span>
                        </button>

                        <button
                          onClick={() =>
                            setCurrentPageIndex((prev) => Math.min(journals.length - 1, prev + 1))
                          }
                          disabled={currentPageIndex >= journals.length - 1}
                          className="px-3 py-1.5 rounded-lg border border-amber-900/20 bg-amber-100/60 hover:bg-amber-200/60 disabled:opacity-40 text-xs font-bold text-amber-950 flex items-center gap-1 cursor-pointer"
                        >
                          <span>{t('readNextPage')}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* RIGHT PAGE OF READER: Doodle & Cryptographic Artifact */}
                    <div className="relative p-5 sm:p-7 flex flex-col justify-between bg-gradient-to-bl from-[#fcf9f2] to-[#f5eedc]">
                      <div>
                        {/* Page Header */}
                        <div className="flex items-center justify-between border-b border-amber-800/20 pb-2 mb-3">
                          <div className="text-[11px] font-bold font-serif-magic uppercase tracking-wider text-amber-950">
                            {t('bookVisualProof')}
                          </div>
                          <span className="text-[10px] font-mono text-amber-900/60">
                            ID: {currentJournal.id}
                          </span>
                        </div>

                        {/* Display Doodle if attached */}
                        <div className="space-y-2 mb-4">
                          <span className="text-[11px] font-bold text-amber-900 block">
                            {t('bookDoodleSketch')}
                          </span>
                          {currentJournal.doodleDataUrl ? (
                            <div className="p-3 bg-white/90 rounded-xl border border-amber-900/20 shadow-inner text-center">
                              <img
                                src={currentJournal.doodleDataUrl}
                                alt={t('bookSavedDoodle')}
                                className="max-h-48 rounded-lg mx-auto border border-amber-800/20 object-contain"
                              />
                            </div>
                          ) : (
                            <div className="p-6 rounded-xl border border-dashed border-amber-900/20 bg-amber-100/30 text-center text-xs text-amber-800/70 font-serif-magic">
                              {t('bookNoDoodleOnPage')}
                            </div>
                          )}
                        </div>

                        {/* Cryptographic Proof Box */}
                        <div className="p-3 rounded-xl bg-amber-950/10 border border-amber-900/20 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-950 text-[11px] flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                              {t('bookPayloadTitle')}:
                            </span>
                            <button
                              onClick={() => {
                                setActiveInspectorPayload(currentJournal.encryptedContent);
                                setInspectorOpen(true);
                              }}
                              className="text-[10px] font-mono font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
                            >
                              {t('bookOpenInspectorBtn')}
                            </button>
                          </div>
                          <div className="p-2 rounded bg-black/80 font-mono text-[10px] text-amber-300 break-all leading-tight max-h-20 overflow-y-auto">
                            {currentJournal.encryptedContent.ciphertext}
                          </div>
                          <div className="text-[10px] text-amber-900/80 flex items-center justify-between">
                            <span>Algo: {currentJournal.encryptedContent.algo}</span>
                            <span>IV: {currentJournal.encryptedContent.iv.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-amber-900/10 flex items-center justify-between">
                        <button
                          onClick={() => setBookMode('toc')}
                          className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>{t('bookOpenTocBtn')}</span>
                        </button>
                        <button
                          onClick={() => setBookMode('write')}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm cursor-pointer flex items-center gap-1"
                        >
                          <PenLine className="w-3.5 h-3.5" />
                          <span>{t('bookWriteNewPageBtn')}</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : null}
              </>
            )}

            {/* ============================================================== */}
            {/* VIEW MODE 3: TABLE OF CONTENTS (Daftar Isi Buku Harian)         */}
            {/* ============================================================== */}
            {bookMode === 'toc' && (
              <div className="col-span-2 p-6 sm:p-10 bg-gradient-to-br from-[#fcf9f2] via-[#f7f0e0] to-[#f4ebd6] min-h-[500px] flex flex-col justify-between">
                <div>
                  <div className="text-center border-b-2 border-amber-900/30 pb-4 mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold font-serif-magic text-amber-950">
                      {t('bookTocTitle')}
                    </h3>
                    <p className="text-xs text-amber-900/80 mt-1">
                      {t('bookTocSubtitle')} &bull; {journals.length} {t('journalsCountLabel')}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-2">
                    {journals.map((entry, idx) => (
                      <div
                        key={entry.id}
                        onClick={() => {
                          setCurrentPageIndex(idx);
                          setBookMode('read');
                        }}
                        className="p-3 rounded-xl bg-white/70 border border-amber-900/20 hover:border-amber-700 hover:bg-amber-50/90 transition-all flex items-center justify-between gap-3 cursor-pointer group shadow-sm"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl group-hover:scale-110 transition-transform">
                            {entry.sticker || '📜'}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-amber-950 font-serif-magic group-hover:text-amber-800">
                              {t('bookChapterPrefix')} {journals.length - idx}: {getMood(entry.moodScore, entry.moodLabel)}
                            </div>
                            <div className="text-[10px] text-amber-900/70 font-mono">
                              {new Date(entry.createdAt).toLocaleDateString(language === 'ja' ? 'ja-JP' : language === 'en' ? 'en-US' : 'id-ID', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-900/20">
                            {t('bookPagePrefix')} {idx + 1}
                          </span>
                          <ChevronRight className="w-4 h-4 text-amber-800 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-amber-900/20 flex items-center justify-between text-xs mt-4">
                  <span className="text-amber-900/70 font-mono text-[11px]">
                    Magic Journal &bull; {t('bookSavedInFirestore')}
                  </span>
                  <button
                    onClick={() => setBookMode('write')}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <PenLine className="w-4 h-4" />
                    <span>{t('bookWriteNewEntryBtn')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* VIEW MODE 4: SHARED WITH PARENT SPREAD (Lembar untuk Orang Tua) */}
            {/* ============================================================== */}
            {bookMode === 'shares' && (
              <div className="col-span-2 p-5 sm:p-8 bg-gradient-to-br from-[#fffbfa] via-[#fff5f5] to-[#fdeded] min-h-[520px] flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-pink-900/20 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-600 border border-pink-500/30 flex items-center justify-center text-2xl">
                        💌
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold font-serif-magic text-neutral-900">
                          {t('bookSharedParentSpreadTitle')}
                        </h3>
                        <p className="text-xs text-neutral-600">
                          {t('bookSharedParentSpreadDesc')}{' '}
                          <strong className="text-neutral-800">
                            {user.parentEmail || 'fatiha@guardian.local'}
                          </strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {journals.length > 0 && (
                        <button
                          onClick={() => {
                            setCurrentPageIndex(0);
                            setBookMode('read');
                            setTimeout(() => setShareModalOpen(true), 100);
                          }}
                          className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-md shadow-pink-600/20 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                        >
                          <Heart className="w-3.5 h-3.5 fill-white" />
                          <span>{t('bookShareAnotherPageBtn')}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {parentShares.length === 0 ? (
                    <div className="p-10 text-center flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-3xl">
                        🕊️
                      </div>
                      <h4 className="text-base font-bold font-serif-magic text-neutral-800">
                        {t('bookNoSharesYetTitle')}
                      </h4>
                      <p className="text-xs text-neutral-600 max-w-md leading-relaxed">
                        {t('bookNoSharesYetDesc')}
                      </p>
                      {journals.length > 0 && (
                        <button
                          onClick={() => {
                            setCurrentPageIndex(0);
                            setBookMode('read');
                            setTimeout(() => setShareModalOpen(true), 150);
                          }}
                          className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5 mt-2"
                        >
                          <Heart className="w-4 h-4 fill-white" />
                          <span>{t('bookChoosePageAndShareBtn')} (+50 XP)</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-2">
                      {parentShares.map((share) => (
                        <div
                          key={share.id}
                          className="p-4 rounded-2xl bg-white/90 border border-pink-200/80 shadow-sm hover:shadow-md transition-all space-y-2.5"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-pink-100">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{share.sticker || '📜'}</span>
                              <div>
                                <div className="text-xs font-bold text-neutral-900 font-serif-magic">
                                  {getMood(share.moodScore, share.moodLabel)}
                                </div>
                                <div className="text-[10px] text-pink-700 font-mono">
                                  {t('bookScoreEmosi')}: {share.moodScore}/5 &bull;{' '}
                                  {new Date(share.createdAt).toLocaleDateString(language === 'ja' ? 'ja-JP' : language === 'en' ? 'en-US' : 'id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </div>
                              </div>
                            </div>

                            {share.parentReaction && (
                              <span
                                className="px-2.5 py-1 rounded-full bg-pink-100 border border-pink-300 text-lg shadow-xs"
                                title={t('bookParentStampTooltip')}
                              >
                                {share.parentReaction}
                              </span>
                            )}
                          </div>

                          {share.childNote && (
                            <div className="p-2.5 rounded-xl bg-pink-50/70 border border-pink-200/60 text-xs">
                              <span className="text-[10px] uppercase font-bold text-pink-700 block mb-0.5">
                                {t('bookParentNoteLabel')}:
                              </span>
                              <p className="italic font-serif-magic text-neutral-800">
                                &ldquo;{share.childNote}&rdquo;
                              </p>
                            </div>
                          )}

                          <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
                            <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-0.5">
                              {t('bookSharedContentLabel')}:
                            </span>
                            <p className="font-serif-magic text-neutral-800 line-clamp-3">
                              &ldquo;{share.sharedContent}&rdquo;
                            </p>
                          </div>

                          {share.doodleDataUrl && (
                            <div className="text-center pt-1">
                              <img
                                src={share.doodleDataUrl}
                                alt={t('bookSharedDoodle')}
                                className="max-h-24 mx-auto rounded-lg border border-pink-200 object-contain bg-white"
                              />
                            </div>
                          )}

                          {/* Parent Reply Section */}
                          <div className="pt-2 border-t border-pink-100">
                            {share.parentReply ? (
                              <div className="p-2.5 rounded-xl bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-300 text-xs space-y-1">
                                <div className="flex items-center justify-between text-[10px] font-bold text-pink-800">
                                  <span className="flex items-center gap-1">
                                    <Heart className="w-3 h-3 fill-pink-500 text-pink-600" />
                                    {t('bookParentReplyTitle')}:
                                  </span>
                                  {share.parentRepliedAt && (
                                    <span className="font-mono text-[9px] text-pink-600">
                                      {new Date(share.parentRepliedAt).toLocaleDateString(language === 'ja' ? 'ja-JP' : language === 'en' ? 'en-US' : 'id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                      })}
                                    </span>
                                  )}
                                </div>
                                <p className="font-serif-magic italic font-bold text-neutral-900">
                                  &ldquo;{share.parentReply}&rdquo;
                                </p>
                              </div>
                            ) : (
                              <div className="text-[10px] text-pink-600 font-mono flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                                <span>{t('bookWaitingParentReaction')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-pink-900/10 flex items-center justify-between text-xs mt-4">
                  <span className="text-neutral-500 font-mono text-[11px]">
                    {t('bookPrivacyGuaranteedNote')}
                  </span>
                  <button
                    onClick={() => setBookMode('read')}
                    className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{t('bookBackToBookBtn')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* VIEW MODE 5: FRIEND COLLABORATION SPREAD                       */}
            {/* ============================================================== */}
            {bookMode === 'collab' && (
              <div className="col-span-2 p-4 sm:p-6 bg-gradient-to-br from-[#121815] via-[#0d1410] to-[#080d0a] text-white min-h-[520px] rounded-2xl">
                <div className="mb-4 pb-3 border-b border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white font-serif-magic">
                        {t('bookDuoQuestSpreadTitle')}
                      </h3>
                      <p className="text-[10px] text-neutral-400">
                        {t('bookDuoQuestSpreadDesc')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setBookMode('read')}
                    className="text-xs text-neutral-400 hover:text-white underline cursor-pointer"
                  >
                    {t('bookBackToReadingBtn')}
                  </button>
                </div>

                <FriendCollaborationView
                  currentUser={user}
                  theme={theme}
                  onRefreshUser={(u) => onJournalCreated(journals[0] || ({} as any), u)}
                />
              </div>
            )}
          </div>

          {/* Book Bottom Page-Stack Edge Effect (Gives 3D depth of thick book paper) */}
          <div className="h-2 sm:h-3 w-[98%] mx-auto bg-amber-200/80 rounded-b-md shadow-md border-x border-b border-amber-900/40" />
          <div className="h-1 sm:h-1.5 w-[96%] mx-auto bg-amber-100/60 rounded-b-md shadow-sm border-x border-b border-amber-900/30" />
        </div>
      </div>

      {/* Crypto Inspector Modal */}
      <CryptoInspectorModal
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        payload={activeInspectorPayload}
        defaultPassphrase={encryptionPin}
      />

      {/* Share with Parent Modal */}
      <ShareWithParentModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        journal={currentJournal}
        plainText={currentJournal?.decryptedText || decryptedTexts[currentJournal?.id || ''] || ''}
        user={user}
        theme={theme}
        onShareSuccess={() => {
          fetchParentShares();
          if (currentJournal) {
            onJournalCreated(currentJournal, {
              ...user,
              xp: user.xp + 50,
              level: Math.floor((user.xp + 50) / 250) + 1,
            });
          }
        }}
      />
    </div>
  );
};
