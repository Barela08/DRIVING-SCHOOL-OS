// =====================================================================
// DRIVING SCHOOL OS — LEARNING LICENCE TRACKING & REMINDER ENGINE
// =====================================================================

import { 
  Student, 
  Enrollment, 
  AttendanceRecord, 
  LicenceRecord, 
  LLReminderSettings, 
  StudentLLProgress, 
  StudentDocument,
  Course,
  LicenceStatus 
} from '@/types';

export const DEFAULT_LL_REMINDER_SETTINGS: LLReminderSettings = {
  enabled: true,
  required_attended_days: 10,
  min_completed_sessions: 10,
  frequency: 'every_7_days',
  notify_owner: true,
  notify_student: true,
  approaching_threshold_days: 2
};

export const OFFICIAL_PARIVAHAN_URL = 'https://sarathi.parivahan.gov.in/';

/**
 * Calculates distinct attended class days and practical session counts.
 * NOTE: Multiple sessions on the same calendar date count as ONE attended class day.
 * Only verified attendance records with status === 'Present' are counted.
 */
export function calculateAttendedClassDays(
  studentId: string, 
  attendanceRecords: AttendanceRecord[]
): {
  distinctDaysCount: number;
  completedSessionsCount: number;
  distinctDates: string[];
  firstAttendedDate?: string;
  mostRecentAttendedDate?: string;
} {
  const presentRecords = attendanceRecords.filter(
    r => r.student_id === studentId && r.status === 'Present'
  );

  const distinctDatesSet = new Set<string>();
  presentRecords.forEach(r => {
    if (r.attendance_date) {
      distinctDatesSet.add(r.attendance_date);
    }
  });

  const sortedDates = Array.from(distinctDatesSet).sort();

  return {
    distinctDaysCount: sortedDates.length,
    completedSessionsCount: presentRecords.length,
    distinctDates: sortedDates,
    firstAttendedDate: sortedDates[0],
    mostRecentAttendedDate: sortedDates[sortedDates.length - 1]
  };
}

/**
 * Checks age and government criteria for Sarathi RTO Learner Licence.
 */
export function checkGovernmentEligibilityRules(
  student: Student, 
  course?: Course
): {
  isAgeEligible: boolean;
  ageYears: number;
  minAgeRequired: number;
  categoryName: string;
  parivahanUrl: string;
  disclaimer: string;
  prerequisites: string[];
} {
  let ageYears = 18; // default fallback
  if (student.date_of_birth) {
    const dob = new Date(student.date_of_birth);
    const now = new Date();
    ageYears = now.getFullYear() - dob.getFullYear();
    const monthDiff = now.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
      ageYears--;
    }
  }

  // Determine category and minimum age
  const courseCategory = course?.category || '4W';
  let minAgeRequired = 18;
  let categoryName = 'LMV (Light Motor Vehicle)';

  if (courseCategory === 'Commercial') {
    minAgeRequired = 20;
    categoryName = 'Commercial / Transport Vehicle';
  } else if (courseCategory === '2W') {
    minAgeRequired = 18; // standard MCWG is 18; 50cc without gear is 16
    categoryName = 'MCWG (Motorcycle with Gear)';
  } else if (courseCategory === 'Combo') {
    minAgeRequired = 18;
    categoryName = 'MCWG + LMV (Motorcycle & Car Combo)';
  }

  const isAgeEligible = ageYears >= minAgeRequired;

  return {
    isAgeEligible,
    ageYears,
    minAgeRequired,
    categoryName,
    parivahanUrl: OFFICIAL_PARIVAHAN_URL,
    disclaimer: 'The driving school class-day tracking threshold is an internal preparatory reminder and does NOT replace statutory government rules. Final Learner Licence issuance requires official application on Sarathi Parivahan, fee clearance, Form 1A compliance, and passing the official RTO computerised learner test.',
    prerequisites: [
      `Minimum age requirement: ${minAgeRequired} years (Current age: ${ageYears} years)`,
      'Valid Government Photo ID & Address Proof (Aadhaar card recommended for OTP e-KYC)',
      'Self-declaration of physical fitness (Form 1) or Medical Certificate (Form 1A) if required',
      'Recent passport-size photographs',
      'Payment of government statutory application and test fees on Parivahan portal',
      'Completion of online or in-person RTO traffic regulations learner test'
    ]
  };
}

