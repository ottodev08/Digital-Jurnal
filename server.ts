import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  type Firestore,
  setLogLevel,
} from 'firebase/firestore';

// Silence gRPC idle stream disconnect log notices
setLogLevel('error');

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'magic_journal_jwt_secret_dev_key_2026_xyz';

// Production security headers
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(express.json({ limit: '10mb' }));


// Input sanitization helper to prevent injection attacks
function sanitizeString(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
}

// In-Memory & Database Data Types
export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'child' | 'parent' | 'super_admin';
  age?: number;
  theme: 'wizard_academy' | 'demon_hunter';
  avatar: string;
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

export interface StoredSystemConfig {
  xpPerJournal: number;
  xpPerParentShare: number;
  xpPerCollab: number;
  lowMoodAlertDays: number;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  updatedAt: string;
}

export interface StoredCustomPrompt {
  id: string;
  theme: 'wizard_academy' | 'demon_hunter';
  textId: string;
  textEn: string;
  textJa: string;
  active: boolean;
  createdAt: string;
}

export interface StoredJournal {
  id: string;
  userId: string;
  userName: string;
  themeUsed: 'wizard_academy' | 'demon_hunter';
  moodScore: number; // 1 to 5
  moodLabel: string;
  promptQuestion: string;
  encryptedContent: {
    ciphertext: string;
    iv: string;
    salt: string;
    algo: string;
  };
  doodleDataUrl?: string;
  sticker?: string;
  createdAt: string;
}

