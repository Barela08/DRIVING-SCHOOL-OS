import { 
  School, 
  Branch, 
  Course, 
  Vehicle, 
  Instructor, 
  Student, 
  Enrollment, 
  AttendanceRecord, 
  Payment, 
  PaymentReceipt, 
  LicenceRecord, 
  ClassSchedule, 
  AuditLog 
} from '@/types';

export const mockSchool: School = {
  id: 'school-apex-001',
  name: 'Apex Motor Driving School',
  slug: 'apex-driving-school',
  contact_phone: '+91 98220 99887',
  contact_email: 'admin@apexdriving.in',
  address: {
    street: 'Plot 42, Near RTO Circle, MG Road',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001'
  },
  logo_url: '/logo.svg',
  tagline: 'Govt. RTO Authorized Driving Institute & Licensing Specialist',
  rto_registration_no: 'MH-12/MDS/2018/042',
  timezone: 'Asia/Kolkata',
  currency: 'INR',
  created_at: '2024-01-01T00:00:00Z'
};

export const mockBranches: Branch[] = [
  {
    id: 'branch-camp',
    school_id: 'school-apex-001',
    name: 'Camp Head Office & Test Track',
    code: 'CMP',
    phone: '+91 98220 99887',
    is_active: true
  },
  {
    id: 'branch-kothrud',
    school_id: 'school-apex-001',
    name: 'Kothrud Branch & Simulator Hub',
    code: 'KTD',
    phone: '+91 98220 99888',
    is_active: true
  }
];

export const mockVehicles: Vehicle[] = [
  {
    id: 'veh-swift-01',
    school_id: 'school-apex-001',
    registration_number: 'MH-12-AB-1234',
    vehicle_type: '4W_Manual',
    brand: 'Maruti Suzuki',
    model: 'Swift Dzire (Dual Control)',
    fuel_type: 'Petrol',
    is_dual_control: true,
    assigned_instructor_id: 'ins-vikram-01',
    assigned_instructor_name: 'Vikram Shinde',
    insurance_expiry: '2027-05-15',
    puc_expiry: '2026-12-20',
    fitness_expiry: '2028-08-30',
    status: 'Assigned'
  },
  {
    id: 'veh-i10-02',
    school_id: 'school-apex-001',
    registration_number: 'MH-12-CD-5678',
    vehicle_type: '4W_Manual',
    brand: 'Hyundai',
    model: 'Grand i10 Nios (Dual Control)',
    fuel_type: 'Petrol',
    is_dual_control: true,
    assigned_instructor_id: 'ins-suresh-02',
    assigned_instructor_name: 'Suresh Patil',
    insurance_expiry: '2027-03-10',
    puc_expiry: '2026-11-28',
    fitness_expiry: '2028-04-12',
    status: 'Assigned'
  },
  {
    id: 'veh-nexon-03',
    school_id: 'school-apex-001',
    registration_number: 'MH-12-GH-3456',
    vehicle_type: '4W_Automatic',
    brand: 'Tata',
    model: 'Nexon EV Dual Pedal',
    fuel_type: 'Electric',
    is_dual_control: true,
    insurance_expiry: '2027-09-01',
    puc_expiry: '2027-09-01',
    fitness_expiry: '2029-01-15',
    status: 'Available'
  },
  {
    id: 'veh-activa-04',
    school_id: 'school-apex-001',
    registration_number: 'MH-12-EF-9012',
    vehicle_type: '2W',
    brand: 'Honda',
    model: 'Activa 6G (Non-Geared)',
    fuel_type: 'Petrol',
    is_dual_control: false,
    insurance_expiry: '2026-12-15',
    puc_expiry: '2026-11-30',
    status: 'Available'
  }
];

export const mockCourses: Course[] = [
  {
    id: 'course-4w-complete',
    school_id: 'school-apex-001',
    name: 'Four Wheeler Complete Mastery Course',
    description: 'Comprehensive 20-session curriculum designed for complete beginners to become confident highway & city drivers, including RTO test clearance.',
    category: '4W',
    duration_days: 30,
    price: 8500,
    is_active: true,
    templates: [
      { id: 't1', course_id: 'course-4w-complete', session_name: 'Basic Vehicle Controls & Cockpit Drill', session_code: 'BASIC_CTRL', total_sessions: 2, sort_order: 1 },
      { id: 't2', course_id: 'course-4w-complete', session_name: 'Clutch, Gear & Steering Coordination', session_code: 'CLUTCH_GEAR', total_sessions: 3, sort_order: 2 },
      { id: 't3', course_id: 'course-4w-complete', session_name: 'Straight Road & Lane Discipline', session_code: 'ROAD_DRIVE', total_sessions: 3, sort_order: 3 },
      { id: 't4', course_id: 'course-4w-complete', session_name: 'Dense Traffic & Junction Negotiation', session_code: 'TRAFFIC_DRIVE', total_sessions: 3, sort_order: 4 },
      { id: 't5', course_id: 'course-4w-complete', session_name: 'Reverse Driving & S-Track Navigation', session_code: 'REVERSE_DRIVE', total_sessions: 2, sort_order: 5 },
      { id: 't6', course_id: 'course-4w-complete', session_name: 'Perpendicular & Box Parking', session_code: 'BOX_PARK', total_sessions: 2, sort_order: 6 },
      { id: 't7', course_id: 'course-4w-complete', session_name: 'Parallel Parking Between Vehicles', session_code: 'PARALLEL_PARK', total_sessions: 1, sort_order: 7 },
      { id: 't8', course_id: 'course-4w-complete', session_name: 'Hill Start & Half-Clutch Slope Balance', session_code: 'HILL_DRIVE', total_sessions: 2, sort_order: 8 },
      { id: 't9', course_id: 'course-4w-complete', session_name: 'Highway Speed & Overtaking Protocol', session_code: 'HIGHWAY_DRIVE', total_sessions: 1, sort_order: 9 },
      { id: 't10', course_id: 'course-4w-complete', session_name: 'Practical RTO Track Mock Test & Signage', session_code: 'RTO_MOCK', total_sessions: 1, sort_order: 10 }
    ]
  },
  {
    id: 'course-2w-expert',
    school_id: 'school-apex-001',
    name: 'Two Wheeler Professional Riding (10 Sessions)',
    description: 'Balance, slow-speed maneuvering, emergency braking, and RTO 8-track test training.',
    category: '2W',
    duration_days: 15,
    price: 3500,
    is_active: true,
    templates: [
      { id: 't20', course_id: 'course-2w-expert', session_name: 'Balance & Low Speed Maneuvers', session_code: '2W_BALANCE', total_sessions: 3, sort_order: 1 },
      { id: 't21', course_id: 'course-2w-expert', session_name: 'City Road & Traffic Handling', session_code: '2W_TRAFFIC', total_sessions: 3, sort_order: 2 },
      { id: 't22', course_id: 'course-2w-expert', session_name: 'Emergency Braking & Turn Indicators', session_code: '2W_BRAKE', total_sessions: 2, sort_order: 3 },
      { id: 't23', course_id: 'course-2w-expert', session_name: 'RTO 8-Track Mock Test Preparation', session_code: '2W_8TRACK', total_sessions: 2, sort_order: 4 }
    ]
  },
  {
    id: 'course-combo-executive',
    school_id: 'school-apex-001',
    name: 'Executive Combo 4W + 2W Comprehensive (25 Sessions)',
    description: 'Master both Car (LMV) and Scooter/Motorcycle (MCWG) with full RTO documentation and doorstep pickup.',
    category: 'Combo',
    duration_days: 45,
    price: 11000,
    is_active: true
  }
];

