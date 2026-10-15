import React from 'react';
import { UserRole } from '../../types';
import { 
  UserCheck, 
  Users, 
  Hospital, 
  Building2, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Flame, 
  Award, 
  ArrowRight,
  Droplet
} from 'lucide-react';

interface RoleDashboardBannerProps {
  currentRole: UserRole;
  onNavigate: (section: string) => void;
  onTriggerSOS: () => void;
}

export const RoleDashboardBanner: React.FC<RoleDashboardBannerProps> = ({
  currentRole,
  onNavigate,
  onTriggerSOS
}) => {
  if (currentRole === 'donor') {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E11D48] to-[#BE123C] text-white flex flex-col items-center justify-center font-black shadow-sm">
              <span className="text-xl leading-none">O-</span>
              <span className="text-[9px] uppercase tracking-wider opacity-85">Universal</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Voluntary Donor Dashboard</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active & Verified
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Welcome back, Marcus Vance
              </h2>
              <p className="text-xs text-slate-500">
                Massachusetts General Transfusion Center • Century Star Donor
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Lifetime Units</span>
              <span className="text-lg font-black text-slate-800">14 Units</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Lives Impacted</span>
              <span className="text-lg font-black text-[#BE123C]">~42 Lives</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] font-bold uppercase text-emerald-700 block">Donation Status</span>
              <span className="text-xs font-black text-emerald-800">Eligible Today</span>
            </div>
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-center">
              <span className="text-[10px] font-bold uppercase text-rose-700 block">SOS Readiness</span>
              <span className="text-xs font-black text-[#BE123C]">Opted In</span>
            </div>
          </div>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-slate-100 flex-wrap">
          <button
            onClick={() => onNavigate('screening')}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5"
          >
            <span>Renew Health Pre-Screening Pass</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate('certificates')}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5 text-[#D4A72C]" />
            <span>View Certificate & Badges</span>
          </button>
          <button
            onClick={() => onNavigate('emergency')}
            className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50/60 text-[#BE123C] text-xs font-bold hover:bg-rose-100 transition flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Check Active SOS Calls</span>
          </button>
        </div>
      </div>
    );
  }

  if (currentRole === 'patient') {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <Users className="w-7 h-7 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patient Representative Portal</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 text-[#BE123C]">
                  Case: Robert Vance Jr.
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Authorized Family Coordination
              </h2>
              <p className="text-xs text-slate-500">
                Brigham and Women’s Hospital • Scheduled CABG Surgery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={onTriggerSOS}
              className="flex-1 lg:flex-none px-5 py-3 rounded-2xl bg-[#BE123C] text-white text-xs font-bold hover:bg-[#9F1239] transition shadow-sm flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4" />
              <span>Broadcast Emergency SOS Request</span>
            </button>
            <button
              onClick={() => onNavigate('surgery')}
              className="flex-1 lg:flex-none px-5 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shadow-sm flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>View Surgery BloodPlan</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentRole === 'hospital') {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <Hospital className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hospital Surgical Team Portal</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Verified Facility
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Massachusetts General Hospital Surgery & ICU
              </h2>
              <p className="text-xs text-slate-500">
                Chief Immunohematologist: Dr. Gregory Sterling, MD
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onNavigate('inventory')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
            >
              Requisition Blood Units
            </button>
            <button
              onClick={() => onNavigate('surgery')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition"
            >
              Review Operating Room BloodPlans
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentRole === 'blood_bank') {
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <Building2 className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Authorized Blood Bank Center</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Regional Central Hub
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                Metro Boston Central Blood Bank
              </h2>
              <p className="text-xs text-slate-500">
                AABB Accredited • Continuous Cold-Chain Telemetry Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onNavigate('inventory')}
              className="px-4 py-2.5 rounded-xl bg-[#BE123C] text-white text-xs font-bold hover:bg-[#9F1239] transition"
            >
              Inspect Shortage Levels
            </button>
            <button
              onClick={() => onNavigate('donors')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition"
            >
              Screening Intake Queue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin / Auditor
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs mb-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#14213D] text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compliance & Audit Directorate</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Safety Verified
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              BLOODLINK Quality & Consent Audit Log
            </h2>
            <p className="text-xs text-slate-500">
              Zero Direct Coordinate Leakage • Mutual Handshake Enforced
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('brand')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
          >
            Design System & Assets
          </button>
        </div>
      </div>
    </div>
  );
};