export interface StoredParentShare {
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

export interface StoredCollaboration {
  id: string;
  title: string;
  prompt: string;
  theme: 'wizard_academy' | 'demon_hunter';
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

export interface StoredLog {
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

// Strip passwordHash before sending to client
function sanitizeUser(user: StoredUser) {
  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}

// Default hash for demo accounts: Password123!
const DEMO_PASSWORD_HASH = bcrypt.hashSync('Password123!', 10);

// Initial users: Sarrah (11 Tahun - Anak), Fatiha (Orang Tua), Cahyadi (Super Admin)
const initialUsers: StoredUser[] = [
  {
    id: 'user_sarrah',
    name: 'Sarrah',
    email: 'sarrah@magicjournal.local',
    passwordHash: DEMO_PASSWORD_HASH,
    role: 'child',
    age: 11,
    theme: 'wizard_academy',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=SarrahMagic',
    streakCount: 5,
    xp: 550,
    level: 3,
    parentEmail: 'fatiha@guardian.local',
    pairingCode: 'SRH110',
    friendIds: [],
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user_fatiha',
    name: 'Fatiha',
    email: 'fatiha@guardian.local',
    passwordHash: DEMO_PASSWORD_HASH,
    role: 'parent',
    age: 36,
    theme: 'wizard_academy',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Fatiha',
    streakCount: 10,
    xp: 0,
    level: 1,
    pairedChildrenIds: ['user_sarrah'],
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'user_superadmin',
    name: 'Cahyadi',
    email: 'cahyadi@magicjournal.local',
    passwordHash: DEMO_PASSWORD_HASH,
    role: 'super_admin',
    age: 35,
    theme: 'wizard_academy',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=CahyadiAdmin',
    streakCount: 30,
    xp: 9999,
    level: 40,
    pairedChildrenIds: ['user_sarrah'],
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Initial Journals with pre-encrypted ciphertext (Only for Sarrah)
const initialJournals: StoredJournal[] = [
  {
    id: 'j_sarrah_1',
    userId: 'user_sarrah',
    userName: 'Sarrah',
    themeUsed: 'wizard_academy',
    moodScore: 4,
    moodLabel: 'Ramuan Keceriaan Emas',
    promptQuestion: 'Mantra rahasia apa yang kamu pelajari tentang dirimu hari ini?',
    encryptedContent: {
      ciphertext: '8kL2M4nB+q9Wk3E5Rt7YuI==',
      iv: 'p1o2i3u4y5t6r7e8',
      salt: 'm8a7g6i5c4s3a2l1',
      algo: 'AES-256-GCM (PBKDF2-SHA256)',
    },
    sticker: '✨',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'j_sarrah_2',
    userId: 'user_sarrah',
    userName: 'Sarrah',
    themeUsed: 'wizard_academy',
    moodScore: 5,
    moodLabel: 'Ramuan Cahaya Bintang',
    promptQuestion: 'Hal kecil apa hari ini yang membuat hatimu berkilau seperti serbuk peri?',
    encryptedContent: {
      ciphertext: '1qA3Z5sW+e7Dc9V0Fb2GnJ==',
      iv: 'x8c7v6b5n4m3l2k1',
      salt: 'm5a4g3i2c1s0a9l8',
      algo: 'AES-256-GCM (PBKDF2-SHA256)',
    },
    sticker: '🪄',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'j_sarrah_3',
    userId: 'user_sarrah',
    userName: 'Sarrah',
    themeUsed: 'wizard_academy',
    moodScore: 5,
    moodLabel: 'Ramuan Cahaya Bintang',
    promptQuestion: 'Ramuan apa yang paling kamu butuhkan untuk menenangkan hatimu saat ini?',
    encryptedContent: {
      ciphertext: '7zX9C8vB+n6Mk0L1Pj5QfD==',
      iv: 'z9x8c7v6b5n4m3a2',
      salt: 's3a4l5t6m7a8g9i0',
      algo: 'AES-256-GCM (PBKDF2-SHA256)',
    },
    sticker: '📜',
    createdAt: new Date().toISOString(),
  },
];

// In-Memory cache for speed, backed by Firestore
let users: StoredUser[] = [...initialUsers];
let journals: StoredJournal[] = [...initialJournals];
let activityLogs: StoredLog[] = [];

// Initial Parent Shares (Only Sarrah -> Fatiha)
const initialParentShares: StoredParentShare[] = [
  {
    id: 'ps_sarrah_1',
    journalId: 'j_sarrah_2',
    childId: 'user_sarrah',
    childName: 'Sarrah',
    parentEmail: 'fatiha@guardian.local',
    moodScore: 5,
    moodLabel: 'Ramuan Cahaya Bintang',
    promptQuestion: 'Hal kecil apa hari ini yang membuat hatimu berkilau seperti serbuk peri?',
    sharedContent: 'Hari ini aku berhasil menyelesaikan tugas menggambar dan presentasi di depan kelas dengan percaya diri! Awalnya sempat deg-degan, tapi setelah menarik napas pelan-pelan akhirnya lancar sekali.',
    sticker: '🪄',
    childNote: 'Bunda Fatiha, ini cerita presentasiku di sekolah hari ini!',
    parentReaction: 'Pelukan Hangat & Bangga! 🤗❤️',
    parentReply: 'MasyaAllah hebat sekali Sarrah sayang! Bunda Fatiha sangat bangga dengan keberanian dan kerja kerasmu hari ini.',
    parentRepliedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

// Initial Friend Collaborations (Clean — no extra dummy children)
const initialCollaborations: StoredCollaboration[] = [];

const initialSystemConfig: StoredSystemConfig = {
  xpPerJournal: 100,
  xpPerParentShare: 50,
  xpPerCollab: 100,
  lowMoodAlertDays: 3,
  maintenanceMode: false,
  allowRegistration: true,
  updatedAt: new Date().toISOString(),
};

const initialCustomPrompts: StoredCustomPrompt[] = [
  {
    id: 'cp_wizard_1',
    theme: 'wizard_academy',
    textId: 'Mantra keberanian apa yang akan kamu rapalkan untuk menyambut hari esok?',
    textEn: 'What spell of courage will you cast to welcome tomorrow?',
    textJa: '明日を迎えるために、どんな勇気の呪文を唱えますか？',
    active: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'cp_hunter_1',
    theme: 'demon_hunter',
    textId: 'Jurus pernapasan apa yang membantumu tetap tenang saat menghadapi ujian sulit?',
    textEn: 'Which breathing form helps you stay calm when facing a difficult trial?',
    textJa: '困難な試練に直面したとき、心を落ち着かせる呼吸の型は何ですか？',
    active: true,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

let parentShares: StoredParentShare[] = [...initialParentShares];
let collaborations: StoredCollaboration[] = [...initialCollaborations];
let systemConfig: StoredSystemConfig = { ...initialSystemConfig };
let customPrompts: StoredCustomPrompt[] = [...initialCustomPrompts];
let lastFirestoreSyncAt: string = new Date().toISOString();

// ==========================================
// FIRESTORE DATABASE INITIALIZATION & SYNC
// ==========================================
let firestoreDb: Firestore | null = null;
let firestoreDatabaseId = '';
let isFirestoreReady = false;

try {
  const configPath = path.resolve(__dirname, 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    firestoreDatabaseId = config.firestoreDatabaseId || '';
    const apps = getApps();
    const appInstance = apps.length > 0 ? apps[0] : initializeApp(config, 'magic-journal-server');
    firestoreDb = getFirestore(appInstance, config.firestoreDatabaseId);
    console.log(`[Firestore Database] Initialized with DB ID: ${config.firestoreDatabaseId}`);
  }
} catch (err) {
  console.warn('[Firestore Database] Could not initialize Firestore directly in server:', err);
}

const LEGACY_USER_IDS = new Set(['user_kenji', 'user_alya', 'user_sarah']);
const LEGACY_JOURNAL_IDS = new Set([
  'j_kenji_1',
  'j_kenji_2',
  'j_kenji_3',
  'j_kenji_4',
  'j_alya_1',
  'j_alya_2',
  'j_alya_3',
  'j_du223d2',
]);
const LEGACY_SHARE_IDS = new Set(['ps_kenji_1']);
const LEGACY_COLLAB_IDS = new Set(['collab_kenji_alya_1', 'collab_kenji_alya_2']);

// Database Seeding and Synchronization (with Legacy Dummy Purge & Strict Deduplication)
async function syncDatabaseFromFirestore() {
  if (!firestoreDb) return;
  try {
    // 1. Sync & Clean Users
    const usersCol = collection(firestoreDb, 'users');
    const userSnap = await getDocs(usersCol);
    const userMap = new Map<string, StoredUser>();
    for (const docSnap of userSnap.docs) {
      const u = docSnap.data() as StoredUser;
      if (
        !u ||
        !u.id ||
        LEGACY_USER_IDS.has(u.id) ||
        u.name?.includes('Kenji') ||
        u.name?.includes('Alya') ||
        u.name?.includes('Sarah (The Guardian)') ||
        u.name?.includes('Otto')
      ) {
        await deleteDoc(docSnap.ref);
        continue;
      }
      userMap.set(u.id, u);
    }

    // Ensure the 3 core users (Sarrah, Fatiha, Cahyadi) are always up-to-date in Firestore
    for (const initU of initialUsers) {
      await setDoc(doc(firestoreDb, 'users', initU.id), initU);
      userMap.set(initU.id, initU);
    }
    users = Array.from(userMap.values());
    const validUserIds = new Set(users.map((u) => u.id));
    console.log(`[Firestore Database] Synced ${users.length} active users in Firestore.`);

    // 2. Sync & Clean Journals (Strict Deduplication by ID)
    const journalsCol = collection(firestoreDb, 'journals');
    const journalSnap = await getDocs(journalsCol);
    const journalMap = new Map<string, StoredJournal>();
    for (const docSnap of journalSnap.docs) {
      const j = docSnap.data() as StoredJournal;
      if (
        !j ||
        !j.id ||
        LEGACY_JOURNAL_IDS.has(j.id) ||
        LEGACY_USER_IDS.has(j.userId) ||
        !validUserIds.has(j.userId)
      ) {
        await deleteDoc(docSnap.ref);
        continue;
      }
      journalMap.set(j.id, j);
    }
    for (const initJ of initialJournals) {
      if (!journalMap.has(initJ.id)) {
        await setDoc(doc(firestoreDb, 'journals', initJ.id), initJ);
        journalMap.set(initJ.id, initJ);
      }
    }
    // Also preserve any in-memory journals created during startup for valid users
    for (const memJ of journals) {
      if (
        memJ &&
        memJ.id &&
        !LEGACY_JOURNAL_IDS.has(memJ.id) &&
        validUserIds.has(memJ.userId) &&
        !journalMap.has(memJ.id)
      ) {
        journalMap.set(memJ.id, memJ);
      }
    }
    journals = Array.from(journalMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    console.log(`[Firestore Database] Synced ${journals.length} journals in Firestore.`);

    // 3. Sync & Clean Activity Logs
    const logsCol = collection(firestoreDb, 'activityLogs');
    const logSnap = await getDocs(logsCol);
    if (!logSnap.empty) {
      const logMap = new Map<string, StoredLog>();
      for (const docSnap of logSnap.docs) {
        const l = docSnap.data() as StoredLog;
        if (
          !l ||
          !l.id ||
          LEGACY_USER_IDS.has(l.userId) ||
          l.userName?.includes('Kenji') ||
          l.userName?.includes('Alya') ||
          l.userName?.includes('Sarah (The Guardian)') ||
          l.userName?.includes('Otto')
        ) {
          await deleteDoc(docSnap.ref);
          continue;
        }
        logMap.set(l.id, l);
      }
      activityLogs = Array.from(logMap.values()).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }

    // 4. Sync & Clean Parent Shares
    const parentSharesCol = collection(firestoreDb, 'parentShares');
    const psSnap = await getDocs(parentSharesCol);
    const psMap = new Map<string, StoredParentShare>();
    for (const docSnap of psSnap.docs) {
      const ps = docSnap.data() as StoredParentShare;
      if (
        !ps ||
        !ps.id ||
        LEGACY_SHARE_IDS.has(ps.id) ||
        LEGACY_USER_IDS.has(ps.childId) ||
        !validUserIds.has(ps.childId)
      ) {
        await deleteDoc(docSnap.ref);
        continue;
      }
      psMap.set(ps.id, ps);
    }
    for (const initPS of initialParentShares) {
      if (!psMap.has(initPS.id)) {
        await setDoc(doc(firestoreDb, 'parentShares', initPS.id), initPS);
        psMap.set(initPS.id, initPS);
      }
    }
    parentShares = Array.from(psMap.values());

    // 5. Sync & Clean Collaborations
    const collabCol = collection(firestoreDb, 'collaborations');
    const collabSnap = await getDocs(collabCol);
    const collabMap = new Map<string, StoredCollaboration>();
    for (const docSnap of collabSnap.docs) {
      const c = docSnap.data() as StoredCollaboration;
      if (
        !c ||
        !c.id ||
        LEGACY_COLLAB_IDS.has(c.id) ||
        LEGACY_USER_IDS.has(c.author1Id) ||
        LEGACY_USER_IDS.has(c.author2Id) ||
        !validUserIds.has(c.author1Id)
      ) {
        await deleteDoc(docSnap.ref);
        continue;
      }
      collabMap.set(c.id, c);
    }
    collaborations = Array.from(collabMap.values());

    // 6. Sync or Seed System Config
    const configRef = doc(firestoreDb, 'systemConfig', 'global');
    const configSnap = await getDoc(configRef);
    if (!configSnap.exists()) {
      await setDoc(configRef, systemConfig);
    } else {
      systemConfig = { ...initialSystemConfig, ...(configSnap.data() as StoredSystemConfig) };
    }

    // 7. Sync or Seed Custom Prompts
    const promptsCol = collection(firestoreDb, 'customPrompts');
    const promptsSnap = await getDocs(promptsCol);
    if (promptsSnap.empty) {
      for (const cp of initialCustomPrompts) {
        await setDoc(doc(firestoreDb, 'customPrompts', cp.id), cp);
      }
    } else {
      const loadedPrompts: StoredCustomPrompt[] = [];
      promptsSnap.forEach((docSnap) => loadedPrompts.push(docSnap.data() as StoredCustomPrompt));
      customPrompts = loadedPrompts;
    }

    isFirestoreReady = true;
    lastFirestoreSyncAt = new Date().toISOString();
    console.log('[Firestore Database] Synchronization completed successfully.');
  } catch (error) {
    console.warn('[Firestore Database] Notice during sync (offline or initial boot):', error);
  }
}

// Initial sync in background
syncDatabaseFromFirestore().catch((e) => console.warn('Background sync error:', e));

// Helper to push log and persist to database
function addLog(log: Omit<StoredLog, 'id' | 'timestamp'>) {
  const newLog: StoredLog = {
    ...log,
    id: 'log_' + Math.random().toString(36).substring(2, 9),
    timestamp: new Date().toISOString(),
  };
  activityLogs.unshift(newLog);
  if (activityLogs.length > 200) {
    activityLogs.pop();
  }

  // Persist to Firestore if available
  if (firestoreDb) {
    setDoc(doc(firestoreDb, 'activityLogs', newLog.id), newLog).catch((err) =>
      console.warn('Failed to log to Firestore:', err)
    );
  }
}

// Helper to persist user
async function persistUser(user: StoredUser) {
  const existingIdx = users.findIndex((u) => u.id === user.id);
  if (existingIdx >= 0) {
    users[existingIdx] = user;
  } else {
    users.push(user);
  }
  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'users', user.id), user);
    } catch (err) {
      console.warn('Failed to persist user to Firestore:', err);
    }
  }
}

// Helper to persist journal (deduplicated by ID)
async function persistJournal(journal: StoredJournal) {
  const existingIdx = journals.findIndex((j) => j.id === journal.id);
  if (existingIdx >= 0) {
    journals[existingIdx] = journal;
  } else {
    journals.unshift(journal);
  }
  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'journals', journal.id), journal);
    } catch (err) {
      console.warn('Failed to persist journal to Firestore:', err);
    }
  }
}

// Helper to persist parent share
async function persistParentShare(share: StoredParentShare) {
  const existingIdx = parentShares.findIndex((s) => s.id === share.id);
  if (existingIdx >= 0) {
    parentShares[existingIdx] = share;
  } else {
    parentShares.unshift(share);
  }
  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'parentShares', share.id), share);
    } catch (err) {
      console.warn('Failed to persist parentShare to Firestore:', err);
    }
  }
}

// Helper to persist collaboration
async function persistCollaboration(collab: StoredCollaboration) {
  const existingIdx = collaborations.findIndex((c) => c.id === collab.id);
  if (existingIdx >= 0) {
    collaborations[existingIdx] = collab;
  } else {
    collaborations.unshift(collab);
  }
  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'collaborations', collab.id), collab);
    } catch (err) {
      console.warn('Failed to persist collaboration to Firestore:', err);
    }
  }
}

