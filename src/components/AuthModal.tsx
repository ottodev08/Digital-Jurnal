import React, { useState, useEffect } from 'react';
import {
  LogIn,
  UserPlus,
  Shield,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  Key,
  Mail,
  User as UserIcon,
  Sparkles,
  Sword,
  CheckCircle2,
} from 'lucide-react';
import { User, ThemeId, UserRole } from '../types';
import { validateEmail, checkPasswordStrength, setStoredToken, authFetch } from '../utils/auth';
import { useLanguage } from '../context/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, token: string) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const { language, t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Common credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration specific
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('child');
  const [age, setAge] = useState<number>(12);
  const [theme, setTheme] = useState<ThemeId>('wizard_academy');
  const [parentEmail, setParentEmail] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // Reset form when modal opens or mode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccessMsg(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // Real-time validations
  const emailValidation = validateEmail(email);
  const passwordStrength = checkPasswordStrength(password);
  const isPasswordMatch = password.length > 0 && password === confirmPassword;

  // 1-Click Quick Demo Login Handler
  const handleQuickLogin = async (userId: string) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await authFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        setStoredToken(data.token);
        setSuccessMsg(data.message || t('authLoginSuccess'));
        setTimeout(() => {
          onLoginSuccess(data.user, data.token);
          onClose();
        }, 500);
      } else {
        setError(data.error || t('authErrorDefault'));
      }
    } catch {
      setError(t('authErrorNetwork'));
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill demo credentials in the form
  const handlePrefillDemo = (demoEmail: string, demoName: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setName(demoName);
    setError(null);
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Client-side validations
    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) {
      setError(emailCheck.error || t('authErrorInvalidEmail'));
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError(t('authErrorNameRequired'));
        return;
      }

      if (passwordStrength.score < 3) {
        setError(
          language === 'ja'
            ? 'パスワードの強度が足りません。8文字以上、大文字・小文字・数字または記号を組み合わせましょう。'
            : language === 'en'
            ? 'Password is not strong enough. Ensure at least 8 characters with upper, lower, and numbers/symbols.'
            : 'Kata sandi belum cukup kuat. Pastikan minimal 8 karakter dengan huruf besar, huruf kecil, dan angka/simbol.'
        );
        return;
      }

      if (password !== confirmPassword) {
        setError(t('authErrorPasswordMismatch'));
        return;
      }
    } else {
      if (!password) {
        setError(
          language === 'ja'
            ? 'パスワードを入力してください。'
            : language === 'en'
            ? 'Password is required.'
            : 'Kata sandi harus diisi.'
        );
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload =
        mode === 'login'
          ? { email: email.trim(), password }
          : {
              name: name.trim(),
              email: email.trim(),
              password,
              role,
              age,
              theme,
              parentEmail: role === 'child' && parentEmail.trim() ? parentEmail.trim() : undefined,
            };

      const res = await authFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        setStoredToken(data.token);
        setSuccessMsg(data.message || (mode === 'login' ? t('authLoginSuccess') : t('authRegisterSuccess')));
        setTimeout(() => {
          onLoginSuccess(data.user, data.token);
          onClose();
        }, 600);
      } else {
        setError(data.error || t('authErrorDefault'));
      }
    } catch {
      setError(t('authErrorNetwork'));
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength.score >= 3) return t('authPasswordStrengthStrong');
    if (passwordStrength.score === 2) return t('authPasswordStrengthMedium');
    return t('authPasswordStrengthWeak');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Mode Switcher */}
        <div className="p-5 sm:p-6 bg-neutral-950/90 border-b border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>{mode === 'login' ? t('authLoginTitle') : t('authRegisterTitle')}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30 font-semibold">
                    JWT Auth
                  </span>
                </h3>
                <p className="text-[11px] text-neutral-400">
                  {mode === 'login' ? t('authLoginSubtitle') : t('authRegisterSubtitle')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-neutral-800 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Clean Segmented Tab Control */}
          <div className="grid grid-cols-2 p-1 bg-neutral-900 rounded-2xl border border-neutral-800">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'login'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('authTabLogin')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'register'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t('authTabRegister')}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-neutral-300">
          {/* Quick Demo Access Bar */}
          <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('authDemoTitle')}</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">{t('authDemoPasswordNote')}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('user_sarrah')}
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800/90 border border-neutral-700/60 text-left transition-all group flex flex-col justify-between cursor-pointer"
                title="1-Click Login Sarrah (11 Tahun - Anak)"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">🪄</span>
                    <span className="text-[8px] font-mono px-1 rounded bg-amber-950/80 text-amber-400">11 {t('authAgeUnit')}</span>
                  </div>
                  <div className="font-bold text-white text-[11px] mt-1 group-hover:text-amber-400 transition-colors">
                    Sarrah
                  </div>
                  <div className="text-[9px] text-neutral-400">Anak (11 Tahun)</div>
                </div>
                <span className="text-[8px] text-amber-400 mt-1 block">Jurnal Anak</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('user_fatiha')}
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800/90 border border-neutral-700/60 text-left transition-all group flex flex-col justify-between cursor-pointer"
                title="1-Click Login Fatiha (Orang Tua)"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">🛡️</span>
                    <span className="text-[8px] font-mono px-1 rounded bg-purple-950/80 text-purple-400">WALI</span>
                  </div>
                  <div className="font-bold text-white text-[11px] mt-1 group-hover:text-purple-400 transition-colors">
                    Fatiha
                  </div>
                  <div className="text-[9px] text-neutral-400">Orang Tua</div>
                </div>
                <span className="text-[8px] text-purple-400 mt-1 block">Parent Portal</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('user_superadmin')}
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-indigo-950/60 border border-indigo-700/50 text-left transition-all group flex flex-col justify-between cursor-pointer"
                title="1-Click Login Cahyadi (Super Admin)"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">👑</span>
                    <span className="text-[8px] font-mono px-1 rounded bg-indigo-950/90 text-indigo-300">ROOT</span>
                  </div>
                  <div className="font-bold text-white text-[11px] mt-1 group-hover:text-indigo-400 transition-colors">
                    Cahyadi
                  </div>
                  <div className="text-[9px] text-neutral-400">Super Admin</div>
                </div>
                <span className="text-[8px] text-indigo-400 mt-1 block">Admin Console</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-0.5 items-center">
            <div className="flex-grow border-t border-neutral-800"></div>
            <span className="flex-shrink mx-3 text-neutral-500 text-[10px] font-medium uppercase tracking-wider">
              {mode === 'login' ? t('authOrEmailPassword') : t('authOrRegisterForm')}
            </span>
            <div className="flex-grow border-t border-neutral-800"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Registration-only fields */}
            {mode === 'register' && (
              <>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-300 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{t('authNickname')}</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('authNicknamePlaceholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Role Switcher */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-300">
                    {t('authRole')} <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('child')}
                      className={`p-2.5 rounded-xl border text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        role === 'child'
                          ? 'border-amber-400 bg-amber-950/40 text-white font-bold'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span>🧒</span>
                      <span>{t('authRoleChild')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('parent')}
                      className={`p-2.5 rounded-xl border text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        role === 'parent'
                          ? 'border-amber-400 bg-amber-950/40 text-white font-bold'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span>👨‍👩‍👧</span>
                      <span>{t('authRoleParent')}</span>
                    </button>
                  </div>
                </div>

                {role === 'child' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-300">
                        {t('authAgeLabel')} ({t('authAgeUnit')})
                      </label>
                      <input
                        type="number"
                        min={6}
                        max={18}
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-neutral-300">{t('authThemeLabel')}</label>
                      <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value as ThemeId)}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                      >
                        <option value="wizard_academy">🪄 Wizard Academy</option>
                        <option value="demon_hunter">⚔️ Demon Hunter</option>
                      </select>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Email Field with Validation */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{t('authEmail')}</span>
                  <span className="text-red-400">*</span>
                </label>
                {emailTouched && email && (
                  <span
                    className={`text-[10px] flex items-center gap-1 font-medium ${
                      emailValidation.isValid ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {emailValidation.isValid ? (
                      <>
                        <Check className="w-3 h-3" /> {language === 'ja' ? '形式OK' : language === 'en' ? 'Valid Format' : 'Format Valid'}
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3" /> {language === 'ja' ? '形式が無効' : language === 'en' ? 'Invalid Format' : 'Format Tidak Sesuai'}
                      </>
                    )}
                  </span>
                )}
              </div>
              <input
                type="email"
                required
                placeholder={t('authEmailPlaceholder')}
                value={email}
                onBlur={() => setEmailTouched(true)}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                className={`w-full px-3.5 py-2.5 bg-neutral-950 border rounded-xl text-white text-xs placeholder-neutral-500 focus:outline-none transition-colors ${
                  emailTouched && email && !emailValidation.isValid
                    ? 'border-red-500 focus:border-red-400'
                    : 'border-neutral-700 focus:border-amber-500'
                }`}
              />
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-neutral-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{t('authPassword')}</span>
                  <span className="text-red-400">*</span>
                </label>
                {mode === 'register' && password && (
                  <span className="text-[10px] font-semibold text-neutral-300">
                    {getPasswordStrengthLabel()}
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={
                    mode === 'register'
                      ? t('authPasswordPlaceholderRegister')
                      : t('authPasswordPlaceholderLogin')
                  }
                  value={password}
                  onFocus={() => setPasswordTouched(true)}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full px-3.5 py-2.5 pr-10 bg-neutral-950 border border-neutral-700 rounded-xl text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter & Live Checklist (Registration only) */}
              {mode === 'register' && (
                <div className="pt-1.5 space-y-2">
                  {/* Strength segments bar */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          passwordStrength.score >= step
                            ? passwordStrength.color
                            : 'bg-neutral-800'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Criteria Checklist */}
                  <div className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800/80 grid grid-cols-2 gap-1.5 text-[10px]">
                    <div
                      className={`flex items-center gap-1.5 ${
                        passwordStrength.requirements.minLength
                          ? 'text-emerald-400 font-semibold'
                          : 'text-neutral-500'
                      }`}
                    >
                      {passwordStrength.requirements.minLength ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <span className="w-3 h-3 rounded-full border border-neutral-600 inline-block text-center text-[8px]">
                          &bull;
                        </span>
                      )}
                      <span>{language === 'ja' ? '8文字以上' : language === 'en' ? 'Min 8 Characters' : 'Minimal 8 Karakter'}</span>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 ${
                        passwordStrength.requirements.hasUppercase
                          ? 'text-emerald-400 font-semibold'
                          : 'text-neutral-500'
                      }`}
                    >
                      {passwordStrength.requirements.hasUppercase ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <span className="w-3 h-3 rounded-full border border-neutral-600 inline-block text-center text-[8px]">
                          &bull;
                        </span>
                      )}
                      <span>{language === 'ja' ? '大文字 (A-Z)' : language === 'en' ? 'Uppercase (A-Z)' : 'Huruf Besar (A-Z)'}</span>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 ${
                        passwordStrength.requirements.hasLowercase
                          ? 'text-emerald-400 font-semibold'
                          : 'text-neutral-500'
                      }`}
                    >
                      {passwordStrength.requirements.hasLowercase ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <span className="w-3 h-3 rounded-full border border-neutral-600 inline-block text-center text-[8px]">
                          &bull;
                        </span>
                      )}
                      <span>{language === 'ja' ? '小文字 (a-z)' : language === 'en' ? 'Lowercase (a-z)' : 'Huruf Kecil (a-z)'}</span>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 ${
                        passwordStrength.requirements.hasNumberOrSymbol
                          ? 'text-emerald-400 font-semibold'
                          : 'text-neutral-500'
                      }`}
                    >
                      {passwordStrength.requirements.hasNumberOrSymbol ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <span className="w-3 h-3 rounded-full border border-neutral-600 inline-block text-center text-[8px]">
                          &bull;
                        </span>
                      )}
                      <span>{language === 'ja' ? '数字または記号 (!@#)' : language === 'en' ? 'Number or Symbol (!@#)' : 'Angka atau Simbol (!@#)'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password (Registration only) */}
            {mode === 'register' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-neutral-300">
                    {t('authConfirmPassword')} <span className="text-red-400">*</span>
                  </label>
                  {confirmPassword && (
                    <span
                      className={`text-[10px] flex items-center gap-1 font-medium ${
                        isPasswordMatch ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {isPasswordMatch ? (
                        <>
                          <Check className="w-3 h-3" /> {t('authPasswordMatch')}
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3" /> {t('authPasswordMismatch')}
                        </>
                      )}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder={t('authConfirmPasswordPlaceholder')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-10 bg-neutral-950 border border-neutral-700 rounded-xl text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Parent Email linking (child registration only) */}
            {mode === 'register' && role === 'child' && (
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-300 flex items-center justify-between">
                  <span>{t('authParentEmailLabel')}</span>
                  <span className="text-[10px] text-neutral-500">{t('optionalNoteLabel')}</span>
                </label>
                <input
                  type="email"
                  placeholder={t('authParentEmailPlaceholder')}
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-white text-xs placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-neutral-500">
                  {t('authParentEmailNotice')}
                </p>
              </div>
            )}

            {/* Error Message Display */}
            {error && (
              <div className="p-3 bg-red-950/70 border border-red-800 rounded-2xl text-xs text-red-200 flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-red-300">
                    {language === 'ja' ? '認証エラー' : language === 'en' ? 'Authentication Error' : 'Autentikasi Gagal'}
                  </div>
                  <div className="text-[11px] text-red-200/90 mt-0.5">{error}</div>
                </div>
              </div>
            )}

            {/* Success Message Display */}
            {successMsg && (
              <div className="p-3 bg-emerald-950/70 border border-emerald-800 rounded-2xl text-xs text-emerald-200 flex items-center gap-2.5 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium">{successMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-2xl text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  <span>{t('authSubmitting')}</span>
                </div>
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{t('authSubmitLogin')}</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>{t('authSubmitRegister')}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Switch footer */}
          <div className="text-center pt-1 text-[11px] text-neutral-400">
            {mode === 'login' ? (
              <span>
                {language === 'ja' ? 'まだアカウントをお持ちでない方は ' : language === 'en' ? "Don't have a Magic Journal account? " : 'Belum memiliki akun Magic Journal? '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className="text-amber-400 hover:text-amber-300 font-bold underline underline-offset-4 cursor-pointer"
                >
                  {language === 'ja' ? '今すぐ無料登録' : language === 'en' ? 'Register Now' : 'Daftar Sekarang'}
                </button>
              </span>
            ) : (
              <span>
                {language === 'ja' ? 'すでに登録済みのアカウントをお持ちの方は ' : language === 'en' ? 'Already have an account? ' : 'Sudah memiliki akun terdaftar? '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="text-amber-400 hover:text-amber-300 font-bold underline underline-offset-4 cursor-pointer"
                >
                  {language === 'ja' ? 'ログインはこちら' : language === 'en' ? 'Sign In Here' : 'Masuk di Sini'}
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