export const mockInstructors: Instructor[] = [
  {
    id: 'ins-vikram-01',
    school_id: 'school-apex-001',
    user_id: 'usr-ins-vikram',
    instructor_code: 'INS-2026-01',
    full_name: 'Vikram Shinde',
    phone: '+91 98220 12345',
    email: 'vikram.instructor@apexdriving.in',
    licence_number: 'MH-12-2008-0044192',
    experience_years: 12,
    employment_status: 'active',
    assigned_vehicle_id: 'veh-swift-01',
    assigned_vehicle_name: 'Maruti Swift Dzire (MH-12-AB-1234)',
    active_students_count: 8,
    today_sessions_count: 5
  },
  {
    id: 'ins-suresh-02',
    school_id: 'school-apex-001',
    user_id: 'usr-ins-suresh',
    instructor_code: 'INS-2026-02',
    full_name: 'Suresh Patil',
    phone: '+91 98220 67890',
    email: 'suresh.patil@apexdriving.in',
    licence_number: 'MH-12-2012-0091823',
    experience_years: 8,
    employment_status: 'active',
    assigned_vehicle_id: 'veh-i10-02',
    assigned_vehicle_name: 'Hyundai Grand i10 (MH-12-CD-5678)',
    active_students_count: 6,
    today_sessions_count: 4
  }
];

export const mockStudents: Student[] = [
  {
    id: 'stud-rahul-01',
    school_id: 'school-apex-001',
    student_code: 'DS-2026-00101',
    full_name: 'Rahul Sharma',
    phone: '+91 98900 11223',
    email: 'rahul.sharma@gmail.com',
    date_of_birth: '1998-07-14',
    gender: 'Male',
    blood_group: 'O+',
    address: {
      area: 'Viman Nagar, Lane 4',
      city: 'Pune',
      pincode: '411014'
    },
    emergency_contact: {
      name: 'Sunil Sharma',
      relation: 'Father',
      phone: '+91 98900 99887'
    },
    admission_date: '2026-10-05',
    status: 'Active',
    assigned_instructor_id: 'ins-vikram-01',
    assigned_instructor_name: 'Vikram Shinde',
    enrolled_course_id: 'course-4w-complete',
    enrolled_course_name: 'Four Wheeler Complete Mastery Course',
    created_at: '2026-10-05T09:30:00Z'
  },
  {
    id: 'stud-priya-02',
    school_id: 'school-apex-001',
    student_code: 'DS-2026-00102',
    full_name: 'Priya Kulkarni',
    phone: '+91 98900 22334',
    email: 'priya.kulkarni@techcorp.com',
    date_of_birth: '2001-03-22',
    gender: 'Female',
    blood_group: 'B+',
    address: {
      area: 'Mayur Colony, Kothrud',
      city: 'Pune',
      pincode: '411038'
    },
    emergency_contact: {
      name: 'Anjali Kulkarni',
      relation: 'Mother',
      phone: '+91 98900 88776'
    },
    admission_date: '2026-10-20',
    status: 'Active',
    assigned_instructor_id: 'ins-vikram-01',
    assigned_instructor_name: 'Vikram Shinde',
    enrolled_course_id: 'course-4w-complete',
    enrolled_course_name: 'Four Wheeler Complete Mastery Course',
    created_at: '2026-10-20T11:00:00Z'
  },
  {
    id: 'stud-amit-03',
    school_id: 'school-apex-001',
    student_code: 'DS-2026-00103',
    full_name: 'Amit Deshmukh',
    phone: '+91 98900 33445',
    email: 'amit.deshmukh@yahoo.in',
    date_of_birth: '1995-11-19',
    gender: 'Male',
    blood_group: 'A+',
    address: {
      area: 'Shivajinagar, FC Road',
      city: 'Pune',
      pincode: '411005'
    },
    admission_date: '2026-09-15',
    status: 'Active',
    assigned_instructor_id: 'ins-suresh-02',
    assigned_instructor_name: 'Suresh Patil',
    enrolled_course_id: 'course-combo-executive',
    enrolled_course_name: 'Executive Combo 4W + 2W Comprehensive (25 Sessions)',
    created_at: '2026-09-15T14:15:00Z'
  },
  {
    id: 'stud-neha-04',
    school_id: 'school-apex-001',
    student_code: 'DS-2026-00104',
    full_name: 'Neha Joshi',
    phone: '+91 98900 44556',
    email: 'neha.j@outlook.com',
    date_of_birth: '2003-08-09',
    gender: 'Female',
    blood_group: 'AB+',
    address: {
      area: 'Aundh, DP Road',
      city: 'Pune',
      pincode: '411007'
    },
    admission_date: '2026-10-18',
    status: 'Active',
    assigned_instructor_id: 'ins-suresh-02',
    assigned_instructor_name: 'Suresh Patil',
    enrolled_course_id: 'course-2w-expert',
    enrolled_course_name: 'Two Wheeler Professional Riding (10 Sessions)',
    created_at: '2026-10-18T16:00:00Z'
  },
  {
    id: 'stud-rohit-05',
    school_id: 'school-apex-001',
    student_code: 'DS-2026-00105',
    full_name: 'Rohit Mane',
    phone: '+91 98900 55667',
    admission_date: '2026-11-08',
    status: 'Registered',
    enrolled_course_id: 'course-4w-complete',
    enrolled_course_name: 'Four Wheeler Complete Mastery Course',
    created_at: '2026-11-08T10:00:00Z'
  }
];