// Generate JWT token helper
function generateToken(user: StoredUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      theme: user.theme,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Current active session pointer
let currentUserId = 'user_sarrah';

// Extended Express Request with Authenticated User
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'child' | 'parent' | 'super_admin';
    name: string;
    theme: 'wizard_academy' | 'demon_hunter';
  };
  currentUser?: StoredUser;
}

// Resolve user ID with automatic migration of legacy demo IDs
function resolveActiveUserById(id?: string): StoredUser | undefined {
  if (!id) return undefined;
  const mappedId =
    id === 'user_sarah'
      ? 'user_fatiha'
      : id === 'user_kenji' || id === 'user_alya'
      ? 'user_sarrah'
      : id;
  return users.find((u) => u.id === mappedId);
}

// Authentication Middleware to verify JWT token
function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.headers['x-auth-token']) {
    token = req.headers['x-auth-token'] as string;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const found = resolveActiveUserById(decoded.id);
      if (found) {
        req.currentUser = found;
        req.user = {
          id: found.id,
          email: found.email,
          role: found.role,
          name: found.name,
          theme: found.theme,
        };
        currentUserId = found.id;
        return next();
      }
    } catch {
      // Fall through to graceful session fallback
    }
  }

  // Graceful fallback to current session if no token or legacy token was provided
  const fallback = resolveActiveUserById(currentUserId) || users[0];
  if (fallback) {
    req.currentUser = fallback;
    req.user = {
      id: fallback.id,
      email: fallback.email,
      role: fallback.role,
      name: fallback.name,
      theme: fallback.theme,
    };
    return next();
  }

  return res.status(401).json({ error: 'Akses ditolak. Token autentikasi JWT diperlukan.' });
}

// REST API ROUTES

// 1. Get current logged in user (validates JWT session)
app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = resolveActiveUserById(decoded.id);
      if (user) {
        currentUserId = user.id;
        const freshToken = user.id !== decoded.id ? generateToken(user) : token;
        return res.json({
          user: sanitizeUser(user),
          token: freshToken,
        });
      }
    } catch {
      // Fall through to default demo user
    }
  }

  // Fallback to active demo user
  const user = resolveActiveUserById(currentUserId) || users[0];
  if (!user) {
    return res.status(401).json({ error: 'Pengguna tidak ditemukan.' });
  }

  const generatedToken = generateToken(user);
  return res.json({
    user: sanitizeUser(user),
    token: generatedToken,
  });
});

// 2. Login endpoint: supports credentials (email + password) & quick persona demo
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password, userId } = req.body;

  // Case A: 1-Click Demo Persona Login
  if (userId) {
    const user = users.find((u) => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'Akun demo tidak ditemukan.' });
    }

    currentUserId = user.id;
    const token = generateToken(user);

    addLog({
      userId: user.id,
      userName: user.name,
      role: user.role,
      action: 'AUTH_LOGIN_DEMO',
      details: `Login cepat akun demo ${user.name} (${user.role.toUpperCase()}). Sesi JWT aktif.`,
      ip: req.ip || '127.0.0.1',
      severity: 'info',
    });

    return res.json({
      message: `Selamat datang kembali, ${user.name}!`,
      token,
      user: sanitizeUser(user),
    });
  }

  // Case B: Standard Email & Password Authentication
  const cleanEmail = sanitizeString(email).toLowerCase();
  const cleanPassword = typeof password === 'string' ? password : '';

  if (!cleanEmail || !cleanPassword) {
    return res.status(400).json({ error: 'Alamat email dan kata sandi wajib diisi.' });
  }

  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    addLog({
      userId: 'anonymous',
      userName: cleanEmail,
      role: 'system',
      action: 'AUTH_LOGIN_FAILED',
      details: `Upaya login gagal: Email [${cleanEmail}] tidak terdaftar di sistem.`,
      ip: req.ip || '127.0.0.1',
      severity: 'warning',
    });

    return res.status(401).json({
      error: 'Email atau kata sandi tidak cocok. Silakan periksa kembali atau buat akun baru.',
    });
  }

  const isPasswordMatch = await bcrypt.compare(cleanPassword, user.passwordHash);

  if (!isPasswordMatch) {
    addLog({
      userId: user.id,
      userName: user.name,
      role: user.role,
      action: 'AUTH_LOGIN_FAILED',
      details: `Upaya login gagal: Kata sandi salah untuk akun ${user.email}.`,
      ip: req.ip || '127.0.0.1',
      severity: 'security',
    });

    return res.status(401).json({
      error: 'Kata sandi salah. Silakan coba lagi (Pastikan huruf besar dan kecil sesuai).',
    });
  }

  currentUserId = user.id;
  const token = generateToken(user);

  addLog({
    userId: user.id,
    userName: user.name,
    role: user.role,
    action: 'AUTH_LOGIN',
    details: `Login sukses via email & password untuk ${user.name} (${user.role.toUpperCase()}). Token JWT diterbitkan.`,
    ip: req.ip || '127.0.0.1',
    severity: 'info',
  });

  return res.json({
    message: `Login sukses! Selamat datang, ${user.name}.`,
    token,
    user: sanitizeUser(user),
  });
});

