import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  Users,
  Database,
  Lock,
  Settings,
  Activity,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Search,
  Link2,
  Unlink,
  ArrowLeft,
  Download,
  Radio,
  Sparkles,
  UserCheck,
  AlertTriangle,
  Key,
  Sliders,
  BookOpen,
  Layers,
} from 'lucide-react';
import {
  User,
  ThemeId,
  UserRole,
  JournalEntry,
  ParentShare,
  FriendCollaboration,
  ActivityLog,
  SystemConfig,
  CustomPrompt,
} from '../types';
import { authFetch } from '../utils/auth';
import { useLanguage } from '../context/LanguageContext';

interface SuperAdminModuleProps {
  currentUser: User;
  onExitSuperAdmin: () => void;
  onSwitchSessionUser: (user: User, token: string) => void;
}

type AdminSection = 'overview' | 'users' | 'relations' | 'vault' | 'cms' | 'audit';

interface OverviewPayload {
  database: {
    connected: boolean;
    provider: string;
    databaseId: string;
    lastSyncAt: string;
  };
  counts: {
    totalUsers: number;
    childrenCount: number;
    parentsCount: number;
    superAdminsCount: number;
    journalsCount: number;
    parentSharesCount: number;
    collaborationsCount: number;
    completedCollabsCount: number;
    logsCount: number;
    securityAlertsCount: number;
  };
  themeDistribution: {
    wizardAcademy: number;
    demonHunter: number;
  };
  globalMoodDistribution: {
    score: number;
    count: number;
    percentage: number;
  }[];
  childHealthMonitors: {
    childId: string;
    childName: string;
    email: string;
    age: number;
    theme: ThemeId;
    streakCount: number;
    xp: number;
    level: number;
    totalJournals: number;
    averageMood: number;
    consecutiveLowMoodDays: number;
    hasAlert: boolean;
    parentEmail?: string;
    pairingCode?: string;
  }[];
  systemConfig: SystemConfig;
  customPrompts: CustomPrompt[];
  users: User[];
  journals: JournalEntry[];
  parentShares: ParentShare[];
  collaborations: FriendCollaboration[];
  logs: ActivityLog[];
}

