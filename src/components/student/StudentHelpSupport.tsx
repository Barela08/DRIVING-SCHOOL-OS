'use client';

import React, { useState } from 'react';
import { 
  HelpCircle, 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Building, 
  User, 
  FileQuestion,
  MapPin
} from 'lucide-react';
import { Student, Instructor, School, SupportTicket } from '@/types';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';

interface StudentHelpSupportProps {
  student: Student;
  instructor?: Instructor;
  school: School;
  tickets: SupportTicket[];
}

export const StudentHelpSupport: React.FC<StudentHelpSupportProps> = ({
  student,
  instructor,
  school,
  tickets
}) => {
  const { submitSupportTicket } = useDrivingSchool();

  const [category, setCategory] = useState<SupportTicket['category']>('scheduling');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Accordion open states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I request a change or reschedule of my driving lesson slot?',
      a: 'You can submit a slot reschedule request using the form below, or directly phone your assigned trainer at least 24 hours prior to your scheduled class. The academy dispatcher will adjust your schedule slot without deducting your allocated quota.'
    },
    {
      q: 'What physical documents must I bring to the Pune RTO for my practical test?',
      a: 'You must bring: (1) Original Learner Licence (LL) printout, (2) Original Aadhaar Card or government ID proof, (3) Certified Form 1A Medical Fitness Certificate, and (4) Form 5 / 5B Driving School Training completion certificate. Apex Driving School will provide the dual-control vehicle on-site.'
    },
    {
      q: 'How long is my Learner Licence (LL) valid, and when can I apply for a permanent DL?',
      a: 'A Learner Licence is valid across India for 6 months from the date of approval. Under Central Motor Vehicles Rules, you can apply for your Permanent Driving Licence after a mandatory minimum training period of 30 days.'
    },
    {
      q: 'When and how will I receive my physical Smart Card Driving Licence?',
      a: 'Once you pass your practical track test at the Alandi RTO, the Licensing Authority approves your digital DL within 48 to 72 hours. The physical Smart Card is printed and dispatched via India Post Speed Post to your registered residential address within 10 to 15 working days.'
    },
    {
      q: 'What happens if I miss a scheduled driving class without prior notice?',
      a: 'If a session is missed without informing the academy at least 12 hours prior, the class may be marked as "Absent". However, in cases of medical emergencies or unavoidable reasons, please contact front desk staff to request an allocated makeup session.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setStatus({ type: 'error', text: 'Please fill in both the subject and message.' });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const res = await submitSupportTicket({
        studentId: student.id,
        category,
        subject: subject.trim(),
        message: message.trim()
      });

      setIsSubmitting(false);
      if (res.success) {
        setStatus({ type: 'success', text: res.message });
        setSubject('');
        setMessage('');
      } else {
        setStatus({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setStatus({ type: 'error', text: err?.message || 'Failed to submit ticket.' });
    }
  };

  // Filter student tickets
  const myTickets = tickets.filter(t => t.student_id === student.id);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Academy Helpline & Contacts Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Support Desk */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Academy Help Desk</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Camp Head Office Front Counter</p>
          </div>
          <div className="space-y-1 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <a href={`tel:${school.contact_phone}`} className="font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline block">
              {school.contact_phone}
            </a>
            <span className="text-[11px] text-slate-400 block">Mon - Sat: 7:00 AM - 8:00 PM</span>
          </div>
        </div>

        {/* Assigned Trainer Direct Phone */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Assigned Trainer</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{instructor?.full_name || 'Vikram Shinde'}</p>
          </div>
          <div className="space-y-1 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            {instructor?.phone ? (
              <a href={`tel:${instructor.phone}`} className="font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline block">
                {instructor.phone}
              </a>
            ) : (
              <span className="text-slate-400">Available during training slots</span>
            )}
            <span className="text-[11px] text-slate-400 block">Call for immediate roadside delays</span>
          </div>
        </div>

        {/* RTO Alandi Guidance Desk */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">RTO Test Coordination</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pune RTO MH-12 Track</p>
          </div>
          <div className="space-y-1 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="font-semibold text-slate-700 dark:text-slate-300 block">Alandi Test Track Hub</span>
            <span className="text-[11px] text-slate-400 block">Dual-Control Car Provided by School</span>
          </div>
        </div>
      </div>

      {/* 2-Column: FAQs & Submit Support Ticket Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* FAQs Accordion (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <FileQuestion className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Frequently Asked Questions (FAQs)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Clear answers regarding training schedules, RTO rules, and licensing procedures.
            </p>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E5EAF1] dark:border-[#1E293B] overflow-hidden bg-slate-50 dark:bg-[#0B1728]/50"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-blue-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200/60 dark:border-slate-800/80 leading-relaxed animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Raise a Support Query Form (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-5">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Submit Help Request
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Need to reschedule a slot or clarify fees? Dispatch staff will respond.
            </p>
          </div>

          {status && (
            <div className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
              status.type === 'success' 
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400'
            }`}>
              {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{status.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="scheduling">Class Scheduling & Slot Reschedule</option>
                <option value="instructor">Instructor & Vehicle Feedback</option>
                <option value="fee">Fees, Receipt & Installment Inquiry</option>
                <option value="licence">RTO Licence & Test Date Status</option>
                <option value="general">General Administrative Support</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Subject
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Request morning slot preference for highway driving"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Detailed Message
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your query or preferred rescheduled time..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Sending Request...' : 'Submit Support Request'}
            </button>
          </form>

          {/* Past Submitted Requests */}
          {myTickets.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                Your Recent Tickets ({myTickets.length})
              </span>
              {myTickets.map(tkt => (
                <div key={tkt.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white truncate">{tkt.subject}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400">
                      {tkt.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{tkt.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};