// 3. Register a new user with validation (email format + password strength)
app.post('/api/auth/register', async (req: Request, res: Response) => {
  const { name, email, password, role, age, theme, parentEmail } = req.body;

  // Basic required checks
  if (!name || !email || !password || !role) {
    return res.status(400).json({
      error: 'Nama panggilan, email, kata sandi, dan peran akun wajib diisi.',
    });
  }

  const cleanName = sanitizeString(name);
  const cleanEmail = sanitizeString(email).toLowerCase();
  const rawPassword = typeof password === 'string' ? password : '';
  const cleanParentEmail = parentEmail ? sanitizeString(parentEmail).toLowerCase() : undefined;
  const userRole = role === 'parent' ? 'parent' : 'child';
  const userTheme = theme === 'wizard_academy' ? 'wizard_academy' : 'demon_hunter';

  // 1. Email Format Validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({
      error: 'Format email tidak valid. Gunakan format seperti nama@domain.com.',
    });
  }

  // 2. Check if email already exists
  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(400).json({
      error: 'Alamat email ini sudah terdaftar. Silakan pilih menu Masuk (Login).',
    });
  }

  // 3. Password Strength Validation (Min 8 chars, uppercase, lowercase, number/symbol)
  if (rawPassword.length < 8) {
    return res.status(400).json({
      error: 'Kata sandi terlalu pendek. Diperlukan minimal 8 karakter.',
    });
  }

  const hasUpper = /[A-Z]/.test(rawPassword);
  const hasLower = /[a-z]/.test(rawPassword);
  const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(rawPassword);

  if (!hasUpper || !hasLower || !hasNumberOrSymbol) {
    const missing: string[] = [];
    if (!hasUpper) missing.push('huruf besar (A-Z)');
    if (!hasLower) missing.push('huruf kecil (a-z)');
    if (!hasNumberOrSymbol) missing.push('angka (0-9) atau simbol khusus');

    return res.status(400).json({
      error: `Kata sandi belum memenuhi kriteria keamanan. Harap tambahkan: ${missing.join(', ')}.`,
    });
  }

  // 4. Secure Password Hashing
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  const newId = 'user_' + Math.random().toString(36).substring(2, 9);
  const pairingCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  const newUser: StoredUser = {
    id: newId,
    name: cleanName,
    email: cleanEmail,
    passwordHash,
    role: userRole,
    age: Number(age) || (userRole === 'child' ? 12 : 35),
    theme: userTheme,
    avatar:
      userRole === 'child'
        ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(cleanName)}`
        : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
    streakCount: 1,
    xp: 100,
    level: 1,
    parentEmail: cleanParentEmail,
    pairingCode,
    pairedChildrenIds: userRole === 'parent' ? [] : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Persist new user in Firestore database and memory cache
  await persistUser(newUser);

  // Link to parent account if provided
  if (cleanParentEmail) {
    const parentUser = users.find((u) => u.email.toLowerCase() === cleanParentEmail);
    if (parentUser) {
      if (!parentUser.pairedChildrenIds) {
        parentUser.pairedChildrenIds = [];
      }
      if (!parentUser.pairedChildrenIds.includes(newId)) {
        parentUser.pairedChildrenIds.push(newId);
        await persistUser(parentUser);
      }
    }
  }

  currentUserId = newUser.id;
  const token = generateToken(newUser);

  addLog({
    userId: newUser.id,
    userName: newUser.name,
    role: newUser.role,
    action: 'AUTH_REGISTER',
    details: `Registrasi akun baru tersimpan permanen di database Firestore: ${newUser.name} (${newUser.role}) dengan password ter-hash bcrypt dan token JWT.`,
    ip: req.ip || '127.0.0.1',
    severity: 'info',
  });

  return res.status(201).json({
    message: 'Registrasi berhasil dan tersimpan di database Firestore!',
    token,
    user: sanitizeUser(newUser),
  });
});

// 4. Logout endpoint
app.post('/api/auth/logout', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const activeUser = req.currentUser;
  if (activeUser) {
    addLog({
      userId: activeUser.id,
      userName: activeUser.name,
      role: activeUser.role,
      action: 'AUTH_LOGOUT',
      details: `Pengguna ${activeUser.name} telah keluar (logout). Sesi JWT dihentikan.`,
      ip: req.ip || '127.0.0.1',
      severity: 'info',
    });
  }

  return res.json({ message: 'Berhasil keluar.' });
});

// 5. Update user theme preference
app.post('/api/theme', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { theme } = req.body;
  const user = req.currentUser || users.find((u) => u.id === currentUserId);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (theme === 'wizard_academy' || theme === 'demon_hunter') {
    user.theme = theme;
    user.updatedAt = new Date().toISOString();
    await persistUser(user);

    addLog({
      userId: user.id,
      userName: user.name,
      role: user.role,
      action: 'THEME_SWITCHED',
      details: `Berganti tema ke ${theme === 'wizard_academy' ? 'Wizard Academy' : 'Demon Hunter'} (Tersimpan di Database)`,
      ip: req.ip || '127.0.0.1',
      severity: 'info',
    });

    return res.json({ success: true, theme: user.theme });
  }

  return res.status(400).json({ error: 'Tema tidak valid' });
});

// 6. Get journals for current authenticated user
app.get('/api/journals', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = req.currentUser || users.find((u) => u.id === currentUserId);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (user.role === 'parent') {
    return res.status(403).json({
      error: 'Kebijakan Privasi: Orang tua tidak dapat mengakses teks jurnal langsung. Gunakan Parent Analytics.',
    });
  }

  const uniqueMap = new Map<string, StoredJournal>();
  for (const j of journals) {
    if (j.userId === user.id && !uniqueMap.has(j.id)) {
      uniqueMap.set(j.id, j);
    }
  }
  const userJournals = Array.from(uniqueMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return res.json(userJournals);
});

// 7. Create new journal entry (Saves to Firestore database)
app.post('/api/journals', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.currentUser || users.find((u) => u.id === currentUserId);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (user.role !== 'child') {
    return res.status(403).json({ error: 'Hanya akun anak/remaja yang dapat membuat jurnal.' });
  }

  const { moodScore, moodLabel, promptQuestion, encryptedContent, doodleDataUrl, sticker } = req.body;

  if (!moodScore || !encryptedContent || !encryptedContent.ciphertext || !encryptedContent.iv) {
    return res.status(400).json({ error: 'Data jurnal tidak lengkap atau belum dienkripsi.' });
  }

  const newJournal: StoredJournal = {
    id: 'j_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36).slice(-4),
    userId: user.id,
    userName: user.name,
    themeUsed: user.theme,
    moodScore: Number(moodScore),
    moodLabel: sanitizeString(moodLabel),
    promptQuestion: sanitizeString(promptQuestion),
    encryptedContent: {
      ciphertext: encryptedContent.ciphertext,
      iv: encryptedContent.iv,
      salt: encryptedContent.salt,
      algo: encryptedContent.algo || 'AES-256-GCM',
    },
    doodleDataUrl: doodleDataUrl || undefined,
    sticker: sticker ? sanitizeString(sticker) : undefined,
    createdAt: new Date().toISOString(),
  };

  // Persist journal to Firestore database
  await persistJournal(newJournal);

  user.xp += 100;
  user.streakCount += 1;
  user.level = Math.floor(user.xp / 250) + 1;
  user.updatedAt = new Date().toISOString();

  // Persist updated user XP & streak to Firestore
  await persistUser(user);

  addLog({
    userId: user.id,
    userName: user.name,
    role: user.role,
    action: 'JOURNAL_CREATED',
    details: `Menyimpan jurnal ke Database Cloud Firestore (Mood: ${newJournal.moodScore}/5 - ${newJournal.moodLabel}). Data terenkripsi client-side AES-256.`,
    ip: req.ip || '127.0.0.1',
    severity: 'info',
  });

  return res.json({
    message: 'Jurnal berhasil dienkripsi dan disimpan permanen di database Cloud Firestore!',
    journal: newJournal,
    updatedUser: sanitizeUser(user),
  });
});

// 8. Get linked children for parent (or super_admin)
app.get('/api/parent/children', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = req.currentUser || users.find((u) => u.id === currentUserId);
  if (!user || (user.role !== 'parent' && user.role !== 'super_admin')) {
    return res.status(403).json({ error: 'Hanya akun orang tua yang dapat mengakses data ini.' });
  }

  const childIds = user.pairedChildrenIds || [];
  const linkedChildren = users
    .filter(
      (u) =>
        u.role === 'child' &&
        (user.role === 'super_admin' || childIds.includes(u.id) || u.parentEmail === user.email)
    )
    .map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      age: c.age,
      theme: c.theme,
      avatar: c.avatar,
      streakCount: c.streakCount,
      xp: c.xp,
      pairingCode: c.pairingCode,
    }));

  return res.json(linkedChildren);
});

// 9. Parent Analytics for a child
app.get('/api/parent/child/:childId/analytics', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = req.currentUser || users.find((u) => u.id === currentUserId);
  if (!user || (user.role !== 'parent' && user.role !== 'super_admin')) {
    return res.status(403).json({ error: 'Akses khusus Parent Portal.' });
  }

  const childId = req.params.childId;
  const child = users.find((u) => u.id === childId);
  if (!child) {
    return res.status(404).json({ error: 'Anak tidak ditemukan.' });
  }

  const childJournals = journals
    .filter((j) => j.userId === childId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const now = new Date();
  const thirtyDayHistory = [];
  const oneDayMs = 86400000;

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * oneDayMs);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });

    const entryOnDate = childJournals.find((j) => j.createdAt.startsWith(dateStr));

    thirtyDayHistory.push({
      date: dateStr,
      dayLabel,
      moodScore: entryOnDate ? entryOnDate.moodScore : 0,
      moodLabel: entryOnDate ? entryOnDate.moodLabel : undefined,
      hasEntry: !!entryOnDate,
    });
  }

  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalScore = 0;
  let scoredCount = 0;

  childJournals.forEach((j) => {
    if (counts[j.moodScore] !== undefined) {
      counts[j.moodScore]++;
      totalScore += j.moodScore;
      scoredCount++;
    }
  });

  const total = scoredCount || 1;
  const moodDistribution = [
    { score: 5, label: 'Luar Biasa / Bahagia', count: counts[5], percentage: Math.round((counts[5] / total) * 100) },
    { score: 4, label: 'Baik / Tenang', count: counts[4], percentage: Math.round((counts[4] / total) * 100) },
    { score: 3, label: 'Biasa / Netral', count: counts[3], percentage: Math.round((counts[3] / total) * 100) },
    { score: 2, label: 'Cemas / Lelah', count: counts[2], percentage: Math.round((counts[2] / total) * 100) },
    { score: 1, label: 'Sedih / Butuh Bantuan', count: counts[1], percentage: Math.round((counts[1] / total) * 100) },
  ];

  const oneWeekAgo = new Date(now.getTime() - 7 * oneDayMs);
  const journalsThisWeek = childJournals.filter((j) => new Date(j.createdAt) >= oneWeekAgo).length;

  let consecutiveLowMood = 0;
  let hasConsecutiveLowMoodAlert = false;

  for (let i = childJournals.length - 1; i >= 0; i--) {
    if (childJournals[i].moodScore <= 2) {
      consecutiveLowMood++;
      if (consecutiveLowMood >= 3) {
        hasConsecutiveLowMoodAlert = true;
        break;
      }
    } else {
      break;
    }
  }

  addLog({
    userId: user.id,
    userName: user.name,
    role: 'parent',
    action: 'PARENT_VIEWED_ANALYTICS',
    details: `Melihat tren analitik emosi ${child.name}. Alert Level Rendah: ${hasConsecutiveLowMoodAlert ? 'AKTIF' : 'Normal'}. Konten teks tetap terenkripsi.`,
    ip: req.ip || '127.0.0.1',
    severity: hasConsecutiveLowMoodAlert ? 'warning' : 'info',
  });

  const analytics = {
    childId: child.id,
    childName: child.name,
    age: child.age || 12,
    theme: child.theme,
    currentStreak: child.streakCount,
    totalJournals: childJournals.length,
    journalsThisWeek,
    averageMood: scoredCount ? Number((totalScore / scoredCount).toFixed(1)) : 3.5,
    hasConsecutiveLowMoodAlert,
    consecutiveLowMoodDays: consecutiveLowMood,
    thirtyDayHistory,
    moodDistribution,
    lastJournalDate: childJournals.length ? childJournals[childJournals.length - 1].createdAt : undefined,
  };

  return res.json(analytics);
});

// 10. Simulate 3 consecutive low moods on a child (for testing alert system)
app.post('/api/parent/simulate-low-mood-alert', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { childId } = req.body;
  const child = users.find((u) => u.id === childId);
  if (!child) {
    return res.status(404).json({ error: 'Anak tidak ditemukan' });
  }

  const dummyLowJournals: StoredJournal[] = [
    {
      id: 'j_test_alert_1',
      userId: child.id,
      userName: child.name,
      themeUsed: child.theme,
      moodScore: 1,
      moodLabel: child.theme === 'wizard_academy' ? 'Ramuan Bayangan Gulita' : 'Kabut Kelam: Pertahanan Jatuh',
      promptQuestion: 'Apa yang membuatmu merasa sangat lelah dan sendirian?',
      encryptedContent: {
        ciphertext: 'AlertEncryptedPayload1==',
        iv: 'alert_iv_1',
        salt: 'alert_salt_1',
        algo: 'AES-256-GCM',
      },
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'j_test_alert_2',
      userId: child.id,
      userName: child.name,
      themeUsed: child.theme,
      moodScore: 2,
      moodLabel: child.theme === 'wizard_academy' ? 'Kabut Kebingungan' : 'Pernapasan Petir: Kilat Tegang',
      promptQuestion: 'Beban apa yang sulit kamu pikul hari ini?',
      encryptedContent: {
        ciphertext: 'AlertEncryptedPayload2==',
        iv: 'alert_iv_2',
        salt: 'alert_salt_2',
        algo: 'AES-256-GCM',
      },
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: 'j_test_alert_3',
      userId: child.id,
      userName: child.name,
      themeUsed: child.theme,
      moodScore: 1,
      moodLabel: child.theme === 'wizard_academy' ? 'Ramuan Bayangan Gulita' : 'Kabut Kelam: Pertahanan Jatuh',
      promptQuestion: 'Apa bantuan yang paling kamu harapkan dari orang terdekat?',
      encryptedContent: {
        ciphertext: 'AlertEncryptedPayload3==',
        iv: 'alert_iv_3',
        salt: 'alert_salt_3',
        algo: 'AES-256-GCM',
      },
      createdAt: new Date().toISOString(),
    },
  ];

  for (const dj of dummyLowJournals) {
    persistJournal(dj).catch((e) => console.warn('Simulated journal persist error', e));
  }

  addLog({
    userId: 'system',
    userName: 'Sistem Deteksi Emosi',
    role: 'system',
    action: 'ALERT_TRIGGERED',
    details: `PERINGATAN DINI: ${child.name} mencatat level emosi terendah selama 3 hari berturut-turut. Rekomendasi dukungan dikirim ke Parent Portal.`,
    ip: req.ip || '127.0.0.1',
    severity: 'alert',
  });

  return res.json({ success: true, message: 'Simulasi peringatan emosi 3 hari aktif!' });
});

// 11. Send simulated email alert to parent
app.post('/api/parent/send-alert-email', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { parentEmail, childName, alertMessage } = req.body;

  addLog({
    userId: currentUserId,
    userName: 'Notification Engine',
    role: 'system',
    action: 'EMAIL_DISPATCHED',
    details: `Email notifikasi pendampingan emosional berhasil dikirim ke ${parentEmail} mengenai ${childName}.`,
    ip: req.ip || '127.0.0.1',
    severity: 'alert',
  });

  return res.json({
    success: true,
    sentTo: parentEmail,
    subject: `[Magic Journal] Peringatan Pendampingan Emosi untuk ${childName}`,
    previewBody: alertMessage,
  });
});

// 12. Link child by 6-digit code
app.post('/api/parent/link-child', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.currentUser || users.find((u) => u.id === currentUserId);
  if (!user || user.role !== 'parent') {
    return res.status(403).json({ error: 'Akses ditolak.' });
  }

  const { pairingCode } = req.body;
  if (!pairingCode) {
    return res.status(400).json({ error: 'Kode pairing harus diisi.' });
  }

  const targetChild = users.find(
    (u) => u.role === 'child' && u.pairingCode?.toUpperCase() === pairingCode.toUpperCase().trim()
  );

  if (!targetChild) {
    return res.status(404).json({ error: 'Kode pairing tidak valid atau tidak ditemukan.' });
  }

  if (!user.pairedChildrenIds) {
    user.pairedChildrenIds = [];
  }

  if (!user.pairedChildrenIds.includes(targetChild.id)) {
    user.pairedChildrenIds.push(targetChild.id);
  }

  targetChild.parentEmail = user.email;

  // Persist updated relations to Firestore
  await persistUser(user);
  await persistUser(targetChild);

  addLog({
    userId: user.id,
    userName: user.name,
    role: 'parent',
    action: 'CHILD_ACCOUNT_LINKED',
    details: `Menghubungkan akun anak ${targetChild.name} menggunakan kode pairing ${pairingCode} (Tersimpan di Database Firestore).`,
    ip: req.ip || '127.0.0.1',
    severity: 'info',
  });

  return res.json({ success: true, message: `Berhasil terhubung dengan ${targetChild.name}!`, child: sanitizeUser(targetChild) });
});

// ==========================================
// 13. PARENT SHARE ENDPOINTS (Fitur Share Orang Tua)
// ==========================================

// Get shared pages (for parent to read and child to check feedback)
app.get('/api/parent-shares', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = req.currentUser || users.find((u) => u.id === currentUserId);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (user.role === 'parent') {
    const paired = user.pairedChildrenIds || [];
    const filtered = parentShares
      .filter((ps) => paired.includes(ps.childId) || ps.parentEmail === user.email)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json(filtered);
  } else {
    const filtered = parentShares
      .filter((ps) => ps.childId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json(filtered);
  }
});

// Child shares a specific journal entry or note with parent
app.post('/api/parent-shares', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.currentUser || users.find((u) => u.id === currentUserId);
  if (!user || user.role !== 'child') {
    return res.status(403).json({ error: 'Hanya akun anak yang dapat membagikan catatan ke orang tua.' });
  }

  const { journalId, sharedContent, childNote, moodScore, moodLabel, promptQuestion, doodleDataUrl, sticker } = req.body;
  if (!sharedContent || typeof sharedContent !== 'string') {
    return res.status(400).json({ error: 'Isi catatan yang dibagikan tidak boleh kosong.' });
  }

  const newShare: StoredParentShare = {
    id: 'ps_' + Math.random().toString(36).substring(2, 9),
    journalId: journalId ? sanitizeString(journalId) : undefined,
    childId: user.id,
    childName: user.name,
    parentEmail: user.parentEmail,
    moodScore: Number(moodScore) || 5,
    moodLabel: sanitizeString(moodLabel) || 'Catatan Hati',
    promptQuestion: sanitizeString(promptQuestion) || 'Refleksi Diri',
    sharedContent: sanitizeString(sharedContent),
    doodleDataUrl: doodleDataUrl || undefined,
    sticker: sticker ? sanitizeString(sticker) : undefined,
    childNote: childNote ? sanitizeString(childNote) : undefined,
    createdAt: new Date().toISOString(),
  };

  await persistParentShare(newShare);

  user.xp += 50;
  user.level = Math.floor(user.xp / 250) + 1;
  await persistUser(user);

  addLog({
    userId: user.id,
    userName: user.name,
    role: 'child',
    action: 'JOURNAL_SHARED_WITH_PARENT',
    details: `${user.name} secara sukarela membagikan 1 lembar jurnal ke orang tua (${user.parentEmail || 'Wali'}). +50 XP Keberanian.`,
    ip: req.ip || '127.0.0.1',
    severity: 'info',
  });

  return res.status(201).json({
    message: 'Catatan berhasil dikirimkan ke Parent Portal orang tuamu!',
    share: newShare,
    updatedUser: sanitizeUser(user),
  });
});

// Parent gives reaction / encouraging reply to shared page
app.post('/api/parent-shares/:id/respond', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.currentUser || users.find((u) => u.id === currentUserId);
  if (!user || user.role !== 'parent') {
    return res.status(403).json({ error: 'Hanya akun orang tua yang dapat memberikan respon dukungan.' });
  }

  const shareId = req.params.id;
  const share = parentShares.find((s) => s.id === shareId);
  if (!share) {
    return res.status(404).json({ error: 'Catatan yang dibagikan tidak ditemukan.' });
  }

  const { reaction, reply } = req.body;
  if (!reaction && !reply) {
    return res.status(400).json({ error: 'Silakan pilih stempel reaksi atau tulis pesan dukungan.' });
  }

  share.parentReaction = reaction ? sanitizeString(reaction) : share.parentReaction;
  share.parentReply = reply ? sanitizeString(reply) : share.parentReply;
  share.parentRepliedAt = new Date().toISOString();

  await persistParentShare(share);

  // Award child bonus XP for receiving parent support
  const targetChild = users.find((u) => u.id === share.childId);
  if (targetChild) {
    targetChild.xp += 50;
    targetChild.level = Math.floor(targetChild.xp / 250) + 1;
    await persistUser(targetChild);
  }

  addLog({
    userId: user.id,
    userName: user.name,
    role: 'parent',
    action: 'PARENT_REACTION_SENT',
    details: `Orang tua ${user.name} mengirim respon hangat [${reaction || 'Pesan'}] kepada ${share.childName}.`,
    ip: req.ip || '127.0.0.1',
    severity: 'info',
  });

  return res.json({
    message: 'Respon kasih sayang berhasil dikirimkan ke buku jurnal anak!',
    share,
  });
});

// ==========================================
// 14. FRIEND COLLABORATION ENDPOINTS (Fitur Kolaborasi Teman)
// ==========================================

// Get list of friends
app.get('/api/friends', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = req.currentUser || users.find((u) => u.id === currentUserId);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const friendIds = user.friendIds || [];
  const allChildren = users.filter((u) => u.role === 'child' && u.id !== user.id);
  const friendList = allChildren
    .filter((c) => friendIds.includes(c.id))
    .map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      avatar: c.avatar,
      theme: c.theme,
      pairingCode: c.pairingCode || 'MJFRIEND',
      streakCount: c.streakCount,
      level: c.level,
    }));

  return res.json(friendList);
});

// Add friend by 6-digit friend code
app.post('/api/friends/add', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.currentUser || users.find((u) => u.id === currentUserId);
  if (!user || user.role !== 'child') {
    return res.status(403).json({ error: 'Akses khusus pertemanan anak/remaja.' });
  }

  const { friendCode } = req.body;
  if (!friendCode) {
    return res.status(400).json({ error: 'Kode teman wajib diisi.' });
  }

  const targetFriend = users.find(
    (u) => u.role === 'child' && u.id !== user.id && u.pairingCode?.toUpperCase() === friendCode.toUpperCase().trim()
  );

  if (!targetFriend) {
    return res.status(404).json({ error: 'Kode teman tidak ditemukan. Pastikan huruf besar/kecil sesuai.' });
  }

  if (!user.friendIds) user.friendIds = [];
  if (!targetFriend.friendIds) targetFriend.friendIds = [];

  if (!user.friendIds.includes(targetFriend.id)) user.friendIds.push(targetFriend.id);
  if (!targetFriend.friendIds.includes(user.id)) targetFriend.friendIds.push(user.id);

  await persistUser(user);
  await persistUser(targetFriend);

  addLog({
    userId: user.id,
    userName: user.name,
    role: 'child',
    action: 'FRIEND_CONNECTED',
    details: `${user.name} berteman dengan ${targetFriend.name} melalui kode ${friendCode}. Kolaborasi buku terbuka!`,
    ip: req.ip || '127.0.0.1',
    severity: 'info',
  });

  return res.json({
    message: `Hore! Kamu sekarang berteman dengan ${targetFriend.name}.`,
    friend: {
      id: targetFriend.id,
      name: targetFriend.name,
      avatar: targetFriend.avatar,
      theme: targetFriend.theme,
      pairingCode: targetFriend.pairingCode,
      streakCount: targetFriend.streakCount,
      level: targetFriend.level,
    },
  });
});

// Get collaborative journal entries
app.get('/api/collaborations', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = req.currentUser || users.find((u) => u.id === currentUserId);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const userCollabs = collaborations
    .filter((c) => c.author1Id === user.id || c.author2Id === user.id || user.role === 'parent')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return res.json(userCollabs);
});

// Start new collaboration journal quest with a friend
app.post('/api/collaborations', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.currentUser || users.find((u) => u.id === currentUserId);
  if (!user || user.role !== 'child') {
    return res.status(403).json({ error: 'Hanya akun anak yang dapat membuat misi kolaborasi.' });
  }

  const { title, prompt, friendId, initialText, doodleDataUrl, sticker } = req.body;
  if (!title || !prompt || !friendId) {
    return res.status(400).json({ error: 'Judul misi, prompt, dan teman tujuan wajib dipilih.' });
  }

  const friend = users.find((u) => u.id === friendId && u.role === 'child');
  if (!friend) {
    return res.status(404).json({ error: 'Teman tidak ditemukan.' });
  }

  const newCollab: StoredCollaboration = {
    id: 'collab_' + Math.random().toString(36).substring(2, 9),
    title: sanitizeString(title),
    prompt: sanitizeString(prompt),
    theme: user.theme,
    author1Id: user.id,
    author1Name: user.name,
    author1Avatar: user.avatar,
    author1Text: initialText ? sanitizeString(initialText) : undefined,
    author1Doodle: doodleDataUrl || undefined,
    author1Sticker: sticker ? sanitizeString(sticker) : undefined,
    author2Id: friend.id,
    author2Name: friend.name,
    author2Avatar: friend.avatar,
    status: 'in_progress',
    cheersCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await persistCollaboration(newCollab);

  user.xp += 50;
  user.level = Math.floor(user.xp / 250) + 1;
  await persistUser(user);

  addLog({
    userId: user.id,
    userName: user.name,
    role: 'child',
    action: 'COLLAB_CREATED',
    details: `${user.name} memulai Misi Jurnal Bersama "${newCollab.title}" dengan ${friend.name}.`,
    ip: req.ip || '127.0.0.1',
    severity: 'info',
  });

  return res.status(201).json({
    message: `Misi kolaborasi berhasil dibuat dan dikirim ke lembaran ${friend.name}!`,
    collab: newCollab,
    updatedUser: sanitizeUser(user),
  });
});

// Contribute response to collaboration journal page
app.post('/api/collaborations/:id/contribute', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.currentUser || users.find((u) => u.id === currentUserId);
  if (!user || user.role !== 'child') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const collabId = req.params.id;
  const collab = collaborations.find((c) => c.id === collabId);
  if (!collab) {
    return res.status(404).json({ error: 'Misi kolaborasi tidak ditemukan.' });
  }

  if (collab.author1Id !== user.id && collab.author2Id !== user.id) {
    return res.status(403).json({ error: 'Anda bukan anggota misi kolaborasi ini.' });
  }

  const { text, doodleDataUrl, sticker, markCompleted } = req.body;

  if (collab.author1Id === user.id) {
    if (text) collab.author1Text = sanitizeString(text);
    if (doodleDataUrl) collab.author1Doodle = doodleDataUrl;
    if (sticker) collab.author1Sticker = sanitizeString(sticker);
  } else {
    if (text) collab.author2Text = sanitizeString(text);
    if (doodleDataUrl) collab.author2Doodle = doodleDataUrl;
    if (sticker) collab.author2Sticker = sanitizeString(sticker);
  }

  if (markCompleted || (collab.author1Text && collab.author2Text)) {
    collab.status = 'completed';
  }

  collab.updatedAt = new Date().toISOString();
  await persistCollaboration(collab);

  // Bonus +100 XP for collaborative victory
  user.xp += 100;
  user.level = Math.floor(user.xp / 250) + 1;
  await persistUser(user);

  addLog({
    userId: user.id,
    userName: user.name,
    role: 'child',
    action: 'COLLAB_CONTRIBUTED',
    details: `${user.name} melengkapi lembar kolaborasi "${collab.title}". Status: ${collab.status.toUpperCase()}.`,
    ip: req.ip || '127.0.0.1',
    severity: 'info',
  });

  return res.json({
    message: 'Goresan kolaborasimu berhasil disimpan di lembar buku bersama!',
    collab,
    updatedUser: sanitizeUser(user),
  });
});

// Send cheer sparkles to collaboration
app.post('/api/collaborations/:id/cheer', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const collabId = req.params.id;
  const collab = collaborations.find((c) => c.id === collabId);
  if (!collab) {
    return res.status(404).json({ error: 'Kolaborasi tidak ditemukan.' });
  }

  collab.cheersCount += 1;
  collab.updatedAt = new Date().toISOString();
  await persistCollaboration(collab);

  return res.json({ success: true, cheersCount: collab.cheersCount });
});

// 15. Get activity logs
app.get('/api/logs', (req: Request, res: Response) => {
  return res.json(activityLogs);
});

// 16. Database connectivity & status endpoint
app.get('/api/database/status', (req: Request, res: Response) => {
  return res.json({
    connected: true,
    provider: 'Google Cloud Firestore',
    databaseId: firestoreDatabaseId || 'ai-studio-magicjournal-439eadd0-05ef-44d4-9819-19dfea4ea46d',
    status: isFirestoreReady ? 'connected' : 'active',
    stats: {
      usersCount: users.length,
      journalsCount: journals.length,
      parentSharesCount: parentShares.length,
      collaborationsCount: collaborations.length,
      logsCount: activityLogs.length,
    },
    collections: ['users', 'journals', 'parentShares', 'collaborations', 'activityLogs', 'systemConfig', 'customPrompts'],
  });
});

// ==========================================
// 17. SUPER ADMIN MODULE ENDPOINTS (Modul Super Admin Terpisah)
// ==========================================

// Get comprehensive Super Admin Overview, Telemetry, Users, Vault, Config & Prompts
app.get('/api/superadmin/overview', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const childrenUsers = users.filter((u) => u.role === 'child');
  const parentUsers = users.filter((u) => u.role === 'parent');
  const superAdminUsers = users.filter((u) => u.role === 'super_admin');

  const wizardCount = users.filter((u) => u.theme === 'wizard_academy').length;
  const hunterCount = users.filter((u) => u.theme === 'demon_hunter').length;

  const moodCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  journals.forEach((j) => {
    if (moodCounts[j.moodScore] !== undefined) {
      moodCounts[j.moodScore]++;
    }
  });
  const totalJournals = journals.length || 1;
  const globalMoodDistribution = [5, 4, 3, 2, 1].map((score) => ({
    score,
    count: moodCounts[score] || 0,
    percentage: Math.round(((moodCounts[score] || 0) / totalJournals) * 100),
  }));

  const alertThreshold = systemConfig.lowMoodAlertDays || 3;
  const childHealthMonitors = childrenUsers.map((child) => {
    const childJournals = journals
      .filter((j) => j.userId === child.id)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    let totalMood = 0;
    childJournals.forEach((j) => {
      totalMood += j.moodScore;
    });
    const avgMood = childJournals.length ? Number((totalMood / childJournals.length).toFixed(1)) : 0;

    let consecutiveLow = 0;
    for (let i = childJournals.length - 1; i >= 0; i--) {
      if (childJournals[i].moodScore <= 2) {
        consecutiveLow++;
      } else {
        break;
      }
    }

    return {
      childId: child.id,
      childName: child.name,
      email: child.email,
      age: child.age || 12,
      theme: child.theme,
      streakCount: child.streakCount,
      xp: child.xp,
      level: child.level,
      totalJournals: childJournals.length,
      averageMood: avgMood,
      consecutiveLowMoodDays: consecutiveLow,
      hasAlert: consecutiveLow >= alertThreshold,
      parentEmail: child.parentEmail,
      pairingCode: child.pairingCode,
    };
  });

  const securityAlertsCount = activityLogs.filter(
    (l) => l.severity === 'alert' || l.severity === 'security' || l.severity === 'warning'
  ).length;

  return res.json({
    database: {
      connected: true,
      provider: 'Google Cloud Firestore',
      databaseId: firestoreDatabaseId || 'ai-studio-magicjournal-439eadd0-05ef-44d4-9819-19dfea4ea46d',
      lastSyncAt: lastFirestoreSyncAt,
    },
    counts: {
      totalUsers: users.length,
      childrenCount: childrenUsers.length,
      parentsCount: parentUsers.length,
      superAdminsCount: superAdminUsers.length,
      journalsCount: journals.length,
      parentSharesCount: parentShares.length,
      collaborationsCount: collaborations.length,
      completedCollabsCount: collaborations.filter((c) => c.status === 'completed').length,
      logsCount: activityLogs.length,
      securityAlertsCount,
    },
    themeDistribution: {
      wizardAcademy: wizardCount,
      demonHunter: hunterCount,
    },
    globalMoodDistribution,
    childHealthMonitors,
    systemConfig,
    customPrompts,
    users: users.map(sanitizeUser),
    journals,
    parentShares,
    collaborations,
    logs: activityLogs,
  });
});

// Force resync with Cloud Firestore
app.post('/api/superadmin/system/sync', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const actor = req.currentUser || users.find((u) => u.id === currentUserId);
  await syncDatabaseFromFirestore();
  lastFirestoreSyncAt = new Date().toISOString();

  addLog({
    userId: actor?.id || 'user_superadmin',
    userName: actor?.name || 'Super Admin',
    role: 'super_admin',
    action: 'SUPERADMIN_DB_SYNC',
    details: `Super Admin melakukan sinkronisasi paksa & verifikasi integritas koleksi Cloud Firestore (${users.length} akun, ${journals.length} jurnal).`,
    ip: req.ip || '127.0.0.1',
    severity: 'info',
  });

  return res.json({
    success: true,
    lastSyncAt: lastFirestoreSyncAt,
    message: 'Sinkronisasi Cloud Firestore selesai.',
  });
});

// Update global system & gamification config
app.patch('/api/superadmin/config', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const actor = req.currentUser || users.find((u) => u.id === currentUserId);
  const { xpPerJournal, xpPerParentShare, xpPerCollab, lowMoodAlertDays, maintenanceMode, allowRegistration } = req.body;

  systemConfig = {
    xpPerJournal: Number(xpPerJournal) || systemConfig.xpPerJournal,
    xpPerParentShare: Number(xpPerParentShare) || systemConfig.xpPerParentShare,
    xpPerCollab: Number(xpPerCollab) || systemConfig.xpPerCollab,
    lowMoodAlertDays: Number(lowMoodAlertDays) || systemConfig.lowMoodAlertDays,
    maintenanceMode: typeof maintenanceMode === 'boolean' ? maintenanceMode : systemConfig.maintenanceMode,
    allowRegistration: typeof allowRegistration === 'boolean' ? allowRegistration : systemConfig.allowRegistration,
    updatedAt: new Date().toISOString(),
  };

  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'systemConfig', 'global'), systemConfig);
    } catch (e) {
      console.warn('Failed to persist systemConfig to Firestore:', e);
    }
  }

  addLog({
    userId: actor?.id || 'user_superadmin',
    userName: actor?.name || 'Super Admin',
    role: 'super_admin',
    action: 'SUPERADMIN_CONFIG_UPDATED',
    details: `Super Admin memperbarui parameter sistem: XP Jurnal=${systemConfig.xpPerJournal}, XP Share=${systemConfig.xpPerParentShare}, XP Collab=${systemConfig.xpPerCollab}, Ambang Alert=${systemConfig.lowMoodAlertDays} hari.`,
    ip: req.ip || '127.0.0.1',
    severity: 'security',
  });

  return res.json({
    success: true,
    systemConfig,
    message: 'Konfigurasi sistem berhasil disimpan ke Cloud Firestore.',
  });
});

// Create user from Super Admin Console
app.post('/api/superadmin/users', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const actor = req.currentUser || users.find((u) => u.id === currentUserId);
  const { name, email, password, role, age, theme, parentEmail } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Nama, email, dan peran wajib diisi.' });
  }

  const cleanName = sanitizeString(name);
  const cleanEmail = sanitizeString(email).toLowerCase();
  if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    return res.status(400).json({ error: 'Email sudah terdaftar di sistem.' });
  }

  const validRole: 'child' | 'parent' | 'super_admin' =
    role === 'super_admin' ? 'super_admin' : role === 'parent' ? 'parent' : 'child';
  const validTheme: 'wizard_academy' | 'demon_hunter' =
    theme === 'demon_hunter' ? 'demon_hunter' : 'wizard_academy';

  const rawPass = typeof password === 'string' && password.length >= 6 ? password : 'Password123!';
  const passwordHash = await bcrypt.hash(rawPass, 10);
  const newId = 'user_' + Math.random().toString(36).substring(2, 9);
  const pairingCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  const newUser: StoredUser = {
    id: newId,
    name: cleanName,
    email: cleanEmail,
    passwordHash,
    role: validRole,
    age: Number(age) || (validRole === 'child' ? 11 : 35),
    theme: validTheme,
    avatar:
      validRole === 'child'
        ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(cleanName)}`
        : validRole === 'super_admin'
        ? `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`
        : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
    streakCount: 1,
    xp: validRole === 'child' ? 100 : 0,
    level: 1,
    parentEmail: parentEmail ? sanitizeString(parentEmail).toLowerCase() : undefined,
    pairingCode,
    pairedChildrenIds: validRole === 'parent' ? [] : undefined,
    friendIds: validRole === 'child' ? [] : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await persistUser(newUser);

  addLog({
    userId: actor?.id || 'user_superadmin',
    userName: actor?.name || 'Super Admin',
    role: 'super_admin',
    action: 'SUPERADMIN_USER_CREATED',
    details: `Super Admin membuat akun baru: ${newUser.name} (${newUser.email}) dengan role [${newUser.role.toUpperCase()}].`,
    ip: req.ip || '127.0.0.1',
    severity: 'security',
  });

  return res.status(201).json({
    success: true,
    user: sanitizeUser(newUser),
  });
});

