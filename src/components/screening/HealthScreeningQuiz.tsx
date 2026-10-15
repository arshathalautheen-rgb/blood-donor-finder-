import React, { useState } from 'react';
import { BloodGroup, ScreeningResult } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldAlert, 
  Heart, 
  Activity, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Download,
  Calendar,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Question {
  id: string;
  category: 'vitals' | 'health_today' | 'medications' | 'procedures' | 'medical_history';
  title: string;
  description: string;
  type: 'boolean' | 'number' | 'select';
  disqualifyingCondition: boolean | string;
  deferralType: 'temporary' | 'permanent' | 'none';
  deferralDays?: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 'q-well-today',
    category: 'health_today',
    title: 'Are you feeling healthy, well, and free of acute infection today?',
    description: 'You should not have an active cold, cough, sore throat, or active fever today.',
    type: 'boolean',
    disqualifyingCondition: false,
    deferralType: 'temporary',
    deferralDays: 3,
    explanation: 'Donating while experiencing an active infection strains your immune system and is unsafe.'
  },
  {
    id: 'q-antibiotics',
    category: 'medications',
    title: 'Have you taken oral or injectable antibiotics within the past 48 hours?',
    description: 'Includes treatment for bacterial infections, dental abscesses, or skin infections.',
    type: 'boolean',
    disqualifyingCondition: true,
    deferralType: 'temporary',
    deferralDays: 3,
    explanation: 'Donors must complete their antibiotic course and be symptom-free for at least 48-72 hours.'
  },
  {
    id: 'q-tattoo',
    category: 'procedures',
    title: 'Have you received a tattoo, microblading, or body piercing in the past 3 months?',
    description: 'Fresh ink and dermal piercings carry a window-period infection precaution.',
    type: 'boolean',
    disqualifyingCondition: true,
    deferralType: 'temporary',
    deferralDays: 90,
    explanation: 'A 3-month waiting period ensures the biological window for hepatitis transmission is safely cleared.'
  },
  {
    id: 'q-surgery',
    category: 'procedures',
    title: 'Have you undergone major surgery or received a blood transfusion in the past 6 months?',
    description: 'Major surgical interventions involve blood loss and tissue recovery.',
    type: 'boolean',
    disqualifyingCondition: true,
    deferralType: 'temporary',
    deferralDays: 180,
    explanation: 'Your body needs adequate time to regenerate iron reserves and ensure no transfusion reactions.'
  },
  {
    id: 'q-malaria',
    category: 'procedures',
    title: 'Have you traveled to a malaria-risk region outside the country in the past 12 months?',
    description: 'Such as tropical areas with active endemic vector transmission.',
    type: 'boolean',
    disqualifyingCondition: true,
    deferralType: 'temporary',
    deferralDays: 365,
    explanation: 'Malaria parasites can remain latent in red cells; a 12-month travel deferral applies.'
  },
  {
    id: 'q-viral-hepatitis',
    category: 'medical_history',
    title: 'Have you ever tested positive for Hepatitis B, Hepatitis C, or HIV/HTLV?',
    description: 'Standard transfusion safety protocol for blood-borne pathogen prevention.',
    type: 'boolean',
    disqualifyingCondition: true,
    deferralType: 'permanent',
    explanation: 'Transfusion guidelines permanently defer individuals with verified viral hepatitis or retroviral infections.'
  }
];

