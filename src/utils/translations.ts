import { Language, ThemeId } from '../types';

export interface TranslationDictionary {
  // Navigation & General
  navJournal: string;
  navCollab: string;
  navParent: string;
  navAudit: string;
  navBadges: string;
  navTheme: string;
  navLogout: string;
  navLogin: string;
  navRegister: string;
  activeUser: string;
  childRole: string;
  parentRole: string;
  streakLabel: string;
  days: string;
  dbStatus: string;
  connected: string;
  journalsCountLabel: string;
  customizeTheme: string;
  hideTheme: string;
  switchAccount: string;
  themeEngineTitle: string;
  
  // Roles Banner Notice
  parentViewingChildNoteTitle: string;
  parentViewingChildNoteDesc: string;
  openParentPortalBtn: string;
  switchChildAccountBtn: string;

  // Landing Hero
  heroBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  startWritingBtn: string;
  parentPortalBtn: string;
  feat1Title: string;
  feat1Desc: string;
  feat2Title: string;
  feat2Desc: string;
  feat3Title: string;
  feat3Desc: string;
  feat4Title: string;
  feat4Desc: string;
  loginOptionText: string;
  registerOptionText: string;
  demoAccountsTitle: string;
  loginAsKenji: string;
  loginAsSarah: string;
  loginAsAlya: string;

  // Auth Modal
  authLoginTitle: string;
  authLoginSubtitle: string;
  authRegisterTitle: string;
  authRegisterSubtitle: string;
  authTabLogin: string;
  authTabRegister: string;
  authDemoTitle: string;
  authDemoPasswordNote: string;
  authOrEmailPassword: string;
  authOrRegisterForm: string;
  authNickname: string;
  authNicknamePlaceholder: string;
  authRole: string;
  authRoleChild: string;
  authRoleParent: string;
  authThemeLabel: string;
  authAgeLabel: string;
  authAgeUnit: string;
  authEmail: string;
  authEmailPlaceholder: string;
  authPassword: string;
  authPasswordPlaceholderLogin: string;
  authPasswordPlaceholderRegister: string;
  authPasswordStrengthWeak: string;
  authPasswordStrengthMedium: string;
  authPasswordStrengthStrong: string;
  authConfirmPassword: string;
  authConfirmPasswordPlaceholder: string;
  authPasswordMatch: string;
  authPasswordMismatch: string;
  authParentEmailLabel: string;
  authParentEmailPlaceholder: string;
  authParentEmailNotice: string;
  authSubmitLogin: string;
  authSubmitRegister: string;
  authSubmitting: string;
  authLoginSuccess: string;
  authRegisterSuccess: string;
  authErrorDefault: string;
  authErrorNetwork: string;
  authErrorMinPassword: string;
  authErrorPasswordMismatch: string;
  authErrorInvalidEmail: string;
  authErrorNameRequired: string;

  // Journal Grimoire (Book)
  bookTabWrite: string;
  bookTabRead: string;
  bookTabIndex: string;
  bookTabShares: string;
  bookTabCollab: string;
  grimoireTitle: string;
  grimoireSubtitle: string;
  moodQuestion: string;
  promptQuestionLabel: string;
  refreshPrompt: string;
  reflectionPlaceholder: string;
  encryptionKeyTitle: string;
  encryptionKeyDesc: string;
  encryptionPinPlaceholder: string;
  chooseSticker: string;
  doodleCanvasBtn: string;
  doodleCanvasOpen: string;
  saveJournalBtn: string;
  savingJournal: string;
  journalSavedSuccess: string;
  inspectCryptoBtn: string;
  shareWithParentBtn: string;
  sharedWithParentBadge: string;
  emptyJournalTitle: string;
  emptyJournalDesc: string;
  startFirstEntry: string;
  decryptPromptTitle: string;
  decryptPromptDesc: string;
  unlockEntryBtn: string;
  incorrectPin: string;
  pageNumber: string;
  ofPages: string;
  readPreviousPage: string;
  readNextPage: string;
  bookWizardPageTitle: string;
  bookHunterPageTitle: string;
  bookStep1MoodWizard: string;
  bookStep1MoodHunter: string;
  bookStep2Write: string;
  bookCharCountUnit: string;
  bookArtPageTitle: string;
  bookArtPageNumber: string;
  bookStickerPaletteTitle: string;
  bookDoodleSectionTitle: string;
  bookHideCanvas: string;
  bookOpenCanvas: string;
  bookClickToEditDoodle: string;
  bookTouchToDraw: string;
  bookTouchToDrawSub: string;
  bookPrivacyGuaranteeTitle: string;
  bookPrivacyGuaranteeDesc: string;
  bookEditionYear: string;
  bookSavedInFirestore: string;
  bookEmptyReadTitle: string;
  bookEmptyReadDesc: string;
  bookDecryptedBadge: string;
  bookNoDoodleOnPage: string;
  bookPayloadTitle: string;
  bookOpenInspectorBtn: string;
  bookOpenTocBtn: string;
  bookWriteNewPageBtn: string;
  bookTocTitle: string;
  bookTocSubtitle: string;
  bookChapterPrefix: string;
  bookPagePrefix: string;
  bookWriteNewEntryBtn: string;
  bookSharedParentSpreadTitle: string;
  bookSharedParentSpreadDesc: string;
  bookShareAnotherPageBtn: string;
  bookNoSharesYetTitle: string;
  bookNoSharesYetDesc: string;
  bookChoosePageAndShareBtn: string;
  bookParentNoteLabel: string;
  bookSharedContentLabel: string;
  bookParentReplyTitle: string;
  bookWaitingParentReaction: string;
  bookBackToBookBtn: string;
  bookDuoQuestSpreadTitle: string;
  bookDuoQuestSpreadDesc: string;
  bookBackToReadingBtn: string;
  bookPageAuthorPrefix: string;
  bookScoreEmosi: string;
  bookBookmarkRibbon: string;
  bookSaveErrorValidation: string;
  bookSaveErrorGeneral: string;

  // Parent Sharing & Interaction
  parentShareHeading: string;
  parentShareSubtitle: string;
  parentNotePlaceholder: string;
  sendToParentBtn: string;
  shareSuccessAlert: string;
  parentStampHeading: string;
  parentReplyHeading: string;
  waitingForParentReply: string;
  replyFromParentLabel: string;
  privacyOwnershipTitle: string;
  optionalNoteLabel: string;
  sendingText: string;
  cancelBtn: string;

  // Duo Quest / Collaboration
  duoQuestTitle: string;
  duoQuestSubtitle: string;
  friendCodeLabel: string;
  copyCodeBtn: string;
  codeCopied: string;
  addFriendTitle: string;
  friendCodeInputPlaceholder: string;
  connectFriendBtn: string;
  connectedFriends: string;
  createNewCollabBtn: string;
  collabPromptPlaceholder: string;
  yourContributionLabel: string;
  waitingFriendContribution: string;
  cheerBtn: string;
  completedBadge: string;
  inProgressBadge: string;
  collabTopicPlaceholder: string;
  collabFirstStoryPlaceholder: string;
  collabReplyPlaceholder: string;
  collabSendingMission: string;
  collabSendMissionBtn: string;
  collabSavingCollab: string;
  collabSealCompleteBtn: string;
  collabMissionDone: string;
  collabWaitingPartner: string;
  collabCheerTooltip: string;
  collabAddFriendError: string;
  collabCreateError: string;
  collabReplyError: string;

  // Parent Portal
  parentPortalHeading: string;
  parentPortalSubtitle: string;
  tabAnalytics: string;
  tabSharedPages: string;
  emotionalTrendTitle: string;
  earlyAlertTitle: string;
  earlyAlertWarning: string;
  earlyAlertOk: string;
  sendEncouragingReply: string;
  sendLoveStampBtn: string;
  quickReplySent: string;
  parentPrivacyLockTitle: string;
  parentPrivacyLockSubtitle: string;
  parentPrivacyLockDesc: string;
  parentLinkChildBtn: string;
  parentPairingPlaceholder: string;
  parentSharedNotesTitle: string;
  parentSharedNotesSubtitle: string;
  parentIncomingSharesCount: string;
  parentNoSharedNotesTitle: string;
  parentNoSharedNotesDesc: string;
  parentVoluntarySharedBadge: string;
  parentScoreLabel: string;
  parentChildNotePrefix: string;
  parentReflectionPromptPrefix: string;
  parentChildDoodleLabel: string;
  parentYourResponseSent: string;
  parentSendReplyBtn: string;
  parentAlertTitle3Days: string;
  parentAlertDesc3Days: string;
  parentSendEmailBtn: string;
  parentSupportAdviceTitle: string;
  parentAdvice1Title: string;
  parentAdvice1Desc: string;
  parentAdvice2Title: string;
  parentAdvice2Desc: string;
  parentAdvice3Title: string;
  parentAdvice3Desc: string;
  parentStatJournalsThisWeek: string;
  parentStatStreak: string;
  parentStatAvgMood: string;
  parentStatFavoriteTheme: string;
  parentTestAlertBtn: string;
  parentLegendGood: string;
  parentLegendNeutral: string;
  parentLegendAlert: string;
  parentLegendAxis: string;
  parentMoodDistributionTitle: string;
  parentSelectChildPrompt: string;
  parentEmailModalTitle: string;
  parentEmailToLabel: string;
  parentEmailSubjectLabel: string;
  parentEmailBodyLabel: string;
  parentEmailSentSuccess: string;
  parentEmailCancel: string;
  parentEmailSendNow: string;
  parentStampWarmHug: string;
  parentStampProud: string;
  parentStampTough: string;
  parentStampAlwaysHere: string;
  parentReplyPlaceholder: string;
  parentReplyDefault: string;
  parentNoEntriesDay: string;

  // Crypto Inspector Modal
  cryptoInspectorTitle: string;
  cryptoInspectorSubtitle: string;
  cryptoPrivacyGuaranteeTitle: string;
  cryptoPrivacyGuaranteeDesc: string;
  cryptoCiphertextTitle: string;
  cryptoCopyCiphertext: string;
  cryptoCopied: string;
  cryptoAlgoLabel: string;
  cryptoIvLabel: string;
  cryptoSaltLabel: string;
  cryptoOriginalTitle: string;
  cryptoHideOriginal: string;
  cryptoShowOriginal: string;
  cryptoSandboxTitle: string;
  cryptoSandboxDesc: string;
  cryptoPinPlaceholder: string;
  cryptoTestBtn: string;
  cryptoKeyMatchSuccess: string;
  cryptoKeyMismatchFail: string;
  cryptoCloseBtn: string;

  // Activity Log
  auditTitle: string;
  auditSubtitle: string;
  auditRefreshBtn: string;
  auditFilterAll: string;
  auditFilterSecurity: string;
  auditFilterAlert: string;
  auditFilterJournal: string;
  auditFilterAuth: string;
  auditSearchPlaceholder: string;
  auditEmptyLogs: string;

  // Theme Selector
  themeWizardDesc: string;
  themeWizardPalette: string;
  themeWizardTypography: string;
  themeWizardPersona: string;
  themeDemonHunterDesc: string;
  themeDemonHunterPalette: string;
  themeDemonHunterMood: string;
  themeDemonHunterPersona: string;

  // Doodle Canvas
  doodleThickness: string;
  doodleEraser: string;
  doodleUndo: string;
  doodleClear: string;
  doodlePadWatermark: string;

  // Badges & Gamification
  badgesModalTitle: string;
  badgesModalSubtitle: string;
  unlockedBadge: string;
  lockedBadge: string;
  xpTotal: string;
  levelLabel: string;
  rankWizardTitle: string;
  rankHunterTitle: string;
  towardsNextLevel: string;

  // Journal List
  journalArchiveTitle: string;
  journalSearchPlaceholder: string;
  scoreSuffix: string;
  viewCryptoProof: string;
  unlockedOnlyYou: string;
  emptyNotePlaceholder: string;
  privateDoodleLabel: string;
  lockedByClientCrypto: string;
  unlockPinPlaceholder: string;
  unlockNoteBtn: string;