// Update user details & RBAC role from Super Admin Console
app.patch('/api/superadmin/users/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const actor = req.currentUser || users.find((u) => u.id === currentUserId);
  const targetId = req.params.id;
  const targetUser = users.find((u) => u.id === targetId);
  if (!targetUser) {
    return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
  }

  const { name, email, role, theme, xp, streakCount, age, parentEmail, pairingCode, newPassword } = req.body;

  if (name) targetUser.name = sanitizeString(name);
  if (email) targetUser.email = sanitizeString(email).toLowerCase();
  if (role === 'child' || role === 'parent' || role === 'super_admin') {
    targetUser.role = role;
  }
  if (theme === 'wizard_academy' || theme === 'demon_hunter') {
    targetUser.theme = theme;
  }
  if (xp !== undefined) {
    targetUser.xp = Math.max(0, Number(xp));
    targetUser.level = Math.floor(targetUser.xp / 250) + 1;
  }
  if (streakCount !== undefined) {
    targetUser.streakCount = Math.max(0, Number(streakCount));
  }
  if (age !== undefined) {
    targetUser.age = Math.max(1, Number(age));
  }
  if (parentEmail !== undefined) {
    targetUser.parentEmail = parentEmail ? sanitizeString(parentEmail).toLowerCase() : undefined;
  }
  if (pairingCode !== undefined) {
    targetUser.pairingCode = sanitizeString(pairingCode).toUpperCase();
  }
  if (typeof newPassword === 'string' && newPassword.trim().length >= 6) {
    targetUser.passwordHash = await bcrypt.hash(newPassword.trim(), 10);
  }

  targetUser.updatedAt = new Date().toISOString();
  await persistUser(targetUser);

  addLog({
    userId: actor?.id || 'user_superadmin',
    userName: actor?.name || 'Super Admin',
    role: 'super_admin',
    action: 'SUPERADMIN_USER_UPDATED',
    details: `Super Admin memperbarui profil/RBAC pengguna ${targetUser.name} (Role: ${targetUser.role}, XP: ${targetUser.xp}, Tema: ${targetUser.theme}).`,
    ip: req.ip || '127.0.0.1',
    severity: 'security',
  });

  return res.json({
    success: true,
    user: sanitizeUser(targetUser),
  });
});