export const HealthScreeningQuiz: React.FC = () => {
  // Donor personal basic info
  const [donorName, setDonorName] = useState('Alex Mercer');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [age, setAge] = useState(26);
  const [weightKg, setWeightKg] = useState(68);
  const [estimatedHb, setEstimatedHb] = useState(13.8);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<ScreeningResult | null>(null);

  const handleAnswer = (val: boolean) => {
    const currentQ = QUESTIONS[currentStepIndex];
    const newAnswers = { ...answers, [currentQ.id]: val };
    setAnswers(newAnswers);

    if (currentStepIndex < QUESTIONS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      evaluateResults(newAnswers);
    }
  };

  const evaluateResults = (finalAnswers: Record<string, boolean>) => {
    // Check vitals first
    if (age < 17) {
      const res: ScreeningResult = {
        id: `scr-${Date.now()}`,
        donorName,
        bloodGroup,
        date: new Date().toISOString(),
        status: 'Temporary Deferral',
        reason: 'Age is below minimum requirement (17 years old with guardian consent or 18+).',
        eligibleFromDate: 'Upon reaching 18 years of age',
        vitalSummary: { age, weightKg, estimatedHb, bloodPressure: '118/76', pulse: 72 }
      };
      setResult(res);
      StorageService.saveScreeningResult(res);
      return;
    }

    if (weightKg < 50) {
      const res: ScreeningResult = {
        id: `scr-${Date.now()}`,
        donorName,
        bloodGroup,
        date: new Date().toISOString(),
        status: 'Temporary Deferral',
        reason: 'Weight is below standard clinical safety threshold (minimum 50 kg / 110 lbs for 450ml draw).',
        eligibleFromDate: 'When weight reaches 50 kg',
        vitalSummary: { age, weightKg, estimatedHb, bloodPressure: '118/76', pulse: 72 }
      };
      setResult(res);
      StorageService.saveScreeningResult(res);
      return;
    }

    if (estimatedHb < 12.5) {
      const res: ScreeningResult = {
        id: `scr-${Date.now()}`,
        donorName,
        bloodGroup,
        date: new Date().toISOString(),
        status: 'Temporary Deferral',
        reason: 'Estimated Hemoglobin level is below 12.5 g/dL. We recommend iron-rich foods and retesting in 30 days.',
        eligibleFromDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        vitalSummary: { age, weightKg, estimatedHb, bloodPressure: '118/76', pulse: 72 }
      };
      setResult(res);
      StorageService.saveScreeningResult(res);
      return;
    }

    // Check specific question answers
    for (const q of QUESTIONS) {
      if (finalAnswers[q.id] === q.disqualifyingCondition) {
        if (q.deferralType === 'permanent') {
          const res: ScreeningResult = {
            id: `scr-${Date.now()}`,
            donorName,
            bloodGroup,
            date: new Date().toISOString(),
            status: 'Permanent Deferral',
            reason: `${q.title} — ${q.explanation}`,
            vitalSummary: { age, weightKg, estimatedHb, bloodPressure: '120/78', pulse: 74 }
          };
          setResult(res);
          StorageService.saveScreeningResult(res);
          return;
        }

        if (q.deferralType === 'temporary') {
          const days = q.deferralDays || 14;
          const eligibleDate = new Date(Date.now() + days * 86400000).toISOString().split('T')[0];
          const res: ScreeningResult = {
            id: `scr-${Date.now()}`,
            donorName,
            bloodGroup,
            date: new Date().toISOString(),
            status: 'Temporary Deferral',
            reason: `${q.explanation}`,
            eligibleFromDate: eligibleDate,
            vitalSummary: { age, weightKg, estimatedHb, bloodPressure: '120/78', pulse: 74 }
          };
          setResult(res);
          StorageService.saveScreeningResult(res);
          return;
        }
      }
    }

    // Fully eligible!
    const eligibleRes: ScreeningResult = {
      id: `scr-${Date.now()}`,
      donorName,
      bloodGroup,
      date: new Date().toISOString(),
      status: 'Eligible',
      reason: 'All pre-screening criteria satisfied. You meet AABB and WHO donor criteria for safe whole blood or apheresis donation.',
      eligibleFromDate: 'Today (Immediate)',
      vitalSummary: { age, weightKg, estimatedHb, bloodPressure: '118/76', pulse: 72 }
    };
    setResult(eligibleRes);
    StorageService.saveScreeningResult(eligibleRes);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-rose-50 text-[#E11D48]">
              <ClipboardCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Donor Health & Eligibility Pre-Screening
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Clinical safety algorithm evaluating vitals, medications, and deferral windows.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200/80 font-semibold">
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
          <span>AABB & Transfusion Guideline Standard</span>
        </div>
      </div>

      {!result ? (
        <div className="mt-6 space-y-6">
          {/* Step 1: Donor Identity & Vitals Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Donor Name</label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full text-xs font-semibold p-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full text-xs font-bold p-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 text-rose-600"
              >
                {(['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as BloodGroup[]).map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Age (Years)</label>
              <input
                type="number"
                min="16"
                max="80"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full text-xs font-semibold p-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Weight (kg)</label>
              <input
                type="number"
                min="35"
                max="160"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full text-xs font-semibold p-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Estimated Hb (g/dL)</label>
              <input
                type="number"
                step="0.1"
                min="9"
                max="19"
                value={estimatedHb}
                onChange={(e) => setEstimatedHb(Number(e.target.value))}
                className="w-full text-xs font-semibold p-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Question {currentStepIndex + 1} of {QUESTIONS.length}</span>
              <span className="text-rose-600">{Math.round(((currentStepIndex + 1) / QUESTIONS.length) * 100)}% Completed</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-[#BE123C] transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Active Question Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-rose-50/30 border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#E11D48] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                Q{currentStepIndex + 1}
              </div>
              <div className="space-y-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#BE123C]">
                  {QUESTIONS[currentStepIndex].category.replace('_', ' ')}
                </span>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
                  {QUESTIONS[currentStepIndex].title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  {QUESTIONS[currentStepIndex].description}
                </p>
              </div>
            </div>

            {/* Binary Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => handleAnswer(true)}
                className="py-4 px-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-rose-400 hover:bg-rose-50/40 text-slate-800 font-bold text-sm transition-all flex items-center justify-between shadow-xs hover:shadow"
              >
                <span>YES</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">Affirmative</span>
              </button>

              <button
                type="button"
                onClick={() => handleAnswer(false)}
                className="py-4 px-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/40 text-slate-800 font-bold text-sm transition-all flex items-center justify-between shadow-xs hover:shadow"
              >
                <span>NO</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">Negative</span>
              </button>
            </div>

            {/* Navigation back */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                disabled={currentStepIndex === 0}
                onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
                className={`text-xs font-semibold flex items-center gap-1.5 ${
                  currentStepIndex === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Question</span>
              </button>

              <span className="text-[11px] text-slate-400">
                Responses are stored locally for verification prior to collection
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Result Screen */
        <div className="mt-6 space-y-6 animate-fadeIn">
          <div
            className={`p-6 md:p-8 rounded-3xl border shadow-md ${
              result.status === 'Eligible'
                ? 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 border-emerald-300'
                : result.status === 'Temporary Deferral'
                ? 'bg-gradient-to-br from-amber-50 via-white to-amber-50/30 border-amber-300'
                : 'bg-gradient-to-br from-rose-50 via-white to-rose-50/30 border-rose-300'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md ${
                    result.status === 'Eligible'
                      ? 'bg-emerald-600'
                      : result.status === 'Temporary Deferral'
                      ? 'bg-amber-600'
                      : 'bg-rose-600'
                  }`}
                >
                  {result.status === 'Eligible' ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : result.status === 'Temporary Deferral' ? (
                    <Clock className="w-8 h-8" />
                  ) : (
                    <AlertCircle className="w-8 h-8" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Screening Outcome</span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        result.status === 'Eligible'
                          ? 'bg-emerald-100 text-emerald-800'
                          : result.status === 'Temporary Deferral'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {result.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mt-0.5">
                    {result.donorName} ({result.bloodGroup})
                  </h3>
                </div>
              </div>

              {result.status === 'Eligible' && (
                <div className="p-3 rounded-2xl bg-emerald-100/80 border border-emerald-300 text-xs text-emerald-900 font-semibold">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Fast-Track Intake Digital Pass</span>
                  </div>
                  <p className="text-[11px] font-mono mt-0.5">PASS ID: BL-PASS-{Date.now().toString().slice(-6)}</p>
                </div>
              )}
            </div>

            {/* Explanation & Details */}
            <div className="my-6 space-y-4">
              <div className="p-4 rounded-2xl bg-white/80 border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Clinical Assessment
                </h4>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  {result.reason}
                </p>
                {result.eligibleFromDate && (
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <Calendar className="w-4 h-4 text-[#BE123C]" />
                    <span>Estimated Re-eligibility Date: <strong className="text-slate-900">{result.eligibleFromDate}</strong></span>
                  </div>
                )}
              </div>

              {/* Vitals Summary Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Age</span>
                  <span className="text-base font-bold text-slate-800">{result.vitalSummary.age} yrs</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Body Weight</span>
                  <span className="text-base font-bold text-slate-800">{result.vitalSummary.weightKg} kg</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Hemoglobin Est.</span>
                  <span className="text-base font-bold text-slate-800">{result.vitalSummary.estimatedHb} g/dL</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Vitals Clearance</span>
                  <span className="text-base font-bold text-emerald-600">Passed</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Screening</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print Screening Record</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
