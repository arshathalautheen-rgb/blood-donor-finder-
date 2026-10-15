import React, { useState } from 'react';
import { BloodGroup } from '../../types';
import { COMPATIBILITY_MATRIX } from '../../data/mockData';
import { CheckCircle2, XCircle, Info, HeartHandshake, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

export const BloodCompatibilityMatrix: React.FC = () => {
  const [selectedType, setSelectedType] = useState<BloodGroup>('O-');
  const [mode, setMode] = useState<'donate' | 'receive'>('donate');

  const currentInfo = COMPATIBILITY_MATRIX[selectedType];
  const activeCompatibleList = mode === 'donate' ? currentInfo.canGiveTo : currentInfo.canReceiveFrom;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-[#E11D48]">
              <HeartHandshake className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              ABO & Rh Transfusion Compatibility Matrix
            </h3>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Clinical cross-match rules governed by surface antigens (A, B, Rh) and serum isoagglutinins.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl self-start md:self-auto">
          <button
            onClick={() => setMode('donate')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              mode === 'donate'
                ? 'bg-[#E11D48] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Can Donate To</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setMode('receive')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              mode === 'receive'
                ? 'bg-[#14213D] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Can Receive From</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Blood Group Selectors */}
      <div className="my-6">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Select Reference Blood Type:
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
          {BLOOD_GROUPS.map((bg) => {
            const isSelected = selectedType === bg;
            const isUniv = bg === 'O-' || bg === 'AB+';
            return (
              <button
                key={bg}
                onClick={() => setSelectedType(bg)}
                className={`relative py-3.5 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'border-[#E11D48] bg-rose-50/60 ring-2 ring-rose-400/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isUniv && (
                  <span className="absolute -top-2 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-amber-400 text-amber-950 uppercase tracking-tighter">
                    {bg === 'O-' ? 'Universal' : 'Golden'}
                  </span>
                )}
                <span className={`text-xl font-black ${isSelected ? 'text-[#BE123C]' : 'text-slate-800'}`}>
                  {bg}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {bg.includes('-') ? 'Rh Negative' : 'Rh Positive'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Match Results */}
      <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800">
              {mode === 'donate' ? `If you are ${selectedType}, you can safely donate Red Blood Cells to:` : `If a patient is ${selectedType}, they can safely receive Red Blood Cells from:`}
            </span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-[#BE123C]">
            {activeCompatibleList.length} of 8 Compatible Types
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {BLOOD_GROUPS.map((target) => {
            const isCompatible = activeCompatibleList.includes(target);
            return (
              <div
                key={target}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                  isCompatible
                    ? 'bg-emerald-50/80 border-emerald-300/80 text-emerald-950 shadow-xs'
                    : 'bg-white/60 border-slate-200/70 text-slate-400 opacity-60'
                }`}
              >
                <div className="mb-1">
                  {isCompatible ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-slate-300" />
                  )}
                </div>
                <span className="text-lg font-black">{target}</span>
                <span className="text-[10px] font-bold uppercase mt-0.5">
                  {isCompatible ? 'Compatible' : 'Incompatible'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clinical Notes & Special Traits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white shadow-xs text-[#E11D48] shrink-0 mt-0.5">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#BE123C]">Red Cell Clinical Insight</h4>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">{currentInfo.redCellTraits}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white shadow-xs text-amber-600 shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">Plasma & Antibody Dynamics</h4>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">{currentInfo.plasmaTraits}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal icon import fix
function Droplets(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
    </svg>
  );
}
