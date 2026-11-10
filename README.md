# Driving School OS 🚗
### Enterprise Digital Platform for Driving Academies & RTO Licensing

**Version:** 1.0  
**Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS + Lucide Icons + Supabase (PostgreSQL & Row Level Security)  
**Deployment:** Vercel / PWA  
**Primary Market:** India (`Asia/Kolkata` Timezone, INR `₹`, Sarathi RTO LL & DL lifecycle)

---

## 🌟 Key Features & Role Breakdown

Driving School OS is built from the ground up to solve the real operational challenges of driving schools in India:

### 1. 👑 Owner / Super Admin (`/owner`)
- **Executive KPI Dashboard**: Total students, active learners, revenue collected (₹), outstanding fees, available fleet, and RTO tests due.
- **Financial Reconciliation & Audit**: View pending payment entries, approve payments, and generate official serialized receipts (`RCP-2026-XXXXX`).
- **Instructor Performance**: Track active student load, completed driving sessions per instructor, and assigned cars.
- **Courses & Curriculum Builder**: Customizable session templates (e.g., Basic Vehicle Introduction, Clutch & Gear, Reverse Parking, Parallel Parking, Hill Slopes, Night Driving, RTO Mock Test).
- **Fleet & Vehicle Health**: Dual-control car register, PUC/Insurance expiry alerts, and service history.
- **Immutable Audit Logs**: Complete trail of every attendance marked, payment confirmed, and student admission.

### 2. 📋 Counter & Desk Staff (`/staff`)
- **Quick Student Admission**: Automatically generates unique serialized student codes (`DS-2026-00101`).
- **Fee Collection Desk**: Record installments via UPI (GPay/PhonePe), Cash, or Bank Transfer; print official fee receipts with school header.
- **RTO Licence Pipeline Management**: Update Learner's Licence (LL) and Driving Licence (DL) application references, test slots, and results.
- **Class Scheduler**: Book driving lesson slots between students, instructors, and dual-control vehicles.

### 3. 🚘 Driver / Instructor Mobile PWA (`/instructor`)
- **Mobile-First Touch Design**: Built for drivers on the road with high contrast and large touch targets.
- **Student Code Search**: Instant search by Student Code (`DS-2026-00101`) or student name.
- **One-Click Atomic Attendance**:
  - Displays remaining session quota for the selected category (e.g., Reverse Parking: 1 of 2 remaining).
  - Quota enforcement prevents duplicate submissions or exceeding allocated sessions.
  - Optional driving performance remarks field.
  - Rewarding haptic / confetti feedback upon successful submission.
- **Daily Completed Classes Log** & Vehicle Maintenance reporting button.

### 4. 🎓 Student Self-Service Portal (`/student`)
- **Strict Privacy**: Protected by database Row Level Security (RLS) — students cannot access other learners' records.
- **Session-Wise Progress Tracker**: Visual progress bar and category breakdown (e.g., Basic: 2/2, Traffic: 2/3, Reverse: 1/2, Hill: 1/2).
- **Financial Balance & Fee Ledger**: View total fee, amount paid, outstanding balance, and download official receipts.
- **RTO LL & DL Interactive Timeline**:
  1. Documents Verified & Application Filed
  2. Learner's Licence Approved (Mandatory 30-day training period)
  3. DL Practical Test Appointment (Date, Test Track, Training Car)
  4. Final Driving Licence Issued
- **Assigned Instructor & Car Details**: Direct phone call link to assigned instructor.

---

## 🗄️ Database Architecture (Supabase / PostgreSQL)

The database schema is provided in `supabase/schema.sql` and includes:
- **28 relational tables** covering schools, branches, profiles, memberships, permissions, students, courses, session templates, enrollments, allocations, vehicles, instructors, attendance records, fee accounts, payments, receipts, licence records, and audit logs.
- **Atomic PL/pgSQL Functions**:
  - `mark_attendance()`: Validates enrollment, verifies remaining session quota, atomically inserts attendance, and records an audit log.
  - `confirm_payment()`: Atomically marks payment confirmed, generates sequential receipt number, and returns balance.
  - `generate_student_code()`: Generates sequential `DS-YYYY-XXXXX`.
  - `generate_receipt_number()`: Generates sequential `RCP-YYYY-XXXXX`.
- **Row Level Security (RLS) Policies**: Strictly isolates data by `school_id` and role permissions.

---

## 🚀 Getting Started

### 1. Install & Run Locally
```bash
# Clone and enter directory
cd "DRIVING SCHOOL OS"

# Dependencies are already installed! To run the development server:
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Quick Demo Credentials (Built-in 1-Tap Switching)
Use the top role switcher bar or visit `/login` for 1-tap demo logins:
- **Owner**: `owner@apexdriving.in` (Rajesh Mehta)
- **Staff**: `staff@apexdriving.in` (Sunita Patil)
- **Instructor**: Code `INS-2026-01`, PIN `1234` (Vikram Shinde)
- **Student**: Code `DS-2026-00101`, Password `pass123` (Rahul Sharma)

### 3. Deploy Database to Supabase
1. Create a project at [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Copy and run `supabase/schema.sql`.
4. (Optional) Run `supabase/seed.sql` to populate sample Indian driving academy records.
5. Copy your project URL and anon key into `.env.local` (see `.env.example`).

### 4. Build & Production Verification
```bash
npm run build
npm run start
```
