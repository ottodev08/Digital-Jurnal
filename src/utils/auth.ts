import { PasswordStrengthResult } from '../types';

export const JWT_STORAGE_KEY = 'magic_journal_jwt_token';

/**
 * Validates email format according to standard email RFC patterns
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Email wajib diisi.' };
  }
  // Standard email format check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Format email tidak valid. Gunakan format seperti nama@domain.com',
    };
  }
  return { isValid: true };
}

/**
 * Evaluates password strength based on length, cases, and numbers/symbols
 */
export function checkPasswordStrength(password: string): PasswordStrengthResult {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  let score = 0;
  if (minLength) score++;
  if (hasUppercase) score++;
  if (hasLowercase) score++;
  if (hasNumberOrSymbol) score++;

  let label: PasswordStrengthResult['label'] = 'Sangat Lemah';
  let color = 'bg-red-500';

  if (!password) {
    score = 0;
    label = 'Sangat Lemah';
    color = 'bg-neutral-700';
  } else if (score === 1) {
    label = 'Lemah';
    color = 'bg-red-500';
  } else if (score === 2) {
    label = 'Cukup';
    color = 'bg-amber-500';
  } else if (score === 3) {
    label = 'Kuat';
    color = 'bg-blue-400';
  } else if (score === 4) {
    label = 'Sangat Kuat';
    color = 'bg-emerald-400';
  }

  return {
    score,
    label,
    color,
    requirements: {
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumberOrSymbol,
    },
  };
}

/**
 * Retrieves the stored JWT token from localStorage
 */
export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(JWT_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Saves the JWT token to localStorage
 */
export function setStoredToken(token: string): void {
  try {
    localStorage.setItem(JWT_STORAGE_KEY, token);
  } catch (err) {
    console.error('Failed to save JWT token', err);
  }
}

/**
 * Removes the stored JWT token
 */
export function clearStoredToken(): void {
  try {
    localStorage.removeItem(JWT_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to remove JWT token', err);
  }
}

/**
 * Fetch wrapper that attaches the Bearer JWT token automatically,
 * retries once on transient HTML gateway responses during server restart,
 * and ensures response.json() never throws SyntaxError on non-JSON payloads.
 */
export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const token = getStoredToken();
  const headers = new Headers(init.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Set default JSON Content-Type if body is string and header not present
  if (
    typeof init.body === 'string' &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  let response = await fetch(input, {
    ...init,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const urlStr = typeof input === 'string' ? input : input.toString();

  // If an /api/* request hits a transient proxy HTML page during server reload, retry once
  if (
    urlStr.includes('/api/') &&
    (response.status >= 502 || contentType.includes('text/html'))
  ) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    try {
      response = await fetch(input, {
        ...init,
        headers,
      });
    } catch {
      // Keep original response if retry fails
    }
  }

  // Wrap response.json() so it never throws "Unexpected token '<', \"<html><hea\"... is not valid JSON"
  response.json = async () => {
    try {
      const text = await response.text();
      if (!text) return {};
      const trimmed = text.trim();
      if (trimmed.startsWith('<')) {
        return { error: 'Server sedang memuat ulang, silakan coba sesaat lagi.' };
      }
      return JSON.parse(trimmed);
    } catch {
      return { error: 'Respons server bukan format JSON yang valid.' };
    }
  };

  return response;
}

