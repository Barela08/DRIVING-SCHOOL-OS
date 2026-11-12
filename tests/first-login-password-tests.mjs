// ============================================================================
// MODEL DRIVING ACADEMY — AUTOMATIC STUDENT ID PASSWORD & FIRST LOGIN TESTS
// ============================================================================

import assert from 'node:assert';
import crypto from 'node:crypto';

// Polyfill Web Crypto API if running in older node, though Node 18+ has crypto.webcrypto
const webCrypto = globalThis.crypto || crypto.webcrypto;

// Password Security Utility Functions (Mirroring src/lib/passwordSecurity.ts)
function generateSalt(length = 16) {
  const bytes = new Uint8Array(length);
  webCrypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const passwordKey = await webCrypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedBits = await webCrypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: 'SHA-256'
    },
    passwordKey,
    256
  );

  return Array.from(new Uint8Array(derivedBits))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifyPassword(inputPassword, salt, storedHash) {
  const computedHash = await hashPassword(inputPassword, salt);
  if (computedHash.length !== storedHash.length) return false;
  let diff = 0;
  for (let i = 0; i < computedHash.length; i++) {
    diff |= computedHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
  }
  return diff === 0;
}

function calculatePasswordStrength(password) {
  let score = 0;
  if (!password) return { score: 0, label: 'Empty', color: 'text-slate-400' };

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)) score++;

  if (score <= 2) return { score: 1, label: 'Weak', color: 'text-rose-500' };
  if (score <= 4) return { score: 2, label: 'Moderate', color: 'text-amber-500' };
  if (score <= 5) return { score: 3, label: 'Strong', color: 'text-blue-500' };
  return { score: 4, label: 'Very Strong', color: 'text-emerald-500' };
}

function validateNewPassword(newPassword, confirmPassword, studentId) {
  const errors = [];
  const pwd = newPassword || '';
  const confirm = confirmPassword || '';
  const cleanStudentId = (studentId || '').trim().toUpperCase();

  const rules = {
    minLength: pwd.length >= 8,
    hasUppercase: /[A-Z]/.test(pwd),
    hasLowercase: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(pwd),
    notStudentId: cleanStudentId.length > 0 ? pwd.toUpperCase() !== cleanStudentId : true,
    passwordsMatch: pwd.length > 0 && confirm.length > 0 && pwd === confirm
  };

  if (!rules.minLength) errors.push('Password must be at least 8 characters long.');
  if (!rules.hasUppercase) errors.push('Password must contain at least one uppercase letter (A-Z).');
  if (!rules.hasLowercase) errors.push('Password must contain at least one lowercase letter (a-z).');
  if (!rules.hasNumber) errors.push('Password must contain at least one numeric digit (0-9).');
  if (!rules.hasSpecial) errors.push('Password must contain at least one special character (e.g. !@#$%^&*).');
  if (!rules.notStudentId) errors.push('Your permanent password cannot be identical to your Student ID.');
  if (!rules.passwordsMatch) errors.push('Password and Confirm Password fields do not match.');

  return {
    isValid: errors.length === 0,
    errors,
    rules,
    strength: calculatePasswordStrength(pwd)
  };
}

