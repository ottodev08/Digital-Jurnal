import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  Calendar,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
  RefreshCw,
  UserPlus,
  Info,
  Heart,
  MessageCircleHeart,
  Send,
  BookOpen,
  Award,
} from 'lucide-react';
import { MoodAnalytics, User, ParentShare } from '../types';
import { authFetch } from '../utils/auth';
import { useLanguage } from '../context/LanguageContext';

interface ParentPortalProps {
  currentUser: User;
}

interface LinkedChild {
  id: string;
  name: string;
  email: string;
  age: number;
  theme: string;
  avatar: string;
  streakCount: number;
  xp: number;
  pairingCode?: string;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({ currentUser }) => {
  const { language, t } = useLanguage();
  const [children, setChildren] = useState<LinkedChild[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [analytics, setAnalytics] = useState<MoodAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [pairingCodeInput, setPairingCodeInput] = useState('');
  const [pairingMessage, setPairingMessage] = useState<string | null>(null);
  const [pairingError, setPairingError] = useState<string | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [simulatingAlert, setSimulatingAlert] = useState(false);

  // Parent Shares State
  const [activeParentTab, setActiveParentTab] = useState<'analytics' | 'shares'>('shares');
  const [parentShares, setParentShares] = useState<ParentShare[]>([]);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [submittingReplyId, setSubmittingReplyId] = useState<string | null>(null);

  // Fetch linked children
  const fetchChildren = async () => {
    try {
      const res = await authFetch('/api/parent/children');
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setChildren(data);
        if (data.length > 0 && !selectedChildId) {
          setSelectedChildId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch children', err);
    }
  };

  // Fetch shared pages from child
  const fetchParentShares = async () => {
    try {
      const res = await authFetch('/api/parent-shares');
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setParentShares(data);
      }
    } catch (err) {
      console.error('Failed to fetch parent shares', err);
    }
  };

  // Fetch analytics for selected child
  const fetchAnalytics = async (childId: string) => {
    if (!childId) return;
    setLoading(true);
    try {
      const res = await authFetch(`/api/parent/child/${childId}/analytics`);
      const data = await res.json();
      if (res.ok) {
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
    fetchParentShares();
  }, []);

  const handleRespondToShare = async (shareId: string, reaction: string, customReply?: string) => {
    setSubmittingReplyId(shareId);
    try {
      const reply = customReply !== undefined ? customReply : (replyTexts[shareId] || '');
      const res = await authFetch(`/api/parent-shares/${shareId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reaction, reply: reply.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.share) {
        setParentShares((prev) =>
          prev.map((s) => (s.id === shareId ? data.share : s))
        );
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#EC4899', '#F43F5E', '#FDE047'],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReplyId(null);
    }
  };

  useEffect(() => {
    if (selectedChildId) {
      fetchAnalytics(selectedChildId);
    }
  }, [selectedChildId]);

  const handleLinkChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setPairingMessage(null);
    setPairingError(null);

    if (!pairingCodeInput.trim()) return;

    try {
      const res = await authFetch('/api/parent/link-child', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pairingCode: pairingCodeInput.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setPairingMessage(data.message);
        setPairingCodeInput('');
        fetchChildren();
      } else {
        setPairingError(data.error || 'Failed to link child account.');
      }
    } catch {
      setPairingError('Connection error.');
    }
  };

  const handleSimulateAlert = async () => {
    if (!selectedChildId) return;
    setSimulatingAlert(true);
    try {
      const res = await authFetch('/api/parent/simulate-low-mood-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId: selectedChildId }),
      });
      if (res.ok) {
        fetchAnalytics(selectedChildId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimulatingAlert(false);
    }
  };

  const handleSendEmailAlert = async () => {
    if (!analytics) return;
    try {
      const res = await authFetch('/api/parent/send-alert-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentEmail: currentUser.email,
          childName: analytics.childName,
          alertMessage: `Notice: Magic Journal detected consecutive low mood records for ${analytics.childName}. Personal journal text remains encrypted. Consider offering gentle presence and supportive quality time together.`,
        }),
      });
      if (res.ok) {
        setEmailSuccess(true);
        setTimeout(() => {
          setEmailSuccess(false);
          setEmailModalOpen(false);
        }, 2500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectedChild = children.find((c) => c.id === selectedChildId);

  const stampOptions = [
    { stamp: 'Pelukan Hangat & Kasih Sayang 🤗❤️', label: t('parentStampWarmHug') },
    { stamp: 'Sangat Bangga Padamu! 🌟', label: t('parentStampProud') },
    { stamp: 'Kamu Hebat & Tangguh! 💪✨', label: t('parentStampTough') },
    { stamp: 'Mama/Papa Selalu Ada Untukmu 🛡️', label: t('parentStampAlwaysHere') },
  ];

  return (
    <div className="space-y-6">
      {/* Privacy Guarantee Lock Banner */}
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-700/80 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {t('parentPrivacyLockTitle')}
              </h3>
              <p className="text-xs text-neutral-400">
                {t('parentPrivacyLockSubtitle')}
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-semibold shrink-0">
            <ShieldCheck className="w-4 h-4" />
            <span>Zero-Knowledge Verified</span>
          </div>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed pl-13">
          {t('parentPrivacyLockDesc')}
        </p>
      </div>

      {/* Child Selector Tabs & Link New Child */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-neutral-900/60 border border-neutral-800 rounded-2xl">
        <div className="flex items-center gap-2 overflow-x-auto">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedChildId === child.id
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
              }`}
            >
              <img
                src={child.avatar}
                alt={child.name}
                className="w-5 h-5 rounded-full bg-neutral-700"
              />
              <span>{child.name}</span>
              <span className="text-[10px] opacity-80">({child.age} {t('authAgeUnit')})</span>
            </button>
          ))}
        </div>

        {/* Pairing Code Form */}
        <form onSubmit={handleLinkChild} className="flex items-center gap-2 text-xs">
          <input
            type="text"
            placeholder={t('parentPairingPlaceholder')}
            value={pairingCodeInput}
            onChange={(e) => setPairingCodeInput(e.target.value)}
            className="px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 text-xs uppercase focus:outline-none focus:border-amber-500 w-44"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl border border-neutral-700 font-medium flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            {t('parentLinkChildBtn')}
          </button>
        </form>
      </div>

      {pairingMessage && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-xs text-emerald-200">
          {pairingMessage}
        </div>
      )}
      {pairingError && (
        <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-200">
          {pairingError}
        </div>
      )}

      {/* Navigation Sub-Tabs: Shared Pages vs 30-Day Analytics */}
      <div className="flex items-center gap-2 p-1.5 bg-neutral-900 border border-neutral-800 rounded-2xl">
        <button
          onClick={() => setActiveParentTab('shares')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeParentTab === 'shares'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-600/20'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4 fill-current" />
          <span>{t('tabSharedPages')} ({parentShares.length})</span>
        </button>

        <button
          onClick={() => setActiveParentTab('analytics')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeParentTab === 'analytics'
              ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{t('tabAnalytics')}</span>
        </button>
      </div>

      {/* VIEW 1: SHARED PAGES FROM CHILD */}
      {activeParentTab === 'shares' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                {t('parentSharedNotesTitle')}
              </h3>
              <p className="text-xs text-neutral-400">
                {t('parentSharedNotesSubtitle')}
              </p>
            </div>
            <span className="text-[11px] font-mono text-pink-400 bg-pink-950/60 border border-pink-800 px-3 py-1 rounded-full font-bold">
              {t('parentIncomingSharesCount').replace('{count}', String(parentShares.length))}
            </span>
          </div>

          {parentShares.length === 0 ? (
            <div className="p-10 rounded-3xl bg-neutral-900/60 border border-neutral-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center text-2xl mx-auto">
                💌
              </div>
              <h4 className="text-sm font-bold text-white font-serif-magic">
                {t('parentNoSharedNotesTitle')}
              </h4>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                {t('parentNoSharedNotesDesc')}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {parentShares.map((share) => (
                <div
                  key={share.id}
                  className="rounded-3xl border-2 border-neutral-800 bg-neutral-900/95 overflow-hidden shadow-2xl space-y-4 p-5 sm:p-6"
                >
                  {/* Share Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center text-xl">
                        {share.sticker || '💌'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{share.childName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-950 text-pink-300 border border-pink-800 font-mono">
                            {t('parentVoluntarySharedBadge')}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-400 font-serif-magic">
                          {share.moodLabel} ({t('parentScoreLabel').replace('{score}', String(share.moodScore))})
                        </div>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono text-neutral-500">
                      {new Date(share.createdAt).toLocaleDateString(
                        language === 'ja' ? 'ja-JP' : language === 'en' ? 'en-US' : 'id-ID',
                        {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }
                      )}
                    </span>
                  </div>

                  {/* Child Personal Note (if provided) */}
                  {share.childNote && (
                    <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-800/30 text-amber-200 text-xs flex items-start gap-2">
                      <span className="text-base shrink-0">💬</span>
                      <div>
                        <span className="font-bold block text-amber-300">
                          {t('parentChildNotePrefix').replace('{child}', share.childName)}
                        </span>
                        <p className="italic font-serif-magic mt-0.5">&ldquo;{share.childNote}&rdquo;</p>
                      </div>
                    </div>
                  )}

                  {/* Shared Journal Content Parchment Paper Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#fcf9f2] to-[#f4eedb] border border-amber-900/20 text-neutral-900 shadow-inner space-y-2">
                    <div className="text-[11px] font-mono uppercase font-bold text-amber-900/80">
                      {t('parentReflectionPromptPrefix')} &ldquo;{share.promptQuestion}&rdquo;
                    </div>
                    <p className="text-xs sm:text-sm font-serif-magic text-neutral-900 leading-relaxed whitespace-pre-wrap">
                      {share.sharedContent}
                    </p>

                    {share.doodleDataUrl && (
                      <div className="mt-3 pt-3 border-t border-amber-900/20 text-center">
                        <span className="text-[10px] font-mono text-amber-900/70 block mb-1">
                          {t('parentChildDoodleLabel')}
                        </span>
                        <img
                          src={share.doodleDataUrl}
                          alt="Doodle sketch"
                          className="max-h-40 rounded-xl mx-auto border border-amber-900/30"
                        />
                      </div>
                    )}
                  </div>

                  {/* Existing Parent Feedback Banner (if already reacted) */}
                  {share.parentReaction && (
                    <div className="p-4 rounded-2xl bg-pink-950/30 border border-pink-800/40 text-pink-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-pink-300">
                          <Heart className="w-4 h-4 fill-pink-400 text-pink-400" />
                          <span>{t('parentYourResponseSent')} {share.parentReaction}</span>
                        </div>
                        {share.parentRepliedAt && (
                          <span className="text-[10px] font-mono text-pink-400/80">
                            {new Date(share.parentRepliedAt).toLocaleDateString(
                              language === 'ja' ? 'ja-JP' : language === 'en' ? 'en-US' : 'id-ID',
                              {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </span>
                        )}
                      </div>
                      {share.parentReply && (
                        <p className="italic font-serif-magic text-neutral-200 text-xs pl-6">
                          &ldquo;{share.parentReply}&rdquo;
                        </p>
                      )}
                    </div>
                  )}

                  {/* Quick Reaction Stamp Bar for Parent */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs text-neutral-300 font-semibold">
                      <span>
                        {language === 'ja'
                          ? `愛情スタンプを送る（${share.childName} に +50 XP）:`
                          : language === 'en'
                          ? `Send Affection Stamp (+50 XP to ${share.childName}):`
                          : `Beri Stempel Reaksi Kasih Sayang (+50 XP untuk ${share.childName}):`}
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        {language === 'ja' ? '1タップで送信' : language === 'en' ? '1-Tap reaction' : 'Klik 1 stempel instan'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {stampOptions.map((item) => (
                        <button
                          key={item.stamp}
                          onClick={() => handleRespondToShare(share.id, item.stamp)}
                          disabled={submittingReplyId === share.id}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            share.parentReaction === item.stamp
                              ? 'bg-pink-600/30 border-pink-500 text-pink-200 ring-2 ring-pink-500'
                              : 'bg-neutral-950 border-neutral-800 hover:border-pink-500/50 hover:bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Custom Reply Box */}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder={t('parentReplyPlaceholder').replace('{child}', share.childName)}
                        value={replyTexts[share.id] ?? ''}
                        onChange={(e) =>
                          setReplyTexts((prev) => ({ ...prev, [share.id]: e.target.value }))
                        }
                        className="flex-1 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-pink-500 font-serif-magic"
                      />
                      <button
                        onClick={() =>
                          handleRespondToShare(
                            share.id,
                            share.parentReaction || 'Pelukan Hangat & Bangga! 🤗❤️',
                            replyTexts[share.id] || t('parentReplyDefault')
                          )
                        }
                        disabled={submittingReplyId === share.id}
                        className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-colors disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{t('parentSendReplyBtn')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: 30-DAY ANALYTICS & ALERTS */}
      {activeParentTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {loading ? (
            <div className="p-12 text-center text-neutral-400 flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
              <span className="text-xs">
                {language === 'ja' ? '感情分析データを読み込み中...' : language === 'en' ? 'Loading mood analytics...' : 'Memuat data analitik emosi...'}
              </span>
            </div>
          ) : analytics ? (
            <div className="space-y-6">
              {/* Alert Banner (if mood is low for 3 consecutive days) */}
              {analytics.hasConsecutiveLowMoodAlert && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/80 via-neutral-900 to-amber-950/80 border-2 border-red-500/80 shadow-2xl space-y-4 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                        <ShieldAlert className="w-6 h-6 animate-bounce" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-red-200 flex items-center gap-2">
                          {t('parentAlertTitle3Days')}
                        </h4>
                        <p className="text-xs text-neutral-300 mt-0.5">
                          {t('parentAlertDesc3Days').replace('{child}', analytics.childName)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setEmailModalOpen(true)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-500/30 flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {t('parentSendEmailBtn')}
                    </button>
                  </div>

                  {/* Empathetic Parent Support Advice */}
                  <div className="p-4 bg-neutral-950/70 border border-red-900/50 rounded-xl text-xs space-y-2">
                    <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                      <HeartHandshake className="w-4 h-4" />
                      {t('parentSupportAdviceTitle')}
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-neutral-300 pl-1 leading-relaxed">
                      <li>
                        <strong>{t('parentAdvice1Title')}</strong> {t('parentAdvice1Desc')}
                      </li>
                      <li>
                        <strong>{t('parentAdvice2Title')}</strong> {t('parentAdvice2Desc')}
                      </li>
                      <li>
                        <strong>{t('parentAdvice3Title')}</strong> {t('parentAdvice3Desc')}
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Activity Tracker Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-1">
                  <span className="text-xs text-neutral-400">{t('parentStatJournalsThisWeek')}</span>
                  <div className="text-2xl font-bold text-white font-mono">
                    {analytics.journalsThisWeek} {t('journalsCountLabel')}
                  </div>
                  <p className="text-[11px] text-emerald-400">
                    {analytics.childName} • {analytics.journalsThisWeek} {t('journalsCountLabel')}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-1">
                  <span className="text-xs text-neutral-400">{t('parentStatStreak')}</span>
                  <div className="text-2xl font-bold text-amber-400 font-mono flex items-center gap-1">
                    <span>{analytics.currentStreak} {t('days')}</span>
                    <span className="text-base">🔥</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Total: {analytics.totalJournals} {t('journalsCountLabel')}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-1">
                  <span className="text-xs text-neutral-400">{t('parentStatAvgMood')}</span>
                  <div className="text-2xl font-bold text-cyan-400 font-mono">
                    {analytics.averageMood} / 5.0
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    {language === 'ja' ? 'スケール 1 (要休養) 〜 5 (絶好調)' : language === 'en' ? 'Scale 1 (Low) to 5 (Thriving)' : 'Skala 1 (Sangat Rendah) hingga 5 (Sangat Baik)'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-1">
                  <span className="text-xs text-neutral-400">{t('parentStatFavoriteTheme')}</span>
                  <div className="text-lg font-bold text-white capitalize flex items-center gap-1.5 pt-1">
                    {analytics.theme === 'wizard_academy' ? '🪄 Wizard Academy' : '⚔️ Demon Hunter'}
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    {t('friendCodeLabel')}: <span className="font-mono text-amber-300 font-bold">{selectedChild?.pairingCode || 'ACTIVE'}</span>
                  </p>
                </div>
              </div>

              {/* 30-Day Mood Analytics Interactive Chart */}
              <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-400" />
                      {t('emotionalTrendTitle')}
                    </h4>
                    <p className="text-xs text-neutral-400">
                      {language === 'ja'
                        ? '子どものプライベートな文章を開示することなく、感情の傾向のみを可視化します。'
                        : language === 'en'
                        ? 'Emotional visual trend without inspecting child encrypted journal text.'
                        : 'Visualisasi grafik emosional tanpa membuka teks privasi anak.'}
                    </p>
                  </div>

                  {/* Simulation button for demo testing */}
                  <button
                    onClick={handleSimulateAlert}
                    disabled={simulatingAlert}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    {simulatingAlert ? (language === 'ja' ? '処理中...' : language === 'en' ? 'Processing...' : 'Memproses...') : t('parentTestAlertBtn')}
                  </button>
                </div>

                {/* SVG Visual Line & Bar Chart */}
                <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 overflow-x-auto">
                  <div className="min-w-[600px] h-48 flex items-end gap-1.5 pt-6 pb-2">
                    {analytics.thirtyDayHistory.map((day, idx) => {
                      const heightPercent = day.hasEntry ? (day.moodScore / 5) * 80 + 10 : 8;
                      const barColor =
                        !day.hasEntry
                          ? '#262626'
                          : day.moodScore >= 4
                          ? '#10B981'
                          : day.moodScore === 3
                          ? '#06B6D4'
                          : '#EF4444';

                      return (
                        <div
                          key={day.date}
                          className="flex-1 flex flex-col items-center justify-end h-full group relative"
                        >
                          {/* Tooltip on hover */}
                          <div className="absolute -top-12 hidden group-hover:flex flex-col items-center bg-neutral-800 border border-neutral-700 text-white text-[10px] px-2 py-1 rounded shadow-xl whitespace-nowrap z-20 pointer-events-none">
                            <span>{day.dayLabel}</span>
                            <span className="font-bold text-amber-400">
                              {day.hasEntry ? `Mood: ${day.moodScore}/5 (${day.moodLabel})` : t('parentNoEntriesDay')}
                            </span>
                          </div>

                          {/* Bar */}
                          <div
                            style={{
                              height: `${heightPercent}%`,
                              backgroundColor: barColor,
                            }}
                            className={`w-full rounded-t-md transition-all group-hover:brightness-125 ${
                              day.hasEntry ? 'opacity-90' : 'opacity-30'
                            }`}
                          />

                          {/* Day Tick (every 5 days) */}
                          {idx % 5 === 0 && (
                            <span className="text-[9px] text-neutral-500 font-mono mt-1">
                              {day.date.slice(8)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Chart Legend */}
                  <div className="mt-3 pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between text-[11px] text-neutral-400 gap-2">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>{t('parentLegendGood')}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                        <span>{t('parentLegendNeutral')}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <span>{t('parentLegendAlert')}</span>
                      </span>
                    </div>
                    <span>{t('parentLegendAxis')}</span>
                  </div>
                </div>
              </div>

              {/* Mood Distribution Breakdown */}
              <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-3">
                <h4 className="text-sm font-bold text-white">{t('parentMoodDistributionTitle')}</h4>
                <div className="space-y-2.5">
                  {analytics.moodDistribution.map((m) => (
                    <div key={m.score} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-300 font-medium">
                          Level {m.score}: {m.label}
                        </span>
                        <span className="text-neutral-400 font-mono">
                          {m.count} ({m.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                        <div
                          style={{ width: `${m.percentage}%` }}
                          className={`h-full rounded-full ${
                            m.score >= 4
                              ? 'bg-emerald-500'
                              : m.score === 3
                              ? 'bg-cyan-500'
                              : 'bg-red-500'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-neutral-400 bg-neutral-900/40 rounded-2xl border border-neutral-800">
              {t('parentSelectChildPrompt')}
            </div>
          )}
        </div>
      )}

      {/* Simulated Email Notification Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <Mail className="w-4 h-4" />
                <span>{t('parentEmailModalTitle')}</span>
              </div>
              <button
                onClick={() => setEmailModalOpen(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-neutral-300">
              <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                <span className="text-neutral-400 block mb-0.5">{t('parentEmailToLabel')}</span>
                <span className="font-mono text-white font-medium">{currentUser.email}</span>
              </div>
              <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
                <span className="text-neutral-400 block mb-0.5">{t('parentEmailSubjectLabel')}</span>
                <span className="font-medium text-white">
                  [Magic Journal] Support Alert for {analytics?.childName}
                </span>
              </div>
              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-2 leading-relaxed">
                <span className="text-neutral-400 block">{t('parentEmailBodyLabel')}</span>
                <p>
                  {currentUser.name}, {analytics?.childName} reported consecutive low mood days.
                </p>
                <p className="text-neutral-400 italic">
                  {t('parentPrivacyLockDesc')}
                </p>
              </div>
            </div>

            {emailSuccess ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-700 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{t('parentEmailSentSuccess')} ({currentUser.email})</span>
              </div>
            ) : (
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setEmailModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-xl cursor-pointer"
                >
                  {t('parentEmailCancel')}
                </button>
                <button
                  onClick={handleSendEmailAlert}
                  className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-red-500/20 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {t('parentEmailSendNow')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