export const mockEnrollments: Enrollment[] = [
  {
    id: 'enr-rahul-01',
    school_id: 'school-apex-001',
    student_id: 'stud-rahul-01',
    student_code: 'DS-2026-00101',
    student_name: 'Rahul Sharma',
    course_id: 'course-4w-complete',
    course_name: 'Four Wheeler Complete Mastery Course',
    branch_id: 'branch-camp',
    assigned_instructor_id: 'ins-vikram-01',
    assigned_instructor_name: 'Vikram Shinde',
    assigned_vehicle_id: 'veh-swift-01',
    vehicle_registration: 'MH-12-AB-1234',
    start_date: '2026-10-06',
    expected_end_date: '2026-11-15',
    agreed_fee: 8500,
    status: 'Active',
    total_sessions: 20,
    completed_sessions: 13,
    session_allocations: [
      { id: 'sa-r1', enrollment_id: 'enr-rahul-01', session_template_id: 't1', session_name_snapshot: 'Basic Vehicle Controls & Cockpit Drill', allocated_count: 2, completed_count: 2, sort_order: 1 },
      { id: 'sa-r2', enrollment_id: 'enr-rahul-01', session_template_id: 't2', session_name_snapshot: 'Clutch, Gear & Steering Coordination', allocated_count: 3, completed_count: 3, sort_order: 2 },
      { id: 'sa-r3', enrollment_id: 'enr-rahul-01', session_template_id: 't3', session_name_snapshot: 'Straight Road & Lane Discipline', allocated_count: 3, completed_count: 3, sort_order: 3 },
      { id: 'sa-r4', enrollment_id: 'enr-rahul-01', session_template_id: 't4', session_name_snapshot: 'Dense Traffic & Junction Negotiation', allocated_count: 3, completed_count: 2, sort_order: 4 },
      { id: 'sa-r5', enrollment_id: 'enr-rahul-01', session_template_id: 't5', session_name_snapshot: 'Reverse Driving & S-Track Navigation', allocated_count: 2, completed_count: 1, sort_order: 5 },
      { id: 'sa-r6', enrollment_id: 'enr-rahul-01', session_template_id: 't6', session_name_snapshot: 'Perpendicular & Box Parking', allocated_count: 2, completed_count: 1, sort_order: 6 },
      { id: 'sa-r7', enrollment_id: 'enr-rahul-01', session_template_id: 't7', session_name_snapshot: 'Parallel Parking Between Vehicles', allocated_count: 1, completed_count: 0, sort_order: 7 },
      { id: 'sa-r8', enrollment_id: 'enr-rahul-01', session_template_id: 't8', session_name_snapshot: 'Hill Start & Half-Clutch Slope Balance', allocated_count: 2, completed_count: 1, sort_order: 8 },
      { id: 'sa-r9', enrollment_id: 'enr-rahul-01', session_template_id: 't9', session_name_snapshot: 'Highway Speed & Overtaking Protocol', allocated_count: 1, completed_count: 0, sort_order: 9 },
      { id: 'sa-r10', enrollment_id: 'enr-rahul-01', session_template_id: 't10', session_name_snapshot: 'Practical RTO Track Mock Test & Signage', allocated_count: 1, completed_count: 0, sort_order: 10 }
    ]
  },
  {
    id: 'enr-priya-02',
    school_id: 'school-apex-001',
    student_id: 'stud-priya-02',
    student_code: 'DS-2026-00102',
    student_name: 'Priya Kulkarni',
    course_id: 'course-4w-complete',
    course_name: 'Four Wheeler Complete Mastery Course',
    branch_id: 'branch-camp',
    assigned_instructor_id: 'ins-vikram-01',
    assigned_instructor_name: 'Vikram Shinde',
    assigned_vehicle_id: 'veh-swift-01',
    vehicle_registration: 'MH-12-AB-1234',
    start_date: '2026-10-21',
    expected_end_date: '2026-11-25',
    agreed_fee: 8500,
    status: 'Active',
    total_sessions: 20,
    completed_sessions: 4,
    session_allocations: [
      { id: 'sa-p1', enrollment_id: 'enr-priya-02', session_template_id: 't1', session_name_snapshot: 'Basic Vehicle Controls & Cockpit Drill', allocated_count: 2, completed_count: 2, sort_order: 1 },
      { id: 'sa-p2', enrollment_id: 'enr-priya-02', session_template_id: 't2', session_name_snapshot: 'Clutch, Gear & Steering Coordination', allocated_count: 3, completed_count: 2, sort_order: 2 },
      { id: 'sa-p3', enrollment_id: 'enr-priya-02', session_template_id: 't3', session_name_snapshot: 'Straight Road & Lane Discipline', allocated_count: 3, completed_count: 0, sort_order: 3 },
      { id: 'sa-p4', enrollment_id: 'enr-priya-02', session_template_id: 't4', session_name_snapshot: 'Dense Traffic & Junction Negotiation', allocated_count: 3, completed_count: 0, sort_order: 4 },
      { id: 'sa-p5', enrollment_id: 'enr-priya-02', session_template_id: 't5', session_name_snapshot: 'Reverse Driving & S-Track Navigation', allocated_count: 2, completed_count: 0, sort_order: 5 },
      { id: 'sa-p6', enrollment_id: 'enr-priya-02', session_template_id: 't6', session_name_snapshot: 'Perpendicular & Box Parking', allocated_count: 2, completed_count: 0, sort_order: 6 },
      { id: 'sa-p7', enrollment_id: 'enr-priya-02', session_template_id: 't7', session_name_snapshot: 'Parallel Parking Between Vehicles', allocated_count: 1, completed_count: 0, sort_order: 7 },
      { id: 'sa-p8', enrollment_id: 'enr-priya-02', session_template_id: 't8', session_name_snapshot: 'Hill Start & Half-Clutch Slope Balance', allocated_count: 2, completed_count: 0, sort_order: 8 },
      { id: 'sa-p9', enrollment_id: 'enr-priya-02', session_template_id: 't9', session_name_snapshot: 'Highway Speed & Overtaking Protocol', allocated_count: 1, completed_count: 0, sort_order: 9 },
      { id: 'sa-p10', enrollment_id: 'enr-priya-02', session_template_id: 't10', session_name_snapshot: 'Practical RTO Track Mock Test & Signage', allocated_count: 1, completed_count: 0, sort_order: 10 }
    ]
  },
  {
    id: 'enr-amit-03',
    school_id: 'school-apex-001',
    student_id: 'stud-amit-03',
    student_code: 'DS-2026-00103',
    student_name: 'Amit Deshmukh',
    course_id: 'course-combo-executive',
    course_name: 'Executive Combo 4W + 2W Comprehensive (25 Sessions)',
    branch_id: 'branch-camp',
    assigned_instructor_id: 'ins-suresh-02',
    assigned_instructor_name: 'Suresh Patil',
    assigned_vehicle_id: 'veh-i10-02',
    vehicle_registration: 'MH-12-CD-5678',
    start_date: '2026-09-16',
    expected_end_date: '2026-10-30',
    agreed_fee: 11000,
    status: 'Completed',
    total_sessions: 25,
    completed_sessions: 25,
    session_allocations: [
      { id: 'sa-a1', enrollment_id: 'enr-amit-03', session_template_id: 't1', session_name_snapshot: 'Basic Vehicle Controls & Cockpit Drill', allocated_count: 3, completed_count: 3, sort_order: 1 },
      { id: 'sa-a2', enrollment_id: 'enr-amit-03', session_template_id: 't2', session_name_snapshot: 'Clutch, Gear & Steering Coordination', allocated_count: 4, completed_count: 4, sort_order: 2 },
      { id: 'sa-a3', enrollment_id: 'enr-amit-03', session_template_id: 't3', session_name_snapshot: 'Straight Road & Lane Discipline', allocated_count: 4, completed_count: 4, sort_order: 3 },
      { id: 'sa-a4', enrollment_id: 'enr-amit-03', session_template_id: 't4', session_name_snapshot: 'Dense Traffic & Junction Negotiation', allocated_count: 4, completed_count: 4, sort_order: 4 },
      { id: 'sa-a5', enrollment_id: 'enr-amit-03', session_template_id: 't5', session_name_snapshot: 'Reverse Driving & S-Track Navigation', allocated_count: 3, completed_count: 3, sort_order: 5 },
      { id: 'sa-a6', enrollment_id: 'enr-amit-03', session_template_id: 't6', session_name_snapshot: 'Perpendicular & Box Parking', allocated_count: 3, completed_count: 3, sort_order: 6 },
      { id: 'sa-a7', enrollment_id: 'enr-amit-03', session_template_id: 't7', session_name_snapshot: 'Parallel Parking & Hill Starts', allocated_count: 2, completed_count: 2, sort_order: 7 },
      { id: 'sa-a8', enrollment_id: 'enr-amit-03', session_template_id: 't8', session_name_snapshot: 'Two-Wheeler Balance & 8-Track Test Prep', allocated_count: 2, completed_count: 2, sort_order: 8 }
    ]
  },
  {
    id: 'enr-neha-04',
    school_id: 'school-apex-001',
    student_id: 'stud-neha-04',
    student_code: 'DS-2026-00104',
    student_name: 'Neha Joshi',
    course_id: 'course-2w-expert',
    course_name: 'Two Wheeler Professional Riding (10 Sessions)',
    branch_id: 'branch-kothrud',
    assigned_instructor_id: 'ins-suresh-02',
    assigned_instructor_name: 'Suresh Patil',
    assigned_vehicle_id: 'veh-activa-04',
    vehicle_registration: 'MH-12-EF-9012',
    start_date: '2026-10-19',
    expected_end_date: '2026-11-05',
    agreed_fee: 3500,
    status: 'Active',
    total_sessions: 10,
    completed_sessions: 8,
    session_allocations: [
      { id: 'sa-n1', enrollment_id: 'enr-neha-04', session_template_id: 't20', session_name_snapshot: 'Balance & Low Speed Maneuvers', allocated_count: 3, completed_count: 3, sort_order: 1 },
      { id: 'sa-n2', enrollment_id: 'enr-neha-04', session_template_id: 't21', session_name_snapshot: 'City Road & Traffic Handling', allocated_count: 3, completed_count: 3, sort_order: 2 },
      { id: 'sa-n3', enrollment_id: 'enr-neha-04', session_template_id: 't22', session_name_snapshot: 'Emergency Braking & Turn Indicators', allocated_count: 2, completed_count: 2, sort_order: 3 },
      { id: 'sa-n4', enrollment_id: 'enr-neha-04', session_template_id: 't23', session_name_snapshot: 'RTO 8-Track Mock Test Preparation', allocated_count: 2, completed_count: 0, sort_order: 4 }
    ]
  },
  {
    id: 'enr-rohit-05',
    school_id: 'school-apex-001',
    student_id: 'stud-rohit-05',
    student_code: 'DS-2026-00105',
    student_name: 'Rohit Mane',
    course_id: 'course-4w-complete',
    course_name: 'Four Wheeler Complete Mastery Course',
    branch_id: 'branch-camp',
    assigned_instructor_id: 'ins-vikram-01',
    assigned_instructor_name: 'Vikram Shinde',
    assigned_vehicle_id: 'veh-swift-01',
    vehicle_registration: 'MH-12-AB-1234',
    start_date: '2026-11-12',
    expected_end_date: '2026-12-15',
    agreed_fee: 8500,
    status: 'Pending',
    total_sessions: 20,
    completed_sessions: 0,
    session_allocations: [
      { id: 'sa-rm1', enrollment_id: 'enr-rohit-05', session_template_id: 't1', session_name_snapshot: 'Basic Vehicle Controls & Cockpit Drill', allocated_count: 2, completed_count: 0, sort_order: 1 },
      { id: 'sa-rm2', enrollment_id: 'enr-rohit-05', session_template_id: 't2', session_name_snapshot: 'Clutch, Gear & Steering Coordination', allocated_count: 3, completed_count: 0, sort_order: 2 }
    ]
  }
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'att-101',
    school_id: 'school-apex-001',
    enrollment_id: 'enr-rahul-01',
    student_id: 'stud-rahul-01',
    student_code: 'DS-2026-00101',
    student_name: 'Rahul Sharma',
    instructor_id: 'ins-vikram-01',
    instructor_name: 'Vikram Shinde',
    session_allocation_id: 'sa-r8',
    session_name: 'Hill Start & Half-Clutch Slope Balance',
    vehicle_id: 'veh-swift-01',
    vehicle_info: 'Swift Dzire (MH-12-AB-1234)',
    attendance_date: '2026-11-09',
    marked_at: '2026-11-09T08:45:00+05:30',
    status: 'Present',
    remarks: 'Good clutch bite point control. Needs less accelerator on rolling back.'
  },
  {
    id: 'att-102',
    school_id: 'school-apex-001',
    enrollment_id: 'enr-rahul-01',
    student_id: 'stud-rahul-01',
    student_code: 'DS-2026-00101',
    student_name: 'Rahul Sharma',
    instructor_id: 'ins-vikram-01',
    instructor_name: 'Vikram Shinde',
    session_allocation_id: 'sa-r6',
    session_name: 'Perpendicular & Box Parking',
    vehicle_id: 'veh-swift-01',
    vehicle_info: 'Swift Dzire (MH-12-AB-1234)',
    attendance_date: '2026-11-08',
    marked_at: '2026-11-08T08:50:00+05:30',
    status: 'Present',
    remarks: 'Mirror check timing was spot-on.'
  },
  {
    id: 'att-103',
    school_id: 'school-apex-001',
    enrollment_id: 'enr-priya-02',
    student_id: 'stud-priya-02',
    student_code: 'DS-2026-00102',
    student_name: 'Priya Kulkarni',
    instructor_id: 'ins-vikram-01',
    instructor_name: 'Vikram Shinde',
    session_allocation_id: 'sa-p2',
    session_name: 'Clutch, Gear & Steering Coordination',
    vehicle_id: 'veh-swift-01',
    vehicle_info: 'Swift Dzire (MH-12-AB-1234)',
    attendance_date: '2026-11-09',
    marked_at: '2026-11-09T09:40:00+05:30',
    status: 'Present',
    remarks: 'Shifted smoothly from 2nd to 3rd gear.'
  }
];

