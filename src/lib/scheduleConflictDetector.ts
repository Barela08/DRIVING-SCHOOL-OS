import { ClassSchedule, TimeSlot, Enrollment } from '@/types';

export interface ConflictCheckParams {
  date: string; // 'YYYY-MM-DD'
  timeSlotId?: string;
  timeSlotLabel?: string;
  startTime?: string; // 'HH:mm'
  endTime?: string;   // 'HH:mm'
  instructorId: string;
  vehicleId?: string;
  studentId?: string;
  enrollmentId?: string;
  excludeScheduleId?: string;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflicts: {
    type: 'instructor_conflict' | 'vehicle_conflict' | 'student_conflict' | 'duplicate_booking' | 'capacity_violation';
    title: string;
    description: string;
    conflictingScheduleId?: string;
  }[];
}

/**
 * Checks whether two time intervals overlap on the same date
 */
export function doIntervalsOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const timeAStart = new Date(startA).getTime();
  const timeAEnd = new Date(endA).getTime();
  const timeBStart = new Date(startB).getTime();
  const timeBEnd = new Date(endB).getTime();

  return timeAStart < timeBEnd && timeAEnd > timeBStart;
}

/**
 * Robust conflict detector preventing overbooking, dual-control vehicle overlaps,
 * and double-booking for instructors or students.
 */
export function checkScheduleConflicts(
  params: ConflictCheckParams,
  schedules: ClassSchedule[],
  timeSlots: TimeSlot[],
  enrollments: Enrollment[]
): ConflictCheckResult {
  const conflicts: ConflictCheckResult['conflicts'] = [];
  const activeSchedules = schedules.filter(
    s => s.status !== 'Cancelled' && s.id !== params.excludeScheduleId
  );

  // Determine target time interval
  let targetStartIso: string;
  let targetEndIso: string;

  if (params.timeSlotId) {
    const slot = timeSlots.find(ts => ts.id === params.timeSlotId);
    if (slot) {
      targetStartIso = `${params.date}T${slot.start_time}:00+05:30`;
      targetEndIso = `${params.date}T${slot.end_time}:00+05:30`;
    } else {
      targetStartIso = `${params.date}T07:00:00+05:30`;
      targetEndIso = `${params.date}T08:00:00+05:30`;
    }
  } else if (params.startTime && params.endTime) {
    targetStartIso = `${params.date}T${params.startTime}:00+05:30`;
    targetEndIso = `${params.date}T${params.endTime}:00+05:30`;
  } else {
    targetStartIso = `${params.date}T07:00:00+05:30`;
    targetEndIso = `${params.date}T08:00:00+05:30`;
  }

  // 1. Instructor Time Conflict Check
  const instructorClash = activeSchedules.find(s => {
    if (s.instructor_id !== params.instructorId) return false;
    return doIntervalsOverlap(s.scheduled_start, s.scheduled_end, targetStartIso, targetEndIso);
  });

  if (instructorClash) {
    conflicts.push({
      type: 'instructor_conflict',
      title: 'Instructor Schedule Clash Detected',
      description: `Instructor is already assigned to conduct a session for ${instructorClash.student_name} (${instructorClash.student_code}) during this time window.`,
      conflictingScheduleId: instructorClash.id
    });
  }

  // 2. Vehicle Time Conflict Check (Dual-control fleet overlap)
  if (params.vehicleId) {
    const vehicleClash = activeSchedules.find(s => {
      if (!s.vehicle_id || s.vehicle_id !== params.vehicleId) return false;
      return doIntervalsOverlap(s.scheduled_start, s.scheduled_end, targetStartIso, targetEndIso);
    });

    if (vehicleClash) {
      conflicts.push({
        type: 'vehicle_conflict',
        title: 'Vehicle Fleet Conflict Detected',
        description: `Training vehicle is already in active dual-control practical usage by student ${vehicleClash.student_name} at this time.`,
        conflictingScheduleId: vehicleClash.id
      });
    }
  }

  // 3. Student Overlapping Schedule / Duplicate Booking Check
  if (params.enrollmentId) {
    const studentClash = activeSchedules.find(s => {
      if (s.enrollment_id !== params.enrollmentId) return false;
      return doIntervalsOverlap(s.scheduled_start, s.scheduled_end, targetStartIso, targetEndIso);
    });

    if (studentClash) {
      conflicts.push({
        type: 'student_conflict',
        title: 'Duplicate Student Class Time',
        description: `This student already has a confirmed session booked for "${studentClash.topic || 'Driving Class'}" during this slot.`,
        conflictingScheduleId: studentClash.id
      });
    }
  }

  // 4. Time Slot Capacity Limit Check
  if (params.timeSlotId) {
    const slot = timeSlots.find(ts => ts.id === params.timeSlotId);
    if (slot && slot.max_capacity > 0) {
      const bookedInSlotCount = activeSchedules.filter(s => {
        const slotMatches = s.time_slot_id === params.timeSlotId || (
          s.time_slot_label && slot.slot_label && s.time_slot_label === slot.slot_label
        );
        const dateMatches = s.scheduled_start.startsWith(params.date);
        return slotMatches && dateMatches;
      }).length;

      if (bookedInSlotCount >= slot.max_capacity) {
        conflicts.push({
          type: 'capacity_violation',
          title: 'Slot Capacity Reached',
          description: `Time slot "${slot.slot_label}" is at maximum capacity (${bookedInSlotCount}/${slot.max_capacity} students). Additional bookings risk overloading driving ground balance.`,
        });
      }
    }
  }

  return {
    hasConflict: conflicts.length > 0,
    conflicts
  };
}