/**
 * Checks if a reminder can be dispatched according to the Owner-configured frequency
 * without sending duplicate reminders on every page refresh.
 */
export function shouldDispatchReminder(
  licenceRecord: LicenceRecord | undefined,
  settings: LLReminderSettings
): boolean {
  if (!settings.enabled) return false;

  // If student already has valid LL or is approved, do not send
  if (
    licenceRecord?.has_existing_ll || 
    licenceRecord?.ll_status === 'Already Available' ||
    licenceRecord?.ll_status === 'Approved' ||
    licenceRecord?.ll_status === 'LL Approved' ||
    licenceRecord?.ll_status === 'Licence Issued'
  ) {
    return false;
  }

  // If reminder has never been sent, send it
  if (!licenceRecord?.last_reminder_sent_date || !licenceRecord?.reminder_count) {
    return true;
  }

  // Frequency check
  if (settings.frequency === 'once') {
    return false;
  }

  const lastSent = new Date(licenceRecord.last_reminder_sent_date).getTime();
  const now = Date.now();
  const diffDays = (now - lastSent) / (1000 * 60 * 60 * 24);

  if (settings.frequency === 'every_3_days' && diffDays >= 3) return true;
  if (settings.frequency === 'every_7_days' && diffDays >= 7) return true;
  if (settings.frequency === 'every_14_days' && diffDays >= 14) return true;

  return false;
}

/**
 * Generates an aggregated progress and reminder state object for any student.
 */
