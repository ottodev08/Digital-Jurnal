import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  Calendar,
  Sparkles,
  Search,
  Code2,
  AlertCircle,
} from 'lucide-react';
import { JournalEntry, ThemeId } from '../types';
import { decryptJournalText } from '../utils/crypto';
import { useLanguage } from '../context/LanguageContext';
import { CryptoInspectorModal } from './CryptoInspectorModal';

interface JournalListProps {
  journals: JournalEntry[];
  currentTheme: ThemeId;
}

export const JournalList: React.FC<JournalListProps> = ({ journals, currentTheme }) => {
  const { language, t, getMood } = useLanguage();
  const [decryptionPins, setDecryptionPins] = useState<Record<string, string>>({});
  const [decryptedTexts, setDecryptedTexts] = useState<Record<string, string>>({});
  const [decryptErrors, setDecryptErrors] = useState<Record<string, string>>({});
  const [activeInspectorPayload, setActiveInspectorPayload] = useState<any>(null);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePinChange = (journalId: string, pin: string) => {
    setDecryptionPins((prev) => ({ ...prev, [journalId]: pin }));
  };

  const handleUnlock = async (journal: JournalEntry) => {
    const pin = decryptionPins[journal.id] || '1234'; // default fallback for demo convenience
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

  const handleInspect = (journal: JournalEntry) => {
    setActiveInspectorPayload(journal.encryptedContent);
    setInspectorOpen(true);
  };

  const uniqueJournals = Array.from(
    new Map(journals.map((j) => [j.id, j])).values()
  );

  const filteredJournals = uniqueJournals.filter(
    (j) =>
      j.promptQuestion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.moodLabel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>{language === 'ja' ? '日記アーカイブ一覧' : language === 'en' ? 'Personal Journal Archives' : 'Lembar Jurnal Pribadimu'}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono">
              {journals.length} {t('journalsCountLabel')}
            </span>
          </h3>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder={language === 'ja' ? '質問や気分で検索...' : language === 'en' ? 'Search prompt or mood...' : 'Cari prompt atau suasana...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 w-full sm:w-64"
          />
        </div>
      </div>

      {filteredJournals.length === 0 ? (
        <div className="p-8 text-center bg-neutral-900/40 border border-dashed border-neutral-800 rounded-2xl space-y-2">
          <p className="text-sm text-neutral-400">{t('emptyJournalTitle')}</p>
          <p className="text-xs text-neutral-500">
            {t('emptyJournalDesc')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredJournals.map((journal) => {
            const isDecrypted = Boolean(
              journal.decryptedText || decryptedTexts[journal.id]
            );
            const contentToShow = journal.decryptedText || decryptedTexts[journal.id];
            const currentPin = decryptionPins[journal.id] ?? '1234';
            const error = decryptErrors[journal.id];

            return (
              <div
                key={journal.id}
                className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition-all space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{journal.sticker || '✨'}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {getMood(journal.moodScore, journal.moodLabel)}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            journal.moodScore >= 4
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : journal.moodScore === 3
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {t('bookScoreEmosi')} {journal.moodScore}/5
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(journal.createdAt).toLocaleDateString(language === 'ja' ? 'ja-JP' : language === 'en' ? 'en-US' : 'id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-lg">
                      <ShieldCheck className="w-3 h-3" />
                      AES-256
                    </span>
                    <button
                      onClick={() => handleInspect(journal)}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                      title={t('inspectCryptoBtn')}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Prompt Question */}
                <p className="text-xs font-semibold text-neutral-300 italic">
                  &ldquo;{journal.promptQuestion}&rdquo;
                </p>

                {/* Encrypted vs Decrypted Content Area */}
                <div className="p-4 bg-neutral-950/80 border border-neutral-800/80 rounded-xl space-y-3">
                  {isDecrypted ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <Unlock className="w-3.5 h-3.5" /> {t('bookDecryptedBadge')}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap">
                        {contentToShow || ''}
                      </p>

                      {/* Display Doodle if attached */}
                      {journal.doodleDataUrl && (
                        <div className="mt-3 pt-3 border-t border-neutral-800">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5">
                            {t('bookDoodleSketch')}
                          </span>
                          <img
                            src={journal.doodleDataUrl}
                            alt="Doodle"
                            className="max-h-48 rounded-lg border border-neutral-700 bg-neutral-900 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                          <Lock className="w-3.5 h-3.5" />
                          <span>{t('decryptPromptTitle')}</span>
                        </div>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          Ciphertext: {journal.encryptedContent.ciphertext.slice(0, 16)}...
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-700 w-full sm:w-auto">
                          <Key className="w-3.5 h-3.5 text-neutral-400" />
                          <input
                            type="password"
                            placeholder={t('encryptionPinPlaceholder')}
                            value={currentPin}
                            onChange={(e) => handlePinChange(journal.id, e.target.value)}
                            className="bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none w-24"
                          />
                        </div>
                        <button
                          onClick={() => handleUnlock(journal)}
                          className="w-full sm:w-auto px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Unlock className="w-3 h-3" />
                          {t('unlockEntryBtn')}
                        </button>
                      </div>

                      {error && (
                        <div className="p-2 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inspector Modal */}
      <CryptoInspectorModal
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        payload={activeInspectorPayload}
      />
    </div>
  );
};