  // Footer
  footerTagline: string;
  footerPrivacy: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  id: {
    navJournal: 'Jurnal Harian',
    navCollab: 'Kolaborasi Teman',
    navParent: 'Parent Portal',
    navAudit: 'Log Aktivitas',
    navBadges: 'Lencana & XP',
    navTheme: 'Tema',
    navLogout: 'Keluar',
    navLogin: 'Masuk',
    navRegister: 'Daftar',
    activeUser: 'Pengguna Aktif',
    childRole: 'Anak / Remaja',
    parentRole: 'Orang Tua (Wali)',
    streakLabel: 'Streak',
    days: 'Hari',
    dbStatus: 'Database: Cloud Firestore',
    connected: 'Tersambung',
    journalsCountLabel: 'Jurnal',
    customizeTheme: 'Sesuaikan Tema',
    hideTheme: 'Sembunyikan Tema',
    switchAccount: 'Ganti Akun / Masuk',
    themeEngineTitle: 'Dynamic Theme Engine (CSS & Aset Tematik)',

    parentViewingChildNoteTitle: 'Anda Sedang Masuk Sebagai Akun Orang Tua',
    parentViewingChildNoteDesc: 'Akun orang tua tidak dapat menulis jurnal anak demi integritas enkripsi dan privasi. Silakan buka Parent Portal untuk memantau grafik tren emosi atau beralih ke akun anak.',
    openParentPortalBtn: 'Buka Parent Portal',
    switchChildAccountBtn: 'Beralih ke Akun Anak',

    heroBadge: 'Digital Journal Interaktif & Terenkripsi Client-Side',
    heroTitle1: 'Grimoire & Catatan Hati',
    heroTitle2: 'Rahasia, Ajaib, & Selalu Terlindungi',
    heroSubtitle: 'Ekspresikan perasaanmu dengan enkripsi AES-256 militer. Bebas berimajinasi dengan tema Sihir & Pemburu Iblis, bagikan lembaran terpilih dengan orang tua, atau berpetualang bareng teman!',
    startWritingBtn: 'Buka Grimoire & Tulis Jurnal',
    parentPortalBtn: 'Pantau di Parent Portal',
    feat1Title: 'Enkripsi Client-Side AES-256',
    feat1Desc: 'Teks dienkripsi langsung di browser dengan PIN rahasiamu sebelum menyentuh cloud.',
    feat2Title: 'Dua Tema Imersif',
    feat2Desc: 'Pilih antara Wizard Academy yang magis atau Demon Hunter yang penuh api semangat.',
    feat3Title: 'Jembatan Kasih Orang Tua',
    feat3Desc: 'Bagikan halaman tertentu secara sukarela untuk menerima stempel cinta dan balasan hangat.',
    feat4Title: 'Duo Quest Ramah Sahabat',
    feat4Desc: 'Buat jurnal bareng teman dengan pairing code aman dan saling memberi cheer api!',
    loginOptionText: 'Sudah Punya Akun? Masuk Disini',
    registerOptionText: 'Baru Disini? Buat Akun Gratis',
    demoAccountsTitle: 'Atau Masuk Cepat dengan Akun Demo:',
    loginAsKenji: 'Sarrah (Anak - 11 Tahun)',
    loginAsSarah: 'Fatiha (Orang Tua)',
    loginAsAlya: 'Cahyadi (Super Admin)',

    authLoginTitle: 'Masuk ke Grimoire',
    authLoginSubtitle: 'Buka gerbang petualangan dan rahasia pribadimu',
    authRegisterTitle: 'Daftar Akun Petualang Baru',
    authRegisterSubtitle: 'Mulai perjalanan menorehkan jejak hatimu',
    authTabLogin: 'Masuk (Login)',
    authTabRegister: 'Daftar Baru (Register)',
    authDemoTitle: 'Akun Demo Cepat (Sarrah, Fatiha, Cahyadi)',
    authDemoPasswordNote: 'Kata sandi demo: Password123!',
    authOrEmailPassword: 'atau masuk dengan email & kata sandi',
    authOrRegisterForm: 'atau lengkapi formulir registrasi',
    authNickname: 'Nama Panggilan',
    authNicknamePlaceholder: 'Contoh: Sarrah...',
    authRole: 'Peran Akun',
    authRoleChild: 'Anak / Remaja (6-17 th)',
    authRoleParent: 'Orang Tua / Wali',
    authThemeLabel: 'Pilihan Tema Awal',
    authAgeLabel: 'Umur Kamu',
    authAgeUnit: 'thn',
    authEmail: 'Email',
    authEmailPlaceholder: 'nama@email.com',
    authPassword: 'Kata Sandi',
    authPasswordPlaceholderLogin: 'Masukkan kata sandi',
    authPasswordPlaceholderRegister: 'Minimal 8 karakter',
    authPasswordStrengthWeak: 'Kekuatan: Lemah',
    authPasswordStrengthMedium: 'Kekuatan: Sedang',
    authPasswordStrengthStrong: 'Kekuatan: Sangat Kuat',
    authConfirmPassword: 'Konfirmasi Kata Sandi',
    authConfirmPasswordPlaceholder: 'Ketik ulang kata sandi',
    authPasswordMatch: 'Kata sandi cocok',
    authPasswordMismatch: 'Kata sandi belum cocok',
    authParentEmailLabel: 'Email Orang Tua / Wali (Opsional)',
    authParentEmailPlaceholder: 'fatiha@guardian.local atau email orang tua...',
    authParentEmailNotice: 'Email Orang Tua diperlukan agar akunmu bisa terhubung dengan sistem perlindungan Parent Portal.',
    authSubmitLogin: 'Masuk ke Grimoire',
    authSubmitRegister: 'Buat Akun Sekarang',
    authSubmitting: 'Memproses...',
    authLoginSuccess: 'Login berhasil!',
    authRegisterSuccess: 'Akun berhasil dibuat! Silakan masuk.',
    authErrorDefault: 'Terjadi kesalahan autentikasi.',
    authErrorNetwork: 'Koneksi ke server gagal. Pastikan jaringan aktif.',
    authErrorMinPassword: 'Kata sandi minimal 8 karakter.',
    authErrorPasswordMismatch: 'Konfirmasi kata sandi tidak cocok.',
    authErrorInvalidEmail: 'Format email tidak valid.',
    authErrorNameRequired: 'Nama panggilan wajib diisi.',

    bookTabWrite: 'Tulis Jurnal',
    bookTabRead: 'Buka & Baca',
    bookTabIndex: 'Daftar Isi',
    bookTabShares: 'Surat Orang Tua',
    bookTabCollab: 'Lembar Teman',
    grimoireTitle: 'Grimoire Terenkripsi',
    grimoireSubtitle: 'Buku Catatan Rahasia Dua Halaman Interaktif',
    moodQuestion: 'Bagaimana suasana hatimu dan energimu saat ini?',
    promptQuestionLabel: 'Misi Refleksi Hari Ini',
    refreshPrompt: 'Ganti Pertanyaan Misi',
    reflectionPlaceholder: 'Goreskan kata-kata, perasaan, dan kisah petualanganmu hari ini...',
    encryptionKeyTitle: 'Kunci Mantra Rahasia (PIN Enkripsi)',
    encryptionKeyDesc: 'PIN ini menjadi kunci enkripsi AES-256 lokalmu.',
    encryptionPinPlaceholder: 'Masukkan 4 digit PIN...',
    chooseSticker: 'Pilih Stempel Ajaib',
    doodleCanvasBtn: 'Buka Kanvas Gambar',
    doodleCanvasOpen: 'Tutup Kanvas Gambar',
    saveJournalBtn: 'Segel & Simpan ke Grimoire (+30 XP)',
    savingJournal: 'Menyegel Jurnal...',
    journalSavedSuccess: 'Halaman Grimoire berhasil disegel dengan aman!',
    inspectCryptoBtn: 'Periksa Bukti Enkripsi Kripto',
    shareWithParentBtn: 'Bagikan Lembar Ini ke Orang Tua',
    sharedWithParentBadge: 'Telah Dibagikan ke Orang Tua 💌',
    emptyJournalTitle: 'Belum Ada Lembaran Tersegel',
    emptyJournalDesc: 'Grimoire masih kosong. Mulailah menulis halaman pertamamu hari ini!',
    startFirstEntry: 'Tulis Halaman Pertama',
    decryptPromptTitle: 'Halaman Ini Terkunci Rapat',
    decryptPromptDesc: 'Masukkan PIN mantra rahasia untuk membuka segel dan membaca catatan ini.',
    unlockEntryBtn: 'Buka Segel Halaman',
    incorrectPin: 'PIN salah! Tidak dapat mendekripsi teks.',
    pageNumber: 'Halaman',
    ofPages: 'dari',
    readPreviousPage: 'Halaman Sebelumnya',
    readNextPage: 'Halaman Selanjutnya',
    bookWizardPageTitle: 'Halaman Refleksi Sihir',
    bookHunterPageTitle: 'Lembar Perjalanan Pendekar',
    bookStep1MoodWizard: '1. Cap Segel Ramuan Emosi Hari Ini:',
    bookStep1MoodHunter: '1. Jurus Pernapasan & Emosi Hari Ini:',
    bookStep2Write: '2. Tuliskan Pikiranmu di Lembaran Buku:',
    bookCharCountUnit: 'Karakter',
    bookArtPageTitle: 'Lembar Seni & Stiker Buku',
    bookArtPageNumber: 'Hal. {num} (Seni)',
    bookStickerPaletteTitle: 'Pilih Stiker untuk Ditempel di Pojok Halaman:',
    bookDoodleSectionTitle: 'Goresan Tinta & Gambar Buku:',
    bookHideCanvas: 'Sembunyikan Kanvas',
    bookOpenCanvas: 'Buka Kanvas Doodle',
    bookClickToEditDoodle: 'Klik untuk mengedit doodle',
    bookTouchToDraw: 'Sentuh untuk Menggambar di Kertas Ini',
    bookTouchToDrawSub: 'Tambahkan sketsa magis, simbol kekuatan, atau perasaanmu dalam bentuk gambar.',
    bookPrivacyGuaranteeTitle: 'Jaminan Privasi Buku Harian:',
    bookPrivacyGuaranteeDesc: 'Buku ini dilindungi oleh prinsip Zero-Knowledge. Saat tombol segel ditekan, teks diubah menjadi kode acak AES-256 di browser Anda sebelum dikirim ke Cloud Firestore.',
    bookEditionYear: 'Magic Journal Book • Edisi 2026',
    bookSavedInFirestore: 'Tersimpan di Cloud Firestore',
    bookEmptyReadTitle: 'Buku Jurnal Masih Kosong',
    bookEmptyReadDesc: 'Belum ada lembaran yang disegel di dalam buku ini. Klik tombol di bawah untuk menulis lembar pertama perjalananmu!',
    bookDecryptedBadge: 'Segel Terbuka • Terbaca',
    bookNoDoodleOnPage: 'Tidak ada goresan doodle pada halaman ini.',
    bookPayloadTitle: 'Payload Ciphertext Database:',
    bookOpenInspectorBtn: 'Buka Inspektor Kripto',
    bookOpenTocBtn: 'Buka Daftar Isi Buku',
    bookWriteNewPageBtn: 'Tulis Halaman Baru',
    bookTocTitle: 'Daftar Isi • Indeks Buku Jurnal',
    bookTocSubtitle: 'Kumpulan bab rekaman perjalanan diri • Total {count} lembar catatan tersimpan',
    bookChapterPrefix: 'Bab',
    bookPagePrefix: 'Hal.',
    bookWriteNewEntryBtn: 'Tulis Entri Baru',
    bookSharedParentSpreadTitle: 'Lembar Terbagi untuk Orang Tua',
    bookSharedParentSpreadDesc: 'Halaman yang kamu bagikan secara sukarela ke {email}',
    bookShareAnotherPageBtn: 'Bagikan Halaman Lain',
    bookNoSharesYetTitle: 'Belum Ada Lembaran yang Kamu Bagikan',
    bookNoSharesYetDesc: 'Semua catatan di grimoire jurnalmu terkunci rapat secara rahasia. Jika kamu ingin berbagi cerita, kebahagiaan, atau meminta dukungan hangat, kamu bisa membagikan lembar jurnal pilihanmu kepada orang tua.',
    bookChoosePageAndShareBtn: 'Pilih Lembaran & Bagikan (+50 XP)',
    bookParentNoteLabel: 'Pesanmu untuk Orang Tua:',
    bookSharedContentLabel: 'Isi Refleksi yang Dibagikan:',
    bookParentReplyTitle: 'Balasan Penuh Kasih Sayang:',
    bookWaitingParentReaction: 'Menunggu respon orang tua di Parent Portal...',
    bookBackToBookBtn: 'Kembali ke Balik Buku',
    bookDuoQuestSpreadTitle: 'Lembar Kolaborasi Teman (Duo Quest)',
    bookDuoQuestSpreadDesc: 'Tulis misi jurnal bersama teman, goreskan doodle bergantian, dan kirimkan sorakan!',
    bookBackToReadingBtn: 'Kembali Membaca Buku',
    bookPageAuthorPrefix: 'Milik: ',
    bookScoreEmosi: 'Skor Emosi: {score}/5',
    bookBookmarkRibbon: 'Pita Pembatas Buku Magis',
    bookSaveErrorValidation: 'Tuliskan refleksi harianmu di atas kertas atau buat gambar doodle.',
    bookSaveErrorGeneral: 'Terjadi kendala saat menyegel lembaran buku.',

    parentShareHeading: 'Bagikan Lembaran Terpilih ke Orang Tua',
    parentShareSubtitle: 'Hanya teks di lembar ini yang dibagikan. Catatan pribadimu yang lain tetap terkunci rahasia.',
    parentNotePlaceholder: 'Tulis pesan singkat untuk Ayah / Bunda (opsional)...',
    sendToParentBtn: 'Kirim ke Orang Tua',
    shareSuccessAlert: 'Lembar jurnal berhasil dikirim ke orang tua!',
    parentStampHeading: 'Stempel Kasih Sayang dari Orang Tua',
    parentReplyHeading: 'Balasan Hangat Orang Tua',
    waitingForParentReply: 'Menunggu balasan dan stempel dari Ayah/Bunda...',
    replyFromParentLabel: 'Pesan dari Orang Tua',
    privacyOwnershipTitle: 'Hak Privasi Penuh Milikmu',
    optionalNoteLabel: 'Pesan Tambahan untuk Mama/Papa (Opsional):',
    sendingText: 'Mengirim...',
    cancelBtn: 'Batal',

    duoQuestTitle: 'Duo Quest & Kolaborasi Sahabat',
    duoQuestSubtitle: 'Tulis kisah petualangan dan selesaikan misi bareng teman terbaikmu!',
    friendCodeLabel: 'Kode Pertemanan Kamu',
    copyCodeBtn: 'Salin Kode',
    codeCopied: 'Disalin!',
    addFriendTitle: 'Hubungkan Sahabat Baru',
    friendCodeInputPlaceholder: 'Ketik kode pairing sahabat (cth: SRH110)...',
    connectFriendBtn: 'Sambungkan Sahabat',
    connectedFriends: 'Daftar Sahabat Terhubung',
    createNewCollabBtn: 'Mulai Lembar Duo Quest Baru',
    collabPromptPlaceholder: 'Tuliskan topik atau petualangan bersama...',
    yourContributionLabel: 'Goresan Kata Kamu',
    waitingFriendContribution: 'Menunggu respon dari kawan seperjuanganmu...',
    cheerBtn: 'Kirim Api Semangat 🔥',
    completedBadge: 'Misi Selesai',
    inProgressBadge: 'Sedang Berlangsung',
    collabTopicPlaceholder: 'Misal: Rencana Menaklukkan Ujian Tengah Semester...',
    collabFirstStoryPlaceholder: 'Tuliskan cerita, perasaan, atau idemu untuk memulai lembar ini...',
    collabReplyPlaceholder: 'Ketik balasanmu di sini untuk melengkapi lembaran buku sahabat...',
    collabSendingMission: 'Mengirim Misi...',
    collabSendMissionBtn: 'Kirim Misi ke Sahabat (+50 XP)',
    collabSavingCollab: 'Menyimpan...',
    collabSealCompleteBtn: 'Segel & Selesaikan Misi (+100 XP)',
    collabMissionDone: 'Misi Selesai ✓',
    collabWaitingPartner: 'Menunggu Rekan...',
    collabCheerTooltip: 'Beri Percikan Semangat',
    collabAddFriendError: 'Terjadi kesalahan saat menambahkan sahabat.',
    collabCreateError: 'Gagal membuat kolaborasi.',
    collabReplyError: 'Gagal mengirim balasan kolaborasi.',

    parentPortalHeading: 'Parent Emotional Wellness Portal',
    parentPortalSubtitle: 'Pantau kesejahteraan emosional anak tanpa melanggar privasi dan tanpa membuka teks terenkripsi.',
    tabAnalytics: 'Tren Emosi & Analisis',
    tabSharedPages: 'Surat & Lembar yang Dibagikan',
    emotionalTrendTitle: 'Tren Suasana Hati 30 Hari Terakhir',
    earlyAlertTitle: 'Sistem Deteksi Dini Kesejahteraan Emosional',
    earlyAlertWarning: 'Perhatian: Terdeteksi suasana hati rendah beberapa hari berurutan. Dianjurkan untuk mendampingi anak.',
    earlyAlertOk: 'Kondisi emosi anak dalam rentang sehat dan stabil.',
    sendEncouragingReply: 'Beri Balasan Penguat Hati',
    sendLoveStampBtn: 'Kirim Stempel Kasih Sayang',
    quickReplySent: 'Balasan dan stempel berhasil dikirim ke Grimoire anak!',
    parentPrivacyLockTitle: 'Privacy Lock Terpasang: Perlindungan Ruang Privat Remaja',
    parentPrivacyLockSubtitle: 'Sistem Magic Journal secara ketat memblokir akses siapapun ke teks asli jurnal anak.',
    parentPrivacyLockDesc: 'Orang tua mendapatkan visibilitas tren emosional, konsistensi kebiasaan, dan peringatan dini jika anak terindikasi stres, tanpa merusak rasa saling percaya ataupun mengintip rahasia pribadi mereka.',
    parentLinkChildBtn: 'Tautkan Anak',
    parentPairingPlaceholder: 'Kode Pairing (misal: SRH110)...',
    parentSharedNotesTitle: 'Catatan Hati & Refleksi Terbuka dari Anak',
    parentSharedNotesSubtitle: 'Anak Anda secara sukarela membagikan lembaran ini untuk bercerita dan mendapatkan dukungan hangat.',
    parentIncomingSharesCount: '{count} Lembaran Masuk',
    parentNoSharedNotesTitle: 'Belum Ada Lembaran yang Dibagikan',
    parentNoSharedNotesDesc: 'Saat anak Anda menulis di Buku Jurnal dan menekan tombol "Bagikan ke Orang Tua", cerita dan refleksinya akan muncul di sini agar Anda bisa mengirimkan pelukan dan pesan kasih sayang.',
    parentVoluntarySharedBadge: 'Dibagikan Sukarela',
    parentScoreLabel: 'Skor {score}/5',
    parentChildNotePrefix: 'Pesan dari {child}:',
    parentReflectionPromptPrefix: 'Pertanyaan Refleksi:',
    parentChildDoodleLabel: 'Goresan Gambar Anak:',
    parentYourResponseSent: 'Respon Anda Telah Terkirim:',
    parentSendReplyBtn: 'Kirim Balasan',
    parentAlertTitle3Days: 'Peringatan Pendampingan Emosi: Suasana Hati Rendah 3 Hari Berturut-turut',
    parentAlertDesc3Days: '{child} mencatat level emosi berada di tingkat terendah selama beberapa hari terakhir.',
    parentSendEmailBtn: 'Kirim Notifikasi & Panduan ke Email',
    parentSupportAdviceTitle: 'Saran Pendampingan Psikologis untuk Orang Tua:',
    parentAdvice1Title: 'Jangan menginterogasi isi jurnal:',
    parentAdvice1Desc: 'Menanyakan "kamu nulis apa di jurnal?" dapat merusak rasa percaya anak.',
    parentAdvice2Title: 'Tawarkan kehadiran tanpa syarat:',
    parentAdvice2Desc: '"Bunda/Ayah ada di sini kalau kamu lagi butuh teman cerita atau jalan keluar sore nanti."',
    parentAdvice3Title: 'Ajak aktivitas relaksasi fisik:',
    parentAdvice3Desc: 'Olahraga ringan, memasak bersama cemilan favorit, atau mendengarkan musik santai.',
    parentStatJournalsThisWeek: 'Jurnal Minggu Ini',
    parentStatStreak: 'Konsistensi Streak',
    parentStatAvgMood: 'Rata-Rata Suasana Hati',
    parentStatFavoriteTheme: 'Tema Favorit',
    parentTestAlertBtn: 'Uji Coba Peringatan 3 Hari',
    parentLegendGood: 'Baik / Luar Biasa (4-5)',
    parentLegendNeutral: 'Netral / Tenang (3)',
    parentLegendAlert: 'Cemas / Butuh Perhatian (1-2)',
    parentLegendAxis: 'Sumbu Horisontal: 30 Hari Terakhir',
    parentMoodDistributionTitle: 'Distribusi Suasana Hati Keseluruhan',
    parentSelectChildPrompt: 'Pilih anak di atas untuk melihat analitik.',
    parentEmailModalTitle: 'Simulasi Notifikasi Email Orang Tua',
    parentEmailToLabel: 'Kepada:',
    parentEmailSubjectLabel: 'Subjek:',
    parentEmailBodyLabel: 'Isi Pesan Pendampingan:',
    parentEmailSentSuccess: 'Email peringatan berhasil dikirim!',
    parentEmailCancel: 'Batal',
    parentEmailSendNow: 'Kirim Notifikasi Sekarang',
    parentStampWarmHug: '🤗 Pelukan Hangat',
    parentStampProud: '🌟 Sangat Bangga',
    parentStampTough: '💪 Kamu Tangguh',
    parentStampAlwaysHere: '🛡️ Selalu Ada',
    parentReplyPlaceholder: 'Tulis pesan atau kalimat penyemangat untuk {child}...',
    parentReplyDefault: 'Mama/Papa sangat bangga padamu!',
    parentNoEntriesDay: 'Tidak ada entri',

    cryptoInspectorTitle: 'Inspektur Enkripsi Client-Side (AES-256-GCM)',
    cryptoInspectorSubtitle: 'Zero-Knowledge Privacy: Teks dienkripsi langsung di browser anak sebelum dikirim ke server.',
    cryptoPrivacyGuaranteeTitle: 'Jaminan Privasi Total untuk Remaja',
    cryptoPrivacyGuaranteeDesc: 'Bahkan admin server, database, maupun akun orang tua di Parent Portal tidak memiliki kunci untuk membaca isi jurnal ini. Hanya anak yang memegang kunci enkripsi rahasia yang dapat membuka tulisan aslinya.',
    cryptoCiphertextTitle: 'Ciphertext Tersimpan di Database (Data Terenkripsi)',
    cryptoCopyCiphertext: 'Salin Ciphertext',
    cryptoCopied: 'Tersalin',
    cryptoAlgoLabel: 'Algoritma',
    cryptoIvLabel: 'Inisialisasi IV (Hex)',
    cryptoSaltLabel: 'Salt KDF (PBKDF2)',
    cryptoOriginalTitle: 'Teks Asli Sebelum Enkripsi (Hanya di Memori Client)',
    cryptoHideOriginal: 'Sembunyikan',
    cryptoShowOriginal: 'Perlihatkan',
    cryptoSandboxTitle: 'Simulasi Uji Coba Dekripsi Data',
    cryptoSandboxDesc: 'Coba masukkan kunci enkripsi yang berbeda untuk membuktikan bahwa tanpa kunci yang tepat, ciphertext tidak dapat dibaca.',
    cryptoPinPlaceholder: 'Masukkan PIN / Kunci Rahasia...',
    cryptoTestBtn: 'Uji Dekripsi',
    cryptoKeyMatchSuccess: 'Kunci Cocok! Teks Berhasil Didekripsi:',
    cryptoKeyMismatchFail: 'Enkripsi AES-256 melindungi data dengan sempurna.',
    cryptoCloseBtn: 'Tutup Inspektur',

    auditTitle: 'Log Audit & Aktivitas Pengguna Terperinci',
    auditSubtitle: 'Merekam riwayat keamanan, proses enkripsi, login, pembuatan jurnal, dan sistem peringatan.',
    auditRefreshBtn: 'Segarkan Log',
    auditFilterAll: 'Semua Aktivitas',
    auditFilterSecurity: 'Enkripsi & Keamanan',
    auditFilterAlert: 'Peringatan Emosi',
    auditFilterJournal: 'Entri Jurnal',
    auditFilterAuth: 'Autentikasi',
    auditSearchPlaceholder: 'Cari aktivitas atau pengguna...',
    auditEmptyLogs: 'Tidak ada log aktivitas yang cocok dengan filter.',

    themeWizardDesc: 'Perkamen kuno, ramuan ajaib, dan mantra refleksi diri.',
    themeWizardPalette: 'Warna: Marun & Emas',
    themeWizardTypography: 'Tipografi: Klasik Serif',
    themeWizardPersona: 'Persona: Sarrah (11 thn)',
    themeDemonHunterDesc: 'Haori kotak hijau-hitam, jurus pernapasan, dan tebasan rintangan.',
    themeDemonHunterPalette: 'Warna: Haori Hijau & Hitam',
    themeDemonHunterMood: 'Mood: Jurus Pernapasan',
    themeDemonHunterPersona: 'Persona: Sarrah (11 thn)',

    doodleThickness: 'Tebal',
    doodleEraser: 'Penghapus',
    doodleUndo: 'Urungkan',
    doodleClear: 'Hapus Semua',
    doodlePadWatermark: 'Doodle Pad Remaja • Gambar / Tanda Tangan',

    badgesModalTitle: 'Koleksi Lencana & Prestasi Petualang',
    badgesModalSubtitle: 'Kumpulkan lencana keberanian, konsistensi menulis, dan pemahaman emosi.',
    unlockedBadge: 'Terbuka',
    lockedBadge: 'Terkunci',
    xpTotal: 'Total XP',
    levelLabel: 'Tingkat',
    rankWizardTitle: 'Penyihir Magang',
    rankHunterTitle: 'Pemburu Mizunoto',
    towardsNextLevel: 'Menuju Tingkat {level} ({xp}/250 XP)',

    journalArchiveTitle: 'Lembar Jurnal Pribadimu',
    journalSearchPlaceholder: 'Cari prompt atau suasana...',
    scoreSuffix: 'Skor {score}/5',
    viewCryptoProof: 'Lihat Ciphertext / Kripto',
    unlockedOnlyYou: 'Jurnal Terbuka (Hanya Kamu yang Bisa Membaca)',
    emptyNotePlaceholder: 'Catatan kosong.',
    privateDoodleLabel: 'Goresan Doodle Privat',
    lockedByClientCrypto: 'Konten Terkunci oleh Enkripsi Client',
    unlockPinPlaceholder: 'PIN rahasia...',
    unlockNoteBtn: 'Buka Catatan',

    footerTagline: 'Magic Journal • Digital Journal Terenkripsi AES-256 untuk Anak & Remaja',
    footerPrivacy: 'Privasi Terjamin • 0% Akses Teks Terbuka Tanpa Izin • Firebase Firestore',
  },