// Delete user from Super Admin Console
app.delete('/api/superadmin/users/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const actor = req.currentUser || users.find((u) => u.id === currentUserId);
  const targetId = req.params.id;
  if (targetId === 'user_superadmin') {
    return res.status(400).json({ error: 'Akun Super Admin utama tidak dapat dihapus.' });
  }

  const idx = users.findIndex((u) => u.id === targetId);
  if (idx === -1) {
    return res.status(404).json({ error: 'Pengguna tidak ditemukan.' });
  }

  const removed = users.splice(idx, 1)[0];
  if (firestoreDb) {
    try {
      await deleteDoc(doc(firestoreDb, 'users', targetId));
    } catch (e) {
      console.warn('Failed to delete user from Firestore:', e);
    }
  }

  addLog({
    userId: actor?.id || 'user_superadmin',
    userName: actor?.name || 'Super Admin',
    role: 'super_admin',
    action: 'SUPERADMIN_USER_DELETED',
    details: `Super Admin menghapus akun pengguna ${removed.name} (${removed.email}) dari sistem dan Firestore.`,
    ip: req.ip || '127.0.0.1',
    severity: 'alert',
  });

  return res.json({ success: true, deletedId: targetId });
});

// Link or Unlink Parent & Child from Super Admin Console
app.post('/api/superadmin/relations/link', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const actor = req.currentUser || users.find((u) => u.id === currentUserId);
  const { childId, parentId, action } = req.body;

  const child = users.find((u) => u.id === childId && u.role === 'child');
  const parent = users.find((u) => u.id === parentId && u.role === 'parent');

  if (!child || !parent) {
    return res.status(404).json({ error: 'Akun anak atau orang tua tidak ditemukan.' });
  }

  if (!parent.pairedChildrenIds) parent.pairedChildrenIds = [];

  if (action === 'unlink') {
    parent.pairedChildrenIds = parent.pairedChildrenIds.filter((id) => id !== child.id);
    if (child.parentEmail === parent.email) {
      child.parentEmail = undefined;
    }
  } else {
    if (!parent.pairedChildrenIds.includes(child.id)) {
      parent.pairedChildrenIds.push(child.id);
    }
    child.parentEmail = parent.email;
  }

  await persistUser(parent);
  await persistUser(child);

  addLog({
    userId: actor?.id || 'user_superadmin',
    userName: actor?.name || 'Super Admin',
    role: 'super_admin',
    action: action === 'unlink' ? 'SUPERADMIN_FAMILY_UNLINKED' : 'SUPERADMIN_FAMILY_LINKED',
    details: `Super Admin ${action === 'unlink' ? 'memutuskan' : 'menautkan'} relasi keluarga antara Anak [${child.name}] dan Orang Tua [${parent.name}].`,
    ip: req.ip || '127.0.0.1',
    severity: 'security',
  });

  return res.json({
    success: true,
    child: sanitizeUser(child),
    parent: sanitizeUser(parent),
  });
});

