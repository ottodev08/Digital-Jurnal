import { ThemeId, Badge } from '../types';

export interface MoodOption {
  score: number;
  label: string;
  name: string;
  color: string;
  description: string;
  iconType: string;
}

export const WIZARD_MOODS: MoodOption[] = [
  {
    score: 5,
    name: 'Ramuan Cahaya Bintang',
    label: 'Luar Biasa / Bersemangat',
    color: '#F59E0B',
    description: 'Energi magis meluap-luap, hari penuh keajaiban dan tawa!',
    iconType: 'starlight',
  },
  {
    score: 4,
    name: 'Ramuan Keceriaan Emas',
    label: 'Baik / Senang',
    color: '#10B981',
    description: 'Mantra berjalan lancar, hati hangat dan penuh inspirasi.',
    iconType: 'golden_elixir',
  },
  {
    score: 3,
    name: 'Seduhan Ketenangan Netral',
    label: 'Biasa / Cukup Tenang',
    color: '#6366F1',
    description: 'Hari yang damai di perpustakaan kastil, tidak ada badai.',
    iconType: 'chamomile_brew',
  },
  {
    score: 2,
    name: 'Kabut Kebingungan',
    label: 'Cemas / Lelah',
    color: '#EC4899',
    description: 'Pikiran agak berkabut, butuh waktu sendiri untuk memulihkan mana.',
    iconType: 'fog_draught',
  },
  {
    score: 1,
    name: 'Ramuan Bayangan Gulita',
    label: 'Sedih / Butuh Bantuan',
    color: '#EF4444',
    description: 'Merasa terbebani dan sendirian, perlu pelindung dan curahan hati.',
    iconType: 'shadow_draught',
  },
];

export const DEMON_HUNTER_MOODS: MoodOption[] = [
  {
    score: 5,
    name: 'Pernapasan Matahari: Terik Semangat',
    label: 'Heroik / Sangat Tangguh',
    color: '#F97316',
    description: 'Pedang menyala, mengalahkan semua rintangan hari ini dengan gagah!',
    iconType: 'sun_breathing',
  },
  {
    score: 4,
    name: 'Pernapasan Air: Aliran Tenang',
    label: 'Kuat / Fokus & Damai',
    color: '#06B6D4',
    description: 'Mengalir tenang menghadapi hari, pikiran jernih tanpa beban.',
    iconType: 'water_breathing',
  },
  {
    score: 3,
    name: 'Pernapasan Angin: Kestabilan',
    label: 'Biasa / Siaga Netral',
    color: '#10B981',
    description: 'Hari berlalu seperti desau angin, seimbang dan terkendali.',
    iconType: 'wind_breathing',
  },
  {
    score: 2,
    name: 'Pernapasan Petir: Kilat Tegang',
    label: 'Gelisah / Kelelahan',
    color: '#EAB308',
    description: 'Detak jantung terburu-buru, energi terkuras oleh tugas dan tekanan.',
    iconType: 'thunder_breathing',
  },
  {
    score: 1,
    name: 'Kabut Kelam: Pertahanan Jatuh',
    label: 'Terluka / Perlu Istirahat',
    color: '#DC2626',
    description: 'Pedang tumpul dan hati lelah, butuh wisteria pelindung dan tempat aman.',
    iconType: 'dark_mire',
  },
];

export const WIZARD_PROMPTS = [
  'Mantra rahasia apa yang kamu pelajari tentang dirimu hari ini?',
  'Ramuan apa yang paling kamu butuhkan untuk menenangkan hatimu saat ini?',
  'Siapa sahabat di akademi yang membuat harimu terasa lebih ajaib?',
  'Jika kamu bisa mengubah satu momen hari ini dengan tongkat sihir, apa yang ingin kamu ubah?',
  'Pesan rahasia apa yang ingin kamu simpan di lemari buku terkunci untuk dirimu di masa depan?',
  'Hal kecil apa hari ini yang membuat hatimu berkilau seperti serbuk peri?',
  'Bagaimana caramu menjaga batas agar energi magismu tidak terkuras oleh orang lain?',
];