  en: {
    navJournal: 'Daily Journal',
    navCollab: 'Friend Collab',
    navParent: 'Parent Portal',
    navAudit: 'Audit Logs',
    navBadges: 'Badges & XP',
    navTheme: 'Theme',
    navLogout: 'Sign Out',
    navLogin: 'Sign In',
    navRegister: 'Register',
    activeUser: 'Active User',
    childRole: 'Child / Teen',
    parentRole: 'Parent (Guardian)',
    streakLabel: 'Streak',
    days: 'Days',
    dbStatus: 'Database: Cloud Firestore',
    connected: 'Connected',
    journalsCountLabel: 'Journals',
    customizeTheme: 'Customize Theme',
    hideTheme: 'Hide Theme',
    switchAccount: 'Switch Account / Login',
    themeEngineTitle: 'Dynamic Theme Engine (CSS & Thematic Assets)',

    parentViewingChildNoteTitle: 'You are signed in as a Parent Account',
    parentViewingChildNoteDesc: 'Parent accounts cannot write into child journals to safeguard client-side encryption and personal privacy. Please open the Parent Portal to view emotional wellness trends or switch to a child account.',
    openParentPortalBtn: 'Open Parent Portal',
    switchChildAccountBtn: 'Switch to Child Account',

    heroBadge: 'Interactive & Client-Side Encrypted Digital Journal',
    heroTitle1: 'Magical Grimoire & Heart Records',
    heroTitle2: 'Secret, Magical, & Always Protected',
    heroSubtitle: 'Express your deepest thoughts with military-grade AES-256 encryption. Let your imagination soar with Wizard Academy & Demon Hunter themes, share voluntary pages with parents, or embark on co-op quests with best friends!',
    startWritingBtn: 'Open Grimoire & Write Journal',
    parentPortalBtn: 'Explore Parent Portal',
    feat1Title: 'Client-Side AES-256 Encryption',
    feat1Desc: 'Journal text is encrypted directly in your browser with your secret key before reaching the cloud.',
    feat2Title: 'Dual Immersive Themes',
    feat2Desc: 'Choose between the mystical Wizard Academy or the fiery, determined Demon Hunter aesthetic.',
    feat3Title: 'Parental Love Bridge',
    feat3Desc: 'Voluntarily share specific pages to receive affectionate reaction stamps and heartwarming messages.',
    feat4Title: 'Best-Friend Duo Quests',
    feat4Desc: 'Co-author journal spreads with friends using secure pairing codes and cheering reactions!',
    loginOptionText: 'Already Have an Account? Sign In',
    registerOptionText: 'New Here? Create a Free Account',
    demoAccountsTitle: 'Or Instant Login with Demo Profiles:',
    loginAsKenji: 'Sarrah (Child - 11 yo)',
    loginAsSarah: 'Fatiha (Parent Account)',
    loginAsAlya: 'Cahyadi (Super Admin)',

    authLoginTitle: 'Enter the Grimoire',
    authLoginSubtitle: 'Unlock the gateway to your personal adventures and reflections',
    authRegisterTitle: 'Register New Adventurer Account',
    authRegisterSubtitle: 'Begin your journey of self-reflection and emotional discovery',
    authTabLogin: 'Sign In (Login)',
    authTabRegister: 'Register New Account',
    authDemoTitle: 'Quick Demo Profiles (Sarrah, Fatiha, Cahyadi)',
    authDemoPasswordNote: 'Demo password: Password123!',
    authOrEmailPassword: 'or sign in with email & password',
    authOrRegisterForm: 'or fill in registration details',
    authNickname: 'Nickname / Inscription Name',
    authNicknamePlaceholder: 'E.g., Sarrah...',
    authRole: 'Account Role',
    authRoleChild: 'Child / Teen (6-17 yrs)',
    authRoleParent: 'Parent / Guardian',
    authThemeLabel: 'Starting Theme',
    authAgeLabel: 'Your Age',
    authAgeUnit: 'yrs',
    authEmail: 'Email Address',
    authEmailPlaceholder: 'name@email.com',
    authPassword: 'Password',
    authPasswordPlaceholderLogin: 'Enter your password',
    authPasswordPlaceholderRegister: 'At least 8 characters',
    authPasswordStrengthWeak: 'Strength: Weak',
    authPasswordStrengthMedium: 'Strength: Medium',
    authPasswordStrengthStrong: 'Strength: Very Strong',
    authConfirmPassword: 'Confirm Password',
    authConfirmPasswordPlaceholder: 'Re-enter your password',
    authPasswordMatch: 'Passwords match',
    authPasswordMismatch: 'Passwords do not match yet',
    authParentEmailLabel: 'Parent / Guardian Email (Optional)',
    authParentEmailPlaceholder: 'fatiha@guardian.local or parent email...',
    authParentEmailNotice: 'Parent email enables connection to the supportive Parent Portal system.',
    authSubmitLogin: 'Sign In to Grimoire',
    authSubmitRegister: 'Create Account Now',
    authSubmitting: 'Processing...',
    authLoginSuccess: 'Signed in successfully!',
    authRegisterSuccess: 'Account created! Please sign in.',
    authErrorDefault: 'Authentication failed.',
    authErrorNetwork: 'Server connection failed. Ensure your network is active.',
    authErrorMinPassword: 'Password must be at least 8 characters.',
    authErrorPasswordMismatch: 'Password confirmation does not match.',
    authErrorInvalidEmail: 'Please enter a valid email address.',
    authErrorNameRequired: 'Nickname is required.',

    bookTabWrite: 'Write Journal',
    bookTabRead: 'Read & Unlock',
    bookTabIndex: 'Index',
    bookTabShares: 'Parent Letters',
    bookTabCollab: 'Friend Spread',
    grimoireTitle: 'Encrypted Grimoire',
    grimoireSubtitle: 'Two-Page Interactive Digital Journal Book',
    moodQuestion: 'How is your emotional mana and energy today?',
    promptQuestionLabel: "Today's Reflection Quest",
    refreshPrompt: 'Shuffle Quest Question',
    reflectionPlaceholder: 'Inscribe your thoughts, feelings, and secret adventures today...',
    encryptionKeyTitle: 'Secret Spell PIN (Encryption Key)',
    encryptionKeyDesc: 'This PIN acts as your local client AES-256 cryptographic passkey.',
    encryptionPinPlaceholder: 'Enter 4-digit PIN...',
    chooseSticker: 'Choose Magical Seal',
    doodleCanvasBtn: 'Open Doodle Canvas',
    doodleCanvasOpen: 'Close Doodle Canvas',
    saveJournalBtn: 'Seal & Save to Grimoire (+30 XP)',
    savingJournal: 'Sealing Journal...',
    journalSavedSuccess: 'Grimoire page has been safely sealed!',
    inspectCryptoBtn: 'Inspect Cryptographic Proof',
    shareWithParentBtn: 'Share This Page with Parents',
    sharedWithParentBadge: 'Shared with Parents 💌',
    emptyJournalTitle: 'No Sealed Pages Yet',
    emptyJournalDesc: 'Your Grimoire is currently blank. Inscribe your very first page today!',
    startFirstEntry: 'Write First Page',
    decryptPromptTitle: 'This Page is Sealed',
    decryptPromptDesc: 'Enter your secret PIN to break the cryptographic seal and read your entry.',
    unlockEntryBtn: 'Break Seal & Read',
    incorrectPin: 'Invalid PIN! Unable to decrypt text.',
    pageNumber: 'Page',
    ofPages: 'of',
    readPreviousPage: 'Previous Page',
    readNextPage: 'Next Page',
    bookWizardPageTitle: 'Magical Reflection Page',
    bookHunterPageTitle: 'Slayer’s Journey Spread',
    bookStep1MoodWizard: '1. Today’s Alchemical Mood Seal:',
    bookStep1MoodHunter: '1. Today’s Breathing Technique & Spirit:',
    bookStep2Write: '2. Inscribe Your Thoughts into the Grimoire:',
    bookCharCountUnit: 'Chars',
    bookArtPageTitle: 'Art & Magical Seal Spread',
    bookArtPageNumber: 'Pg. {num} (Art)',
    bookStickerPaletteTitle: 'Choose a Sticker for the Page Corner:',
    bookDoodleSectionTitle: 'Ink & Sketch Doodle Pad:',
    bookHideCanvas: 'Hide Canvas',
    bookOpenCanvas: 'Open Doodle Canvas',
    bookClickToEditDoodle: 'Click to edit doodle sketch',
    bookTouchToDraw: 'Touch to Draw on this Parchment',
    bookTouchToDrawSub: 'Add magical sketches, warrior emblems, or visual emotions.',
    bookPrivacyGuaranteeTitle: 'Journal Privacy Guarantee:',
    bookPrivacyGuaranteeDesc: 'Protected by Zero-Knowledge client-side encryption. Text is transformed into random AES-256 ciphertext in your browser before ever reaching Cloud Firestore.',
    bookEditionYear: 'Magic Journal Book • 2026 Edition',
    bookSavedInFirestore: 'Saved to Cloud Firestore',
    bookEmptyReadTitle: 'Journal Book is Blank',
    bookEmptyReadDesc: 'No entries sealed in this grimoire yet. Click below to begin your very first journey!',
    bookDecryptedBadge: 'Seal Broken • Decrypted',
    bookNoDoodleOnPage: 'No doodle sketch on this page.',
    bookPayloadTitle: 'Database Ciphertext Payload:',
    bookOpenInspectorBtn: 'Open Crypto Inspector',
    bookOpenTocBtn: 'Open Table of Contents',
    bookWriteNewPageBtn: 'Write New Page',
    bookTocTitle: 'Table of Contents • Journal Index',
    bookTocSubtitle: 'Chronicles of self-reflection • Total {count} pages recorded',
    bookChapterPrefix: 'Chapter',
    bookPagePrefix: 'Pg.',
    bookWriteNewEntryBtn: 'Write New Entry',
    bookSharedParentSpreadTitle: 'Pages Shared with Parents',
    bookSharedParentSpreadDesc: 'Entries you voluntarily shared with {email}',
    bookShareAnotherPageBtn: 'Share Another Page',
    bookNoSharesYetTitle: 'No Pages Shared Yet',
    bookNoSharesYetDesc: 'All entries in your grimoire are strictly sealed. When you want to share an accomplishment, happiness, or request warm support, you can voluntarily send a selected page to your parents.',
    bookChoosePageAndShareBtn: 'Choose a Page & Share (+50 XP)',
    bookParentNoteLabel: 'Your Note to Parents:',
    bookSharedContentLabel: 'Shared Reflection Content:',
    bookParentReplyTitle: 'Affectionate Reply from Parents:',
    bookWaitingParentReaction: 'Waiting for parental response in Parent Portal...',
    bookBackToBookBtn: 'Back to Journal Book',
    bookDuoQuestSpreadTitle: 'Friend Co-Op Spread (Duo Quest)',
    bookDuoQuestSpreadDesc: 'Write shared quests with friends, trade doodles, and send energetic cheers!',
    bookBackToReadingBtn: 'Back to Reading Spread',
    bookPageAuthorPrefix: 'Author: ',
    bookScoreEmosi: 'Mood Score: {score}/5',
    bookBookmarkRibbon: 'Magical Bookmark Ribbon',
    bookSaveErrorValidation: 'Write your daily reflection or draw a doodle sketch first.',
    bookSaveErrorGeneral: 'Encountered an issue sealing the book page.',

    parentShareHeading: 'Share Selected Pages with Parents',
    parentShareSubtitle: 'Only this specific page will be shared. All your other personal entries remain strictly private and locked.',
    parentNotePlaceholder: 'Write a short message for mom / dad (optional)...',
    sendToParentBtn: 'Send to Parents',
    shareSuccessAlert: 'Journal page has been shared with your parents!',
    parentStampHeading: 'Affection Stamp from Parents',
    parentReplyHeading: 'Warm Reply from Parents',
    waitingForParentReply: 'Waiting for parents to view and send a warm reaction...',
    replyFromParentLabel: 'Message from Parents',
    privacyOwnershipTitle: 'Complete Privacy Ownership',
    optionalNoteLabel: 'Optional Message for Mom / Dad:',
    sendingText: 'Sending...',
    cancelBtn: 'Cancel',

    duoQuestTitle: 'Duo Quest & Best Friend Co-Op',
    duoQuestSubtitle: 'Write adventure stories and overcome quests side-by-side with your companions!',
    friendCodeLabel: 'Your Friend Pairing Code',
    copyCodeBtn: 'Copy Code',
    codeCopied: 'Copied!',
    addFriendTitle: 'Pair with a New Companion',
    friendCodeInputPlaceholder: "Enter friend's code (e.g., SRH110)...",
    connectFriendBtn: 'Connect Companion',
    connectedFriends: 'Connected Companions',
    createNewCollabBtn: 'Start New Duo Quest Spread',
    collabPromptPlaceholder: 'Describe your shared quest or topic...',
    yourContributionLabel: 'Your Inscription',
    waitingFriendContribution: 'Waiting for your companion to respond...',
    cheerBtn: 'Send Fiery Cheer 🔥',
    completedBadge: 'Quest Completed',
    inProgressBadge: 'In Progress',
    collabTopicPlaceholder: 'E.g., Conquering the Midterm Exams Quest...',
    collabFirstStoryPlaceholder: 'Write your story, feelings, or ideas to begin this shared spread...',
    collabReplyPlaceholder: 'Write your response here to complete your companion’s spread...',
    collabSendingMission: 'Sending Quest...',
    collabSendMissionBtn: 'Send Quest to Companion (+50 XP)',
    collabSavingCollab: 'Saving...',
    collabSealCompleteBtn: 'Seal & Complete Quest (+100 XP)',
    collabMissionDone: 'Quest Completed ✓',
    collabWaitingPartner: 'Waiting for Companion...',
    collabCheerTooltip: 'Send a Spark of Encouragement',
    collabAddFriendError: 'Error pairing with companion.',
    collabCreateError: 'Failed to create collaboration spread.',
    collabReplyError: 'Failed to submit collaboration response.',

    parentPortalHeading: 'Parent Emotional Wellness Portal',
    parentPortalSubtitle: 'Gain gentle insights into your child’s emotional wellbeing without intruding on privacy or reading encrypted entries.',
    tabAnalytics: 'Mood Analytics & Trends',
    tabSharedPages: 'Shared Pages & Letters',
    emotionalTrendTitle: '30-Day Emotional Mana Trends',
    earlyAlertTitle: 'Early Emotional Wellness Detection',
    earlyAlertWarning: 'Notice: Consecutive low mood days detected. Consider spending gentle, supportive time with your child.',
    earlyAlertOk: 'Your child’s emotional expressions are steady and healthy.',
    sendEncouragingReply: 'Send Heartwarming Words',
    sendLoveStampBtn: 'Send Love Stamp',
    quickReplySent: 'Warm reaction stamp and reply sent to child’s Grimoire!',
    parentPrivacyLockTitle: 'Privacy Lock Engaged: Child Private Space Safeguard',
    parentPrivacyLockSubtitle: 'The Magic Journal system strictly blocks anyone from reading child encrypted journal text.',
    parentPrivacyLockDesc: 'Parents receive visibility into emotional trends, streak consistency, and early alerts for prolonged stress, without undermining mutual trust or inspecting private journals.',
    parentLinkChildBtn: 'Link Child',
    parentPairingPlaceholder: 'Pairing Code (e.g., SRH110)...',
    parentSharedNotesTitle: 'Heart Notes & Open Reflections from Child',
    parentSharedNotesSubtitle: 'Your child voluntarily shared these spreads to communicate and receive your heartfelt warmth.',
    parentIncomingSharesCount: '{count} Shared Spreads',
    parentNoSharedNotesTitle: 'No Shared Spreads Yet',
    parentNoSharedNotesDesc: 'When your child writes in their Grimoire and taps "Share with Parents", their thoughts will appear here so you can send loving reaction stamps and replies.',
    parentVoluntarySharedBadge: 'Shared Voluntarily',
    parentScoreLabel: 'Score {score}/5',
    parentChildNotePrefix: 'Note from {child}:',
    parentReflectionPromptPrefix: 'Reflection Question:',
    parentChildDoodleLabel: 'Child Doodle Sketch:',
    parentYourResponseSent: 'Your Response Has Been Sent:',
    parentSendReplyBtn: 'Send Warm Reply',
    parentAlertTitle3Days: 'Support Alert: Consecutive Low Mood for 3 Days',
    parentAlertDesc3Days: '{child} reported low emotional levels over several recent days.',
    parentSendEmailBtn: 'Send Email Notification & Guidance',
    parentSupportAdviceTitle: 'Gentle Psychological Guidance for Parents:',
    parentAdvice1Title: 'Do not interrogate journal contents:',
    parentAdvice1Desc: 'Asking "what did you write in your journal?" breaches your child’s trust.',
    parentAdvice2Title: 'Offer unconditional, gentle presence:',
    parentAdvice2Desc: '"I am here if you need a listening ear or want to take a relaxing walk together."',
    parentAdvice3Title: 'Invite calming physical activities:',
    parentAdvice3Desc: 'Light sports, making favorite snacks together, or listening to soothing music.',
    parentStatJournalsThisWeek: 'Journals This Week',
    parentStatStreak: 'Consistency Streak',
    parentStatAvgMood: 'Average Mood',
    parentStatFavoriteTheme: 'Favorite Theme',
    parentTestAlertBtn: 'Test 3-Day Alert Simulation',
    parentLegendGood: 'Good / Thriving (4-5)',
    parentLegendNeutral: 'Neutral / Calm (3)',
    parentLegendAlert: 'Stressed / Needs Care (1-2)',
    parentLegendAxis: 'Horizontal Axis: Last 30 Days',
    parentMoodDistributionTitle: 'Overall Mood Distribution',
    parentSelectChildPrompt: 'Select a child above to view mood analytics.',
    parentEmailModalTitle: 'Simulated Parent Email Notification',
    parentEmailToLabel: 'To:',
    parentEmailSubjectLabel: 'Subject:',
    parentEmailBodyLabel: 'Supportive Guidance Content:',
    parentEmailSentSuccess: 'Support alert email successfully delivered!',
    parentEmailCancel: 'Cancel',
    parentEmailSendNow: 'Send Notification Now',
    parentStampWarmHug: '🤗 Warm Hug',
    parentStampProud: '🌟 So Proud of You',
    parentStampTough: '💪 You Are Resilient',
    parentStampAlwaysHere: '🛡️ Always Here for You',
    parentReplyPlaceholder: 'Write an encouraging message for {child}...',
    parentReplyDefault: 'We are so proud of your bravery and kindness!',
    parentNoEntriesDay: 'No entries',

    cryptoInspectorTitle: 'Client-Side Encryption Inspector (AES-256-GCM)',
    cryptoInspectorSubtitle: 'Zero-Knowledge Privacy: Text is encrypted directly in the child’s browser before transmission.',
    cryptoPrivacyGuaranteeTitle: 'Total Privacy Guarantee for Youth',
    cryptoPrivacyGuaranteeDesc: 'Neither server admins, databases, nor parents in the Parent Portal possess the cryptographic key to read these journal contents. Only the child holding the secret PIN can unlock the original words.',
    cryptoCiphertextTitle: 'Database Ciphertext (Encrypted Payload)',
    cryptoCopyCiphertext: 'Copy Ciphertext',
    cryptoCopied: 'Copied',
    cryptoAlgoLabel: 'Algorithm',
    cryptoIvLabel: 'IV Initialization (Hex)',
    cryptoSaltLabel: 'KDF Salt (PBKDF2)',
    cryptoOriginalTitle: 'Original Text Before Encryption (Client Memory Only)',
    cryptoHideOriginal: 'Hide',
    cryptoShowOriginal: 'Show',
    cryptoSandboxTitle: 'Decryption Sandbox Simulation',
    cryptoSandboxDesc: 'Test entering different passkeys to demonstrate that without the exact secret PIN, ciphertext cannot be broken.',
    cryptoPinPlaceholder: 'Enter PIN / Secret Passkey...',
    cryptoTestBtn: 'Test Decrypt',
    cryptoKeyMatchSuccess: 'Key Match! Text Decrypted Successfully:',
    cryptoKeyMismatchFail: 'AES-256 encryption protects your private thoughts completely.',
    cryptoCloseBtn: 'Close Inspector',

    auditTitle: 'Detailed Audit & Activity Logs',
    auditSubtitle: 'Tracks security events, encryption cycles, logins, journal operations, and emotional health alerts.',
    auditRefreshBtn: 'Refresh Logs',
    auditFilterAll: 'All Activities',
    auditFilterSecurity: 'Crypto & Security',
    auditFilterAlert: 'Emotional Alerts',
    auditFilterJournal: 'Journal Entries',
    auditFilterAuth: 'Authentication',
    auditSearchPlaceholder: 'Search activities or users...',
    auditEmptyLogs: 'No activity logs matching your filter.',

    themeWizardDesc: 'Ancient parchment, magical elixirs, and insightful reflection spells.',
    themeWizardPalette: 'Palette: Maroon & Gold',
    themeWizardTypography: 'Typography: Classical Serif',
    themeWizardPersona: 'Persona: Sarrah (11 yrs)',
    themeDemonHunterDesc: 'Green-black checkered haori, breathing styles, and overcoming obstacles.',
    themeDemonHunterPalette: 'Palette: Green & Black Haori',
    themeDemonHunterMood: 'Mood: Breathing Forms',
    themeDemonHunterPersona: 'Persona: Sarrah (11 yrs)',

    doodleThickness: 'Weight',
    doodleEraser: 'Eraser',
    doodleUndo: 'Undo',
    doodleClear: 'Clear All',
    doodlePadWatermark: 'Youth Doodle Pad • Sketch / Signature',

    badgesModalTitle: 'Adventurer Badges & Achievements',
    badgesModalSubtitle: 'Unlock badges through self-reflection consistency, bravery, and emotional awareness.',
    unlockedBadge: 'Unlocked',
    lockedBadge: 'Locked',
    xpTotal: 'Total XP',
    levelLabel: 'Level',
    rankWizardTitle: 'Apprentice Wizard',
    rankHunterTitle: 'Mizunoto Hunter',
    towardsNextLevel: 'Towards Level {level} ({xp}/250 XP)',

    journalArchiveTitle: 'Personal Journal Archives',
    journalSearchPlaceholder: 'Search prompt or mood...',
    scoreSuffix: 'Score {score}/5',
    viewCryptoProof: 'Inspect Ciphertext / Proof',
    unlockedOnlyYou: 'Unlocked Journal (Only You Can Read)',
    emptyNotePlaceholder: 'Blank entry.',
    privateDoodleLabel: 'Private Doodle Sketch',
    lockedByClientCrypto: 'Locked by Client Encryption',
    unlockPinPlaceholder: 'Secret PIN...',
    unlockNoteBtn: 'Unlock Note',

    footerTagline: 'Magic Journal • Client-Side AES-256 Encrypted Journal for Kids & Teens',
    footerPrivacy: 'Privacy Guaranteed • Zero Unencrypted Text Storage • Firebase Firestore',
  },

