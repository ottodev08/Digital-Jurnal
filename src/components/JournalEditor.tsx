import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Lock,
  ShieldCheck,
  RefreshCw,
  Key,
  Flame,
  CheckCircle2,
  ChevronRight,
  Eye,
  PenTool,
  Smile,
  AlertCircle,
} from 'lucide-react';
import { ThemeId, JournalEntry, User } from '../types';
import {
  WIZARD_MOODS,
  DEMON_HUNTER_MOODS,
  WIZARD_PROMPTS,
  DEMON_HUNTER_PROMPTS,
  WIZARD_STICKERS,
  DEMON_HUNTER_STICKERS,
  MoodOption,
} from '../data/promptsAndThemes';
import { encryptJournalText } from '../utils/crypto';
import { authFetch } from '../utils/auth';
import { DoodleCanvas } from './DoodleCanvas';
import { CryptoInspectorModal } from './CryptoInspectorModal';

interface JournalEditorProps {
  user: User;
  theme: ThemeId;
  onJournalCreated: (journal: JournalEntry, updatedUser: User) => void;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({
  user,
  theme,
  onJournalCreated,
}) => {
  const moods = theme === 'wizard_academy' ? WIZARD_MOODS : DEMON_HUNTER_MOODS;
  const prompts = theme === 'wizard_academy' ? WIZARD_PROMPTS : DEMON_HUNTER_PROMPTS;
  const stickers = theme === 'wizard_academy' ? WIZARD_STICKERS : DEMON_HUNTER_STICKERS;

  const [selectedMood, setSelectedMood] = useState<MoodOption>(moods[1]); // Default to good/optimistic
  const [promptIndex, setPromptIndex] = useState(0);
  const [journalText, setJournalText] = useState('');
  const [encryptionPin, setEncryptionPin] = useState('1234');
  const [showPin, setShowPin] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [doodleDataUrl, setDoodleDataUrl] = useState<string | null>(null);
  const [showDoodlePad, setShowDoodlePad] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Crypto Inspector Modal State
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [lastEncryptedPayload, setLastEncryptedPayload] = useState<any>(null);

  const currentPrompt = prompts[promptIndex % prompts.length];

  const handleNextPrompt = () => {
    setPromptIndex((prev) => (prev + 1) % prompts.length);
  };

  const triggerMagicConfetti = () => {
    if (theme === 'wizard_academy') {
      confetti({
        particleCount: 80,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!journalText.trim() && !doodleDataUrl) {
      setErrorMessage('Tuliskan refleksi harianmu atau tambahkan gambar doodle terlebih dahulu.');
      return;
    }

    if (!encryptionPin.trim()) {
      setErrorMessage('PIN/Kunci rahasia enkripsi dibutuhkan agar catatanmu aman.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Client-Side AES-256-GCM Encryption before sending to server
      const encryptedPayload = await encryptJournalText(journalText, encryptionPin);
      setLastEncryptedPayload(encryptedPayload);

      // 2. Dispatch to backend REST API with JWT Bearer header
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
        throw new Error(data.error || 'Gagal menyimpan jurnal.');
      }

      // Success particle burst!
      triggerMagicConfetti();

      // Attach client decrypted text for current active session
      const createdEntry: JournalEntry = {
        ...data.journal,
        decryptedText: journalText,
      };

      onJournalCreated(createdEntry, data.updatedUser);

      // Reset form
      setJournalText('');
      setDoodleDataUrl(null);
      setSelectedSticker(null);
      setShowDoodlePad(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Terjadi kesalahan saat memproses jurnal.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isWizard = theme === 'wizard_academy';

  return (
    <div className="space-y-6">
      {/* Encryption Banner & Security Status */}
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
          isWizard
            ? 'bg-amber-950/30 border-amber-800/40 text-amber-200'
            : 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
        }`}
      >
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isWizard ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-white">
                Enkripsi Klien AES-256 Aktif
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 font-mono text-neutral-300">
                Zero-Knowledge
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Tulisanmu dienkripsi secara lokal sebelum dikirim ke server. Orang tua dan server hanya melihat kode acak.
            </p>
          </div>
        </div>

        {/* PIN Configuration & Inspector Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-black/50 px-2.5 py-1.5 rounded-xl border border-neutral-700/80">
            <Key className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-[10px] text-neutral-400 font-medium">Kunci/PIN:</span>
            <input
              type={showPin ? 'text' : 'password'}
              value={encryptionPin}
              onChange={(e) => setEncryptionPin(e.target.value)}
              className="w-14 bg-transparent text-xs font-mono font-bold text-white focus:outline-none text-center"
              maxLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="text-neutral-400 hover:text-white p-0.5"
            >
              <Eye className="w-3 h-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setInspectorOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs font-medium transition-colors"
          >
            Inspeksi Kripto
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Mood Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
            {isWizard ? '1. Pilih Ramuan Emosi Hari Ini' : '1. Pilih Jurus Pernapasan Emosi Hari Ini'}
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {moods.map((m) => {
              const isSelected = selectedMood.score === m.score;
              return (
                <button
                  key={m.score}
                  type="button"
                  onClick={() => setSelectedMood(m)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[96px] ${
                    isSelected
                      ? isWizard
                        ? 'border-amber-400 bg-amber-950/60 shadow-lg shadow-amber-950/40 ring-1 ring-amber-400'
                        : 'border-emerald-400 bg-emerald-950/60 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400'
                      : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xl">
                      {m.score === 5 ? (isWizard ? '✨' : '🔥') :
                       m.score === 4 ? (isWizard ? '🧪' : '🌊') :
                       m.score === 3 ? (isWizard ? '🍵' : '🍃') :
                       m.score === 2 ? (isWizard ? '🌫️' : '⚡') :
                       (isWizard ? '🌑' : '🩸')}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: m.color }}
                    />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white line-clamp-1">
                      {m.name.split(':')[0]}
                    </h5>
                    <span className="text-[10px] text-neutral-400 block truncate">
                      {m.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active mood description banner */}
          <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-xl text-xs flex items-center justify-between">
            <span className="text-neutral-300 font-medium">
              <strong className="text-white">{selectedMood.name}</strong> &mdash; {selectedMood.description}
            </span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
              style={{
                backgroundColor: `${selectedMood.color}20`,
                color: selectedMood.color,
                border: `1px solid ${selectedMood.color}40`,
              }}
            >
              Level {selectedMood.score}/5
            </span>
          </div>
        </div>

        {/* Step 2: Prompt Generator */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isWizard
              ? 'bg-amber-950/20 border-amber-800/40 text-amber-100'
              : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-100'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {isWizard ? 'Mantra Refleksi Harian' : 'Tantangan Jurus Harian'}
            </span>
            <button
              type="button"
              onClick={handleNextPrompt}
              className="flex items-center gap-1 text-xs text-neutral-300 hover:text-white bg-neutral-900/80 px-2.5 py-1 rounded-lg border border-neutral-700 hover:bg-neutral-800 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              {isWizard ? 'Putar Mantra Lain' : 'Ganti Jurus Lain'}
            </button>
          </div>
          <p
            className={`text-sm md:text-base font-semibold text-white leading-relaxed ${
              isWizard ? 'font-serif-magic' : ''
            }`}
          >
            &ldquo;{currentPrompt}&rdquo;
          </p>
        </div>

        {/* Step 3: Journal Writing Canvas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <label className="font-semibold text-neutral-300 uppercase tracking-wider">
              2. Ruang Curhat & Ekspresi Privat
            </label>
            <span>{journalText.length} karakter</span>
          </div>

          <div
            className={`rounded-2xl p-4 border transition-all shadow-inner ${
              isWizard
                ? 'bg-[#181512] border-amber-900/40 focus-within:border-amber-500'
                : 'bg-[#0f1715] border-emerald-900/40 focus-within:border-emerald-500'
            }`}
          >
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder={
                isWizard
                  ? 'Tuliskan mantra pikiranmu di sini... Semua tersimpan rahasia dengan mantra perlindungan AES-256.'
                  : 'Catat pertarungan batinmu hari ini... Jangan ragu, tidak ada iblis yang tidak bisa kamu tebas!'
              }
              rows={5}
              className={`w-full bg-transparent resize-none focus:outline-none text-sm md:text-base leading-relaxed text-neutral-100 placeholder-neutral-500 ${
                isWizard ? 'font-serif-magic' : ''
              }`}
            />

            {/* Sticker Bar & Toolbar */}
            <div className="pt-3 mt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
              {/* Sticker Selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                <span className="text-[11px] text-neutral-400 mr-1 flex items-center gap-1 shrink-0">
                  <Smile className="w-3.5 h-3.5" /> Stiker:
                </span>
                {stickers.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() =>
                      setSelectedSticker(selectedSticker === s.emoji ? null : s.emoji)
                    }
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg transition-transform ${
                      selectedSticker === s.emoji
                        ? 'bg-neutral-800 scale-110 ring-2 ring-amber-400'
                        : 'bg-neutral-900/60 hover:bg-neutral-800 hover:scale-105'
                    }`}
                    title={s.label}
                  >
                    {s.emoji}
                  </button>
                ))}
              </div>

              {/* Doodle Toggle Button */}
              <button
                type="button"
                onClick={() => setShowDoodlePad(!showDoodlePad)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  showDoodlePad || doodleDataUrl
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                {doodleDataUrl ? 'Doodle Terpasang (Edit)' : 'Tambah Doodle Gambar'}
              </button>
            </div>
          </div>
        </div>

        {/* Step 4: Optional Doodle Pad */}
        {showDoodlePad && (
          <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-2xl space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5 text-amber-400" />
                Doodle Canvas Remaja
              </span>
              <button
                type="button"
                onClick={() => setShowDoodlePad(false)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                Tutup Pad
              </button>
            </div>
            <DoodleCanvas
              theme={theme}
              initialDoodle={doodleDataUrl || undefined}
              onSaveDoodle={(url) => setDoodleDataUrl(url)}
            />
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-neutral-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>+100 XP &bull; Streak Bertambah &bull; Enkripsi AES-256</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm text-neutral-950 shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer ${
              isWizard
                ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:brightness-110 shadow-amber-500/20'
                : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:brightness-110 shadow-emerald-500/20'
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Mengenkrpsi & Menyimpan...
              </>
            ) : (
              <>
                {isWizard ? <Sparkles className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
                {isWizard ? 'Segel & Simpan Jurnal Magis' : 'Tebas Hari & Kunci Jurnal'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Crypto Inspector Modal */}
      <CryptoInspectorModal
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        payload={lastEncryptedPayload}
        originalText={journalText}
        defaultPassphrase={encryptionPin}
      />
    </div>
  );
};