export const mockPayments: Payment[] = [
  {
    id: 'pay-001',
    school_id: 'school-apex-001',
    enrollment_id: 'enr-rahul-01',
    student_id: 'stud-rahul-01',
    student_name: 'Rahul Sharma',
    student_code: 'DS-2026-00101',
    amount: 5000,
    payment_method: 'UPI',
    transaction_reference: 'UPI/20261005/98218271',
    status: 'Confirmed',
    received_at: '2026-10-05T10:15:00+05:30',
    confirmed_by: 'Staff Priya',
    confirmed_at: '2026-10-05T10:16:00+05:30',
    receipt_number: 'RCP-2026-00042',
    notes: 'Admission down payment (1st installment)'
  },
  {
    id: 'pay-002',
    school_id: 'school-apex-001',
    enrollment_id: 'enr-priya-02',
    student_id: 'stud-priya-02',
    student_name: 'Priya Kulkarni',
    student_code: 'DS-2026-00102',
    amount: 8500,
    payment_method: 'UPI',
    transaction_reference: 'UPI/20261020/44819201',
    status: 'Confirmed',
    received_at: '2026-10-20T11:30:00+05:30',
    confirmed_by: 'Owner Rajesh',
    confirmed_at: '2026-10-20T11:35:00+05:30',
    receipt_number: 'RCP-2026-00043',
    notes: 'Full course fee paid upfront with 5% discount waiver'
  },
  {
    id: 'pay-003',
    school_id: 'school-apex-001',
    enrollment_id: 'enr-rahul-01',
    student_id: 'stud-rahul-01',
    student_name: 'Rahul Sharma',
    student_code: 'DS-2026-00101',
    amount: 3500,
    payment_method: 'Cash',
    status: 'Pending',
    received_at: '2026-11-10T11:00:00+05:30',
    notes: '2nd installment handed to counter staff'
  }
];

