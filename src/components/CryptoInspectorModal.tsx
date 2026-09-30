import React, { useState } from 'react';
import { ShieldCheck, Lock, Key, Copy, Check, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { EncryptedPayload } from '../types';
import { decryptJournalText } from '../utils/crypto';
import { useLanguage } from '../context/LanguageContext';

interface CryptoInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload?: EncryptedPayload;
  originalText?: string;
  defaultPassphrase?: string;
}

export const CryptoInspectorModal: React.FC<CryptoInspectorModalProps> = ({
  isOpen,
  onClose,
  payload,
  originalText,
  defaultPassphrase = '1234',
}) => {
  const { language, t } = useLanguage();
  const [testPassphrase, setTestPassphrase] = useState(defaultPassphrase);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  if (!isOpen) return null;

  const currentPayload: EncryptedPayload = payload || {
    ciphertext: 'kP8vN4qR+x7Yk1A2Wm6YbC9mX2lP0Zq8==',
    iv: 'q1w2e3r4t5y6',
    salt: 's7a6l5t4m3a2g1i0',
    algo: 'AES-256-GCM (PBKDF2-SHA256)',
  };

  const handleCopyCiphertext = () => {
    navigator.clipboard.writeText(currentPayload.ciphertext);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestDecrypt = async () => {
    setTestError(null);
    setTestResult(null);

    try {
      const decrypted = await decryptJournalText(currentPayload, testPassphrase);
      setTestResult(decrypted);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setTestError(err.message);
      } else {
        setTestError(
          language === 'ja'
            ? '復号失敗: 鍵が一致しません。'
            : language === 'en'
            ? 'Decryption failed: Key mismatch.'
            : 'Gagal mendekripsi: Kunci tidak cocok.'
        );
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-neutral-800/80 border-b border-neutral-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {t('cryptoInspectorTitle')}
              </h3>
              <p className="text-xs text-neutral-400">
                {t('cryptoInspectorSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-neutral-300">
          {/* Explanation Banner */}
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 text-xs leading-relaxed space-y-1">
            <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> {t('cryptoPrivacyGuaranteeTitle')}
            </div>
            <p>
              {t('cryptoPrivacyGuaranteeDesc')}
            </p>
          </div>

          {/* Ciphertext Card */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              <span>{t('cryptoCiphertextTitle')}</span>
              <button
                onClick={handleCopyCiphertext}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 normal-case cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? t('cryptoCopied') : t('cryptoCopyCiphertext')}
              </button>
            </div>
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-amber-300/90 break-all select-all">
              {currentPayload.ciphertext}
            </div>
          </div>

          {/* Crypto Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-lg">
              <span className="text-[11px] text-neutral-400 block mb-1">{t('cryptoAlgoLabel')}</span>
              <span className="font-mono text-xs text-white font-medium">{currentPayload.algo}</span>
            </div>
            <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-lg">
              <span className="text-[11px] text-neutral-400 block mb-1">{t('cryptoIvLabel')}</span>
              <span className="font-mono text-xs text-neutral-300 truncate block">{currentPayload.iv}</span>
            </div>
            <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-lg">
              <span className="text-[11px] text-neutral-400 block mb-1">{t('cryptoSaltLabel')}</span>
              <span className="font-mono text-xs text-neutral-300 truncate block">{currentPayload.salt}</span>
            </div>
          </div>

          {/* Original Text (If Available) */}
          {originalText && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-400">
                <span>{t('cryptoOriginalTitle')}</span>
                <button
                  onClick={() => setShowOriginal(!showOriginal)}
                  className="flex items-center gap-1 text-neutral-400 hover:text-white cursor-pointer"
                >
                  {showOriginal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showOriginal ? t('cryptoHideOriginal') : t('cryptoShowOriginal')}
                </button>
              </div>
              <div className="p-3 bg-neutral-950/80 border border-neutral-800 rounded-xl font-sans text-xs text-neutral-200">
                {showOriginal ? originalText : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
              </div>
            </div>
          )}

          {/* Interactive Decryption Sandbox */}
          <div className="p-4 bg-neutral-800/40 border border-neutral-700/80 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Key className="w-4 h-4 text-amber-400" />
              <span>{t('cryptoSandboxTitle')}</span>
            </div>
            <p className="text-xs text-neutral-400">
              {t('cryptoSandboxDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={testPassphrase}
                onChange={(e) => setTestPassphrase(e.target.value)}
                placeholder={t('cryptoPinPlaceholder')}
                className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleTestDecrypt}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                {t('cryptoTestBtn')}
              </button>
            </div>

            {testResult && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-700/70 rounded-lg text-xs text-emerald-200 space-y-1">
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {t('cryptoKeyMatchSuccess')}
                </span>
                <p className="font-medium text-white italic bg-neutral-950/40 p-2 rounded border border-emerald-900">
                  &ldquo;{testResult}&rdquo;
                </p>
              </div>
            )}

            {testError && (
              <div className="p-3 bg-red-950/60 border border-red-700/70 rounded-lg text-xs text-red-200 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>{testError} {t('cryptoKeyMismatchFail')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-neutral-950 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {t('cryptoCloseBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};