  ja: {
    navJournal: '魔法日記',
    navCollab: '仲間と共同日記',
    navParent: '保護者ポータル',
    navAudit: '操作履歴',
    navBadges: 'バッジ＆XP',
    navTheme: 'テーマ',
    navLogout: 'ログアウト',
    navLogin: 'ログイン',
    navRegister: '新規登録',
    activeUser: '現在の冒険者',
    childRole: '子ども・冒険者',
    parentRole: '保護者（守護者）',
    streakLabel: '連続記録',
    days: '日',
    dbStatus: 'DB: クラウド・ファイアストア',
    connected: '接続中',
    journalsCountLabel: '記録',
    customizeTheme: 'テーマ変更',
    hideTheme: 'テーマを隠す',
    switchAccount: 'アカウント切替',
    themeEngineTitle: 'ダイナミック・テーマエンジン（CSS＆世界観）',

    parentViewingChildNoteTitle: '保護者アカウントでログイン中',
    parentViewingChildNoteDesc: '子どもの日記のプライバシーと端末側暗号化を守るため、保護者アカウントからは日記本文を閲覧・執筆できません。保護者ポータルで心の健康トレンドをご確認いただくか、子どもアカウントに切り替えてください。',
    openParentPortalBtn: '保護者ポータルを開く',
    switchChildAccountBtn: '子どもアカウントへ切替',

    heroBadge: '端末内AES-256完全暗号化・対話型デジタル魔導書',
    heroTitle1: '心をつづる秘密の魔導書',
    heroTitle2: '誰にも見られない、あなただけの聖域',
    heroSubtitle: '軍用規格AES-256暗号化で、素直な気持ちを安心記録。魔法学園＆鬼狩りテーマ、親子をつなぐ手紙機能、親友との共同クエスト日記で豊かな自己表現をサポートします。',
    startWritingBtn: '魔導書を開いて日記を書く',
    parentPortalBtn: '保護者ポータルを見る',
    feat1Title: '端末内 AES-256 完全暗号化',
    feat1Desc: 'ブラウザ内で暗号化してから保存。平文テキストはサーバーにも保護者にも一切漏れません。',
    feat2Title: '没入感あふれる2つのテーマ',
    feat2Desc: '幻想的な「魔法学園」と、闘志みなぎる「鬼狩り」の2大世界観をワンタップで切り替え。',
    feat3Title: '親子のあたたかな絆ブリッジ',
    feat3Desc: '子ども自身が選んだページだけを保護者に共有。愛情スタンプや励ましの言葉が届きます。',
    feat4Title: '親友とのデュオ・クエスト',
    feat4Desc: '安全なフレンドコードで友だちとペアリング。一緒に物語や日記を紡ぎ、エールを送り合えます。',
    loginOptionText: 'すでにアカウントをお持ちの方はこちら',
    registerOptionText: 'はじめての方はこちら（無料登録）',
    demoAccountsTitle: 'またはデモアカウントですぐ体験：',
    loginAsKenji: 'Sarrah（子ども・11歳）',
    loginAsSarah: 'Fatiha（保護者）',
    loginAsAlya: 'Cahyadi（Super Admin）',

    authLoginTitle: '魔導書にログイン',
    authLoginSubtitle: 'あなたの秘密と心の冒険の扉を開きましょう',
    authRegisterTitle: '新しい冒険者アカウントを登録',
    authRegisterSubtitle: '心をつづる安心の魔法の旅をここから始めます',
    authTabLogin: 'ログイン',
    authTabRegister: '新規登録',
    authDemoTitle: '1クリック体験用デモアカウント (Sarrah, Fatiha, Cahyadi)',
    authDemoPasswordNote: 'デモ用パスワード: Password123!',
    authOrEmailPassword: 'またはメールアドレスとパスワードでログイン',
    authOrRegisterForm: 'または登録情報を入力',
    authNickname: '冒険者のニックネーム',
    authNicknamePlaceholder: '例: Sarrah...',
    authRole: 'アカウントの役割',
    authRoleChild: '子ども・若者（6〜17歳）',
    authRoleParent: '保護者（見守り・保護者）',
    authThemeLabel: '初期テーマの選択',
    authAgeLabel: 'あなたの年齢',
    authAgeUnit: '歳',
    authEmail: 'メールアドレス',
    authEmailPlaceholder: 'name@email.com',
    authPassword: 'パスワード',
    authPasswordPlaceholderLogin: 'パスワードを入力',
    authPasswordPlaceholderRegister: '8文字以上で設定',
    authPasswordStrengthWeak: '強度: 弱い',
    authPasswordStrengthMedium: '強度: 普通',
    authPasswordStrengthStrong: '強度: とても安全',
    authConfirmPassword: 'パスワードの再確認',
    authConfirmPasswordPlaceholder: 'もう一度入力してください',
    authPasswordMatch: 'パスワードが一致しました',
    authPasswordMismatch: 'パスワードが一致していません',
    authParentEmailLabel: '保護者のメールアドレス（任意）',
    authParentEmailPlaceholder: 'fatiha@guardian.local または保護者のメール...',
    authParentEmailNotice: '保護者メールを設定すると、保護者ポータルの見守り機能と連携できます。',
    authSubmitLogin: '魔導書にログインする',
    authSubmitRegister: 'アカウントを作成する',
    authSubmitting: '処理中...',
    authLoginSuccess: 'ログインに成功しました！',
    authRegisterSuccess: '登録が完了しました！ログインしてください。',
    authErrorDefault: '認証に失敗しました。',
    authErrorNetwork: 'サーバーとの通信に失敗しました。ネットワークを確認してください。',
    authErrorMinPassword: 'パスワードは8文字以上必要です。',
    authErrorPasswordMismatch: '確認用パスワードが一致しません。',
    authErrorInvalidEmail: '有効なメールアドレスを入力してください。',
    authErrorNameRequired: 'ニックネームを入力してください。',

    bookTabWrite: '日記を書く',
    bookTabRead: '封印解除＆読む',
    bookTabIndex: '目次一覧',
    bookTabShares: '保護者への手紙',
    bookTabCollab: '仲間のページ',
    grimoireTitle: '暗号化魔導書',
    grimoireSubtitle: '見開き2ページ・本格インタラクティブ日記帳',
    moodQuestion: '今日のあなたの心の状態・魔力は？',
    promptQuestionLabel: '本日の内省クエスト',
    refreshPrompt: '別のクエストを引く',
    reflectionPlaceholder: '今日あった出来事、素直な想い、冒険の記録をつづろう...',
    encryptionKeyTitle: '秘密の呪文コード（暗号化PIN）',
    encryptionKeyDesc: 'この4桁の数字がブラウザ上でのAES-256暗号化キーになります。',
    encryptionPinPlaceholder: '4桁のPINを入力...',
    chooseSticker: '魔法の紋章スタンプ',
    doodleCanvasBtn: 'お絵かきキャンバスを開く',
    doodleCanvasOpen: 'キャンバスを閉じる',
    saveJournalBtn: '魔導書に封印して保存 (+30 XP)',
    savingJournal: '封印処理中...',
    journalSavedSuccess: '魔導書に記録が安全に封印されました！',
    inspectCryptoBtn: '暗号化データを確認する',
    shareWithParentBtn: 'このページを保護者に届ける',
    sharedWithParentBadge: '保護者に共有済み 💌',
    emptyJournalTitle: 'まだ封印された記録はありません',
    emptyJournalDesc: '魔導書の白紙のページがあなたを待っています。最初の記録を残しましょう！',
    startFirstEntry: '最初のページを書く',
    decryptPromptTitle: 'このページは固く封印されています',
    decryptPromptDesc: '設定した秘密のPINを入力して封印を解き、日記を読み出してください。',
    unlockEntryBtn: '封印を解いて読む',
    incorrectPin: '暗証コードが違います！封印を解けません。',
    pageNumber: 'ページ',
    ofPages: '全',
    readPreviousPage: '前のページ',
    readNextPage: '次のページ',
    bookWizardPageTitle: '魔法の内省ページ',
    bookHunterPageTitle: '鬼狩りの旅路ページ',
    bookStep1MoodWizard: '1. 今日の調子・魔力の調合:',
    bookStep1MoodHunter: '1. 今日の呼吸法と感情:',
    bookStep2Write: '2. あなたの言葉を魔導書に刻む:',
    bookCharCountUnit: '文字',
    bookArtPageTitle: '見開きアート＆魔法の紋章',
    bookArtPageNumber: '第 {num} 頁 (芸術)',
    bookStickerPaletteTitle: 'ページの隅に貼る紋章スタンプを選択:',
    bookDoodleSectionTitle: '手書きスケッチ＆お絵かき:',
    bookHideCanvas: 'キャンバスを隠す',
    bookOpenCanvas: 'お絵かきキャンバスを開く',
    bookClickToEditDoodle: 'クリックしてお絵かきを編集',
    bookTouchToDraw: 'タップしてこの羊皮紙にお絵かき',
    bookTouchToDrawSub: '魔法の紋章、戦士のマーク、今日の気持ちを絵に表現しよう。',
    bookPrivacyGuaranteeTitle: '日記のプライバシー保護宣言:',
    bookPrivacyGuaranteeDesc: 'ゼロ知識・端末内暗号化技術により保護されています。保存ボタンを押した瞬間、ブラウザ内で強固なAES-256暗号文に変換されてから送信されます。',
    bookEditionYear: 'Magic Journal Book • 2026年版',
    bookSavedInFirestore: 'Cloud Firestore に安全保管中',
    bookEmptyReadTitle: '魔導書はまだ白紙です',
    bookEmptyReadDesc: 'まだ封印されたページはありません。下のボタンから最初の1ページを書きましょう！',
    bookDecryptedBadge: '封印解除・平文表示',
    bookNoDoodleOnPage: 'このページにお絵かきはありません。',
    bookPayloadTitle: 'DB暗号化データ（暗号文）:',
    bookOpenInspectorBtn: '暗号インスペクターを開く',
    bookOpenTocBtn: '目次を開く',
    bookWriteNewPageBtn: '新しいページを書く',
    bookTocTitle: '目次・魔導書インデックス',
    bookTocSubtitle: '心の成長記録の章立て • 合計 {count} ページ保管中',
    bookChapterPrefix: '第',
    bookPagePrefix: '頁',
    bookWriteNewEntryBtn: '新しい日記を書く',
    bookSharedParentSpreadTitle: '保護者にお届けした手紙',
    bookSharedParentSpreadDesc: '{email} に共有したページ一覧',
    bookShareAnotherPageBtn: '別のページも届ける',
    bookNoSharesYetTitle: 'まだ保護者に届けたページはありません',
    bookNoSharesYetDesc: 'あなたの日記はすべて固く暗号化されています。うれしかったことや悩み、頑張ったことを伝えたい時は、選んだページだけを保護者に届けることができます。',
    bookChoosePageAndShareBtn: '選んだページを届ける (+50 XP)',
    bookParentNoteLabel: 'あなたから保護者へのひと言:',
    bookSharedContentLabel: 'お届けした日記の本文:',
    bookParentReplyTitle: '保護者からの愛情あふれるお返事:',
    bookWaitingParentReaction: '保護者ポータルからの返信・スタンプを待っています...',
    bookBackToBookBtn: '魔導書の見開きに戻る',
    bookDuoQuestSpreadTitle: '仲間との共同日記（デュオ・クエスト）',
    bookDuoQuestSpreadDesc: '親友と一緒に冒険日記を紡ぎ、お絵かきを交わし、エールを送り合いましょう！',
    bookBackToReadingBtn: '読書モードに戻る',
    bookPageAuthorPrefix: '冒険者: ',
    bookScoreEmosi: '感情スコア: {score}/5',
    bookBookmarkRibbon: '魔法のしおり紐',
    bookSaveErrorValidation: '日記の言葉をつづるか、お絵かきを描いてください。',
    bookSaveErrorGeneral: '魔導書の封印処理中に問題が発生しました。',

    parentShareHeading: '選んだページを保護者にお届け',
    parentShareSubtitle: 'このページの内容だけが保護者に届きます。他のプライベートな日記は暗号化されたまま安全です。',
    parentNotePlaceholder: 'お父さん・お母さんへのひと言（任意）...',
    sendToParentBtn: '保護者に送信する',
    shareSuccessAlert: '日記のページが保護者に届けられました！',
    parentStampHeading: '保護者からの愛情スタンプ',
    parentReplyHeading: '保護者からの温かい返信',
    waitingForParentReply: '保護者からのリアクションを待っています...',
    replyFromParentLabel: '保護者からのメッセージ',
    privacyOwnershipTitle: '完全なプライバシーの権利',
    optionalNoteLabel: '保護者へのひと言（任意）:',
    sendingText: '送信中...',
    cancelBtn: 'キャンセル',

    duoQuestTitle: 'デュオ・クエスト（親友との共同日記）',
    duoQuestSubtitle: '大切な仲間と一緒に、冒険の日記を1つの見開きページにつづろう！',
    friendCodeLabel: 'あなたのフレンドコード',
    copyCodeBtn: 'コードをコピー',
    codeCopied: 'コピー完了！',
    addFriendTitle: '新しい仲間とペアリング',
    friendCodeInputPlaceholder: '友だちのコードを入力（例: SRH110）...',
    connectFriendBtn: '仲間を結ぶ',
    connectedFriends: '結ばれた仲間一覧',
    createNewCollabBtn: '新しい共同クエストを始める',
    collabPromptPlaceholder: 'いっしょに語り合いたい冒険のテーマ...',
    yourContributionLabel: 'あなたの言葉',
    waitingFriendContribution: '仲間の書き込みを待っています...',
    cheerBtn: 'エールを送る 🔥',
    completedBadge: 'クエスト達成',
    inProgressBadge: '進行中',
    collabTopicPlaceholder: '例: 定期テストや部活の試練を乗り越える作戦...',
    collabFirstStoryPlaceholder: 'この見開きを始めるあなたの冒険エピソードや想いをつづろう...',
    collabReplyPlaceholder: '仲間の言葉に応えるあなたのメッセージをここに書き込もう...',
    collabSendingMission: 'クエスト送信中...',
    collabSendMissionBtn: '仲間にクエストを届ける (+50 XP)',
    collabSavingCollab: '保存中...',
    collabSealCompleteBtn: '封印してクエスト達成 (+100 XP)',
    collabMissionDone: 'クエスト達成 ✓',
    collabWaitingPartner: '仲間の書き込み待ち...',
    collabCheerTooltip: '勇気のエールを送る',
    collabAddFriendError: '仲間の追加に失敗しました。',
    collabCreateError: '共同クエストの作成に失敗しました。',
    collabReplyError: '共同日記の返信送信に失敗しました。',

    parentPortalHeading: '保護者ウェルネス・ポータル',
    parentPortalSubtitle: '子どもの秘密とプライバシーを100%守りながら、心の健康傾向をそっと見守る安心のシステムです。',
    tabAnalytics: '気分の推移＆分析',
    tabSharedPages: '共有された手紙・日記',
    emotionalTrendTitle: '過去30日間の気分の推移',
    earlyAlertTitle: '心のウェルネス早期検知システム',
    earlyAlertWarning: 'お知らせ：気分の落ち込みが数日連続で検知されました。温かい声かけや対話をおすすめします。',
    earlyAlertOk: 'お子さまの気分の表現は安定しており、健康な状態です。',
    sendEncouragingReply: '励ましのメッセージを送る',
    sendLoveStampBtn: '愛情スタンプを送る',
    quickReplySent: 'リアクションとお手紙をお子さまの魔導書に届けました！',
    parentPrivacyLockTitle: 'プライバシー・ロック常時稼働中（子どもの個人空間保護）',
    parentPrivacyLockSubtitle: 'Magic Journalは子どもの暗号化日記本文の閲覧をシステムレベルで厳密に遮断しています。',
    parentPrivacyLockDesc: '保護者の方には、相互の信頼関係を損ねることなく、日々の感情の推移、継続の様子、ストレスの早期サインのみが穏やかに共有されます。',
    parentLinkChildBtn: 'お子さまを結ぶ',
    parentPairingPlaceholder: 'ペアリングコード（例: SRH110）...',
    parentSharedNotesTitle: 'お子さまから届いた手紙＆オープン日記',
    parentSharedNotesSubtitle: 'お子さま自身が選んで共有してくれた心温まる記録です。愛情スタンプやお返事を届けましょう。',
    parentIncomingSharesCount: '{count} 通の手紙が到着',
    parentNoSharedNotesTitle: 'まだ届いた手紙はありません',
    parentNoSharedNotesDesc: 'お子さまが魔導書で「保護者に届ける」を押すと、ここに手紙や日記が届きます。温かいハグのスタンプやお返事を送ることができます。',
    parentVoluntarySharedBadge: '自発的に共有',
    parentScoreLabel: 'スコア {score}/5',
    parentChildNotePrefix: '{child} からのひと言:',
    parentReflectionPromptPrefix: '内省テーマ:',
    parentChildDoodleLabel: 'お子さまのお絵かき:',
    parentYourResponseSent: 'お返事をお届け済み:',
    parentSendReplyBtn: 'お返事を届ける',
    parentAlertTitle3Days: '見守りアラート：3日連続で気分の落ち込みを検知',
    parentAlertDesc3Days: '{child} さんの感情レベルが直近数日間低めの傾向を示しています。',
    parentSendEmailBtn: '見守りガイドをメールに送信',
    parentSupportAdviceTitle: '保護者のための温かな声かけのヒント:',
    parentAdvice1Title: '日記の内容を問い詰めないこと:',
    parentAdvice1Desc: '「日記に何を書いたの？」と尋ねることは、せっかくの信頼関係を損ねてしまいます。',
    parentAdvice2Title: '無条件の安心感と存在を伝える:',
    parentAdvice2Desc: '「話したくなったら、いつでもお母さん・お父さんが味方だよ。一緒にお散歩でも行こうか」',
    parentAdvice3Title: 'リラックスできる時間を作る:',
    parentAdvice3Desc: '軽い運動や好きなおやつの時間、穏やかな音楽を一緒に楽しむことが効果的です。',
    parentStatJournalsThisWeek: '今週の日記',
    parentStatStreak: '継続日数',
    parentStatAvgMood: '平均気分スコア',
    parentStatFavoriteTheme: 'お気に入りテーマ',
    parentTestAlertBtn: '3日間アラートの動作テスト',
    parentLegendGood: '好調・元気 (4-5)',
    parentLegendNeutral: '普通・穏やか (3)',
    parentLegendAlert: '疲れ・見守り推奨 (1-2)',
    parentLegendAxis: '横軸: 過去30日間',
    parentMoodDistributionTitle: '気分の全体分布',
    parentSelectChildPrompt: '上記でお子さまを選択すると分析が表示されます。',
    parentEmailModalTitle: '保護者向けメール通知シミュレーション',
    parentEmailToLabel: '宛先:',
    parentEmailSubjectLabel: '件名:',
    parentEmailBodyLabel: '見守りメッセージ本文:',
    parentEmailSentSuccess: '見守りメール通知を送信しました！',
    parentEmailCancel: 'キャンセル',
    parentEmailSendNow: '今すぐメールを送信',
    parentStampWarmHug: '🤗 温かいハグ',
    parentStampProud: '🌟 とても誇らしいよ',
    parentStampTough: '💪 乗り越える力があるよ',
    parentStampAlwaysHere: '🛡️ いつでも味方だよ',
    parentReplyPlaceholder: '{child} さんへの温かいメッセージを入力...',
    parentReplyDefault: 'いつもあなたの味方だよ！がんばっているね！',
    parentNoEntriesDay: '記録なし',

    cryptoInspectorTitle: '端末内暗号化インスペクター（AES-256-GCM）',
    cryptoInspectorSubtitle: 'ゼロ知識プライバシー：お子さまの端末（ブラウザ）上で暗号化されてから送信されます。',
    cryptoPrivacyGuaranteeTitle: '若者のための完全プライバシー保証',
    cryptoPrivacyGuaranteeDesc: 'サーバー管理者も、データベースも、保護者ポータルのアカウントも、この日記を読む暗号鍵を持ち得ません。秘密のPINを持つ本人のみ平文を閲覧できます。',
    cryptoCiphertextTitle: 'データベース保管データ（暗号文）',
    cryptoCopyCiphertext: '暗号文をコピー',
    cryptoCopied: 'コピー完了',
    cryptoAlgoLabel: '暗号化アルゴリズム',
    cryptoIvLabel: 'IV初期化ベクトル (Hex)',
    cryptoSaltLabel: 'KDFソルト (PBKDF2)',
    cryptoOriginalTitle: '暗号化前の平文（ブラウザメモリ内のみ存在）',
    cryptoHideOriginal: '隠す',
    cryptoShowOriginal: '表示する',
    cryptoSandboxTitle: '復号サンドボックスシミュレーション',
    cryptoSandboxDesc: '異なるパスコードを入力して、正しいPINなしでは絶対に復号できないことをテスト確認できます。',
    cryptoPinPlaceholder: '暗号化PIN / 秘密鍵を入力...',
    cryptoTestBtn: '復号テスト実行',
    cryptoKeyMatchSuccess: '鍵が一致しました！復号成功:',
    cryptoKeyMismatchFail: 'AES-256暗号化がデータを完全に保護しています。',
    cryptoCloseBtn: 'インスペクターを閉じる',

    auditTitle: '詳細操作履歴＆監査ログ',
    auditSubtitle: 'セキュリティ操作、暗号化サイクル、ログイン、日記作成、見守りアラートの記録。',
    auditRefreshBtn: 'ログを更新',
    auditFilterAll: 'すべての履歴',
    auditFilterSecurity: '暗号・セキュリティ',
    auditFilterAlert: '感情アラート',
    auditFilterJournal: '日記エントリ',
    auditFilterAuth: '認証関連',
    auditSearchPlaceholder: 'ユーザー名や操作内容で検索...',
    auditEmptyLogs: '条件に一致する操作ログはありません。',

    themeWizardDesc: '古びた羊皮紙、輝く魔法薬、知恵と内省の呪文。',
    themeWizardPalette: '色彩: 深紅＆黄金',
    themeWizardTypography: '書体: クラシック・セリフ',
    themeWizardPersona: 'ペルソナ: Sarrah（11歳）',
    themeDemonHunterDesc: '緑と黒の市松羽織、全集中の呼吸、困難を切り裂く刃。',
    themeDemonHunterPalette: '色彩: 市松の緑＆漆黒',
    themeDemonHunterMood: '気風: 呼吸法・鍛錬',
    themeDemonHunterPersona: 'ペルソナ: Sarrah（11歳）',

    doodleThickness: '線の太さ',
    doodleEraser: '消しゴム',
    doodleUndo: '元に戻す',
    doodleClear: '全消去',
    doodlePadWatermark: '冒険者のお絵かき帳 • スケッチ＆サイン',

    badgesModalTitle: '冒険者の栄誉バッジコレクション',
    badgesModalSubtitle: '日記の継続、自己対話の勇気、感情への気づきに応じてバッジが解禁されます。',
    unlockedBadge: '獲得済み',
    lockedBadge: '未獲得',
    xpTotal: '合計 XP',
    levelLabel: 'レベル',
    rankWizardTitle: '見習い魔法使い',
    rankHunterTitle: '癸（みずのと）の隊士',
    towardsNextLevel: '次のレベル {level} まであと ({xp}/250 XP)',

    journalArchiveTitle: '日記アーカイブ一覧',
    journalSearchPlaceholder: '質問や気分で検索...',
    scoreSuffix: 'スコア {score}/5',
    viewCryptoProof: '暗号データ・証明を見る',
    unlockedOnlyYou: '封印解除（あなただけに読めます）',
    emptyNotePlaceholder: '白紙の記録です。',
    privateDoodleLabel: '秘密の手書きスケッチ',
    lockedByClientCrypto: '端末内暗号化により封印中',
    unlockPinPlaceholder: '暗号化PIN...',
    unlockNoteBtn: '記録を開く',

    footerTagline: 'Magic Journal • 子どもと若者のためのAES-256完全暗号化デジタル魔導書',
    footerPrivacy: '完全プライバシー保護 • 許可なき平文閲覧0% • Firebase Firestore 連携',
  },
};