export const mockLicenceRecords: LicenceRecord[] = [
  {
    id: 'lic-rahul-01',
    school_id: 'school-apex-001',
    student_id: 'stud-rahul-01',
    student_name: 'Rahul Sharma',
    student_code: 'DS-2026-00101',
    licence_type: 'LMV (Light Motor Vehicle - Car)',
    ll_application_date: '2026-10-08',
    ll_reference: 'MH12/LL/2026/099182',
    ll_status: 'DL Test Scheduled',
    ll_issue_date: '2026-10-12',
    ll_valid_till: '2027-04-11',
    dl_application_date: '2026-11-02',
    dl_reference: 'MH12/DL/2026/102948',
    rto_name: 'MH-12 Pune (Alandi Track)',
    test_date: '2026-11-20',
    test_result: 'Pending',
    next_action_date: '2026-11-19',
    remarks: 'Student has completed slope & reverse box sessions. Ready for test on Maruti Swift Dzire.'
  },
  {
    id: 'lic-priya-02',
    school_id: 'school-apex-001',
    student_id: 'stud-priya-02',
    student_name: 'Priya Kulkarni',
    student_code: 'DS-2026-00102',
    licence_type: 'LMV (Car)',
    ll_application_date: '2026-10-22',
    ll_reference: 'MH12/LL/2026/110291',
    ll_status: 'LL Approved',
    ll_issue_date: '2026-10-25',
    ll_valid_till: '2027-04-24',
    rto_name: 'MH-12 Pune (Alandi Track)',
    remarks: 'Learner licence active. Practical training underway (mandatory 30 days window).'
  },
  {
    id: 'lic-amit-03',
    school_id: 'school-apex-001',
    student_id: 'stud-amit-03',
    student_name: 'Amit Deshmukh',
    student_code: 'DS-2026-00103',
    licence_type: 'MCWG + LMV (Motorcycle + Car)',
    ll_application_date: '2026-09-18',
    ll_reference: 'MH12/LL/2026/081920',
    ll_status: 'Licence Issued',
    ll_issue_date: '2026-09-22',
    ll_valid_till: '2027-03-21',
    dl_application_date: '2026-10-25',
    dl_reference: 'MH12/DL/2026/091823',
    rto_name: 'MH-12 Pune (Alandi Track)',
    test_date: '2026-11-04',
    test_result: 'Passed',
    licence_number: 'MH-12-2026-0081923',
    issue_date: '2026-11-06',
    remarks: 'Passed 8-track and H-track with 0 negative points. Smart Card dispatched via Speed Post.'
  },
  {
    id: 'lic-neha-04',
    school_id: 'school-apex-001',
    student_id: 'stud-neha-04',
    student_name: 'Neha Joshi',
    student_code: 'DS-2026-00104',
    licence_type: 'MCWG (Motorcycle with Gear)',
    ll_application_date: '2026-10-20',
    ll_reference: 'MH12/LL/2026/119283',
    ll_status: 'DL Application Submitted',
    ll_issue_date: '2026-10-23',
    ll_valid_till: '2027-04-22',
    dl_application_date: '2026-11-08',
    dl_reference: 'MH12/DL/2026/114920',
    rto_name: 'MH-12 Pune (Alandi Track)',
    test_date: '2026-11-28',
    test_result: 'Pending',
    remarks: 'Slot booked for 8-track two wheeler practical assessment.'
  },
  {
    id: 'lic-rohit-05',
    school_id: 'school-apex-001',
    student_id: 'stud-rohit-05',
    student_name: 'Rohit Mane',
    student_code: 'DS-2026-00105',
    licence_type: 'LMV (Car)',
    ll_status: 'Documents Pending',
    rto_name: 'MH-12 Pune (Alandi Track)',
    remarks: 'Awaiting medical fitness Form 1A submission at counter before filing online LL application.'
  }
];