export const DEMON_HUNTER_PROMPTS = [
  'Iblis kecil apa (rasa malas, takut, cemas) yang berhasil kamu tebas hari ini?',
  'Jurus ketahanan apa yang kamu pakai saat menghadapi situasi yang menyebalkan?',
  'Siapa kawan seperjuangan yang menemanimu melewati rintangan hari ini?',
  'Jika pedangmu mencatat satu pelajaran hari ini, apa kata yang terukir di bilahnya?',
  'Luka emosional apa yang butuh kamu rawat di Rumah Wisteria malam ini?',
  'Kekuatan apa yang baru kamu sadari bersemayam di dalam dadamu?',
  'Apa hal yang ingin kamu syukuri setelah seharian bertarung di dunia nyata?',
];

export const WIZARD_STICKERS = [
  { id: 'wand', label: 'Tongkat Sihir', emoji: '🪄' },
  { id: 'potion', label: 'Ramuan Berkilau', emoji: '🧪' },
  { id: 'crystal', label: 'Bola Kristal', emoji: '🔮' },
  { id: 'scroll', label: 'Gulungan Kuno', emoji: '📜' },
  { id: 'owl', label: 'Burung Hantu', emoji: '🦉' },
  { id: 'feather', label: 'Bulu Phoenix', emoji: '🪶' },
  { id: 'stars', label: 'Konstelasi', emoji: '✨' },
  { id: 'cauldron', label: 'Kuali Mantra', emoji: '🕯️' },
];

export const DEMON_HUNTER_STICKERS = [
  { id: 'sword', label: 'Pedang Nichirin', emoji: '⚔️' },
  { id: 'mask', label: 'Topeng Rubah', emoji: '👺' },
  { id: 'fire', label: 'Api Semangat', emoji: '🔥' },
  { id: 'water', label: 'Ombak Biru', emoji: '🌊' },
  { id: 'flower', label: 'Bunga Wisteria', emoji: '🌸' },
  { id: 'bamboo', label: 'Bambu Pelindung', emoji: '🎋' },
  { id: 'shield', label: 'Segel Pelindung', emoji: '🛡️' },
  { id: 'onigiri', label: 'Bento Pemulihan', emoji: '🍙' },
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge_first_entry',
    name: 'Pena Pertama Terpatri',
    theme: 'universal',
    description: 'Menulis dan mengenkripsi jurnal pertamamu di Magic Journal.',
    icon: '🪶',
    unlocked: true,
    unlockedAt: '2026-09-20',
  },
  {
    id: 'badge_streak_3',
    name: 'Kobaran Api 3 Hari',
    theme: 'demon_hunter',
    description: 'Mencapai streak jurnal 3 hari berturut-turut tanpa jeda!',
    icon: '🔥',
    unlocked: true,
    unlockedAt: '2026-09-22',
  },
  {
    id: 'badge_streak_7',
    name: 'Mantra Abadi 7 Hari',
    theme: 'wizard_academy',
    description: 'Menjaga ritme refleksi diri selama seminggu penuh.',
    icon: '🔮',
    unlocked: true,
    unlockedAt: '2026-09-24',
  },
  {
    id: 'badge_crypto_shield',
    name: 'Segel Rahasia AES-256',
    theme: 'universal',
    description: 'Memverifikasi keamanan data dengan kunci enkripsi privat.',
    icon: '🛡️',
    unlocked: true,
    unlockedAt: '2026-09-21',
  },
  {
    id: 'badge_artist_doodle',
    name: 'Goresan Imajinasi',
    theme: 'universal',
    description: 'Menyertakan doodle kreatif pada halaman jurnal pribadi.',
    icon: '🎨',
    unlocked: true,
    unlockedAt: '2026-09-23',
  },
  {
    id: 'badge_master_emotions',
    name: 'Penguasa Harmoni Hati',
    theme: 'universal',
    description: 'Mengenal dan mencatat 5 spektrum emosi berbeda secara jujur.',
    icon: '🌟',
    unlocked: false,
  },
];