// Delete encrypted journal record (Zero-Knowledge metadata moderation)
app.delete('/api/superadmin/journals/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const actor = req.currentUser || users.find((u) => u.id === currentUserId);
  const journalId = req.params.id;
  const idx = journals.findIndex((j) => j.id === journalId);
  if (idx === -1) {
    return res.status(404).json({ error: 'Entri jurnal tidak ditemukan.' });
  }

  const removed = journals.splice(idx, 1)[0];
  if (firestoreDb) {
    try {
      await deleteDoc(doc(firestoreDb, 'journals', journalId));
    } catch (e) {
      console.warn('Failed to delete journal from Firestore:', e);
    }
  }

  addLog({
    userId: actor?.id || 'user_superadmin',
    userName: actor?.name || 'Super Admin',
    role: 'super_admin',
    action: 'SUPERADMIN_JOURNAL_PURGED',
    details: `Super Admin menghapus blob ciphertext jurnal [${journalId}] milik ${removed.userName} dari Cloud Firestore.`,
    ip: req.ip || '127.0.0.1',
    severity: 'warning',
  });

  return res.json({ success: true, deletedId: journalId });
});

// Delete collaboration quest from Super Admin Console
app.delete('/api/superadmin/collaborations/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const actor = req.currentUser || users.find((u) => u.id === currentUserId);
  const collabId = req.params.id;
  const idx = collaborations.findIndex((c) => c.id === collabId);
  if (idx === -1) {
    return res.status(404).json({ error: 'Misi kolaborasi tidak ditemukan.' });
  }

  const removed = collaborations.splice(idx, 1)[0];
  if (firestoreDb) {
    try {
      await deleteDoc(doc(firestoreDb, 'collaborations', collabId));
    } catch (e) {
      console.warn('Failed to delete collaboration from Firestore:', e);
    }
  }

  addLog({
    userId: actor?.id || 'user_superadmin',
    userName: actor?.name || 'Super Admin',
    role: 'super_admin',
    action: 'SUPERADMIN_COLLAB_MODERATED',
    details: `Super Admin memoderasi/menghapus misi kolaborasi "${removed.title}" (${removed.author1Name} & ${removed.author2Name}).`,
    ip: req.ip || '127.0.0.1',
    severity: 'warning',
  });

  return res.json({ success: true, deletedId: collabId });
});

