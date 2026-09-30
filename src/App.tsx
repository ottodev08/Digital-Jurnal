/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Shield,
  Activity,
  Award,
  LogIn,
  Database,
  Users,
  ShieldAlert,
  Home,
} from 'lucide-react';
import { ThemeId, User, JournalEntry } from './types';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { ThemeSelector } from './components/ThemeSelector';
import { JournalBook } from './components/JournalBook';
import { JournalList } from './components/JournalList';
import { FriendCollaborationView } from './components/FriendCollaborationView';
import { ParentPortal } from './components/ParentPortal';
import { ActivityLogView } from './components/ActivityLogView';
import { BadgesModal } from './components/BadgesModal';
import { AuthModal } from './components/AuthModal';
import { SuperAdminModule } from './components/SuperAdminModule';
import { authFetch, setStoredToken, clearStoredToken } from './utils/auth';
import { testConnection } from './firebase';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { language, t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user_sarrah',
    name: 'Sarrah',
    email: 'sarrah@magicjournal.local',
    role: 'child',
    age: 11,
    theme: 'wizard_academy',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=SarrahMagic',
    streakCount: 5,
    xp: 550,
    level: 3,
    pairingCode: 'SRH110',
    parentEmail: 'fatiha@guardian.local',
  });

  // View Mode: 'index' (Landing Page as Index Page) | 'app' (Main Workspace) | 'superadmin' (Standalone Super Admin Module)
  const [viewMode, setViewMode] = useState<'index' | 'app' | 'superadmin'>('index');
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('wizard_academy');
  const [activeTab, setActiveTab] = useState<'journal' | 'collab' | 'parent' | 'logs'>('journal');
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [badgesOpen, setBadgesOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    provider: string;
    stats?: { usersCount: number; journalsCount: number; logsCount: number };
  }>({
    connected: true,
    provider: 'Cloud Firestore',
  });

  // Test Firestore connection on boot & load session & database status
  useEffect(() => {
    testConnection().catch((err) => console.log('Firestore probe:', err));

    authFetch('/api/database/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && !data.error) {
          setDbStatus(data);
        }
      })
      .catch((err) => console.log('Database status fetch:', err));

    authFetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) {
          setCurrentUser(data.user);
          setCurrentTheme(data.user.theme || 'wizard_academy');
          if (data.token) {
            setStoredToken(data.token);
          }
        }
      })
      .catch((err) => console.log('Init auth fallback', err));
  }, []);

  // Fetch journals whenever active user ID or role changes
  useEffect(() => {
    if (currentUser.role === 'child') {
      authFetch('/api/journals')
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data)) {
            setJournals((prev) => {
              const prevDecrypted = new Map<string, string>();
              prev.forEach((p) => {
                if (p.decryptedText) {
                  prevDecrypted.set(p.id, p.decryptedText);
                }
              });
              const uniqueMap = new Map<string, JournalEntry>();
              data.forEach((item: JournalEntry) => {
                if (item && item.id && !uniqueMap.has(item.id)) {
                  const cachedPlain = prevDecrypted.get(item.id);
                  uniqueMap.set(
                    item.id,
                    cachedPlain ? { ...item, decryptedText: cachedPlain } : item
                  );
                }
              });
              return Array.from(uniqueMap.values());
            });
          }
        })
        .catch((err) => console.error(err));
    }
  }, [currentUser.id, currentUser.role]);

  // Handle switching theme
  const handleSelectTheme = async (theme: ThemeId) => {
    setCurrentTheme(theme);
    try {
      await authFetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme }),
      });
      setCurrentUser((prev) => ({ ...prev, theme }));
    } catch (err) {
      console.error('Failed to sync theme', err);
    }
  };

  const handleToggleTheme = () => {
    const nextTheme: ThemeId =
      currentTheme === 'wizard_academy' ? 'demon_hunter' : 'wizard_academy';
    handleSelectTheme(nextTheme);
  };

  const handleJournalCreated = (newEntry: JournalEntry, updatedUser: User) => {
    setJournals((prev) => {
      const filtered = prev.filter((j) => j.id !== newEntry.id);
      return [newEntry, ...filtered];
    });
    setCurrentUser(updatedUser);
    authFetch('/api/database/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && !data.error) setDbStatus(data);
      })
      .catch(() => {});
  };

  // Quick persona login from Index Landing Page
  const handleQuickPersonaLogin = async (
    userId: string,
    targetView: 'app' | 'superadmin' = 'app',
    targetTab: 'journal' | 'collab' | 'parent' | 'logs' = 'journal'
  ) => {
    try {
      const res = await authFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (res.ok && data.user && data.token) {
        setCurrentUser(data.user);
        setCurrentTheme(data.user.theme || 'wizard_academy');
        setStoredToken(data.token);
      }
    } catch (err) {
      console.error('Quick persona login error:', err);
    }
    setActiveTab(targetTab);
    setViewMode(targetView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Dedicated Super Admin Module (auto-authenticates as Super Admin if not already)
  const handleLaunchSuperAdminModule = async () => {
    if (currentUser.role !== 'super_admin') {
      try {
        const res = await authFetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 'user_superadmin' }),
        });
        const data = await res.json();
        if (res.ok && data.user && data.token) {
          setCurrentUser(data.user);
          setStoredToken(data.token);
        }
      } catch (err) {
        console.error('Failed to switch to super admin session', err);
      }
    }
    setViewMode('superadmin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logout handler: clears JWT session
  const handleLogout = async () => {
    try {
      await authFetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Continue client cleanup regardless
    }
    clearStoredToken();
    setViewMode('index');
    setAuthMode('login');
    setAuthOpen(true);
  };

  // 1. Render Separate Full-Screen Super Admin Module when viewMode === 'superadmin'
  if (viewMode === 'superadmin') {
    return (
      <SuperAdminModule
        currentUser={currentUser}
        onExitSuperAdmin={() => setViewMode('index')}
        onSwitchSessionUser={(user, token) => {
          setCurrentUser(user);
          setCurrentTheme(user.theme || 'wizard_academy');
          setStoredToken(token);
          if (user.role === 'parent') {
            setActiveTab('parent');
            setViewMode('app');
          } else if (user.role === 'child') {
            setActiveTab('journal');
            setViewMode('app');
          }
        }}
      />
    );
  }

  // 2. Render Standalone Landing Page as Index Page when viewMode === 'index'
  if (viewMode === 'index') {
    return (
      <>
        <LandingPage
          theme={currentTheme}
          currentUser={currentUser}
          dbStats={dbStatus.stats}
          onSelectTheme={handleSelectTheme}
          onEnterApp={(targetTab) => {
            if (targetTab) setActiveTab(targetTab);
            setViewMode('app');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onQuickPersonaLogin={handleQuickPersonaLogin}
          onOpenAuthModal={(mode) => {
            setAuthMode(mode);
            setAuthOpen(true);
          }}
          onOpenSuperAdmin={handleLaunchSuperAdminModule}
        />

        <AuthModal
          isOpen={authOpen}
          initialMode={authMode}
          onClose={() => setAuthOpen(false)}
          onLoginSuccess={(user, token) => {
            setCurrentUser(user);
            setCurrentTheme(user.theme || 'wizard_academy');
            setStoredToken(token);
            if (user.role === 'super_admin') {
              setViewMode('superadmin');
            } else if (user.role === 'parent') {
              setActiveTab('parent');
              setViewMode('app');
            } else {
              setActiveTab('journal');
              setViewMode('app');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </>
    );
  }

  // 3. Render Main Application Workspace when viewMode === 'app'
  const isWizard = currentTheme === 'wizard_academy';

  return (
    <div
      className={`min-h-screen transition-colors duration-500 flex flex-col ${
        isWizard
          ? 'bg-[#0d0a09] text-amber-50 selection:bg-amber-500 selection:text-black'
          : 'bg-[#070d0a] text-emerald-50 selection:bg-emerald-500 selection:text-black'
      }`}
    >
      {/* Top Navbar Contract */}
      <Navbar
        user={currentUser}
        theme={currentTheme}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenIndex={() => {
          setViewMode('index');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBadges={() => setBadgesOpen(true)}
        onToggleTheme={handleToggleTheme}
        onOpenAuth={(mode) => {
          setAuthMode(mode || 'login');
          setAuthOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-8">
        {/* Active Persona & Database Persistence Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setViewMode('index')}
              className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
              title="Kembali ke Halaman Index (Landing Page)"
            >
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'ja' ? 'ホーム' : language === 'en' ? 'Index Page' : 'Halaman Index'}</span>
            </button>

            <span className="text-neutral-600">&bull;</span>
            <span className="text-neutral-400">{t('activeUser')}:</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{currentUser.name}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  currentUser.role === 'child'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : currentUser.role === 'super_admin'
                    ? 'bg-indigo-950 text-indigo-300 border border-indigo-700'
                    : 'bg-purple-950 text-purple-400 border border-purple-800'
                }`}
              >
                {currentUser.role === 'child'
                  ? t('childRole')
                  : currentUser.role === 'super_admin'
                  ? 'Super Admin'
                  : t('parentRole')}
              </span>
            </div>
            {currentUser.role === 'child' && (
              <span className="hidden sm:inline text-neutral-400">
                &bull; {t('streakLabel')}: <strong className="text-amber-400">{currentUser.streakCount} {t('days')} 🔥</strong>
              </span>
            )}

            {/* Cloud Firestore Database Status Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/70 border border-emerald-700/60 text-emerald-300 font-mono text-[11px] shadow-sm">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('dbStatus')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title={t('connected')}></span>
              {dbStatus.stats && (
                <span className="hidden md:inline text-[10px] text-emerald-400/80">
                  ({dbStatus.stats.journalsCount} {t('journalsCountLabel')})
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleLaunchSuperAdminModule}
              className="px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/70 text-indigo-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Buka Modul Super Admin Terpisah"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {language === 'ja'
                  ? 'Super Admin モジュール'
                  : language === 'en'
                  ? 'Super Admin Module'
                  : 'Modul Super Admin'}
              </span>
            </button>
            <span className="text-neutral-600">&bull;</span>
            <button
              onClick={() => setShowThemePanel(!showThemePanel)}
              className="text-xs text-neutral-300 hover:text-white underline underline-offset-4 cursor-pointer"
            >
              {showThemePanel ? t('hideTheme') : t('customizeTheme')}
            </button>
            <span className="text-neutral-600">&bull;</span>
            <button
              onClick={() => {
                setAuthMode('login');
                setAuthOpen(true);
              }}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('switchAccount')}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Theme Selection Panel */}
        {showThemePanel && (
          <div className="p-4 bg-neutral-900/80 rounded-2xl border border-neutral-800 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Dynamic Theme Engine (CSS &amp; Aset Tematik)
              </span>
              <button
                onClick={() => setShowThemePanel(false)}
                className="text-xs text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <ThemeSelector currentTheme={currentTheme} onSelectTheme={handleSelectTheme} />
          </div>
        )}

        {/* Tab 1: Journaling View */}
        {activeTab === 'journal' && (
          <div className="space-y-8">
            {currentUser.role === 'child' ? (
              <div id="journal-editor-section" className="space-y-8 scroll-mt-20">
                <JournalBook
                  user={currentUser}
                  theme={currentTheme}
                  journals={journals}
                  onJournalCreated={handleJournalCreated}
                />

                {/* Previous Journal Search & Quick Explorer */}
                <div className="pt-4 border-t border-neutral-800/80">
                  <JournalList journals={journals} currentTheme={currentTheme} />
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-neutral-900/90 border border-neutral-800 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl">
                  🛡️
                </div>
                <h3 className="text-lg font-bold text-white">
                  {t('parentViewingChildNoteTitle')} ({currentUser.name})
                </h3>
                <p className="text-xs text-neutral-400 max-w-lg mx-auto leading-relaxed">
                  {t('parentViewingChildNoteDesc')}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('parent')}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    {t('openParentPortalBtn')}
                  </button>
                  <button
                    onClick={handleLaunchSuperAdminModule}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 cursor-pointer"
                  >
                    {language === 'ja'
                      ? 'Super Admin モジュールを開く'
                      : language === 'en'
                      ? 'Open Super Admin Module'
                      : 'Buka Modul Super Admin'}
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setAuthOpen(true);
                    }}
                    className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-xl border border-neutral-700 font-medium cursor-pointer"
                  >
                    {t('switchChildAccountBtn')}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Friend Collaboration */}
        {activeTab === 'collab' && (
          <div className="space-y-6">
            <FriendCollaborationView
              currentUser={currentUser}
              theme={currentTheme}
              onRefreshUser={(updated) => setCurrentUser(updated)}
            />
          </div>
        )}

        {/* Tab 3: Parent Portal */}
        {activeTab === 'parent' && <ParentPortal currentUser={currentUser} />}

        {/* Tab 4: Detailed Activity Logs */}
        {activeTab === 'logs' && <ActivityLogView />}
      </main>

      {/* Mobile Touch-First Fixed Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 px-3 py-2 pb-safe">
        <div className="grid grid-cols-5 items-center gap-1">
          <button
            onClick={() => setActiveTab('journal')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'journal' ? 'text-amber-400 font-bold' : 'text-neutral-400'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-[9px] truncate max-w-full px-1">{t('navJournal')}</span>
          </button>

          <button
            onClick={() => setActiveTab('collab')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'collab' ? 'text-amber-400 font-bold' : 'text-neutral-400'
            }`}
          >
            <Users className="w-5 h-5 mb-1" />
            <span className="text-[9px] truncate max-w-full px-1">{t('navCollab')}</span>
          </button>

          <button
            onClick={() => setActiveTab('parent')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'parent' ? 'text-amber-400 font-bold' : 'text-neutral-400'
            }`}
          >
            <Shield className="w-5 h-5 mb-1" />
            <span className="text-[9px] truncate max-w-full px-1">{t('navParent')}</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'logs' ? 'text-amber-400 font-bold' : 'text-neutral-400'
            }`}
          >
            <Activity className="w-5 h-5 mb-1" />
            <span className="text-[9px] truncate max-w-full px-1">{t('navAudit')}</span>
          </button>

          <button
            onClick={() => setBadgesOpen(true)}
            className="flex flex-col items-center justify-center py-1 text-neutral-400 hover:text-amber-300 transition-colors"
          >
            <Award className="w-5 h-5 mb-1 text-amber-400" />
            <span className="text-[9px] truncate max-w-full px-1">{t('navBadges')}</span>
          </button>
        </div>
      </nav>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950/60 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('index')}
              className="font-serif-magic font-bold text-neutral-300 hover:text-amber-400 transition-colors cursor-pointer"
            >
              Magic Journal
            </button>
            <span>&bull;</span>
            <span>{t('footerTagline')}</span>
          </div>
          <div className="text-neutral-400 text-[11px]">
            {t('footerPrivacy')}
          </div>
        </div>
      </footer>

      {/* Badges Modal */}
      <BadgesModal
        isOpen={badgesOpen}
        onClose={() => setBadgesOpen(false)}
        user={currentUser}
        theme={currentTheme}
      />

      {/* Auth Modal (Supports Login & Registration with JWT) */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={(user, token) => {
          setCurrentUser(user);
          setCurrentTheme(user.theme || 'wizard_academy');
          setStoredToken(token);
          if (user.role === 'super_admin') {
            setViewMode('superadmin');
          } else if (user.role === 'parent') {
            setActiveTab('parent');
            setViewMode('app');
          } else {
            setActiveTab('journal');
            setViewMode('app');
          }
        }}
      />
    </div>
  );
}
