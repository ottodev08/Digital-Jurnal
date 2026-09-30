export type ThemeId = 'wizard_academy' | 'demon_hunter';
export type UserRole = 'child' | 'parent' | 'super_admin';
export type Language = 'id' | 'en' | 'ja';

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  salt: string;
  algo: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  age?: number;
  theme: ThemeId;
  avatar: string;
  encryptionHint?: string;
  streakCount: number;
  xp: number;
  level: number;
  pairedChildrenIds?: string[];
  parentEmail?: string;
  pairingCode?: string;
  friendIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ParentShare {
  id: string;
  journalId?: string;
  childId: string;
  childName: string;
  parentEmail?: string;
  moodScore: number;
  moodLabel: string;
  promptQuestion: string;
  sharedContent: string;
  doodleDataUrl?: string;
  sticker?: string;
  childNote?: string;
  parentReaction?: string;
  parentReply?: string;
  parentRepliedAt?: string;
  createdAt: string;
}

export interface FriendCollaboration {
  id: string;
  title: string;
  prompt: string;
  theme: ThemeId;
  author1Id: string;
  author1Name: string;
  author1Avatar: string;
  author1Text?: string;
  author1Doodle?: string;
  author1Sticker?: string;
  author2Id: string;
  author2Name: string;
  author2Avatar: string;
  author2Text?: string;
  author2Doodle?: string;
  author2Sticker?: string;
  status: 'in_progress' | 'completed';
  cheersCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FriendUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  theme: ThemeId;
  pairingCode: string;
  streakCount: number;
  level: number;
}

export interface JournalEntry {
  id: string;
  userId: string;
  userName: string;
  themeUsed: ThemeId;
  moodScore: number; // 1 to 5
  moodLabel: string;
  promptQuestion: string;
  encryptedContent: EncryptedPayload;
  doodleDataUrl?: string;
  sticker?: string;
  createdAt: string;
  // Client-side decrypted text (never stored on server or visible to parents)
  decryptedText?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: 'child' | 'parent' | 'super_admin' | 'system';
  action: string;
  details: string;
  ip: string;
  severity: 'info' | 'security' | 'warning' | 'alert';
}

export interface Badge {
  id: string;
  name: string;
  theme: ThemeId | 'universal';
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface MoodAnalytics {
  childId: string;
  childName: string;
  age: number;
  theme: ThemeId;
  currentStreak: number;
  totalJournals: number;
  journalsThisWeek: number;
  averageMood: number;
  hasConsecutiveLowMoodAlert: boolean;
  consecutiveLowMoodDays: number;
  thirtyDayHistory: {
    date: string;
    dayLabel: string;
    moodScore: number; // 0 if no journal that day, 1-5 if recorded
    moodLabel?: string;
    hasEntry: boolean;
  }[];
  moodDistribution: {
    score: number;
    label: string;
    count: number;
    percentage: number;
  }[];
  lastJournalDate?: string;
}

export interface SystemConfig {
  xpPerJournal: number;
  xpPerParentShare: number;
  xpPerCollab: number;
  lowMoodAlertDays: number;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  updatedAt: string;
}

export interface CustomPrompt {
  id: string;
  theme: ThemeId;
  textId: string;
  textEn: string;
  textJa: string;
  active: boolean;
  createdAt: string;
}

export interface SuperAdminOverview {
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
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface PasswordStrengthResult {
  score: number; // 0 to 4
  label: 'Sangat Lemah' | 'Lemah' | 'Cukup' | 'Kuat' | 'Sangat Kuat';
  color: string;
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumberOrSymbol: boolean;
  };
}
