import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Users,
  UserPlus,
  Sparkles,
  Flame,
  CheckCircle2,
  RefreshCw,
  Send,
  Heart,
  Share2,
  BookOpen,
  Award,
  ChevronRight,
  Smile,
  Copy,
  Check,
  AlertCircle,
  PlusCircle,
  Shield,
} from 'lucide-react';
import { ThemeId, User, FriendCollaboration, FriendUser } from '../types';
import { authFetch } from '../utils/auth';
import { useLanguage } from '../context/LanguageContext';
import { DoodleCanvas } from './DoodleCanvas';

interface FriendCollaborationViewProps {
  currentUser: User;
  theme: ThemeId;
  onRefreshUser?: (user: User) => void;
}

export const FriendCollaborationView: React.FC<FriendCollaborationViewProps> = ({
  currentUser,
  theme,
  onRefreshUser,
}) => {
  const { language, t, collabPrompts } = useLanguage();
  const isWizard = theme === 'wizard_academy';

  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [collaborations, setCollaborations] = useState<FriendCollaboration[]>([]);
  const [loading, setLoading] = useState(false);

  // Add friend state
  const [friendCodeInput, setFriendCodeInput] = useState('');
  const [addFriendSuccess, setAddFriendSuccess] = useState<string | null>(null);
  const [addFriendError, setAddFriendError] = useState<string | null>(null);
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // New collab modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newPrompt, setNewPrompt] = useState(collabPrompts[0]);
  const [initialText, setInitialText] = useState('');
  const [initialSticker, setInitialSticker] = useState('✨');
  const [initialDoodle, setInitialDoodle] = useState<string | null>(null);
  const [showDoodlePad, setShowDoodlePad] = useState(false);
  const [isSubmittingNew, setIsSubmittingNew] = useState(false);

  // Contribute state (for active collaboration)
  const [activeCollabForReply, setActiveCollabForReply] = useState<FriendCollaboration | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySticker, setReplySticker] = useState('🔥');
  const [replyDoodle, setReplyDoodle] = useState<string | null>(null);
  const [showReplyDoodlePad, setShowReplyDoodlePad] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Quick Collaborative Prompts
  const SUGGESTED_PROMPTS = collabPrompts;

  const fetchFriends = async () => {
    try {
      const res = await authFetch('/api/friends');
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setFriends(data);
        if (data.length > 0 && !selectedFriendId) {
          setSelectedFriendId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch friends', err);
    }
  };

  const fetchCollaborations = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/collaborations');
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setCollaborations(data);
      }
    } catch (err) {
      console.error('Failed to fetch collaborations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchCollaborations();
  }, []);

  const handleCopyMyCode = () => {
    if (currentUser.pairingCode) {
      navigator.clipboard.writeText(currentUser.pairingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendCodeInput.trim()) return;

    setIsAddingFriend(true);
    setAddFriendSuccess(null);
    setAddFriendError(null);

    try {
      const res = await authFetch('/api/friends/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendCode: friendCodeInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t('collabAddFriendError'));
      }

      setAddFriendSuccess(data.message);
      setFriendCodeInput('');
      fetchFriends();
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAddFriendError(err.message);
      } else {
        setAddFriendError(t('collabAddFriendError'));
      }
    } finally {
      setIsAddingFriend(false);
    }
  };

  const handleCreateCollaboration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !selectedFriendId) return;

    setIsSubmittingNew(true);
    try {
      const res = await authFetch('/api/collaborations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          prompt: newPrompt,
          friendId: selectedFriendId,
          initialText: initialText.trim(),
          sticker: initialSticker,
          doodleDataUrl: initialDoodle || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t('collabCreateError'));
      }

      setCollaborations((prev) => [data.collab, ...prev]);
      if (onRefreshUser && data.updatedUser) {
        onRefreshUser(data.updatedUser);
      }

      setCreateModalOpen(false);
      setNewTitle('');
      setInitialText('');
      setInitialDoodle(null);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingNew(false);
    }
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCollabForReply || !replyText.trim()) return;

    setIsSubmittingReply(true);
    try {
      const res = await authFetch(`/api/collaborations/${activeCollabForReply.id}/contribute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: replyText.trim(),
          sticker: replySticker,
          doodleDataUrl: replyDoodle || undefined,
          markCompleted: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t('collabReplyError'));
      }

      setCollaborations((prev) =>
        prev.map((c) => (c.id === data.collab.id ? data.collab : c))
      );
      if (onRefreshUser && data.updatedUser) {
        onRefreshUser(data.updatedUser);
      }

      setActiveCollabForReply(null);
      setReplyText('');
      setReplyDoodle(null);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899'],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleCheer = async (collabId: string) => {
    try {
      const res = await authFetch(`/api/collaborations/${collabId}/cheer`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setCollaborations((prev) =>
          prev.map((c) =>
            c.id === collabId ? { ...c, cheersCount: data.cheersCount } : c
          )
        );
        confetti({
          particleCount: 30,
          spread: 40,
          origin: { y: 0.8 },
          colors: ['#F59E0B', '#FDE047'],
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${
                isWizard
                  ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                  : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
              }`}
            >
              🤝
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-serif-magic">
                {t('duoQuestTitle')}
              </h2>
              <p className="text-xs text-neutral-400">
                {t('duoQuestSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCreateModalOpen(true)}
              disabled={friends.length === 0}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                isWizard
                  ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-amber-500/20'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-emerald-500/20'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('createNewCollabBtn')}</span>
            </button>
          </div>
        </div>

        {/* User's Pairing Code & Friend Search Bar */}
        <div className="pt-4 border-t border-neutral-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* My Friend Code */}
          <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400">{t('friendCodeLabel')}:</span>
              <strong className="font-mono text-sm tracking-wider text-amber-400 font-bold">
                {currentUser.pairingCode || 'MJ888'}
              </strong>
            </div>
            <button
              onClick={handleCopyMyCode}
              className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? t('codeCopied') : t('copyCodeBtn')}</span>
            </button>
          </div>

          {/* Add Friend Form */}
          <form onSubmit={handleAddFriend} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={t('friendCodeInputPlaceholder')}
              value={friendCodeInput}
              onChange={(e) => setFriendCodeInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 font-mono uppercase focus:outline-none focus:border-amber-400"
              maxLength={8}
            />
            <button
              type="submit"
              disabled={isAddingFriend}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs border border-neutral-700 cursor-pointer flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isAddingFriend ? (language === 'ja' ? '検索中...' : language === 'en' ? 'Searching...' : 'Mencari...') : t('connectFriendBtn')}</span>
            </button>
          </form>
        </div>

        {addFriendSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{addFriendSuccess}</span>
          </div>
        )}
        {addFriendError && (
          <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{addFriendError}</span>
          </div>
        )}
      </div>

      {/* Friends Carousel / Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              {t('connectedFriends')} ({friends.length})
            </h3>
          </div>
          <span className="text-[11px] text-neutral-500">
            {t('bookSavedInFirestore')}
          </span>
        </div>

        {friends.length === 0 ? (
          <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-center space-y-2">
            <p className="text-xs text-neutral-400">
              {language === 'ja' ? (
                <>
                  まだ繋がっている仲間がいません。上のコード欄に友達の6桁ペアリングコード（例：Sarrah <strong className="text-amber-400">SRH110</strong>）を入力してください。
                </>
              ) : language === 'en' ? (
                <>
                  No friends connected yet. Enter a friend’s 6-digit pairing code above (e.g., Sarrah <strong className="text-amber-400">SRH110</strong>).
                </>
              ) : (
                <>
                  Belum ada sahabat yang terhubung. Masukkan kode pairing 6 digit sahabat di atas (contoh kode Sarrah: <strong className="text-amber-400">SRH110</strong>).
                </>
              )}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {friends.map((f) => (
              <div
                key={f.id}
                className="p-3.5 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 transition-all flex items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={f.avatar}
                    alt={f.name}
                    className="w-10 h-10 rounded-xl bg-neutral-800 object-cover border border-neutral-700"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{f.name}</h4>
                    <div className="text-[10px] text-neutral-400 font-mono flex items-center gap-1 mt-0.5">
                      <span className="capitalize">{f.theme === 'wizard_academy' ? '🧙‍♂️ Wizard' : '⚔️ Hunter'}</span>
                      <span>&bull;</span>
                      <span className="text-amber-400">{f.streakCount} {t('streakLabel')} 🔥</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedFriendId(f.id);
                    setCreateModalOpen(true);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 text-[11px] font-bold border border-neutral-700 cursor-pointer transition-colors"
                >
                  {language === 'ja' ? '一緒に書く' : language === 'en' ? 'Invite' : 'Ajak Nulis'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Collaborative Journal Quests List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              {language === 'ja'
                ? `共同魔導書シート • Co-Op Spreads (${collaborations.length})`
                : language === 'en'
                ? `Shared Journal Pages • Co-Op Spreads (${collaborations.length})`
                : `Lembar Jurnal Bersama • Co-Op Spreads (${collaborations.length})`}
            </h3>
          </div>
          <span className="text-[11px] text-neutral-500">
            {language === 'ja' ? '2人共同執筆' : language === 'en' ? '2-Author Co-Op' : 'Kolaborasi 2 Penulis'}
          </span>
        </div>

        {collaborations.length === 0 ? (
          <div className="p-8 rounded-3xl bg-neutral-900/70 border border-neutral-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center text-2xl mx-auto">
              📜
            </div>
            <h4 className="text-sm font-bold text-white font-serif-magic">
              {language === 'ja'
                ? 'まだ共同クエストがありません'
                : language === 'en'
                ? 'No Collaborative Quests Yet'
                : 'Belum Ada Lembar Kolaborasi'}
            </h4>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              {language === 'ja'
                ? '仲間と一緒に日記ページを書きましょう！テーマを選んでそれぞれのパートを埋めると、友情バッジが獲得できます。'
                : language === 'en'
                ? 'Invite a friend to co-write a journal spread! Pick a quest prompt and complete your halves to unlock friendship badges.'
                : 'Ajak sahabatmu menulis lembaran buku bersama! Pilih prompt tantangan dan isi bagian masing-masing untuk mendapatkan lencana persahabatan.'}
            </p>
            <button
              onClick={() => setCreateModalOpen(true)}
              disabled={friends.length === 0}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md cursor-pointer"
            >
              {t('createNewCollabBtn')}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {collaborations.map((collab) => {
              const isAuthor1 = collab.author1Id === currentUser.id;
              const isAuthor2 = collab.author2Id === currentUser.id;
              const needsMyReply =
                collab.status === 'in_progress' &&
                ((isAuthor2 && !collab.author2Text) || (isAuthor1 && !collab.author1Text));

              return (
                <div
                  key={collab.id}
                  className="rounded-3xl border-2 border-neutral-800 bg-neutral-900/90 shadow-2xl overflow-hidden"
                >
                  {/* Quest Header Bar */}
                  <div className="p-4 sm:p-5 bg-neutral-950/80 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {collab.theme === 'wizard_academy' ? '🪄' : '⚔️'}
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-white font-serif-magic">
                          {collab.title}
                        </h4>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            collab.status === 'completed'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse'
                          }`}
                        >
                          {collab.status === 'completed' ? t('collabMissionDone') : t('collabWaitingPartner')}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 italic">
                        Prompt: &ldquo;{collab.prompt}&rdquo;
                      </p>
                    </div>

                    {/* Cheers & Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCheer(collab.id)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                        title={t('collabCheerTooltip')}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>{collab.cheersCount} Sparks</span>
                      </button>

                      {needsMyReply && (
                        <button
                          onClick={() => {
                            setActiveCollabForReply(collab);
                            setReplyText('');
                          }}
                          className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold shadow-md cursor-pointer transition-colors"
                        >
                          {language === 'ja' ? '続きを書く (+100 XP)' : language === 'en' ? 'Contribute (+100 XP)' : 'Isi Bagianmu (+100 XP)'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Dual Parchment Physical Spread (Side A & Side B) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-800 bg-[#fbf7ee] text-neutral-900">
                    {/* SIDE A: Author 1 Contribution */}
                    <div className="p-5 sm:p-6 flex flex-col justify-between space-y-4 bg-gradient-to-br from-[#fcf9f2] to-[#f4eedb]">
                      <div>
                        {/* Author Header */}
                        <div className="flex items-center justify-between border-b border-amber-900/20 pb-2 mb-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={collab.author1Avatar}
                              alt={collab.author1Name}
                              className="w-8 h-8 rounded-lg bg-neutral-800 object-cover border border-amber-900/30"
                            />
                            <div>
                              <div className="text-xs font-bold text-amber-950 font-serif-magic">
                                {collab.author1Name}
                              </div>
                              <div className="text-[10px] text-amber-900/70 font-mono">
                                {language === 'ja' ? '第1著者（発起人）' : language === 'en' ? 'Lead Author' : 'Penulis Pembuka'}
                              </div>
                            </div>
                          </div>
                          {collab.author1Sticker && (
                            <span className="text-2xl select-none">{collab.author1Sticker}</span>
                          )}
                        </div>

                        {/* Content */}
                        {collab.author1Text ? (
                          <div className="p-3.5 rounded-xl bg-white/80 border border-amber-900/20 shadow-inner min-h-[120px]">
                            <p className="text-xs sm:text-sm text-neutral-900 font-serif-magic leading-relaxed whitespace-pre-wrap">
                              {collab.author1Text}
                            </p>
                          </div>
                        ) : (
                          <div className="p-6 rounded-xl border border-dashed border-amber-900/20 text-center text-xs text-amber-800/60 font-serif-magic">
                            {language === 'ja' ? 'まだ最初の文章がありません。' : language === 'en' ? 'No opening entry yet.' : 'Belum ada tulisan pembuka.'}
                          </div>
                        )}

                        {/* Doodle */}
                        {collab.author1Doodle && (
                          <div className="mt-3 p-2 bg-white/70 rounded-xl border border-amber-900/20 text-center">
                            <img
                              src={collab.author1Doodle}
                              alt="Author 1 Doodle"
                              className="max-h-32 mx-auto rounded-lg"
                            />
                          </div>
                        )}
                      </div>

                      <div className="text-[10px] font-mono text-amber-900/60 text-right">
                        {language === 'ja' ? '左ページ（共同記録）' : language === 'en' ? 'Left Co-Op Page' : 'Halaman Kiri Bersama'}
                      </div>
                    </div>

                    {/* SIDE B: Author 2 Contribution */}
                    <div className="p-5 sm:p-6 flex flex-col justify-between space-y-4 bg-gradient-to-bl from-[#fcf9f2] to-[#f4eedb]">
                      <div>
                        {/* Author Header */}
                        <div className="flex items-center justify-between border-b border-amber-900/20 pb-2 mb-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={collab.author2Avatar}
                              alt={collab.author2Name}
                              className="w-8 h-8 rounded-lg bg-neutral-800 object-cover border border-amber-900/30"
                            />
                            <div>
                              <div className="text-xs font-bold text-amber-950 font-serif-magic">
                                {collab.author2Name}
                              </div>
                              <div className="text-[10px] text-amber-900/70 font-mono">
                                {language === 'ja' ? '第2著者（相棒）' : language === 'en' ? 'Co-Quest Partner' : 'Sahabat Pendamping'}
                              </div>
                            </div>
                          </div>
                          {collab.author2Sticker && (
                            <span className="text-2xl select-none">{collab.author2Sticker}</span>
                          )}
                        </div>

                        {/* Content */}
                        {collab.author2Text ? (
                          <div className="p-3.5 rounded-xl bg-white/80 border border-amber-900/20 shadow-inner min-h-[120px]">
                            <p className="text-xs sm:text-sm text-neutral-900 font-serif-magic leading-relaxed whitespace-pre-wrap">
                              {collab.author2Text}
                            </p>
                          </div>
                        ) : (
                          <div className="p-8 rounded-xl border-2 border-dashed border-amber-900/30 bg-amber-50/60 text-center space-y-2 flex flex-col items-center justify-center min-h-[140px]">
                            <span className="text-2xl">⏳</span>
                            <div className="text-xs font-bold text-amber-950 font-serif-magic">
                              {t('waitingFriendContribution')} ({collab.author2Name})
                            </div>
                            {isAuthor2 && (
                              <button
                                onClick={() => {
                                  setActiveCollabForReply(collab);
                                  setReplyText('');
                                }}
                                className="mt-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm cursor-pointer"
                              >
                                {language === 'ja' ? '今すぐ返事を書く' : language === 'en' ? 'Write Reply Now' : 'Tulis Balasan Sekarang'}
                              </button>
                            )}
                          </div>
                        )}

                        {/* Doodle */}
                        {collab.author2Doodle && (
                          <div className="mt-3 p-2 bg-white/70 rounded-xl border border-amber-900/20 text-center">
                            <img
                              src={collab.author2Doodle}
                              alt="Author 2 Doodle"
                              className="max-h-32 mx-auto rounded-lg"
                            />
                          </div>
                        )}
                      </div>

                      <div className="text-[10px] font-mono text-amber-900/60 text-right">
                        {language === 'ja'
                          ? '右ページ • 暗号化済 • Firestore保存'
                          : language === 'en'
                          ? 'Right Co-Op Page • Encrypted • Stored in Firestore'
                          : 'Halaman Kanan Bersama • Terenkripsi • Disimpan di Firestore'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL 1: Create New Collaboration Quest */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-5 text-neutral-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✨</span>
                <div>
                  <h3 className="text-base font-bold text-white font-serif-magic">
                    {t('createNewCollabBtn')}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {t('duoQuestSubtitle')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCollaboration} className="space-y-4">
              {/* Select Friend */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-300">
                  {language === 'ja'
                    ? '1. 一緒にクエストを行う仲間を選択:'
                    : language === 'en'
                    ? '1. Choose a Friend for Co-Op Quest:'
                    : '1. Pilih Sahabat untuk Diajak Kolaborasi:'}
                </label>
                <select
                  value={selectedFriendId}
                  onChange={(e) => setSelectedFriendId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {friends.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.theme === 'wizard_academy' ? 'Wizard Academy' : 'Demon Hunter'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-300">
                  {language === 'ja'
                    ? '2. コラボシートのタイトル:'
                    : language === 'en'
                    ? '2. Collaboration Spread Title:'
                    : '2. Judul Lembar Kolaborasi:'}
                </label>
                <input
                  type="text"
                  placeholder={t('collabTopicPlaceholder')}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Prompt selection */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-300">
                  {language === 'ja'
                    ? '3. クエストの問いかけ / テーマ:'
                    : language === 'en'
                    ? '3. Collaboration Prompt / Quest:'
                    : '3. Pertanyaan / Misi Kolaborasi:'}
                </label>
                <select
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-amber-400 mb-1.5"
                >
                  {SUGGESTED_PROMPTS.map((p, idx) => (
                    <option key={idx} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Initial text */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-300">
                  {language === 'ja'
                    ? '4. 最初のメッセージ・振り返りを書く:'
                    : language === 'en'
                    ? '4. Write Your Opening Reflection:'
                    : '4. Tulis Refleksi Pembukamu:'}
                </label>
                <textarea
                  placeholder={t('collabFirstStoryPlaceholder')}
                  value={initialText}
                  onChange={(e) => setInitialText(e.target.value)}
                  rows={3}
                  required
                  className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white font-serif-magic resize-none focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Sticker Choice */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-300">
                  {language === 'ja'
                    ? '5. 封印ステッカーを選択:'
                    : language === 'en'
                    ? '5. Choose Seal Sticker:'
                    : '5. Pilih Stiker Segel:'}
                </label>
                <div className="flex gap-2 text-xl">
                  {['✨', '⚔️', '🔥', '🌸', '🪄', '📜', '🛡️'].map((stk) => (
                    <button
                      key={stk}
                      type="button"
                      onClick={() => setInitialSticker(stk)}
                      className={`p-2 rounded-lg cursor-pointer ${
                        initialSticker === stk ? 'bg-amber-500/30 border border-amber-400 scale-110' : 'bg-neutral-800'
                      }`}
                    >
                      {stk}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white cursor-pointer"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNew}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingNew ? t('collabSendingMission') : t('collabSendMissionBtn')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Reply / Contribute to Collaborative Quest */}
      {activeCollabForReply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl space-y-5 text-neutral-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h3 className="text-base font-bold text-white font-serif-magic">
                  {language === 'ja'
                    ? `共同シートを完成させる: ${activeCollabForReply.title}`
                    : language === 'en'
                    ? `Complete Co-Op Spread: ${activeCollabForReply.title}`
                    : `Lengkapi Lembar Kolaborasi: ${activeCollabForReply.title}`}
                </h3>
                <p className="text-xs text-neutral-400">
                  {language === 'ja'
                    ? `${activeCollabForReply.author1Name} との共同クエスト`
                    : language === 'en'
                    ? `With ${activeCollabForReply.author1Name}`
                    : `Bersama ${activeCollabForReply.author1Name}`}
                </p>
              </div>
              <button
                onClick={() => setActiveCollabForReply(null)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-800/30 text-amber-200 text-xs">
              <span className="font-bold">Prompt: </span>
              <em>&ldquo;{activeCollabForReply.prompt}&rdquo;</em>
            </div>

            <form onSubmit={handleContribute} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-300">
                  {t('yourContributionLabel')}:
                </label>
                <textarea
                  placeholder={t('collabReplyPlaceholder')}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  required
                  className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white font-serif-magic resize-none focus:outline-none focus:border-emerald-400"
                />
              </div>

              {/* Stikers */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-300">
                  {t('chooseSticker')}:
                </label>
                <div className="flex gap-2 text-xl">
                  {['🔥', '✨', '🌸', '⚔️', '🪄', '🍵', '🤝'].map((stk) => (
                    <button
                      key={stk}
                      type="button"
                      onClick={() => setReplySticker(stk)}
                      className={`p-2 rounded-lg cursor-pointer ${
                        replySticker === stk ? 'bg-emerald-500/30 border border-emerald-400 scale-110' : 'bg-neutral-800'
                      }`}
                    >
                      {stk}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveCollabForReply(null)}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white cursor-pointer"
                >
                  {t('cancelBtn')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReply}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isSubmittingReply ? t('collabSavingCollab') : t('collabSealCompleteBtn')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