export const mockSchedules: ClassSchedule[] = [
  {
    id: 'sch-01',
    school_id: 'school-apex-001',
    enrollment_id: 'enr-rahul-01',
    student_name: 'Rahul Sharma',
    student_code: 'DS-2026-00101',
    instructor_id: 'ins-vikram-01',
    instructor_name: 'Vikram Shinde',
    vehicle_id: 'veh-swift-01',
    vehicle_name: 'Swift Dzire (MH-12-AB-1234)',
    scheduled_start: '2026-11-10T15:00:00+05:30',
    scheduled_end: '2026-11-10T16:00:00+05:30',
    topic: 'Parallel Parking Between Vehicles',
    status: 'Scheduled'
  },
  {
    id: 'sch-02',
    school_id: 'school-apex-001',
    enrollment_id: 'enr-priya-02',
    student_name: 'Priya Kulkarni',
    student_code: 'DS-2026-00102',
    instructor_id: 'ins-vikram-01',
    instructor_name: 'Vikram Shinde',
    vehicle_id: 'veh-swift-01',
    vehicle_name: 'Swift Dzire (MH-12-AB-1234)',
    scheduled_start: '2026-11-10T16:30:00+05:30',
    scheduled_end: '2026-11-10T17:30:00+05:30',
    topic: 'Straight Road & Lane Discipline',
    status: 'Scheduled'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'aud-01',
    school_id: 'school-apex-001',
    actor_name: 'Vikram Shinde (Instructor)',
    action: 'MARK_ATTENDANCE',
    entity_type: 'attendance_records',
    entity_id: 'att-101',
    details: 'Marked attendance for Rahul Sharma (DS-2026-00101) - Hill Start & Slope Balance',
    created_at: '2026-11-09T08:45:00+05:30'
  },
  {
    id: 'aud-02',
    school_id: 'school-apex-001',
    actor_name: 'Rajesh Mehta (Owner)',
    action: 'CONFIRM_PAYMENT',
    entity_type: 'payments',
    entity_id: 'pay-002',
    details: 'Confirmed payment of ₹8,500 for Priya Kulkarni, Receipt #RCP-2026-00043 generated',
    created_at: '2026-10-20T11:35:00+05:30'
  },
  {
    id: 'aud-03',
    school_id: 'school-apex-001',
    actor_name: 'Sunita Patil (Staff)',
    action: 'NEW_ADMISSION',
    entity_type: 'students',
    entity_id: 'stud-rohit-05',
    details: 'Registered student Rohit Mane (DS-2026-00105) for 4W Complete Mastery',
    created_at: '2026-11-08T10:00:00+05:30'
  }
];