export function getStudentLLProgress(
  student: Student,
  enrollment: Enrollment | undefined,
  attendanceRecords: AttendanceRecord[],
  licenceRecord: LicenceRecord | undefined,
  settings: LLReminderSettings = DEFAULT_LL_REMINDER_SETTINGS,
  studentDocuments: StudentDocument[] = []
): StudentLLProgress {
  const { 
    distinctDaysCount, 
    completedSessionsCount, 
    firstAttendedDate, 
    mostRecentAttendedDate 
  } = calculateAttendedClassDays(student.id, attendanceRecords);

  const totalAllocatedSessions = enrollment?.total_sessions || 20;
  const courseProgressPercent = Math.min(100, Math.round((completedSessionsCount / totalAllocatedSessions) * 100));

  const hasExistingLL = Boolean(
    student.has_existing_ll || 
    licenceRecord?.has_existing_ll || 
    licenceRecord?.ll_status === 'Already Available'
  );

  const llStatus: LicenceStatus = licenceRecord?.ll_status || (hasExistingLL ? 'Already Available' : 'Not Applied');

  // Check uploaded LL document
  const uploadedDoc = studentDocuments.find(
    d => d.student_id === student.id && (d.document_type === 'Learner_Licence' || d.document_name.toLowerCase().includes('ll'))
  );
  const documentUploaded = Boolean(uploadedDoc || licenceRecord?.ll_document_url);
  const documentVerified = Boolean(uploadedDoc?.verification_status === 'Verified' || licenceRecord?.ll_document_verified);

  // Check validity and expiry
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  let isLLValid = false;
  let isLLExpired = false;
  let isLLExpiringSoon = false;

  const validTill = licenceRecord?.ll_valid_till;
  if (validTill) {
    if (validTill < todayStr) {
      isLLExpired = true;
      isLLValid = false;
    } else {
      isLLValid = true;
      const expiryDate = new Date(validTill);
      const daysLeft = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      if (daysLeft <= 30) {
        isLLExpiringSoon = true;
      }
    }
  } else if (hasExistingLL || llStatus === 'Approved' || llStatus === 'LL Approved' || llStatus === 'Licence Issued') {
    isLLValid = true;
  }

  // Threshold rules
  const requiredDays = settings.required_attended_days;
  const minSessions = settings.min_completed_sessions || 0;
  const daysToThreshold = Math.max(0, requiredDays - distinctDaysCount);

  const reachedThreshold = distinctDaysCount >= requiredDays && completedSessionsCount >= minSessions;
  const isApproachingThreshold = 
    !reachedThreshold && 
    distinctDaysCount >= (requiredDays - settings.approaching_threshold_days) &&
    !hasExistingLL &&
    llStatus === 'Not Applied';

  // Eligibility for reminder
  const isEligibleForReminder = 
    reachedThreshold && 
    !hasExistingLL && 
    (llStatus === 'Not Applied' || llStatus === 'Reminder Sent') &&
    enrollment?.status !== 'Cancelled' && 
    enrollment?.status !== 'On_Hold';

  const canSendReminder = isEligibleForReminder && shouldDispatchReminder(licenceRecord, settings);

  // Status badge calculation
  let statusBadge = {
    label: 'Not Applied',
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-100 dark:bg-slate-800',
    border: 'border-slate-300 dark:border-slate-700'
  };

  if (hasExistingLL || llStatus === 'Already Available') {
    if (isLLExpired) {
      statusBadge = {
        label: 'LL Expired',
        color: 'text-rose-600 dark:text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30'
      };
    } else if (isLLExpiringSoon) {
      statusBadge = {
        label: 'LL Expiring Soon',
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30'
      };
    } else {
      statusBadge = {
        label: 'Already Available',
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30'
      };
    }
  } else if (llStatus === 'Approved' || llStatus === 'LL Approved' || llStatus === 'Licence Issued') {
    statusBadge = {
      label: 'LL Approved',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30'
    };
  } else if (llStatus === 'Test Scheduled' || llStatus === 'LL Test Scheduled') {
    statusBadge = {
      label: 'Test Scheduled',
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30'
    };
  } else if (llStatus === 'Application Submitted') {
    statusBadge = {
      label: 'Application Submitted',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30'
    };
  } else if (llStatus === 'Application Started') {
    statusBadge = {
      label: 'Application Started',
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/30'
    };
  } else if (llStatus === 'Document Uploaded') {
    statusBadge = {
      label: 'Document Uploaded',
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/30'
    };
  } else if (llStatus === 'Reminder Sent') {
    statusBadge = {
      label: 'Reminder Sent',
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/30'
    };
  } else if (llStatus === 'Rejected') {
    statusBadge = {
      label: 'Application Rejected',
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30'
    };
  } else if (isEligibleForReminder) {
    statusBadge = {
      label: `Eligible (${distinctDaysCount}/${requiredDays} Days)`,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30'
    };
  } else if (isApproachingThreshold) {
    statusBadge = {
      label: `Approaching (${distinctDaysCount}/${requiredDays} Days)`,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30'
    };
  } else {
    statusBadge = {
      label: `Tracking (${distinctDaysCount}/${requiredDays} Days)`,
      color: 'text-slate-600 dark:text-slate-400',
      bg: 'bg-slate-100 dark:bg-slate-800',
      border: 'border-slate-300 dark:border-slate-700'
    };
  }

  return {
    studentId: student.id,
    studentCode: student.student_code,
    studentName: student.full_name,
    mobileNumber: student.phone,
    instructorName: student.assigned_instructor_name || enrollment?.assigned_instructor_name || 'Unassigned',
    courseName: student.enrolled_course_name || enrollment?.course_name || 'Driving Course',
    admissionDate: student.admission_date,
    totalAttendedClassDays: distinctDaysCount,
    completedPracticalSessions: completedSessionsCount,
    totalAllocatedSessions,
    firstAttendedClassDate: firstAttendedDate,
    mostRecentAttendedClassDate: mostRecentAttendedDate,
    courseProgressPercent,
    hasExistingLL,
    llStatus,
    llNumber: licenceRecord?.licence_number || student.ll_number,
    llIssueDate: licenceRecord?.ll_issue_date,
    llExpiryDate: licenceRecord?.ll_valid_till,
    llVehicleCategory: licenceRecord?.licence_type,
    applicationNumber: licenceRecord?.application_number || licenceRecord?.ll_reference,
    applicationDate: licenceRecord?.ll_application_date,
    testDate: licenceRecord?.test_date,
    approvalDate: licenceRecord?.approval_date,
    documentUploaded,
    documentVerified,
    documentUrl: licenceRecord?.ll_document_url || uploadedDoc?.file_url,
    documentName: licenceRecord?.ll_document_name || uploadedDoc?.document_name,
    isEligibleForReminder,
    isApproachingThreshold,
    daysToThreshold,
    reminderSentDate: licenceRecord?.last_reminder_sent_date,
    reminderCount: licenceRecord?.reminder_count || 0,
    canSendReminder,
    isLLValid,
    isLLExpired,
    isLLExpiringSoon,
    statusBadge
  };
}