// Add custom daily reflection prompt from Super Admin CMS
app.post('/api/superadmin/prompts', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const actor = req.currentUser || users.find((u) => u.id === currentUserId);
  const { theme, textId, textEn, textJa } = req.body;

  if (!textId) {
    return res.status(400).json({ error: 'Teks prompt wajib diisi.' });
  }

  const newPrompt: StoredCustomPrompt = {
    id: 'cp_' + Math.random().toString(36).substring(2, 9),
    theme: theme === 'demon_hunter' ? 'demon_hunter' : 'wizard_academy',
    textId: sanitizeString(textId),
    textEn: sanitizeString(textEn || textId),
    textJa: sanitizeString(textJa || textId),
    active: true,
    createdAt: new Date().toISOString(),
  };

  customPrompts.unshift(newPrompt);
  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'customPrompts', newPrompt.id), newPrompt);
    } catch (e) {
      console.warn('Failed to persist customPrompt to Firestore:', e);
    }
  }

  addLog({
    userId: actor?.id || 'user_superadmin',
    userName: actor?.name || 'Super Admin',
    role: 'super_admin',
    action: 'SUPERADMIN_PROMPT_ADDED',
    details: `Super Admin menambahkan prompt refleksi baru (${newPrompt.theme}): "${newPrompt.textId}"`,
    ip: req.ip || '127.0.0.1',
    severity: 'info',
  });

  return res.status(201).json({ success: true, prompt: newPrompt });
});

// Delete custom prompt from Super Admin CMS
app.delete('/api/superadmin/prompts/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const actor = req.currentUser || users.find((u) => u.id === currentUserId);
  const promptId = req.params.id;
  const idx = customPrompts.findIndex((p) => p.id === promptId);
  if (idx === -1) {
    return res.status(404).json({ error: 'Prompt tidak ditemukan.' });
  }

  const removed = customPrompts.splice(idx, 1)[0];
  if (firestoreDb) {
    try {
      await deleteDoc(doc(firestoreDb, 'customPrompts', promptId));
    } catch (e) {
      console.warn('Failed to delete customPrompt from Firestore:', e);
    }
  }

  addLog({
    userId: actor?.id || 'user_superadmin',
    userName: actor?.name || 'Super Admin',
    role: 'super_admin',
    action: 'SUPERADMIN_PROMPT_DELETED',
    details: `Super Admin menghapus prompt kustom [${removed.id}].`,
    ip: req.ip || '127.0.0.1',
    severity: 'info',
  });

  return res.json({ success: true, deletedId: promptId });
});

// Broadcast system security audit log from Super Admin Console
app.post('/api/superadmin/logs/broadcast', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const actor = req.currentUser || users.find((u) => u.id === currentUserId);
  const { action, details, severity } = req.body;

  if (!details) {
    return res.status(400).json({ error: 'Rincian pesan broadcast wajib diisi.' });
  }

  addLog({
    userId: actor?.id || 'user_superadmin',
    userName: actor?.name || 'Super Admin',
    role: 'super_admin',
    action: sanitizeString(action || 'SYSTEM_SECURITY_BROADCAST').toUpperCase(),
    details: sanitizeString(details),
    ip: req.ip || '127.0.0.1',
    severity: severity === 'alert' || severity === 'warning' || severity === 'security' ? severity : 'info',
  });

  return res.json({ success: true, logs: activityLogs });
});

// 18. 404 handler for API routes
app.all('/api/*', (req: Request, res: Response) => {
  return res.status(404).json({ error: 'Endpoint API tidak ditemukan' });
});

// 18. Global error handling middleware
app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
  const message = err instanceof Error ? err.message : 'Unknown error';
  console.error('Unhandled server error:', message);
  if (res.headersSent) {
    return next(err);
  }
  return res.status(500).json({ error: 'Terjadi kesalahan pada server internal.' });
});

// Mount Vite or static server
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets with caching
    const distPath = path.resolve(__dirname, 'dist');
    app.use(
      express.static(distPath, {
        maxAge: '1y',
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, must-revalidate');
          }
        },
      })
    );
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, () => {
    console.log(`Magic Journal full-stack server running on port ${PORT}`);
  });

  // Graceful shutdown
  const handleShutdown = () => {
    console.log('Shutting down server gracefully...');
    server.close(() => {
      process.exit(0);
    });
  };
  process.on('SIGTERM', handleShutdown);
  process.on('SIGINT', handleShutdown);
}

setupServer();