export const LOCALIZED_PROMPTS: Record<Language, { wizard: string[]; demonHunter: string[] }> = {
  id: {
    wizard: [
      'Mantra rahasia apa yang kamu pelajari tentang dirimu hari ini?',
      'Ramuan apa yang paling kamu butuhkan untuk menenangkan hatimu saat ini?',
      'Siapa sahabat di akademi yang membuat harimu terasa lebih ajaib?',
      'Jika kamu bisa mengubah satu momen hari ini dengan tongkat sihir, apa yang ingin kamu ubah?',
      'Pesan rahasia apa yang ingin kamu simpan di lemari buku terkunci untuk dirimu di masa depan?',
      'Hal kecil apa hari ini yang membuat hatimu berkilau seperti serbuk peri?',
      'Bagaimana caramu menjaga batas agar energi magismu tidak terkuras oleh orang lain?',
    ],
    demonHunter: [
      'Iblis kecil apa (rasa malas, takut, cemas) yang berhasil kamu tebas hari ini?',
      'Jurus ketahanan apa yang kamu pakai saat menghadapi situasi yang menyebalkan?',
      'Siapa kawan seperjuangan yang menemanimu melewati rintangan hari ini?',
      'Jika pedangmu mencatat satu pelajaran hari ini, apa kata yang terukir di bilahnya?',
      'Luka emosional apa yang butuh kamu rawat di Rumah Wisteria malam ini?',
      'Kekuatan apa yang baru kamu sadari bersemayam di dalam dadamu?',
      'Apa hal yang ingin kamu syukuri setelah seharian bertarung di dunia nyata?',
    ],
  },
  en: {
    wizard: [
      'What secret spell or insight did you discover about yourself today?',
      'What soothing elixir does your heart need most right now?',
      'Which academy companion made your day feel a little more magical?',
      'If you could enchant or transform one moment today with your wand, what would it be?',
      'What secret message do you want to lock away in your grimoire for your future self?',
      'What tiny moment today sparkled like enchanted fairy dust?',
      'How did you guard your magical mana from being drained by others today?',
    ],
    demonHunter: [
      'What inner demon (procrastination, fear, worry) did you successfully slay today?',
      'What form of mental breathing helped you endure through frustrating challenges?',
      'Which battle comrade stood beside you in overcoming today’s trials?',
      'If your Nichirin blade engraved one life lesson from today, what would it read?',
      'What emotional exhaustion needs resting at the safe Wisteria House tonight?',
      'What hidden strength did you realize is beating inside your chest?',
      'What are you genuinely grateful for after fighting bravely in the world today?',
    ],
  },
  ja: {
    wizard: [
      '今日、自分自身について学んだ秘密の魔法や気づきは何ですか？',
      '今、あなたの心を一番穏やかにするために必要な魔法の薬は何ですか？',
      '今日、あなたの一日を魔法のように輝かせてくれた学園の仲間は誰ですか？',
      'もし魔法の杖で今日の出来事をひとつ変えられるなら、何をどう変えたい？',
      '未来の自分に向けて、鍵付きの本棚にしまっておきたい秘密のメッセージは？',
      '今日のどんな小さな瞬間に、妖精の粉のような心のきらめきを感じましたか？',
      '自分の大切な魔力（エネルギー）をすり減らさないために、どう自分を守りましたか？',
    ],
    demonHunter: [
      '今日、見事に斬り伏せた心の鬼（なまけ心、不安、恐れ）は何ですか？',
      '思い通りにいかない時、どんな呼吸法（工夫や心の落ち着かせ方）で耐え抜きましたか？',
      '今日の厳しい鍛錬や試練を一緒に乗り越えてくれた戦友は誰ですか？',
      '日輪刀の刃に今日の一言を刻むとしたら、どんな文字を刻みますか？',
      '今夜、藤の家紋の屋敷でゆっくり癒やしたい心の疲れや傷は何ですか？',
      '自分の胸の奥に眠っていた、新しい強さや勇気に気づいた瞬間はありますか？',
      '現実世界で一日たたかい抜いたあと、心から感謝したいことは何ですか？',
    ],
  },
};

