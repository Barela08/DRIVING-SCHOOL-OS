'use client';

import React, { useState } from 'react';
import { 
  Star, 
  X, 
  Sparkles, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Heart,
  MessageSquare,
  Award
} from 'lucide-react';
import { CourseCertificate } from '@/types';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';

interface CertificateFeedbackModalProps {
  certificate: CourseCertificate | null;
  isOpen: boolean;
  onClose: () => void;
  onProceedToDownload: () => void;
}

export const CertificateFeedbackModal: React.FC<CertificateFeedbackModalProps> = ({
  certificate,
  isOpen,
  onClose,
  onProceedToDownload
}) => {
  const { school, submitCertificateFeedback } = useDrivingSchool();

  const [step, setStep] = useState<'feedback' | 'googleReview'>('feedback');

  // Star ratings
  const [overallRating, setOverallRating] = useState<number>(5);
  const [instructorRating, setInstructorRating] = useState<number>(5);
  const [trainingQualityRating, setTrainingQualityRating] = useState<number>(5);

  // Optional text
  const [writtenFeedback, setWrittenFeedback] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string>('');

  // Google review tracking
  const [hasOpenedGoogleReview, setHasOpenedGoogleReview] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !certificate) return null;

  const googleReviewUrl = school.google_review_url || 'https://g.page/r/apex-driving-school/review';

  // Handle submitting feedback
  const handleSubmitFeedback = async () => {
    setIsSubmitting(true);
    try {
      await submitCertificateFeedback({
        certificateId: certificate.id,
        overallRating,
        instructorRating,
        trainingQualityRating,
        writtenFeedback: writtenFeedback.trim() || undefined,
        suggestions: suggestions.trim() || undefined,
        googleReviewClicked: false
      });
      setStep('googleReview');
    } catch (e) {
      console.error(e);
      setStep('googleReview');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle skipping feedback (voluntary!)
  const handleSkipFeedback = () => {
    setStep('googleReview');
  };

  // Handle clicking Google Review button
  const handleOpenGoogleReview = () => {
    setHasOpenedGoogleReview(true);
    if (typeof window !== 'undefined') {
      window.open(googleReviewUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Final continue to download
  const handleCompleteAndDownload = () => {
    onClose();
    onProceedToDownload();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-[#0F1C31] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden relative text-slate-100 animate-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                {step === 'feedback' ? 'Course Experience Feedback' : 'Congratulations on Course Completion!'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {step === 'feedback' ? 'Step 1 of 2: Voluntary Student Feedback' : 'Step 2 of 2: Google Review Invitation'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: VOLUNTARY FEEDBACK FORM                                          */}
        {/* ========================================================================= */}
        {step === 'feedback' && (
          <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            <div className="text-center space-y-1">
              <span className="text-xs font-semibold text-amber-400">Your Opinion Matters</span>
              <h2 className="text-lg font-black text-white">How was your driving training?</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Please rate your learning experience with {school.name}. Feedback is completely voluntary.
              </p>
            </div>

            {/* Ratings Section */}
            <div className="space-y-4 pt-1">
              {/* Overall Experience */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Overall Experience</span>
                  <span className="font-bold text-amber-400">{overallRating} / 5 Stars</span>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setOverallRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star 
                        className={`w-6 h-6 ${
                          star <= overallRating 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-slate-600 hover:text-slate-400'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructor Rating */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">
                    Instructor Guidance ({certificate.instructor_name || 'Assigned Instructor'})
                  </span>
                  <span className="font-bold text-amber-400">{instructorRating} / 5 Stars</span>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setInstructorRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star 
                        className={`w-6 h-6 ${
                          star <= instructorRating 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-slate-600 hover:text-slate-400'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Training Quality & Dual-Control Vehicles */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Training Quality &amp; Practical Track Drills</span>
                  <span className="font-bold text-amber-400">{trainingQualityRating} / 5 Stars</span>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTrainingQualityRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star 
                        className={`w-6 h-6 ${
                          star <= trainingQualityRating 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-slate-600 hover:text-slate-400'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional Written Feedback */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Written Feedback <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={writtenFeedback}
                  onChange={e => setWrittenFeedback(e.target.value)}
                  placeholder="Share highlights of your practical classes, clutch control, parking sessions..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-white placeholder-slate-500 outline-none transition resize-none"
                />
              </div>

              {/* Optional Suggestions */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Suggestions for Improvement <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <textarea
                  value={suggestions}
                  onChange={e => setSuggestions(e.target.value)}
                  placeholder="Any aspects of syllabus, track timings or scheduling we can enhance?"
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-white placeholder-slate-500 outline-none transition resize-none"
                />
              </div>
            </div>

            {/* Privacy & Voluntary Note */}
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Feedback is voluntary and will not affect your certificate issuance.</span>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSkipFeedback}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition"
              >
                Skip for Now
              </button>

              <button
                type="button"
                onClick={handleSubmitFeedback}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition"
              >
                {isSubmitting ? 'Saving...' : 'Submit & Continue'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: GOOGLE REVIEW INVITATION                                         */}
        {/* ========================================================================= */}
        {step === 'googleReview' && (
          <div className="p-6 space-y-6 text-center animate-in fade-in">
            {/* Confetti & Congratulations Crest */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 mx-auto shadow-xl shadow-amber-500/20">
              <Sparkles className="w-9 h-9 stroke-[2.5]" />
            </div>

            {/* Mandatory Requirement 6 exact text */}
            <div className="space-y-3">
              <h2 className="text-xl font-black text-white">
                Congratulations on completing your driving course!
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                We hope you had a great learning experience. Please share your honest experience and help others discover our driving school.
              </p>
            </div>

            {/* Prominent Write a Google Review Button */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-amber-300">Official Google Business Profile</span>
              </div>

              <button
                type="button"
                onClick={handleOpenGoogleReview}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 transition transform hover:-translate-y-0.5"
              >
                <ExternalLink className="w-4 h-4" />
                Write a Google Review
              </button>

              {hasOpenedGoogleReview && (
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>Google Review page opened in a new tab. Thank you!</span>
                </div>
              )}
            </div>

            {/* Important Voluntary Assurance */}
            <div className="text-[11px] text-slate-400 space-y-1">
              <p>Google reviews are entirely voluntary and help new learners in Pune find safe driving training.</p>
              <p className="text-slate-500">Your certificate is ready to download immediately regardless of your choice.</p>
            </div>

            {/* Continue to Certificate Option */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCompleteAndDownload}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                Continue to Certificate &amp; Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