console.log('------------------------------------------------------------');
console.log('RUNNING MODEL DRIVING ACADEMY FIRST-LOGIN SECURITY TEST SUITE');
console.log('------------------------------------------------------------\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  [PASS] Test ${totalTests}: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] Test ${totalTests}: ${name}`);
    console.error(`         ${err.message}`);
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  [PASS] Test ${totalTests}: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] Test ${totalTests}: ${name}`);
    console.error(`         ${err.message}`);
  }
}

// 1. Password policy tests
runTest('Reject password shorter than 8 characters', () => {
  const res = validateNewPassword('Ab1!', 'Ab1!', 'MDA-2026-00125');
  assert.strictEqual(res.isValid, false);
  assert.ok(res.errors.some(e => e.includes('8 characters')));
});

runTest('Reject password missing uppercase character', () => {
  const res = validateNewPassword('driving@2026', 'driving@2026', 'MDA-2026-00125');
  assert.strictEqual(res.isValid, false);
  assert.ok(res.errors.some(e => e.includes('uppercase letter')));
});

runTest('Reject password missing lowercase character', () => {
  const res = validateNewPassword('DRIVING@2026', 'DRIVING@2026', 'MDA-2026-00125');
  assert.strictEqual(res.isValid, false);
  assert.ok(res.errors.some(e => e.includes('lowercase letter')));
});

runTest('Reject password missing numeric digit', () => {
  const res = validateNewPassword('Driving@Academy', 'Driving@Academy', 'MDA-2026-00125');
  assert.strictEqual(res.isValid, false);
  assert.ok(res.errors.some(e => e.includes('numeric digit')));
});

runTest('Reject password missing special character', () => {
  const res = validateNewPassword('Driving2026', 'Driving2026', 'MDA-2026-00125');
  assert.strictEqual(res.isValid, false);
  assert.ok(res.errors.some(e => e.includes('special character')));
});

runTest('CRITICAL: Reject permanent password identical to Student ID', () => {
  const res = validateNewPassword('MDA-2026-00125', 'MDA-2026-00125', 'MDA-2026-00125');
  assert.strictEqual(res.isValid, false);
  assert.ok(res.errors.some(e => e.includes('cannot be identical to your Student ID')));
});

runTest('Reject mismatched password and confirmation', () => {
  const res = validateNewPassword('Driving@2026', 'Driving@2027', 'MDA-2026-00125');
  assert.strictEqual(res.isValid, false);
  assert.ok(res.errors.some(e => e.includes('do not match')));
});

runTest('Accept strong compliant permanent password', () => {
  const res = validateNewPassword('Driving@2026', 'Driving@2026', 'MDA-2026-00125');
  assert.strictEqual(res.isValid, true);
  assert.strictEqual(res.errors.length, 0);
  assert.ok(res.strength.score >= 3);
});

// 2. Cryptographic PBKDF2-SHA256 tests
await runAsyncTest('Salt generation produces unique random hex strings', async () => {
  const salt1 = generateSalt();
  const salt2 = generateSalt();
  assert.strictEqual(salt1.length, 32);
  assert.strictEqual(salt2.length, 32);
  assert.notStrictEqual(salt1, salt2);
});

await runAsyncTest('PBKDF2-SHA256 hashing correctly verifies matching passwords', async () => {
  const salt = generateSalt();
  const hash = await hashPassword('Driving@2026', salt);
  const isMatch = await verifyPassword('Driving@2026', salt, hash);
  assert.strictEqual(isMatch, true);
});

await runAsyncTest('PBKDF2-SHA256 hashing rejects incorrect passwords', async () => {
  const salt = generateSalt();
  const hash = await hashPassword('Driving@2026', salt);
  const isMatch = await verifyPassword('WrongPassword123!', salt, hash);
  assert.strictEqual(isMatch, false);
});

// 3. Complete First-Time Login Simulation
await runAsyncTest('Full Lifecycle: Admission -> 1st Login -> Change Password -> Invalidation of Temp ID', async () => {
  // Step 1: Admission - Student created with initial password = Student ID
  const student = {
    id: 'stud-mda-125',
    student_code: 'MDA-2026-00125',
    full_name: 'Kavita Desai',
    account_status: 'FIRST_LOGIN_PASSWORD_CHANGE_REQUIRED',
    first_login_completed: false,
    must_change_password: true,
    is_temporary_password: true,
    account_enabled: true
  };

  const initialSalt = generateSalt();
  let storedHash = await hashPassword(student.student_code, initialSalt);
  let storedSalt = initialSalt;
  let isTemporary = true;

  // Step 2: First-time login with Student ID as password
  const firstLoginInput = 'MDA-2026-00125';
  const firstLoginMatch = await verifyPassword(firstLoginInput, storedSalt, storedHash);
  assert.strictEqual(firstLoginMatch, true);

  // Must redirect to password setup, not dashboard
  const requiresPasswordSetup = Boolean(
    student.must_change_password ||
    student.first_login_completed === false ||
    student.account_status === 'FIRST_LOGIN_PASSWORD_CHANGE_REQUIRED'
  );
  assert.strictEqual(requiresPasswordSetup, true);

  // Step 3: Password setup
  const newPass = 'Kavita@Driving2026';
  const validation = validateNewPassword(newPass, newPass, student.student_code);
  assert.strictEqual(validation.isValid, true);

  // Update credentials
  storedSalt = generateSalt();
  storedHash = await hashPassword(newPass, storedSalt);
  isTemporary = false;
  student.account_status = 'ACTIVE';
  student.first_login_completed = true;
  student.must_change_password = false;
  student.is_temporary_password = false;
  student.password_changed_at = new Date().toISOString();

  // Step 4: Subsequent login with original Student ID as password MUST FAIL
  const canLoginWithOldId = isTemporary 
    ? (firstLoginInput.toUpperCase() === student.student_code.toUpperCase()) 
    : await verifyPassword(firstLoginInput, storedSalt, storedHash);
  assert.strictEqual(canLoginWithOldId, false, 'Initial Student ID must no longer be accepted as password');

  // Step 5: Subsequent login with permanent password SUCCEEDS
  const permanentLoginMatch = await verifyPassword(newPass, storedSalt, storedHash);
  assert.strictEqual(permanentLoginMatch, true);
  assert.strictEqual(student.first_login_completed, true);
  assert.strictEqual(student.account_status, 'ACTIVE');

  // Step 6: Staff reset restores temporary status
  student.account_status = 'FIRST_LOGIN_PASSWORD_CHANGE_REQUIRED';
  student.first_login_completed = false;
  student.must_change_password = true;
  student.is_temporary_password = true;
  storedSalt = generateSalt();
  storedHash = await hashPassword(student.student_code, storedSalt);
  isTemporary = true;

  // Now Student ID works again as temporary password and forces setup
  const postResetMatch = await verifyPassword(student.student_code, storedSalt, storedHash);
  assert.strictEqual(postResetMatch, true);
  assert.strictEqual(student.account_status, 'FIRST_LOGIN_PASSWORD_CHANGE_REQUIRED');
});

console.log('\n------------------------------------------------------------');
console.log(`TEST SUITE SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('------------------------------------------------------------\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