export const LOCALIZED_COLLAB_PROMPTS: Record<Language, string[]> = {
  id: [
    'Apa momen paling berkesan dalam petualanganmu minggu ini?',
    'Apa kemenangan terbesarmu atas rasa takut atau malas minggu ini?',
    'Jika kita bisa menjelajah dunia sihir/petualangan bersama, tempat apa yang ingin kita datangi?',
    'Apa hal yang paling kamu syukuri tentang persahabatan kita?',
    'Resep rahasia apa (makanan, hobi, atau kebiasaan) yang membuat harimu bahagia?',
    'Pesan semangat apa yang ingin kamu sampaikan untuk saling mendukung?',
  ],
  en: [
    'What was the most memorable moment in your adventures this week?',
    'What was your biggest victory over fear or procrastination this week?',
    'If we could explore a magical realm together, where would we go first?',
    'What are you most grateful for in our friendship?',
    'What secret recipe (hobby, food, or habit) always brings you joy?',
    'What encouraging message do you want to share with each other today?',
  ],
  ja: [
    '今週のあなたの冒険の中で、一番心に残った出来事は何ですか？',
    '今週、恐れやなまけ心に打ち勝った一番の勝利は何ですか？',
    'もし二人で不思議な魔法の世界を冒険できるなら、どこに行きたい？',
    '私たちの友情について、一番「ありがとう」と伝えたいことは何？',
    'あなたの毎日をご機嫌にしてくれる秘密のレシピ（趣味や習慣）は？',
    'お互いを応援するために、今届けたい温かいメッセージは何ですか？',
  ],
};

