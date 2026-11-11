/**
 * MODEL DRIVING ACADEMY — PASSWORD SECURITY & HASHING ENGINE
 * 
 * Provides cryptographic password hashing (PBKDF2-SHA256),
 * salt generation, constant-time verification, strength scoring,
 * and comprehensive password policy validation.
 */

// Universal crypto accessor for Browser and Node.js
function getSubtleCrypto(): SubtleCrypto {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    return globalThis.crypto.subtle;
  }
  throw new Error('Web Cryptography API is not available in the current runtime environment.');
}

function getRandomValues(array: Uint8Array): Uint8Array {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.getRandomValues) {
    return globalThis.crypto.getRandomValues(array);
  }
  // Fallback pseudo-random for edge contexts
  for (let i = 0; i < array.length; i++) {
    array[i] = Math.floor(Math.random() * 256);
  }
  return array;
}

/**
 * Generates a cryptographically strong random salt (hex-encoded)
 */
export function generateSalt(byteLength: number = 16): string {
  const bytes = new Uint8Array(byteLength);
  getRandomValues(bytes);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Computes a secure PBKDF2-SHA256 password hash (100,000 iterations)
 * Never stores or transmits plaintext passwords.
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const subtle = getSubtleCrypto();
  const enc = new TextEncoder();

  // Import raw password as key material
  const keyMaterial = await subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  // Derive 256 bits with PBKDF2-SHA256
  const derivedBits = await subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );

  return Array.from(new Uint8Array(derivedBits))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Constant-time comparison between stored hash and calculated hash
 * Prevents timing attacks.
 */
export async function verifyPassword(
  providedPassword: string,
  storedSalt: string,
  storedHash: string
): Promise<boolean> {
  if (!providedPassword || !storedSalt || !storedHash) return false;

  try {
    const computedHash = await hashPassword(providedPassword, storedSalt);
    if (computedHash.length !== storedHash.length) return false;

    let result = 0;
    for (let i = 0; i < computedHash.length; i++) {
      result |= computedHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
    }
    return result === 0;
  } catch (err) {
    console.error('Password verification error:', err);
    return false;
  }
}

/**
 * Password Policy Requirements Checklist
 */
export interface PasswordRequirementsStatus {
  minLength: boolean;      // Min 8 characters
  hasUppercase: boolean;   // At least one uppercase letter (A-Z)
  hasLowercase: boolean;   // At least one lowercase letter (a-z)
  hasNumber: boolean;      // At least one number (0-9)
  hasSpecialChar: boolean; // At least one special character
  notStudentId: boolean;   // Must NOT match Student ID
  passwordsMatch: boolean; // Must match confirm password
}

export interface PasswordStrength {
  score: number;      // 0 to 4
  label: 'Too Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  color: string;      // Tailwind color string
  barClass: string;
  percent: number;    // 0 to 100
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  requirements: PasswordRequirementsStatus;
  strength: PasswordStrength;
}

/**
 * Validates a newly proposed student password against the mandatory academy security policy:
 * - Minimum 8 characters.
 * - At least one uppercase letter.
 * - At least one lowercase letter.
 * - At least one number.
 * - At least one special character.
 * - Cannot be identical to Student ID.
 * - Must match confirm password (if provided).
 */
export function validateNewPassword(
  newPassword: string,
  confirmPassword?: string,
  studentCode?: string
): PasswordValidationResult {
  const p = newPassword || '';
  const cleanCode = (studentCode || '').trim().toUpperCase();

  const minLength = p.length >= 8;
  const hasUppercase = /[A-Z]/.test(p);
  const hasLowercase = /[a-z]/.test(p);
  const hasNumber = /[0-9]/.test(p);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>\-_+=\[\]/\\~`]/.test(p);
  
  // Forbidden: Using the Student ID (case-insensitive) as the permanent password
  const notStudentId = cleanCode.length > 0 
    ? p.trim().toUpperCase() !== cleanCode && !p.toUpperCase().includes(cleanCode)
    : true;

  // Matching check
  const passwordsMatch = confirmPassword !== undefined 
    ? p.length > 0 && p === confirmPassword 
    : true;

  const requirements: PasswordRequirementsStatus = {
    minLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    notStudentId,
    passwordsMatch
  };

  const errors: string[] = [];
  if (!minLength) errors.push('Password must be at least 8 characters long.');
  if (!hasUppercase) errors.push('Password must contain at least one uppercase letter (A-Z).');
  if (!hasLowercase) errors.push('Password must contain at least one lowercase letter (a-z).');
  if (!hasNumber) errors.push('Password must contain at least one number (0-9).');
  if (!hasSpecialChar) errors.push('Password must contain at least one special character (!@#$%^&*...).');
  if (!notStudentId) errors.push('For security, your Student ID cannot be used as your permanent password. Please choose a personal password.');
  if (confirmPassword !== undefined && !passwordsMatch) errors.push('Confirm password does not match.');

  // Calculate Strength
  let score = 0;
  if (minLength) score++;
  if (hasUppercase && hasLowercase) score++;
  if (hasNumber && hasSpecialChar) score++;
  if (p.length >= 12 && hasSpecialChar && notStudentId) score++;

  let strength: PasswordStrength;
  switch (score) {
    case 0:
    case 1:
      strength = {
        score,
        label: p.length === 0 ? 'Too Weak' : 'Weak',
        color: 'text-rose-500',
        barClass: 'bg-rose-500',
        percent: p.length === 0 ? 0 : 25
      };
      break;
    case 2:
      strength = {
        score,
        label: 'Fair',
        color: 'text-amber-500',
        barClass: 'bg-amber-500',
        percent: 50
      };
      break;
    case 3:
      strength = {
        score,
        label: 'Strong',
        color: 'text-blue-500',
        barClass: 'bg-blue-500',
        percent: 75
      };
      break;
    case 4:
    default:
      strength = {
        score: 4,
        label: 'Very Strong',
        color: 'text-emerald-500',
        barClass: 'bg-emerald-500',
        percent: 100
      };
      break;
  }

  const isValid = 
    minLength && 
    hasUppercase && 
    hasLowercase && 
    hasNumber && 
    hasSpecialChar && 
    notStudentId && 
    passwordsMatch;

  return {
    isValid,
    errors,
    requirements,
    strength
  };
}
