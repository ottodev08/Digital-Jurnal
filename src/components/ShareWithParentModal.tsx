import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Heart,
  Send,
  X,
  ShieldCheck,
  Sparkles,
  MessageCircleHeart,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { ThemeId, JournalEntry, User } from '../types';
import { authFetch } from '../utils/auth';
import { useLanguage } from '../context/LanguageContext';

interface ShareWithParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  journal: JournalEntry | null;
  plainText: string;
  user: User;
  theme: ThemeId;
  onShareSuccess: () => void;
}

export const ShareWithParentModal: React.FC<ShareWithParentModalProps> = ({
  isOpen,
  onClose,
  journal,
  plainText,
  user,
  theme,
  onShareSuccess,
}) => {
  if (!isOpen || !journal) return null;

  const { language, t, getMood } = useLanguage();
  const isWizard = theme === 'wizard_academy';
  const [childNote, setChildNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const contentToShare = plainText.trim() || journal.decryptedText || 'Aku ingin membagikan catatan emosi hari ini kepadamu.';

    try {
      const res = await authFetch('/api/parent-shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journalId: journal.id,
          sharedContent: contentToShare,
          childNote: childNote.trim() || undefined,
          moodScore: journal.moodScore,
          moodLabel: journal.moodLabel,
          promptQuestion: journal.promptQuestion,
          doodleDataUrl: journal.doodleDataUrl,
          sticker: journal.sticker,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal membagikan catatan ke orang tua.');
      }

      setSuccess(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#EC4899', '#F43F5E', '#FB7185', '#FDE047'],
      });

      setTimeout(() => {
        onShareSuccess();
        onClose();
        setSuccess(false);
        setChildNote('');
      }, 1800);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kendala saat mengirim catatan.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-5 text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center text-xl">
              💌
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-serif-magic">
                {t('parentShareHeading')}
              </h3>
              <p className="text-xs text-neutral-400">
                {language === 'ja' ? '宛先: ' : language === 'en' ? 'To: ' : 'Kirimkan ke: '}
                <strong className="text-neutral-200">{user.parentEmail || 'fatiha@guardian.local'}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy Transparency Notice */}
        <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-amber-200 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{language === 'ja' ? '完全なプライバシーの権利' : language === 'en' ? 'Complete Privacy Ownership' : 'Hak Privasi Penuh Milikmu'}</span>
          </div>
          <p className="text-[11px] text-amber-200/90 leading-relaxed">
            {t('parentShareSubtitle')}
          </p>
        </div>

        {/* Journal Preview Card */}
        <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="font-bold text-neutral-200 flex items-center gap-1.5">
              <span>{journal.sticker || '📜'}</span>
              <span>{getMood(journal.moodScore, journal.moodLabel)} ({journal.moodScore}/5)</span>
            </span>
            <span className="font-mono text-[10px]">
              {new Date(journal.createdAt).toLocaleDateString(language === 'ja' ? 'ja-JP' : language === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'short' })}
            </span>
          </div>

          <p className="text-neutral-300 italic font-serif-magic line-clamp-3 text-xs">
            &ldquo;{plainText || journal.decryptedText || (language === 'ja' ? '暗号化された日記本文...' : language === 'en' ? 'Encrypted journal text...' : 'Isi tulisan jurnal terenkripsi...')}&rdquo;
          </p>
        </div>

        {/* Child Personal Note */}
        <form onSubmit={handleShare} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-300">
              {language === 'ja' ? '保護者へのひと言（任意）:' : language === 'en' ? 'Optional Note for Mom / Dad:' : 'Pesan Tambahan untuk Mama/Papa (Opsional):'}
            </label>
            <textarea
              value={childNote}
              onChange={(e) => setChildNote(e.target.value)}
              placeholder={t('parentNotePlaceholder')}
              rows={3}
              className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-pink-500 focus:outline-none text-xs text-neutral-100 placeholder-neutral-500 resize-none font-serif-magic"
              maxLength={400}
            />
            <div className="text-right text-[10px] text-neutral-500 font-mono">
              {childNote.length}/400 {language === 'ja' ? '文字' : language === 'en' ? 'Chars' : 'Karakter'}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{t('shareSuccessAlert')} (+50 XP)</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              {language === 'ja' ? 'キャンセル' : language === 'en' ? 'Cancel' : 'Batal'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-pink-500/20 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>{isSubmitting ? (language === 'ja' ? '送信中...' : language === 'en' ? 'Sending...' : 'Mengirim...') : `${t('sendToParentBtn')} (+50 XP)`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