export interface LocalizedMood {
  score: number;
  name: string;
  label: string;
  description: string;
}

export const LOCALIZED_MOODS: Record<Language, { wizard: LocalizedMood[]; demonHunter: LocalizedMood[] }> = {
  id: {
    wizard: [
      { score: 5, name: 'Ramuan Cahaya Bintang', label: 'Luar Biasa / Bersemangat', description: 'Energi magis meluap-luap, hari penuh keajaiban dan tawa!' },
      { score: 4, name: 'Ramuan Keceriaan Emas', label: 'Baik / Senang', description: 'Mantra berjalan lancar, hati hangat dan penuh inspirasi.' },
      { score: 3, name: 'Seduhan Ketenangan Netral', label: 'Biasa / Cukup Tenang', description: 'Hari yang damai di perpustakaan kastil, tidak ada badai.' },
      { score: 2, name: 'Kabut Kebingungan', label: 'Cemas / Lelah', description: 'Pikiran agak berkabut, butuh waktu sendiri untuk memulihkan mana.' },
      { score: 1, name: 'Ramuan Bayangan Gulita', label: 'Sedih / Butuh Bantuan', description: 'Merasa terbebani dan sendirian, perlu pelindung dan curahan hati.' },
    ],
    demonHunter: [
      { score: 5, name: 'Pernapasan Matahari: Terik Semangat', label: 'Heroik / Sangat Tangguh', description: 'Pedang menyala, mengalahkan semua rintangan hari ini dengan gagah!' },
      { score: 4, name: 'Pernapasan Air: Aliran Tenang', label: 'Kuat / Fokus & Damai', description: 'Mengalir tenang menghadapi hari, pikiran jernih tanpa beban.' },
      { score: 3, name: 'Pernapasan Angin: Kestabilan', label: 'Biasa / Siaga Netral', description: 'Hari berlalu seperti desau angin, seimbang dan terkendali.' },
      { score: 2, name: 'Pernapasan Petir: Kilat Tegang', label: 'Gelisah / Kelelahan', description: 'Detak jantung terburu-buru, energi terkuras oleh tugas dan tekanan.' },
      { score: 1, name: 'Kabut Kelam: Pertahanan Jatuh', label: 'Terluka / Perlu Istirahat', description: 'Pedang tumpul dan hati lelah, butuh wisteria pelindung dan tempat aman.' },
    ],
  },
  en: {
    wizard: [
      { score: 5, name: 'Starlight Elixir', label: 'Thriving / Inspired', description: 'Magical energy overflowing, full of wonder and discovery!' },
      { score: 4, name: 'Golden Cheer Brew', label: 'Good / Happy', description: 'Spells working smoothly, warm heart and clear purpose.' },
      { score: 3, name: 'Chamomile Calm Infusion', label: 'Balanced / Peaceful', description: 'Quiet hours in the castle library, steady and centered.' },
      { score: 2, name: 'Fog of Uncertainty', label: 'Anxious / Fatigued', description: 'Hazy thoughts, needing quiet time to restore magical mana.' },
      { score: 1, name: 'Deep Shadow Draught', label: 'Down / In Need of Support', description: 'Heavy burdens, seeking warm companionship and sanctuary.' },
    ],
    demonHunter: [
      { score: 5, name: 'Sun Breathing: Blazing Spirit', label: 'Heroic / Determined', description: 'Blade aglow, overcoming every obstacle today with bravery!' },
      { score: 4, name: 'Water Breathing: Serene Current', label: 'Strong / Focused & Calm', description: 'Flowing gracefully past challenges with a clear mind.' },
      { score: 3, name: 'Wind Breathing: Steady Breeze', label: 'Balanced / Ready', description: 'Day passed like an even breeze, poised and composed.' },
      { score: 2, name: 'Thunder Breathing: Tense Flash', label: 'Restless / Worn Out', description: 'Rapid pulse, energy drained by heavy trials and pressure.' },
      { score: 1, name: 'Dark Mist: Guard Fallen', label: 'Weary / Seeking Refuge', description: 'Blade nicked, resting safely under the wisteria crest house.' },
    ],
  },
  ja: {
    wizard: [
      { score: 5, name: '星光のエリクサー', label: '絶好調・魔力全開', description: '魔力があふれ出し、発見と喜びに満ちた輝く一日！' },
      { score: 4, name: '黄金の陽気ポーション', label: '良好・前向き', description: '呪文も快調、心あたたかくひらめきに満ちています。' },
      { score: 3, name: 'カモミールの静穏茶', label: '普通・穏やか', description: '城の図書館で過ごすような、波風のない平穏な時間。' },
      { score: 2, name: '迷妄の霧のしずく', label: '不安・魔力不足', description: '頭の中が少し霧がかり、静かに魔力を回復したい気分。' },
      { score: 1, name: '深淵の影のエッセンス', label: '落ち込み・支えが必要', description: '重圧で心が疲弊し、安心できる居場所や対話を求めています。' },
    ],
    demonHunter: [
      { score: 5, name: '日の呼吸・赫灼の闘志', label: '勇猛果敢・絶好調', description: '日輪刀が赫く輝き、困難をすべて斬り伏せた一日！' },
      { score: 4, name: '水の呼吸・清廉なせせらぎ', label: '集中・明鏡止水', description: '水のように淀みなく、澄んだ心で試練を乗り越えました。' },
      { score: 3, name: '風の呼吸・平穏な風声', label: '平常心・油断なし', description: '吹き抜ける風のように、静かで安定した一日。' },
      { score: 2, name: '雷の呼吸・焦燥の迅雷', label: '焦り・疲労気味', description: '鼓動が乱れ、日々の重圧で気力が消耗しています。' },
      { score: 1, name: '深き霧・休戦の刻', label: '傷心・休息が必要', description: '刀も心も限界、藤の家紋の屋敷で静養が必要です。' },
    ],
  },
};