export const SuperAdminModule: React.FC<SuperAdminModuleProps> = ({
  currentUser,
  onExitSuperAdmin,
  onSwitchSessionUser,
}) => {
  const { language, setLanguage } = useLanguage();
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [data, setData] = useState<OverviewPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [bannerMsg, setBannerMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // User Management state
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // New User Form
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('Password123!');
  const [newUserRole, setNewUserRole] = useState<UserRole>('child');
  const [newUserAge, setNewUserAge] = useState<number>(11);
  const [newUserTheme, setNewUserTheme] = useState<ThemeId>('wizard_academy');
  const [newUserParentEmail, setNewUserParentEmail] = useState('');

  // Edit User Form
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('child');
  const [editTheme, setEditTheme] = useState<ThemeId>('wizard_academy');
  const [editXp, setEditXp] = useState<number>(0);
  const [editStreak, setEditStreak] = useState<number>(0);
  const [editParentEmail, setEditParentEmail] = useState('');
  const [editPairingCode, setEditPairingCode] = useState('');
  const [editNewPassword, setEditNewPassword] = useState('');

  // Family Graph Linking state
  const [selectedChildId, setSelectedChildId] = useState('');
  const [selectedParentId, setSelectedParentId] = useState('');

  // Vault Search state
  const [vaultSearch, setVaultSearch] = useState('');
  const [selectedCipherEntry, setSelectedCipherEntry] = useState<JournalEntry | null>(null);

  // CMS & Config state
  const [cfgXpJournal, setCfgXpJournal] = useState(100);
  const [cfgXpShare, setCfgXpShare] = useState(50);
  const [cfgXpCollab, setCfgXpCollab] = useState(100);
  const [cfgAlertDays, setCfgAlertDays] = useState(3);
  const [cfgAllowReg, setCfgAllowReg] = useState(true);
  const [cfgMaintenance, setCfgMaintenance] = useState(false);

  const [promptTheme, setPromptTheme] = useState<ThemeId>('wizard_academy');
  const [promptTextId, setPromptTextId] = useState('');
  const [promptTextEn, setPromptTextEn] = useState('');
  const [promptTextJa, setPromptTextJa] = useState('');

  // Audit Log state
  const [auditSearch, setAuditSearch] = useState('');
  const [auditSeverity, setAuditSeverity] = useState<'all' | 'info' | 'security' | 'warning' | 'alert'>('all');
  const [broadcastAction, setBroadcastAction] = useState('SECURITY_POLICY_NOTICE');
  const [broadcastDetails, setBroadcastDetails] = useState('');
  const [broadcastSeverity, setBroadcastSeverity] = useState<'info' | 'security' | 'warning' | 'alert'>('security');

  const tr = useCallback(
    (idText: string, enText: string, jaText: string) => {
      if (language === 'en') return enText;
      if (language === 'ja') return jaText;
      return idText;
    },
    [language]
  );

  const showNotice = (type: 'success' | 'error', text: string) => {
    setBannerMsg({ type, text });
    setTimeout(() => {
      setBannerMsg((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  const fetchOverview = useCallback(async () => {
    try {
      const res = await authFetch('/api/superadmin/overview');
      if (res.ok) {
        const payload: OverviewPayload = await res.json();
        setData(payload);
        if (payload.systemConfig) {
          setCfgXpJournal(payload.systemConfig.xpPerJournal);
          setCfgXpShare(payload.systemConfig.xpPerParentShare);
          setCfgXpCollab(payload.systemConfig.xpPerCollab);
          setCfgAlertDays(payload.systemConfig.lowMoodAlertDays);
          setCfgAllowReg(payload.systemConfig.allowRegistration);
          setCfgMaintenance(payload.systemConfig.maintenanceMode);
        }
        const firstChild = payload.users.find((u) => u.role === 'child');
        const firstParent = payload.users.find((u) => u.role === 'parent');
        if (firstChild && !selectedChildId) setSelectedChildId(firstChild.id);
        if (firstParent && !selectedParentId) setSelectedParentId(firstParent.id);
      }
    } catch (err) {
      console.error('Failed to load Super Admin overview:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedChildId, selectedParentId]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const handleForceSync = async () => {
    setSyncing(true);
    try {
      const res = await authFetch('/api/superadmin/system/sync', { method: 'POST' });
      if (res.ok) {
        await fetchOverview();
        showNotice(
          'success',
          tr(
            'Sinkronisasi penuh dengan Google Cloud Firestore berhasil diverifikasi.',
            'Full synchronization with Google Cloud Firestore verified.',
            'Google Cloud Firestoreとの完全同期が検証されました。'
          )
        );
      }
    } catch {
      showNotice('error', tr('Gagal melakukan sinkronisasi Firestore.', 'Failed to sync Firestore.', 'Firestore同期に失敗しました。'));
    } finally {
      setSyncing(false);
    }
  };

  const handleImpersonateUser = async (userId: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const result = await res.json();
      if (res.ok && result.user && result.token) {
        onSwitchSessionUser(result.user, result.token);
        if (result.user.role !== 'super_admin') {
          onExitSuperAdmin();
        } else {
          showNotice(
            'success',
            tr(
              `Sesi aktif beralih ke ${result.user.name}.`,
              `Active session switched to ${result.user.name}.`,
              `アクティブなセッションが ${result.user.name} に切り替わりました。`
            )
          );
        }
      }
    } catch {
      showNotice('error', tr('Gagal beralih sesi pengguna.', 'Failed to switch user session.', 'セッション切り替えに失敗しました。'));
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authFetch('/api/superadmin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole,
          age: newUserAge,
          theme: newUserTheme,
          parentEmail: newUserRole === 'child' ? newUserParentEmail : undefined,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setShowCreateUserModal(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserParentEmail('');
        await fetchOverview();
        showNotice(
          'success',
          tr(
            `Akun ${result.user.name} berhasil dibuat di Cloud Firestore.`,
            `Account ${result.user.name} created in Cloud Firestore.`,
            `アカウント ${result.user.name} がCloud Firestoreに作成されました。`
          )
        );
      } else {
        showNotice('error', result.error || 'Error');
      }
    } catch {
      showNotice('error', 'Network error');
    }
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditRole(u.role);
    setEditTheme(u.theme);
    setEditXp(u.xp);
    setEditStreak(u.streakCount);
    setEditParentEmail(u.parentEmail || '');
    setEditPairingCode(u.pairingCode || '');
    setEditNewPassword('');
  };

  const handleSaveUserEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const res = await authFetch(`/api/superadmin/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          role: editRole,
          theme: editTheme,
          xp: editXp,
          streakCount: editStreak,
          parentEmail: editParentEmail,
          pairingCode: editPairingCode,
          newPassword: editNewPassword || undefined,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setEditingUser(null);
        await fetchOverview();
        showNotice(
          'success',
          tr(
            `Data & RBAC untuk ${result.user.name} berhasil diperbarui.`,
            `Profile & RBAC for ${result.user.name} updated.`,
            `${result.user.name} のプロフィールとRBACが更新されました。`
          )
        );
      } else {
        showNotice('error', result.error || 'Failed');
      }
    } catch {
      showNotice('error', 'Network error');
    }
  };

  const handleDeleteUser = async (u: User) => {
    if (u.id === 'user_superadmin') return;
    try {
      const res = await authFetch(`/api/superadmin/users/${u.id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchOverview();
        showNotice(
          'success',
          tr(
            `Akun ${u.name} telah dihapus dari sistem.`,
            `Account ${u.name} deleted from system.`,
            `アカウント ${u.name} が削除されました。`
          )
        );
      } else {
        const err = await res.json();
        showNotice('error', err.error || 'Error');
      }
    } catch {
      showNotice('error', 'Network error');
    }
  };

  const handleFamilyLinkAction = async (childId: string, parentId: string, action: 'link' | 'unlink') => {
    if (!childId || !parentId) return;
    try {
      const res = await authFetch('/api/superadmin/relations/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, parentId, action }),
      });
      if (res.ok) {
        await fetchOverview();
        showNotice(
          'success',
          action === 'link'
            ? tr('Relasi Orang Tua & Anak berhasil ditautkan.', 'Parent & Child relation linked.', '親子アカウントが連携されました。')
            : tr('Relasi Orang Tua & Anak berhasil diputuskan.', 'Parent & Child relation unlinked.', '親子アカウントの連携が解除されました。')
        );
      }
    } catch {
      showNotice('error', 'Failed to update family relation');
    }
  };

  const handleDeleteJournal = async (journalId: string) => {
    try {
      const res = await authFetch(`/api/superadmin/journals/${journalId}`, { method: 'DELETE' });
      if (res.ok) {
        if (selectedCipherEntry?.id === journalId) setSelectedCipherEntry(null);
        await fetchOverview();
        showNotice(
          'success',
          tr(
            `Entri jurnal terenkripsi [${journalId}] telah dihapus.`,
            `Encrypted journal entry [${journalId}] purged.`,
            `暗号化ジャーナル [${journalId}] を削除しました。`
          )
        );
      }
    } catch {
      showNotice('error', 'Failed to delete journal');
    }
  };

  const handleDeleteCollab = async (collabId: string) => {
    try {
      const res = await authFetch(`/api/superadmin/collaborations/${collabId}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchOverview();
        showNotice(
          'success',
          tr(
            'Misi kolaborasi berhasil dimoderasi/dihapus.',
            'Collaboration quest moderated/removed.',
            'コラボクエストを削除しました。'
          )
        );
      }
    } catch {
      showNotice('error', 'Failed to delete collaboration');
    }
  };

  const handleSaveSystemConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authFetch('/api/superadmin/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          xpPerJournal: cfgXpJournal,
          xpPerParentShare: cfgXpShare,
          xpPerCollab: cfgXpCollab,
          lowMoodAlertDays: cfgAlertDays,
          allowRegistration: cfgAllowReg,
          maintenanceMode: cfgMaintenance,
        }),
      });
      if (res.ok) {
        await fetchOverview();
        showNotice(
          'success',
          tr(
            'Konfigurasi gamifikasi & sistem berhasil disimpan ke Cloud Firestore.',
            'Gamification & system configuration saved to Cloud Firestore.',
            'システム設定がCloud Firestoreに保存されました。'
          )
        );
      }
    } catch {
      showNotice('error', 'Failed to update config');
    }
  };

  const handleAddPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptTextId.trim()) return;
    try {
      const res = await authFetch('/api/superadmin/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: promptTheme,
          textId: promptTextId.trim(),
          textEn: (promptTextEn || promptTextId).trim(),
          textJa: (promptTextJa || promptTextId).trim(),
        }),
      });
      if (res.ok) {
        setPromptTextId('');
        setPromptTextEn('');
        setPromptTextJa('');
        await fetchOverview();
        showNotice(
          'success',
          tr(
            'Prompt refleksi baru berhasil ditambahkan ke CMS.',
            'New reflection prompt added to CMS.',
            '新しいリフレクションプロンプトがCMSに追加されました。'
          )
        );
      }
    } catch {
      showNotice('error', 'Failed to add prompt');
    }
  };

  const handleDeletePrompt = async (promptId: string) => {
    try {
      const res = await authFetch(`/api/superadmin/prompts/${promptId}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchOverview();
        showNotice('success', tr('Prompt kustom dihapus.', 'Custom prompt removed.', 'カスタムプロンプトを削除しました。'));
      }
    } catch {
      showNotice('error', 'Failed to delete prompt');
    }
  };

  const handleSendBroadcastLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastDetails.trim()) return;
    try {
      const res = await authFetch('/api/superadmin/logs/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: broadcastAction,
          details: broadcastDetails,
          severity: broadcastSeverity,
        }),
      });
      if (res.ok) {
        setBroadcastDetails('');
        await fetchOverview();
        showNotice(
          'success',
          tr(
            'Pengumuman keamanan berhasil dicatat ke Audit Trail.',
            'Security broadcast recorded to Audit Trail.',
            'セキュリティ通知が監査ログに記録されました。'
          )
        );
      }
    } catch {
      showNotice('error', 'Failed to broadcast log');
    }
  };

  const handleExportAuditCsv = () => {
    if (!data?.logs.length) return;
    const headers = ['ID', 'Timestamp', 'User', 'Role', 'Action', 'Severity', 'IP', 'Details'];
    const rows = data.logs.map((l) => [
      l.id,
      l.timestamp,
      `"${l.userName.replace(/"/g, '""')}"`,
      l.role,
      l.action,
      l.severity,
      l.ip,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `magic-journal-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const navItems: { id: AdminSection; label: string; icon: React.ReactNode; count?: number }[] = [
    {
      id: 'overview',
      label: tr('Ringkasan Eksekutif', 'Executive Overview', 'エグゼクティブ概要'),
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'users',
      label: tr('Direktori Akun & RBAC', 'Users & RBAC', 'ユーザー・RBAC管理'),
      icon: <Users className="w-4 h-4" />,
      count: data?.counts.totalUsers,
    },
    {
      id: 'relations',
      label: tr('Graf Keluarga & Misi', 'Family & Co-op Graph', '家族・フレンド連携'),
      icon: <Link2 className="w-4 h-4" />,
      count: data?.counts.collaborationsCount,
    },
    {
      id: 'vault',
      label: tr('Brankas Kriptografi', 'Zero-Knowledge Vault', '暗号化ボールト監査'),
      icon: <Lock className="w-4 h-4" />,
      count: data?.counts.journalsCount,
    },
    {
      id: 'cms',
      label: tr('CMS Prompt & Sistem', 'Prompts & Config CMS', 'プロンプト・設定CMS'),
      icon: <Sliders className="w-4 h-4" />,
      count: data?.customPrompts.length,
    },
    {
      id: 'audit',
      label: tr('Pusat Audit Keamanan', 'Security Audit Center', 'セキュリティ監査ログ'),
      icon: <Activity className="w-4 h-4" />,
      count: data?.counts.logsCount,
    },
  ];

  const activeNavObj = navItems.find((n) => n.id === activeSection) || navItems[0];

  const filteredUsers = (data?.users || []).filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const q = userSearch.toLowerCase();
    const matchesQuery =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.pairingCode || '').toLowerCase().includes(q);
    return matchesRole && matchesQuery;
  });

  const filteredJournals = (data?.journals || []).filter((j) => {
    const q = vaultSearch.toLowerCase();
    return (
      !q ||
      j.id.toLowerCase().includes(q) ||
      j.userName.toLowerCase().includes(q) ||
      j.moodLabel.toLowerCase().includes(q) ||
      j.promptQuestion.toLowerCase().includes(q)
    );
  });

  const filteredLogs = (data?.logs || []).filter((l) => {
    const matchesSeverity = auditSeverity === 'all' || l.severity === auditSeverity;
    const q = auditSearch.toLowerCase();
    const matchesQuery =
      !q ||
      l.userName.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      l.details.toLowerCase().includes(q);
    return matchesSeverity && matchesQuery;
  });

  const childrenList = (data?.users || []).filter((u) => u.role === 'child');
  const parentsList = (data?.users || []).filter((u) => u.role === 'parent');

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col md:flex-row font-sans selection:bg-indigo-500 selection:text-white">
      {/* Left Sidebar Navigation (260px Desktop Workspace Canvas) */}
      <aside className="w-full md:w-64 lg:w-72 bg-[#0F172A] border-b md:border-b-0 md:border-r border-slate-800 flex flex-col shrink-0">
        {/* Brand Identity */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white">Magic Journal</div>
              <div className="text-[11px] text-indigo-400 font-mono">Super Admin Console</div>
            </div>
          </div>
        </div>

        {/* Active Super Admin Operator Card */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
              <div className="text-[11px] text-slate-400 truncate font-mono">{currentUser.email}</div>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
            <span>{tr('Otoritas Sistem', 'System Authority', 'システム権限')}</span>
            <span className="text-indigo-400 font-mono font-semibold">ROOT / RBAC-0</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 flex-1 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1 md:gap-0">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span
                    className={`text-[11px] font-mono tabular-nums ${
                      isActive ? 'text-indigo-100' : 'text-slate-500'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer: Return to Consumer App */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={onExitSuperAdmin}
            className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{tr('Kembali ke Aplikasi Utama', 'Return to Main App', 'メインアプリへ戻る')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar Contract: Breadcrumb Left — Actions Right */}
        <header className="h-16 px-6 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between gap-4 sticky top-0 z-30">
          {/* Zone 1: Contextual Breadcrumb */}
          <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
            <span className="text-slate-400 font-medium hidden sm:inline">Super Admin</span>
            <span className="text-slate-600 hidden sm:inline">/</span>
            <span className="text-white font-semibold truncate">{activeNavObj.label}</span>
          </div>

          {/* Zone 3: Language Switcher, Firestore Sync & Exit */}
          <div className="flex items-center gap-3">
            {/* Segmented Language Control */}
            <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-semibold">
              {(['id', 'en', 'ja'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    language === lang ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'ja' ? '日本語' : lang.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={handleForceSync}
              disabled={syncing}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${syncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {syncing
                  ? tr('Menyinkronkan...', 'Syncing...', '同期中...')
                  : tr('Sinkronisasi Firestore', 'Sync Firestore', 'Firestore同期')}
              </span>
            </button>
          </div>
        </header>

        {/* Notification Banner */}
        {bannerMsg && (
          <div
            className={`mx-6 mt-4 px-4 py-3 rounded-lg border text-xs flex items-center justify-between ${
              bannerMsg.type === 'success'
                ? 'bg-emerald-950/70 border-emerald-800 text-emerald-200'
                : 'bg-red-950/70 border-red-800 text-red-200'
            }`}
          >
            <span>{bannerMsg.text}</span>
            <button onClick={() => setBannerMsg(null)} className="text-slate-400 hover:text-white cursor-pointer">
              ✕
            </button>
          </div>
        )}

        {/* Viewport Body */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {loading || !data ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-24 rounded-lg bg-slate-900 border border-slate-800 animate-pulse p-4" />
                ))}
              </div>
              <div className="h-80 rounded-lg bg-slate-900 border border-slate-800 animate-pulse" />
            </div>
          ) : (
            <>
              {/* ==========================================
                  SECTION 1: EXECUTIVE OVERVIEW & TELEMETRY
                 ========================================== */}
              {activeSection === 'overview' && (
                <div className="space-y-6">
                  {/* Top Metric Strip (Single-Elevation Depth, Tabular Numerals) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-800">
                      <div className="text-xs text-slate-400">
                        {tr('Total Akun Terdaftar', 'Total Registered Accounts', '総登録アカウント数')}
                      </div>
                      <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
                        {data.counts.totalUsers}
                      </div>
                      <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                        <span>{data.counts.childrenCount} {tr('Anak', 'Children', '子ども')}</span>
                        <span>·</span>
                        <span>{data.counts.parentsCount} {tr('Orang Tua', 'Parents', '保護者')}</span>
                        <span>·</span>
                        <span>{data.counts.superAdminsCount} Admin</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-800">
                      <div className="text-xs text-slate-400">
                        {tr('Brankas Jurnal Terenkripsi', 'Encrypted Journal Entries', '暗号化ジャーナル総数')}
                      </div>
                      <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums mt-1">
                        {data.counts.journalsCount}
                      </div>
                      <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                        <span>AES-256-GCM</span>
                        <span>·</span>
                        <span>{data.counts.parentSharesCount} {tr('Dibagikan ke Wali', 'Shared w/ Parent', '保護者共有')}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-800">
                      <div className="text-xs text-slate-400">
                        {tr('Misi Kolaborasi Teman', 'Friend Collaboration Quests', 'フレンド協力クエスト')}
                      </div>
                      <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums mt-1">
                        {data.counts.collaborationsCount}
                      </div>
                      <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                        <span>{data.counts.completedCollabsCount} {tr('Selesai', 'Completed', '完了')}</span>
                        <span>·</span>
                        <span>
                          {data.counts.collaborationsCount - data.counts.completedCollabsCount}{' '}
                          {tr('Berlangsung', 'In Progress', '進行中')}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-800">
                      <div className="text-xs text-slate-400">
                        {tr('Insiden & Peringatan Emosi', 'Security & Emotion Alerts', 'セキュリティ・感情アラート')}
                      </div>
                      <div className="text-2xl font-bold text-rose-400 font-mono tabular-nums mt-1">
                        {data.counts.securityAlertsCount}
                      </div>
                      <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                        <span>{data.counts.logsCount} {tr('Total Log Audit', 'Audit Logs', '総監査ログ')}</span>
                        <span>·</span>
                        <span>
                          {data.childHealthMonitors.filter((m) => m.hasAlert).length}{' '}
                          {tr('Anak Butuh Perhatian', 'Active Child Alerts', '要注意児童')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Row: Global Mood Distribution & Cloud Firestore Infrastructure */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Global Anonymized Mood Distribution */}
                    <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-sm font-semibold text-white">
                            {tr(
                              'Indeks Kesehatan Emosi Global (Anonim)',
                              'Global Anonymized Mood Health Index',
                              'グローバル感情ヘルス指標（匿名統計）'
                            )}
                          </h2>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {tr(
                              'Agregasi skor suasana hati (1–5) tanpa membuka teks jurnal pribadi anak.',
                              'Aggregated mood scores (1–5) without decrypting private child journals.',
                              '個人の日記本文を復号せずに集計された感情スコア（1〜5）の分布。'
                            )}
                          </p>
                        </div>
                        <span className="text-xs font-mono text-slate-400 tabular-nums">
                          N = {data.counts.journalsCount}
                        </span>
                      </div>

                      <div className="space-y-3 pt-1">
                        {data.globalMoodDistribution.map((item) => {
                          const moodName =
                            item.score === 5
                              ? tr('5 · Sangat Bahagia / Heroik', '5 · Joyful / Heroic', '5 · 最高・充実')
                              : item.score === 4
                              ? tr('4 · Tenang & Positif', '4 · Calm & Positive', '4 · 穏やか・良好')
                              : item.score === 3
                              ? tr('3 · Netral / Stabil', '3 · Neutral / Steady', '3 · 普通・安定')
                              : item.score === 2
                              ? tr('2 · Cemas / Lelah', '2 · Anxious / Tired', '2 · 不安・疲れ')
                              : tr('1 · Sedih / Butuh Dukungan', '1 · Low / Needs Support', '1 · 悲しい・要サポート');
                          const barColor =
                            item.score >= 4
                              ? 'bg-emerald-500'
                              : item.score === 3
                              ? 'bg-amber-500'
                              : 'bg-rose-500';
                          return (
                            <div key={item.score} className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-200">{moodName}</span>
                                <span className="font-mono tabular-nums text-slate-400">
                                  {item.count} ({item.percentage}%)
                                </span>
                              </div>
                              <div className="w-full h-2 rounded bg-slate-800 overflow-hidden">
                                <div
                                  className={`h-full ${barColor} transition-all duration-300`}
                                  style={{ width: `${Math.max(item.percentage, item.count > 0 ? 6 : 0)}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Cloud Firestore Status & Theme Split */}
                    <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h2 className="text-sm font-semibold text-white">
                            {tr(
                              'Infrastruktur Database Cloud Firestore',
                              'Cloud Firestore Database Infrastructure',
                              'Cloud Firestore データベース基盤'
                            )}
                          </h2>
                          <span className="text-xs text-emerald-400 font-mono">● ONLINE</span>
                        </div>
                        <div className="text-xs text-slate-400 space-y-1.5 font-mono">
                          <div className="flex justify-between py-1 border-b border-slate-800/80">
                            <span className="text-slate-500">Provider</span>
                            <span className="text-slate-200">{data.database.provider}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-800/80">
                            <span className="text-slate-500">Database ID</span>
                            <span className="text-indigo-300 truncate max-w-[260px]" title={data.database.databaseId}>
                              {data.database.databaseId}
                            </span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-800/80">
                            <span className="text-slate-500">Last Synced</span>
                            <span className="text-slate-300 tabular-nums">
                              {new Date(data.database.lastSyncAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-500">Theme Distribution</span>
                            <span className="text-slate-200 tabular-nums">
                              🪄 Wizard: {data.themeDistribution.wizardAcademy} · ⚔️ Hunter:{' '}
                              {data.themeDistribution.demonHunter}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
                        <div className="text-xs text-slate-400">
                          {tr(
                            'Koleksi Aktif: users · journals · parentShares · collaborations · activityLogs · systemConfig · customPrompts',
                            'Active Collections: users · journals · parentShares · collaborations · activityLogs · systemConfig · customPrompts',
                            '有効コレクション: users · journals · parentShares · collaborations · activityLogs · systemConfig · customPrompts'
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Child Early-Warning Emotion Monitor Table */}
                  <div className="rounded-lg bg-[#0F172A] border border-slate-800 overflow-hidden">
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                      <div>
                        <h2 className="text-sm font-semibold text-white">
                          {tr(
                            'Monitor Deteksi Dini Kesejahteraan Anak',
                            'Child Well-Being Early-Warning Monitor',
                            '子どもメンタルヘルス早期警戒モニター'
                          )}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {tr(
                            `Ambang Peringatan Dini: ${data.systemConfig.lowMoodAlertDays} hari berturut-turut dengan skor emosi rendah (≤ 2).`,
                            `Early-Warning Threshold: ${data.systemConfig.lowMoodAlertDays} consecutive days with low mood score (≤ 2).`,
                            `早期警戒しきい値: 低感情スコア(≤ 2)が連続 ${data.systemConfig.lowMoodAlertDays} 日以上。`
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                            <th className="py-2.5 px-4 font-medium">{tr('Nama Anak', 'Child Name', '児童名')}</th>
                            <th className="py-2.5 px-4 font-medium">{tr('Tema Aktif', 'Theme', 'テーマ')}</th>
                            <th className="py-2.5 px-4 font-medium text-right">{tr('Jurnal', 'Journals', '記録数')}</th>
                            <th className="py-2.5 px-4 font-medium text-right">{tr('Rata-rata Mood', 'Avg Mood', '平均Mood')}</th>
                            <th className="py-2.5 px-4 font-medium text-right">{tr('Hari Mood Rendah', 'Low Streak', '連続低調日')}</th>
                            <th className="py-2.5 px-4 font-medium">{tr('Wali Tertaut', 'Linked Parent', '連携保護者')}</th>
                            <th className="py-2.5 px-4 font-medium">{tr('Status Kesejahteraan', 'Well-Being Status', 'ステータス')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/70">
                          {data.childHealthMonitors.map((m) => (
                            <tr key={m.childId} className="hover:bg-slate-800/40 transition-colors">
                              <td className="py-2.5 px-4 font-medium text-white">
                                {m.childName}{' '}
                                <span className="text-slate-500 font-mono">({m.age}y)</span>
                              </td>
                              <td className="py-2.5 px-4 text-slate-300">
                                {m.theme === 'wizard_academy' ? '🪄 Wizard Academy' : '⚔️ Demon Hunter'}
                              </td>
                              <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-200">
                                {m.totalJournals}
                              </td>
                              <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-200">
                                {m.averageMood} / 5.0
                              </td>
                              <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-200">
                                {m.consecutiveLowMoodDays} {tr('hari', 'days', '日')}
                              </td>
                              <td className="py-2.5 px-4 font-mono text-slate-400">
                                {m.parentEmail || tr('Belum ditautkan', 'Unlinked', '未連携')}
                              </td>
                              <td className="py-2.5 px-4">
                                {m.hasAlert ? (
                                  <span className="text-rose-400 font-semibold flex items-center gap-1">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    <span>{tr('PERLU PENDAMPINGAN', 'NEEDS ATTENTION', '要サポート')}</span>
                                  </span>
                                ) : (
                                  <span className="text-emerald-400 font-medium">
                                    {tr('Stabil / Normal', 'Nominal / Stable', '安定・正常')}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ==========================================
                  SECTION 2: USER & RBAC DIRECTORY
                 ========================================== */}
              {activeSection === 'users' && (
                <div className="space-y-5">
                  {/* Filter & Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0F172A] p-4 rounded-lg border border-slate-800">
                    <div className="flex flex-wrap items-center gap-3 flex-1">
                      <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          placeholder={tr(
                            'Cari nama, email, kode pairing...',
                            'Search name, email, pairing code...',
                            '名前・メール・ペアリングコード検索...'
                          )}
                          className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      {/* Segmented Role Filter */}
                      <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-md border border-slate-800">
                        {(['all', 'child', 'parent', 'super_admin'] as const).map((r) => (
                          <button
                            key={r}
                            onClick={() => setRoleFilter(r)}
                            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap ${
                              roleFilter === r
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {r === 'all'
                              ? tr('Semua Peran', 'All Roles', 'すべて')
                              : r === 'child'
                              ? tr('Anak', 'Child', '子ども')
                              : r === 'parent'
                              ? tr('Orang Tua', 'Parent', '保護者')
                              : 'Super Admin'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setShowCreateUserModal(true)}
                      className="px-3.5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{tr('Buat Akun Baru', 'Create User Account', '新規アカウント作成')}</span>
                    </button>
                  </div>

                  {/* Users High-Density Table */}
                  <div className="rounded-lg bg-[#0F172A] border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                            <th className="py-2.5 px-4 font-medium">{tr('Pengguna', 'User', 'ユーザー')}</th>
                            <th className="py-2.5 px-4 font-medium">{tr('Peran RBAC', 'RBAC Role', 'ロール')}</th>
                            <th className="py-2.5 px-4 font-medium">{tr('Tema', 'Theme', 'テーマ')}</th>
                            <th className="py-2.5 px-4 font-medium text-right">XP · Level · Streak</th>
                            <th className="py-2.5 px-4 font-medium">{tr('Kode Pairing / Relasi', 'Pairing / Link', 'ペアリング')}</th>
                            <th className="py-2.5 px-4 font-medium text-right">{tr('Tindakan Admin', 'Admin Actions', '操作')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/70">
                          {filteredUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                              <td className="py-2.5 px-4">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={u.avatar}
                                    alt={u.name}
                                    referrerPolicy="no-referrer"
                                    className="w-7 h-7 rounded bg-slate-800 object-cover shrink-0"
                                  />
                                  <div>
                                    <div className="font-semibold text-white">{u.name}</div>
                                    <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-2.5 px-4 font-mono">
                                <span
                                  className={
                                    u.role === 'super_admin'
                                      ? 'text-indigo-400 font-semibold'
                                      : u.role === 'parent'
                                      ? 'text-purple-400'
                                      : 'text-emerald-400'
                                  }
                                >
                                  {u.role.toUpperCase()}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 text-slate-300">
                                {u.theme === 'wizard_academy' ? '🪄 Wizard' : '⚔️ Hunter'}
                              </td>
                              <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-300">
                                {u.xp} XP · Lv.{u.level} · {u.streakCount}d
                              </td>
                              <td className="py-2.5 px-4 font-mono text-slate-400">
                                {u.pairingCode ? `Code: ${u.pairingCode}` : '—'}
                                {u.parentEmail ? ` · Wali: ${u.parentEmail}` : ''}
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleImpersonateUser(u.id)}
                                    className="px-2 py-1 rounded bg-slate-800 hover:bg-indigo-950/80 text-slate-300 hover:text-indigo-300 border border-slate-700 text-[11px] flex items-center gap-1 cursor-pointer"
                                    title={tr('Masuk Sebagai Akun Ini', 'Switch Session to User', 'このユーザーとしてログイン')}
                                  >
                                    <UserCheck className="w-3 h-3" />
                                    <span>{tr('Uji Sesi', 'Switch', '切替')}</span>
                                  </button>
                                  <button
                                    onClick={() => openEditModal(u)}
                                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                                    title={tr('Edit Profil & RBAC', 'Edit Profile & RBAC', '編集')}
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  {u.id !== 'user_superadmin' && (
                                    <button
                                      onClick={() => handleDeleteUser(u)}
                                      className="p-1.5 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 cursor-pointer"
                                      title={tr('Hapus Akun', 'Delete User', '削除')}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ==========================================
                  SECTION 3: FAMILY & FRIENDSHIP GRAPH
                 ========================================== */}
              {activeSection === 'relations' && (
                <div className="space-y-6">
                  {/* Manual Parent-Child Linker Tool */}
                  <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4">
                    <div>
                      <h2 className="text-sm font-semibold text-white">
                        {tr(
                          'Manajer Relasi Keluarga (Tautkan Akun Anak & Orang Tua)',
                          'Family Relationship Manager (Link Child & Parent Accounts)',
                          '家族関係マネージャー（親子アカウントのペアリング管理）'
                        )}
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {tr(
                          'Hubungkan atau putuskan tautan pemantauan antara akun anak dan akun orang tua secara langsung di Cloud Firestore.',
                          'Directly link or unlink monitoring permissions between child and parent accounts in Cloud Firestore.',
                          'Cloud Firestore上の児童アカウントと保護者アカウントの連携を直接管理します。'
                        )}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          {tr('Pilih Akun Anak', 'Select Child Account', '子どもアカウント選択')}
                        </label>
                        <select
                          value={selectedChildId}
                          onChange={(e) => setSelectedChildId(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs text-white"
                        >
                          {childrenList.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.email})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          {tr('Pilih Akun Orang Tua / Wali', 'Select Parent / Guardian', '保護者アカウント選択')}
                        </label>
                        <select
                          value={selectedParentId}
                          onChange={(e) => setSelectedParentId(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs text-white"
                        >
                          {parentsList.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.email})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFamilyLinkAction(selectedChildId, selectedParentId, 'link')}
                          className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          <span>{tr('Tautkan', 'Link Pair', '連携する')}</span>
                        </button>
                        <button
                          onClick={() => handleFamilyLinkAction(selectedChildId, selectedParentId, 'unlink')}
                          className="py-2 px-3 bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Unlink className="w-3.5 h-3.5" />
                          <span>{tr('Putuskan', 'Unlink', '解除')}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Friend Collaboration Quests Moderation Table */}
                  <div className="rounded-lg bg-[#0F172A] border border-slate-800 overflow-hidden">
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          {tr(
                            'Moderasi Misi Kolaborasi Teman (Co-op Quests)',
                            'Friend Collaboration Quests Moderation',
                            'フレンド協力クエスト監視・モデレーション'
                          )}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {tr(
                            'Pantau interaksi jurnal bersama antar teman sebaya untuk menjaga lingkungan ramah anak.',
                            'Monitor peer-to-peer collaborative journal spreads to ensure a child-safe environment.',
                            '子ども同士の共同ジャーナルを監視し、安全な環境を維持します。'
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                            <th className="py-2.5 px-4 font-medium">{tr('Judul Misi & Prompt', 'Quest Title & Prompt', 'クエスト名')}</th>
                            <th className="py-2.5 px-4 font-medium">{tr('Penulis 1 & 2', 'Authors', '参加者')}</th>
                            <th className="py-2.5 px-4 font-medium">{tr('Status', 'Status', '状態')}</th>
                            <th className="py-2.5 px-4 font-medium text-right">Cheers</th>
                            <th className="py-2.5 px-4 font-medium text-right">{tr('Moderasi', 'Action', '操作')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/70">
                          {data.collaborations.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-800/40">
                              <td className="py-3 px-4 max-w-md">
                                <div className="font-semibold text-white">{c.title}</div>
                                <div className="text-slate-400 truncate mt-0.5">{c.prompt}</div>
                              </td>
                              <td className="py-3 px-4 text-slate-300">
                                {c.author1Name} · {c.author2Name}
                              </td>
                              <td className="py-3 px-4 font-mono">
                                <span className={c.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'}>
                                  {c.status.toUpperCase()}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right font-mono tabular-nums text-amber-300">
                                ✨ {c.cheersCount}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => handleDeleteCollab(c.id)}
                                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 text-[11px] inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>{tr('Hapus', 'Remove', '削除')}</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ==========================================
                  SECTION 4: ZERO-KNOWLEDGE ENCRYPTED VAULT
                 ========================================== */}
              {activeSection === 'vault' && (
                <div className="space-y-5">
                  <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                        <Lock className="w-4 h-4 text-emerald-400" />
                        <span>
                          {tr(
                            'Inspektor Brankas Kriptografi Zero-Knowledge (AES-256-GCM)',
                            'Zero-Knowledge Cryptographic Vault Inspector (AES-256-GCM)',
                            'ゼロ知識暗号化ボールトインスペクター (AES-256-GCM)'
                          )}
                        </span>
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {tr(
                          'Super Admin dapat memverifikasi integritas payload terenkripsi (Ciphertext, IV, Salt) tanpa pernah bisa membaca isi curhatan pribadi anak.',
                          'Super Admin can audit encrypted payload integrity (Ciphertext, IV, Salt) while child plaintext remains mathematically private.',
                          'Super Adminは子どもの日記本文を一切復号することなく、暗号化ペイロード(Ciphertext, IV, Salt)の整合性を監査できます。'
                        )}
                      </p>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={vaultSearch}
                        onChange={(e) => setVaultSearch(e.target.value)}
                        placeholder={tr('Filter ID, penulis, mood...', 'Filter ID, author, mood...', 'ID・作成者・感情で検索...')}
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-xs text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  {/* Selected Ciphertext Inspector Drawer */}
                  {selectedCipherEntry && (
                    <div className="p-4 rounded-lg bg-slate-900 border border-indigo-500/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-indigo-300 font-mono">
                          PAYLOAD INSPECTOR · ID: {selectedCipherEntry.id} · {selectedCipherEntry.userName}
                        </div>
                        <button
                          onClick={() => setSelectedCipherEntry(null)}
                          className="text-xs text-slate-400 hover:text-white cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[11px]">
                        <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                          <div className="text-slate-500">Algorithm</div>
                          <div className="text-emerald-400 mt-0.5">{selectedCipherEntry.encryptedContent.algo}</div>
                        </div>
                        <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                          <div className="text-slate-500">Initialization Vector (IV)</div>
                          <div className="text-amber-300 mt-0.5 break-all">{selectedCipherEntry.encryptedContent.iv}</div>
                        </div>
                        <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                          <div className="text-slate-500">PBKDF2 Salt</div>
                          <div className="text-purple-300 mt-0.5 break-all">{selectedCipherEntry.encryptedContent.salt}</div>
                        </div>
                      </div>
                      <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px]">
                        <div className="text-slate-500">AES-256-GCM Ciphertext Blob (Zero-Knowledge Protected)</div>
                        <div className="text-slate-300 mt-1 break-all">{selectedCipherEntry.encryptedContent.ciphertext}</div>
                      </div>
                    </div>
                  )}

                  {/* Vault Table */}
                  <div className="rounded-lg bg-[#0F172A] border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                            <th className="py-2.5 px-4 font-medium">ID · Timestamp</th>
                            <th className="py-2.5 px-4 font-medium">{tr('Penulis', 'Author', '作成者')}</th>
                            <th className="py-2.5 px-4 font-medium">Mood</th>
                            <th className="py-2.5 px-4 font-medium">Ciphertext Blob (AES-256)</th>
                            <th className="py-2.5 px-4 font-medium text-right">{tr('Tindakan', 'Actions', '操作')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/70">
                          {filteredJournals.map((j) => (
                            <tr key={j.id} className="hover:bg-slate-800/40">
                              <td className="py-2.5 px-4 font-mono tabular-nums">
                                <div className="text-white">{j.id}</div>
                                <div className="text-[11px] text-slate-500">
                                  {new Date(j.createdAt).toLocaleString()}
                                </div>
                              </td>
                              <td className="py-2.5 px-4 text-slate-200 font-medium">{j.userName}</td>
                              <td className="py-2.5 px-4 font-mono tabular-nums text-slate-300">
                                {j.moodScore}/5 · {j.moodLabel}
                              </td>
                              <td className="py-2.5 px-4 font-mono text-[11px] text-emerald-400/90 max-w-xs truncate">
                                🔒 {j.encryptedContent.ciphertext}
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    onClick={() => setSelectedCipherEntry(j)}
                                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] cursor-pointer"
                                  >
                                    {tr('Inspeksi Kripto', 'Inspect Blob', '暗号監査')}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteJournal(j.id)}
                                    className="p-1.5 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 cursor-pointer"
                                    title={tr('Hapus Blob', 'Purge Blob', '削除')}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ==========================================
                  SECTION 5: DYNAMIC PROMPTS & CONFIG CMS
                 ========================================== */}
              {activeSection === 'cms' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* System Gamification & Policy Configuration */}
                  <form
                    onSubmit={handleSaveSystemConfig}
                    className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4"
                  >
                    <div>
                      <h2 className="text-sm font-semibold text-white">
                        {tr(
                          'Parameter Gamifikasi & Kebijakan Sistem',
                          'Gamification & System Policy Parameters',
                          'ゲーミフィケーション・システムポリシー設定'
                        )}
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {tr(
                          'Konfigurasi hadiah XP dan ambang batas deteksi emosi secara real-time di Cloud Firestore.',
                          'Configure XP rewards and emotion alert thresholds in real time on Cloud Firestore.',
                          'XP報酬や感情アラートしきい値をCloud Firestore上でリアルタイムに設定します。'
                        )}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">
                          {tr('XP per Jurnal Baru', 'XP per New Journal', '新規ジャーナルXP')}
                        </label>
                        <input
                          type="number"
                          min={10}
                          max={1000}
                          value={cfgXpJournal}
                          onChange={(e) => setCfgXpJournal(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs text-white font-mono tabular-nums"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">
                          {tr('XP Berbagi ke Orang Tua', 'XP per Parent Share', '保護者共有XP')}
                        </label>
                        <input
                          type="number"
                          min={10}
                          max={1000}
                          value={cfgXpShare}
                          onChange={(e) => setCfgXpShare(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs text-white font-mono tabular-nums"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">
                          {tr('XP Misi Kolaborasi Teman', 'XP per Friend Collab', 'フレンド協力XP')}
                        </label>
                        <input
                          type="number"
                          min={10}
                          max={1000}
                          value={cfgXpCollab}
                          onChange={(e) => setCfgXpCollab(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs text-white font-mono tabular-nums"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">
                          {tr('Ambang Hari Peringatan Emosi', 'Low-Mood Alert Threshold (Days)', '低感情アラート連続日数')}
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={14}
                          value={cfgAlertDays}
                          onChange={(e) => setCfgAlertDays(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs text-white font-mono tabular-nums"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer py-1">
                        <span>{tr('Izinkan Pendaftaran Akun Publik Baru', 'Allow New Public Account Registration', '新規アカウント登録を許可')}</span>
                        <input
                          type="checkbox"
                          checked={cfgAllowReg}
                          onChange={(e) => setCfgAllowReg(e.target.checked)}
                          className="rounded accent-indigo-500"
                        />
                      </label>
                      <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer py-1">
                        <span>{tr('Mode Pemeliharaan Sistem (Maintenance)', 'System Maintenance Mode', 'メンテナンスモード')}</span>
                        <input
                          type="checkbox"
                          checked={cfgMaintenance}
                          onChange={(e) => setCfgMaintenance(e.target.checked)}
                          className="rounded accent-indigo-500"
                        />
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {tr('Simpan Konfigurasi ke Firestore', 'Save Configuration to Firestore', '設定をFirestoreに保存')}
                    </button>
                  </form>

                  {/* Custom Daily Reflection Prompts CMS */}
                  <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4 flex flex-col">
                    <div>
                      <h2 className="text-sm font-semibold text-white">
                        {tr(
                          'CMS Pertanyaan Pemantik Harian (Multi-Bahasa)',
                          'Daily Reflection Prompts CMS (Multi-Language)',
                          '日替わりリフレクションプロンプトCMS（多言語対応）'
                        )}
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {tr(
                          'Tambahkan pertanyaan refleksi tematik untuk memandu anak menulis jurnal.',
                          'Add thematic reflection questions to guide children in daily journaling.',
                          '子どもの日記作成を導くテーマ別の質問を追加・管理します。'
                        )}
                      </p>
                    </div>

                    <form onSubmit={handleAddPrompt} className="space-y-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">
                          {tr('Target Tema Dunia', 'Target World Theme', '対象テーマ')}
                        </label>
                        <select
                          value={promptTheme}
                          onChange={(e) => setPromptTheme(e.target.value as ThemeId)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs text-white"
                        >
                          <option value="wizard_academy">🪄 Wizard Academy</option>
                          <option value="demon_hunter">⚔️ Demon Hunter</option>
                        </select>
                      </div>

                      <div>
                        <input
                          type="text"
                          required
                          value={promptTextId}
                          onChange={(e) => setPromptTextId(e.target.value)}
                          placeholder="Teks Prompt (Bahasa Indonesia) *"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs text-white placeholder-slate-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={promptTextEn}
                          onChange={(e) => setPromptTextEn(e.target.value)}
                          placeholder="English Translation (Optional)"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs text-white placeholder-slate-500"
                        />
                        <input
                          type="text"
                          value={promptTextJa}
                          onChange={(e) => setPromptTextJa(e.target.value)}
                          placeholder="日本語訳 (任意)"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-xs text-white placeholder-slate-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{tr('Tambah Prompt ke Database', 'Add Prompt to Database', 'プロンプトを追加')}</span>
                      </button>
                    </form>

                    {/* Existing Custom Prompts List */}
                    <div className="space-y-2 pt-2 border-t border-slate-800 flex-1 overflow-y-auto max-h-60">
                      {data.customPrompts.map((cp) => (
                        <div
                          key={cp.id}
                          className="p-3 rounded bg-slate-900 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="text-[11px] font-mono text-indigo-400">
                              {cp.theme === 'wizard_academy' ? '🪄 Wizard Academy' : '⚔️ Demon Hunter'} · {cp.id}
                            </div>
                            <div className="text-white font-medium">
                              {language === 'ja' ? cp.textJa : language === 'en' ? cp.textEn : cp.textId}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeletePrompt(cp.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ==========================================
                  SECTION 6: SECURITY AUDIT & INCIDENT CENTER
                 ========================================== */}
              {activeSection === 'audit' && (
                <div className="space-y-5">
                  {/* Broadcast Security Log Form */}
                  <form
                    onSubmit={handleSendBroadcastLog}
                    className="p-4 rounded-lg bg-[#0F172A] border border-slate-800 flex flex-wrap items-end gap-3"
                  >
                    <div className="w-full sm:w-48">
                      <label className="block text-[11px] text-slate-400 mb-1">
                        {tr('Kode Aksi Broadcast', 'Broadcast Action Code', 'アクションコード')}
                      </label>
                      <input
                        type="text"
                        value={broadcastAction}
                        onChange={(e) => setBroadcastAction(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-xs text-white font-mono"
                      />
                    </div>
                    <div className="flex-1 min-w-[220px]">
                      <label className="block text-[11px] text-slate-400 mb-1">
                        {tr('Pesan Pengumuman / Catatan Insiden Keamanan', 'Security Broadcast / Incident Note', 'セキュリティ監査メッセージ')}
                      </label>
                      <input
                        type="text"
                        value={broadcastDetails}
                        onChange={(e) => setBroadcastDetails(e.target.value)}
                        placeholder={tr(
                          'Contoh: Verifikasi kunci enkripsi bulanan selesai tanpa anomali...',
                          'E.g., Monthly zero-knowledge key audit completed with zero anomalies...',
                          '例: 月次暗号化キー監査が異常なしで完了しました...'
                        )}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-xs text-white placeholder-slate-500"
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-[11px] text-slate-400 mb-1">Severity</label>
                      <select
                        value={broadcastSeverity}
                        onChange={(e) => setBroadcastSeverity(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-xs text-white"
                      >
                        <option value="info">INFO</option>
                        <option value="security">SECURITY</option>
                        <option value="warning">WARNING</option>
                        <option value="alert">ALERT</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>{tr('Catat Broadcast', 'Log Broadcast', '記録する')}</span>
                    </button>
                  </form>

                  {/* Filter & CSV Export Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0F172A] p-4 rounded-lg border border-slate-800">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="relative w-64">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={auditSearch}
                          onChange={(e) => setAuditSearch(e.target.value)}
                          placeholder={tr('Cari aksi, pengguna, detail...', 'Search action, user, details...', 'アクション・ユーザー検索...')}
                          className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-xs text-white placeholder-slate-500"
                        />
                      </div>

                      <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-md border border-slate-800">
                        {(['all', 'info', 'security', 'warning', 'alert'] as const).map((sev) => (
                          <button
                            key={sev}
                            onClick={() => setAuditSeverity(sev)}
                            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer uppercase ${
                              auditSeverity === sev
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {sev}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleExportAuditCsv}
                      className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  </div>

                  {/* Audit Table */}
                  <div className="rounded-lg bg-[#0F172A] border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                            <th className="py-2.5 px-4 font-medium">Timestamp</th>
                            <th className="py-2.5 px-4 font-medium">Severity</th>
                            <th className="py-2.5 px-4 font-medium">{tr('Aktor & Peran', 'Actor & Role', '実行者')}</th>
                            <th className="py-2.5 px-4 font-medium">Action</th>
                            <th className="py-2.5 px-4 font-medium">{tr('Rincian Audit', 'Audit Details', '詳細')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/70">
                          {filteredLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-800/40">
                              <td className="py-2.5 px-4 font-mono tabular-nums text-slate-400 whitespace-nowrap">
                                {new Date(log.timestamp).toLocaleString()}
                              </td>
                              <td className="py-2.5 px-4 font-mono">
                                <span
                                  className={
                                    log.severity === 'alert'
                                      ? 'text-rose-400 font-semibold'
                                      : log.severity === 'warning'
                                      ? 'text-amber-400 font-semibold'
                                      : log.severity === 'security'
                                      ? 'text-indigo-400 font-semibold'
                                      : 'text-emerald-400'
                                  }
                                >
                                  {log.severity.toUpperCase()}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 text-slate-200 whitespace-nowrap">
                                {log.userName} <span className="text-slate-500 font-mono">({log.role})</span>
                              </td>
                              <td className="py-2.5 px-4 font-mono text-white whitespace-nowrap">{log.action}</td>
                              <td className="py-2.5 px-4 text-slate-300">{log.details}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Modal: Create New User */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0F172A] border border-slate-700 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-white">
                {tr('Buat Akun Pengguna Baru', 'Create New User Account', '新規ユーザーアカウント作成')}
              </h3>
              <button
                onClick={() => setShowCreateUserModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">{tr('Nama Lengkap / Panggilan', 'Full Name / Nickname', '名前')}</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">{tr('Peran RBAC', 'RBAC Role', 'ロール')}</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white"
                  >
                    <option value="child">Child (Anak)</option>
                    <option value="parent">Parent (Orang Tua)</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">{tr('Tema Awal', 'Initial Theme', '初期テーマ')}</label>
                  <select
                    value={newUserTheme}
                    onChange={(e) => setNewUserTheme(e.target.value as ThemeId)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white"
                  >
                    <option value="wizard_academy">🪄 Wizard Academy</option>
                    <option value="demon_hunter">⚔️ Demon Hunter</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">{tr('Usia', 'Age', '年齢')}</label>
                  <input
                    type="number"
                    value={newUserAge}
                    onChange={(e) => setNewUserAge(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">{tr('Kata Sandi Awal', 'Initial Password', '初期パスワード')}</label>
                  <input
                    type="text"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white font-mono"
                  />
                </div>
              </div>

              {newUserRole === 'child' && (
                <div>
                  <label className="block text-slate-300 mb-1">
                    {tr('Email Orang Tua (Opsional)', 'Parent Email (Optional)', '保護者メール（任意）')}
                  </label>
                  <input
                    type="email"
                    value={newUserParentEmail}
                    onChange={(e) => setNewUserParentEmail(e.target.value)}
                    placeholder="fatiha@guardian.local"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-4 py-2 rounded-md bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  {tr('Batal', 'Cancel', 'キャンセル')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer"
                >
                  {tr('Simpan Akun', 'Create User', '作成する')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit User & RBAC */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0F172A] border border-slate-700 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-white">
                {tr('Edit Profil & Otoritas RBAC', 'Edit Profile & RBAC Authority', 'プロフィール・RBAC権限編集')}
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">{tr('Nama Pengguna', 'User Name', '名前')}</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">{tr('Peran RBAC', 'RBAC Role', 'ロール')}</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white"
                  >
                    <option value="child">Child</option>
                    <option value="parent">Parent</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">{tr('Tema', 'Theme', 'テーマ')}</label>
                  <select
                    value={editTheme}
                    onChange={(e) => setEditTheme(e.target.value as ThemeId)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white"
                  >
                    <option value="wizard_academy">🪄 Wizard Academy</option>
                    <option value="demon_hunter">⚔️ Demon Hunter</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">XP</label>
                  <input
                    type="number"
                    value={editXp}
                    onChange={(e) => setEditXp(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Streak ({tr('Hari', 'Days', '日')})</label>
                  <input
                    type="number"
                    value={editStreak}
                    onChange={(e) => setEditStreak(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Pairing Code</label>
                  <input
                    type="text"
                    value={editPairingCode}
                    onChange={(e) => setEditPairingCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">{tr('Reset Sandi (Opsional)', 'Reset Password', '新パスワード')}</label>
                  <input
                    type="text"
                    value={editNewPassword}
                    onChange={(e) => setEditNewPassword(e.target.value)}
                    placeholder={tr('Kosongkan jika tetap', 'Leave blank to keep', '変更時のみ入力')}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-md bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  {tr('Batal', 'Cancel', 'キャンセル')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold cursor-pointer"
                >
                  {tr('Simpan Perubahan', 'Save Changes', '変更を保存')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
