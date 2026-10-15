import React, { useState } from 'react';
import { DonorBadge, AppreciationPerk, BloodGroup, CertificateData } from '../../types';
import { DONOR_BADGES, APPRECIATION_PERKS } from '../../data/mockData';
import { BloodLinkLogo } from '../brand/BloodLinkLogo';
import { 
  Award, 
  Calendar, 
  Clock, 
  Download, 
  Printer, 
  ShieldCheck, 
  Gift, 
  Sparkles, 
  Heart, 
  Droplets, 
  CheckCircle2, 
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DonationHistoryCertificatesProps {
  donorName?: string;
  bloodGroup?: BloodGroup;
  totalDonations?: number;
  livesSaved?: number;
  lastDonationDate?: string;
}

export const DonationHistoryCertificates: React.FC<DonationHistoryCertificatesProps> = ({
  donorName = 'Marcus Vance',
  bloodGroup = 'O-',
  totalDonations = 14,
  livesSaved = 42,
  lastDonationDate = '2026-07-10'
}) => {
  const [activeTab, setActiveTab] = useState<'certificates' | 'badges' | 'perks' | 'history'>('certificates');
  const [copiedPerkCode, setCopiedPerkCode] = useState<string | null>(null);

  // Interval calculation
  const lastDate = new Date(lastDonationDate);
  const nextSafeDate = new Date(lastDate.getTime() + 56 * 86400000); // 56 days whole blood
  const daysRemaining = Math.max(0, Math.ceil((nextSafeDate.getTime() - Date.now()) / 86400000));
  const isEligibleNow = daysRemaining === 0;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedPerkCode(code);
    setTimeout(() => setCopiedPerkCode(null), 2000);
  };

  const handlePrint = () => {
    confetti({ particleCount: 40, spread: 60 });
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Interval & Next Safe Donation Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#14213D] via-slate-900 to-[#1e293b] text-white shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
                Biological Recovery & Donor Safety
              </span>
              <h2 className="text-xl font-bold tracking-tight mt-1">
                Donation Interval Countdown
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Last Whole Blood Donation: <strong>{lastDonationDate}</strong> (56-Day Physiological RBC Interval)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-right">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Status</span>
              <span className={`text-base font-black ${isEligibleNow ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isEligibleNow ? 'Eligible to Donate Today' : `${daysRemaining} Days to Full Recovery`}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-right">
              <span className="text-[10px] font-bold uppercase text-rose-300 block">Lives Sustained</span>
              <span className="text-xl font-black text-white">~{livesSaved} Patients</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'certificates'
              ? 'bg-[#E11D48] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Official Honor Certificate</span>
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'badges'
              ? 'bg-[#14213D] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Lifesaver Badges ({DONOR_BADGES.filter(b => b.unlocked).length}/{DONOR_BADGES.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('perks')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'perks'
              ? 'bg-[#D4A72C] text-slate-950 font-black shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Donor Appreciation Perks</span>
        </button>
      </div>

      {/* Tab 1: Certificate */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Verified cryptographic milestone certificate for personal portfolio or employer recognition.
            </span>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
          </div>

          {/* Printable High-Fidelity Certificate Card */}
          <div
            id="printable-certificate"
            className="relative bg-gradient-to-br from-amber-50/40 via-white to-rose-50/40 p-8 md:p-12 rounded-3xl border-4 border-double border-amber-300 shadow-xl overflow-hidden max-w-4xl mx-auto"
          >
            {/* Guilloché background watermark */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
              <svg width="600" height="600" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="#14213D" strokeWidth="1" fill="none" />
                <circle cx="50" cy="50" r="35" stroke="#E11D48" strokeWidth="1" fill="none" />
                <circle cx="50" cy="50" r="25" stroke="#D4A72C" strokeWidth="1" fill="none" />
              </svg>
            </div>

            {/* Certificate Header */}
            <div className="text-center space-y-2 relative z-10">
              <div className="flex items-center justify-center mb-2">
                <BloodLinkLogo variant="horizontal" size="lg" showTagline />
              </div>
              <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#BE123C]">
                Official Transfusion Safety & Donor Honor Roll
              </p>
              <h1 className="text-2xl md:text-3xl font-black text-[#14213D] uppercase tracking-tight mt-1">
                Certificate of Lifesaving Distinction
              </h1>
              <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
                Presented with deepest gratitude by the Regional Blood Coordination Council & Hospital Transfusion Directorate.
              </p>
            </div>

            {/* Recipient Block */}
            <div className="my-8 text-center space-y-3 relative z-10">
              <span className="text-xs text-slate-400 font-serif italic">This certifies that voluntary donor</span>
              <div className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight font-serif border-b-2 border-slate-300 pb-2 max-w-md mx-auto">
                {donorName}
              </div>
              <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed pt-2">
                has generously contributed <strong>{totalDonations} verified units</strong> of <strong>{bloodGroup}</strong> blood products through the BLOODLINK platform, directly saving, stabilizing, and restoring the health of an estimated <strong className="text-[#BE123C]">~{livesSaved} patients</strong> during surgical and emergency care.
              </p>
            </div>

            {/* Certificate Stats Bar */}
            <div className="grid grid-cols-3 gap-3 my-6 max-w-lg mx-auto text-center relative z-10">
              <div className="p-3 rounded-2xl bg-white/90 border border-amber-200/80 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Group</span>
                <span className="text-xl font-black text-[#BE123C]">{bloodGroup}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/90 border border-amber-200/80 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Lifetime Units</span>
                <span className="text-xl font-black text-slate-800">{totalDonations} Units</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/90 border border-amber-200/80 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Lifesaving Rank</span>
                <span className="text-sm font-black text-[#D4A72C] uppercase mt-1 block">Century Star</span>
              </div>
            </div>

            {/* Seal & Signatures */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 mt-6 border-t border-slate-200 relative z-10">
              <div className="text-center sm:text-left">
                <div className="font-serif italic font-bold text-base text-slate-800">
                  Dr. Eleanor Sterling, MD, FCAP
                </div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">
                  Director of Immunohematology & Transfusion
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Mass General Blood Center</span>
              </div>

              {/* Gold Verification Seal */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FDE047] via-[#D4A72C] to-[#CA8A04] p-1 shadow-md flex items-center justify-center shrink-0">
                <div className="w-full h-full rounded-full border-2 border-dashed border-amber-950/40 flex flex-col items-center justify-center text-amber-950 font-black">
                  <Droplets className="w-4 h-4 mb-0.5" />
                  <span className="text-[8px] uppercase tracking-tighter leading-none">BLOODLINK</span>
                  <span className="text-[7px] uppercase tracking-widest font-semibold">VERIFIED</span>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <span className="text-[10px] font-mono text-slate-400 block">
                  CERT-ID: BL-{Date.now().toString().slice(-8)}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">
                  Issued: October 15, 2026
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center justify-center sm:justify-end gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Tamper-Proof Ledger Signed</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Badges */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DONOR_BADGES.map((b) => (
            <div
              key={b.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                b.unlocked
                  ? 'bg-white border-slate-200/90 shadow-xs hover:border-rose-200'
                  : 'bg-slate-50 border-dashed border-slate-200 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: b.color }}
                  >
                    <Award className="w-6 h-6" />
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      b.unlocked
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {b.unlocked ? 'Unlocked' : 'In Progress'}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{b.name}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {b.description}
                </p>
              </div>

              {b.unlockedDate && (
                <div className="text-[11px] text-slate-400 mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>Earned On:</span>
                  <strong className="text-slate-600">{b.unlockedDate}</strong>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Perks */}
      {activeTab === 'perks' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
            <Gift className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Voluntary Donor Recognition Program</span>
              <span>
                To honor selfless altruism without violating commercial compensation laws, BLOODLINK partners with healthcare networks to provide free preventive diagnostic panels and wellness care.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {APPRECIATION_PERKS.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full inline-block mb-2">
                    {p.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Partner: {p.partner}</p>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Voucher Code:</span>
                    <button
                      onClick={() => handleCopyCode(p.code)}
                      className="font-mono font-bold text-xs text-[#BE123C] bg-rose-50 px-2 py-1 rounded-lg border border-rose-100 hover:bg-rose-100 transition flex items-center gap-1"
                    >
                      <span>{p.code}</span>
                      {copiedPerkCode === p.code ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-slate-400 block text-right">Valid through: {p.validUntil}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