export const LOCALIZED_STICKERS: Record<Language, Record<string, string>> = {
  id: {
    wand: 'Tongkat Sihir',
    potion: 'Ramuan Berkilau',
    crystal: 'Bola Kristal',
    scroll: 'Gulungan Kuno',
    owl: 'Burung Hantu',
    feather: 'Bulu Phoenix',
    stars: 'Konstelasi',
    cauldron: 'Kuali Mantra',
    sword: 'Pedang Nichirin',
    mask: 'Topeng Rubah',
    fire: 'Api Semangat',
    water: 'Ombak Biru',
    flower: 'Bunga Wisteria',
    bamboo: 'Bambu Pelindung',
    shield: 'Segel Pelindung',
    onigiri: 'Bento Pemulihan',
  },
  en: {
    wand: 'Magic Wand',
    potion: 'Glowing Potion',
    crystal: 'Crystal Sphere',
    scroll: 'Ancient Scroll',
    owl: 'Sage Owl',
    feather: 'Phoenix Feather',
    stars: 'Constellation',
    cauldron: 'Spell Cauldron',
    sword: 'Nichirin Blade',
    mask: 'Fox Warding Mask',
    fire: 'Blazing Spirit',
    water: 'Azure Waves',
    flower: 'Wisteria Blossom',
    bamboo: 'Guardian Bamboo',
    shield: 'Warding Seal',
    onigiri: 'Restoration Bento',
  },
  ja: {
    wand: '魔法の杖',
    potion: '光る魔法薬',
    crystal: '水晶玉',
    scroll: '古代の巻物',
    owl: '賢者のフクロウ',
    feather: '不死鳥の羽',
    stars: '星座のきらめき',
    cauldron: '調合の大釜',
    sword: '日輪刀',
    mask: '厄除けの狐面',
    fire: '燃ゆる闘志',
    water: '清廉な波紋',
    flower: '藤の花',
    bamboo: '守護の竹筒',
    shield: '結界の護符',
    onigiri: '回復のおにぎり',
  },
};

export const LOCALIZED_BADGES: Record<
  Language,
  Record<string, { name: string; description: string }>
> = {
  id: {
    badge_first_entry: {
      name: 'Pena Pertama Terpatri',
      description: 'Menulis dan mengenkripsi jurnal pertamamu di Magic Journal.',
    },
    badge_streak_3: {
      name: 'Kobaran Api 3 Hari',
      description: 'Mencapai streak jurnal 3 hari berturut-turut tanpa jeda!',
    },
    badge_streak_7: {
      name: 'Mantra Abadi 7 Hari',
      description: 'Menjaga ritme refleksi diri selama seminggu penuh.',
    },
    badge_crypto_shield: {
      name: 'Segel Rahasia AES-256',
      description: 'Memverifikasi keamanan data dengan kunci enkripsi privat.',
    },
    badge_artist_doodle: {
      name: 'Goresan Imajinasi',
      description: 'Menyertakan doodle kreatif pada halaman jurnal pribadi.',
    },
    badge_master_emotions: {
      name: 'Penguasa Harmoni Hati',
      description: 'Mengenal dan mencatat 5 spektrum emosi berbeda secara jujur.',
    },
  },
  en: {
    badge_first_entry: {
      name: 'First Inscription Carved',
      description: 'Inscribed and encrypted your very first page in Magic Journal.',
    },
    badge_streak_3: {
      name: '3-Day Blazing Torch',
      description: 'Maintained a consecutive 3-day journaling streak!',
    },
    badge_streak_7: {
      name: '7-Day Eternal Incantation',
      description: 'Held the rhythm of mindful self-reflection for an entire week.',
    },
    badge_crypto_shield: {
      name: 'AES-256 Cryptographic Shield',
      description: 'Verified data security with your private client passkey.',
    },
    badge_artist_doodle: {
      name: 'Imagination Artisan',
      description: 'Included an expressive doodle sketch on your journal spread.',
    },
    badge_master_emotions: {
      name: 'Master of Emotional Harmony',
      description: 'Honored and logged all 5 distinct emotional spectrum states.',
    },
  },
  ja: {
    badge_first_entry: {
      name: '最初の一筆・刻印',
      description: '魔導書に初めての日記を暗号化して記録しました。',
    },
    badge_streak_3: {
      name: '三日連続の炎',
      description: '3日連続で日記を記録し、継続の炎を灯しました！',
    },
    badge_streak_7: {
      name: '七日間の不滅呪文',
      description: '丸一週間、自分の心と向き合う内省の習慣を守り抜きました。',
    },
    badge_crypto_shield: {
      name: 'AES-256 絶対守護の結界',
      description: '秘密の暗号鍵で自らのデータ保護を検証しました。',
    },
    badge_artist_doodle: {
      name: '想像力の絵師',
      description: '日記の見開きに手書きのスケッチを描き添えました。',
    },
    badge_master_emotions: {
      name: '心の調和の達人',
      description: '5つの異なる感情の波をありのままに認識・記録しました。',
    },
  },
};