import { StaffMember, NotificationItem } from '@/types';

export const mockStaffMembers: StaffMember[] = [
  {
    id: 'stf-sunita-01',
    school_id: 'school-apex-001',
    user_id: 'usr-staff-sunita',
    employee_code: 'STF-2026-01',
    full_name: 'Sunita Patil',
    phone: '+91 98220 55443',
    email: 'sunita.staff@apexdriving.in',
    role_title: 'Senior Admissions & Desk Coordinator',
    is_active: true,
    permissions: {
      can_admit_students: true,
      can_manage_fees: true,
      can_confirm_payments: true,
      can_assign_instructors: true,
      can_manage_licences: true,
      can_manage_vehicles: false,
      can_view_reports: true,
    },
    last_login: '2026-11-10T09:15:00+05:30',
    created_at: '2024-06-01T00:00:00Z',
  },
  {
    id: 'stf-rohan-02',
    school_id: 'school-apex-001',
    user_id: 'usr-staff-rohan',
    employee_code: 'STF-2026-02',
    full_name: 'Rohan Gaikwad',
    phone: '+91 98220 77665',
    email: 'rohan.desk@apexdriving.in',
    role_title: 'Front Desk & Schedules Executive',
    is_active: true,
    permissions: {
      can_admit_students: true,
      can_manage_fees: false,
      can_confirm_payments: false,
      can_assign_instructors: true,
      can_manage_licences: true,
      can_manage_vehicles: true,
      can_view_reports: false,
    },
    last_login: '2026-11-09T17:45:00+05:30',
    created_at: '2025-01-15T00:00:00Z',
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-01',
    school_id: 'school-apex-001',
    title: 'New Student Admission',
    message: 'Rohit Mane (DS-2026-00105) enrolled in 4W Complete Mastery Course.',
    category: 'admission',
    is_read: false,
    created_at: '2026-11-08T10:00:00+05:30'
  },
  {
    id: 'notif-02',
    school_id: 'school-apex-001',
    student_id: 'stud-rahul-01',
    title: 'Fee Payment Pending Confirmation',
    message: 'Cash installment of ₹3,500 received at desk counter. Awaiting final owner confirmation.',
    category: 'payment',
    is_read: false,
    created_at: '2026-11-10T11:00:00+05:30',
    link_url: '/student?tab=fees'
  },
  {
    id: 'notif-03',
    school_id: 'school-apex-001',
    student_id: 'stud-rahul-01',
    title: 'Class Scheduled Today: Parallel Parking',
    message: 'Your driving session on Parallel Parking Between Vehicles is scheduled today at 3:00 PM with Vikram Shinde.',
    category: 'schedule',
    is_read: false,
    created_at: '2026-11-10T08:00:00+05:30',
    link_url: '/student?tab=schedule'
  },
  {
    id: 'notif-04',
    school_id: 'school-apex-001',
    student_id: 'stud-rahul-01',
    title: 'Attendance Marked — Hill Start & Slope Balance',
    message: 'Instructor Vikram Shinde logged your attendance for Session 13. Good clutch bite point control!',
    category: 'attendance',
    is_read: true,
    created_at: '2026-11-09T08:50:00+05:30',
    link_url: '/student?tab=attendance'
  },
  {
    id: 'notif-05',
    school_id: 'school-apex-001',
    student_id: 'stud-rahul-01',
    title: 'RTO DL Practical Test Slot Confirmed',
    message: 'Pune RTO (Alandi Track) has confirmed your DL Driving Test for Friday, 20 Nov 2026 at 10:30 AM.',
    category: 'licence',
    is_read: true,
    created_at: '2026-11-07T14:30:00+05:30',
    link_url: '/student?tab=licence'
  },
  {
    id: 'notif-06',
    school_id: 'school-apex-001',
    student_id: 'stud-rahul-01',
    title: 'Payment Confirmed: Receipt #RCP-2026-00042',
    message: 'Admission fee payment of ₹5,000 via UPI is verified. Official receipt generated.',
    category: 'payment',
    is_read: true,
    created_at: '2026-10-05T10:16:00+05:30',
    link_url: '/student?tab=fees'
  },
  {
    id: 'notif-07',
    school_id: 'school-apex-001',
    student_id: 'stud-priya-02',
    title: 'Class Scheduled: Straight Road & Lane Discipline',
    message: 'Your driving session is scheduled for today at 4:30 PM with instructor Vikram Shinde.',
    category: 'schedule',
    is_read: false,
    created_at: '2026-11-10T09:00:00+05:30',
    link_url: '/student?tab=schedule'
  },
  {
    id: 'notif-08',
    school_id: 'school-apex-001',
    student_id: 'stud-priya-02',
    title: 'Learner Licence Approved',
    message: 'Your Learner Licence (Ref: MH12/LL/2026/110291) has been approved by Pune RTO and is valid till Apr 2027.',
    category: 'licence',
    is_read: true,
    created_at: '2026-10-25T12:00:00+05:30',
    link_url: '/student?tab=licence'
  }
];

import { StudentDocument, SupportTicket } from '@/types';

export const mockStudentDocuments: StudentDocument[] = [
  {
    id: 'doc-001',
    school_id: 'school-apex-001',
    student_id: 'stud-rahul-01',
    document_type: 'Aadhaar',
    document_name: 'Aadhaar_Card_Rahul_Sharma.pdf',
    file_url: 'https://storage.supabase.co/student-documents/stud-rahul-01/aadhaar.pdf',
    file_size: '1.4 MB',
    mime_type: 'application/pdf',
    verification_status: 'Verified',
    uploaded_at: '2026-10-05T09:40:00+05:30',
    verified_at: '2026-10-05T10:00:00+05:30',
    notes: 'Verified against UIDAI offline XML'
  },
  {
    id: 'doc-002',
    school_id: 'school-apex-001',
    student_id: 'stud-rahul-01',
    document_type: 'Form_1A_Medical',
    document_name: 'Form_1A_Medical_Certificate_Certified.pdf',
    file_url: 'https://storage.supabase.co/student-documents/stud-rahul-01/form1a.pdf',
    file_size: '850 KB',
    mime_type: 'application/pdf',
    verification_status: 'Verified',
    uploaded_at: '2026-10-05T09:45:00+05:30',
    verified_at: '2026-10-05T10:15:00+05:30',
    notes: 'Signed by Dr. A. V. Kulkarni (Reg #MMC-2011/4891)'
  },
  {
    id: 'doc-003',
    school_id: 'school-apex-001',
    student_id: 'stud-rahul-01',
    document_type: 'Passport_Photo',
    document_name: 'Student_Passport_Photo.jpg',
    file_url: 'https://storage.supabase.co/student-documents/stud-rahul-01/photo.jpg',
    file_size: '320 KB',
    mime_type: 'image/jpeg',
    verification_status: 'Verified',
    uploaded_at: '2026-10-05T09:35:00+05:30',
    verified_at: '2026-10-05T09:50:00+05:30'
  },
  {
    id: 'doc-004',
    school_id: 'school-apex-001',
    student_id: 'stud-rahul-01',
    document_type: 'Learner_Licence',
    document_name: 'RTO_Learner_Licence_MH12LL099182.pdf',
    file_url: 'https://storage.supabase.co/student-documents/stud-rahul-01/ll_copy.pdf',
    file_size: '1.8 MB',
    mime_type: 'application/pdf',
    verification_status: 'Verified',
    uploaded_at: '2026-10-12T16:20:00+05:30',
    verified_at: '2026-10-12T16:30:00+05:30',
    notes: 'Official Sarathi Parivahan LL PDF with digital signature'
  },
  {
    id: 'doc-005',
    school_id: 'school-apex-001',
    student_id: 'stud-rahul-01',
    document_type: 'Payment_Receipt',
    document_name: 'Admission_Fee_Receipt_RCP-2026-00042.pdf',
    file_url: 'https://storage.supabase.co/student-documents/stud-rahul-01/rcp_00042.pdf',
    file_size: '420 KB',
    mime_type: 'application/pdf',
    verification_status: 'Verified',
    uploaded_at: '2026-10-05T10:16:00+05:30',
    verified_at: '2026-10-05T10:16:00+05:30'
  },
  {
    id: 'doc-006',
    school_id: 'school-apex-001',
    student_id: 'stud-priya-02',
    document_type: 'Aadhaar',
    document_name: 'Aadhaar_Priya_Kulkarni.pdf',
    file_url: 'https://storage.supabase.co/student-documents/stud-priya-02/aadhaar.pdf',
    file_size: '1.2 MB',
    mime_type: 'application/pdf',
    verification_status: 'Verified',
    uploaded_at: '2026-10-20T11:05:00+05:30',
    verified_at: '2026-10-20T11:15:00+05:30'
  },
  {
    id: 'doc-007',
    school_id: 'school-apex-001',
    student_id: 'stud-priya-02',
    document_type: 'Learner_Licence',
    document_name: 'Learner_Licence_MH12LL110291.pdf',
    file_url: 'https://storage.supabase.co/student-documents/stud-priya-02/ll.pdf',
    file_size: '1.6 MB',
    mime_type: 'application/pdf',
    verification_status: 'Verified',
    uploaded_at: '2026-10-25T12:10:00+05:30',
    verified_at: '2026-10-25T12:15:00+05:30'
  },
  {
    id: 'doc-008',
    school_id: 'school-apex-001',
    student_id: 'stud-priya-02',
    document_type: 'Payment_Receipt',
    document_name: 'Full_Fee_Receipt_RCP-2026-00043.pdf',
    file_url: 'https://storage.supabase.co/student-documents/stud-priya-02/receipt.pdf',
    file_size: '410 KB',
    mime_type: 'application/pdf',
    verification_status: 'Verified',
    uploaded_at: '2026-10-20T11:35:00+05:30',
    verified_at: '2026-10-20T11:35:00+05:30'
  }
];

export const mockSupportTickets: SupportTicket[] = [
  {
    id: 'tkt-01',
    school_id: 'school-apex-001',
    student_id: 'stud-rahul-01',
    student_name: 'Rahul Sharma',
    student_code: 'DS-2026-00101',
    category: 'scheduling',
    subject: 'Request morning slot preference for highway drive',
    message: 'Could we schedule the highway speed session on Saturday between 7 AM and 8 AM to avoid highway traffic?',
    status: 'In_Progress',
    created_at: '2026-11-08T15:30:00+05:30'
  }
];
