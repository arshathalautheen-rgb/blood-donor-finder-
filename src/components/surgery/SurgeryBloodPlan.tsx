import React, { useState } from 'react';
import { SurgeryBloodPlan, BloodGroup } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  User, 
  Building2, 
  ShieldCheck, 
  AlertCircle, 
  Plus, 
  ArrowRight, 
  Scissors,
  Check,
  Droplets,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SurgeryBloodPlanView: React.FC = () => {
  const [plans, setPlans] = useState<SurgeryBloodPlan[]>(() => StorageService.getSurgeryPlans());
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || '');
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);

  // New Surgery Form State
  const [patientName, setPatientName] = useState('');
  const [procedureName, setProcedureName] = useState('');
  const [surgicalSpecialty, setSurgicalSpecialty] = useState<SurgeryBloodPlan['surgicalSpecialty']>('Cardiothoracic');
  const [leadSurgeon, setLeadSurgeon] = useState('');
  const [hospitalName, setHospitalName] = useState('Massachusetts General Hospital');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('A+');
  const [scheduledDate, setScheduledDate] = useState('2026-10-24');
  const [scheduledTime, setScheduledTime] = useState('08:00 AM');
  const [estimatedUnitsRBC, setEstimatedUnitsRBC] = useState(3);
  const [estimatedUnitsFFP, setEstimatedUnitsFFP] = useState(2);
  const [estimatedUnitsPlatelets, setEstimatedUnitsPlatelets] = useState(1);

  const activePlan = plans.find(p => p.id === selectedPlanId) || plans[0];

  const handleAdvanceMilestone = (planId: string) => {
    const updated = StorageService.advanceSurgeryMilestone(planId);
    if (updated) {
      setPlans(StorageService.getSurgeryPlans());
      confetti({ particleCount: 35, spread: 60 });
    }
  };

  const handleCreateSurgeryPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !procedureName) return;

    const newPlan: SurgeryBloodPlan = {
      id: `plan-${Date.now()}`,
      patientName,
      patientIdMasked: `PT-${Math.floor(1000 + Math.random() * 9000)}-MR`,
      scheduledDate,
      scheduledTime,
      procedureName,
      surgicalSpecialty,
      leadSurgeon: leadSurgeon || 'Chief Surgical Officer, MD',
      hospitalName,
      bloodGroup,
      estimatedUnitsRBC,
      estimatedUnitsFFP,
      estimatedUnitsPlatelets,
      currentMilestone: 1,
      milestones: [
        {
          step: 1,
          title: 'Surgical Plan & Blood Requisition Created',
          description: 'Blood requisition issued by surgical coordinator.',
          status: 'completed',
          completedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        },
        {
          step: 2,
          title: 'Voluntary Donors Matched & Consented',
          description: 'Matching voluntary donors in the regional pool.',
          status: 'in_progress'
        },
        {
          step: 3,
          title: 'Clinical Donation & Apheresis Processing',
          description: 'Donors arrive at authorized blood center for collection.',
          status: 'upcoming'
        },
        {
          step: 4,
          title: 'Hospital Immunohematology Crossmatch',
          description: 'Laboratory compatibility testing prior to surgery date.',
          status: 'upcoming'
        },
        {
          step: 5,
          title: 'Operating Room Blood Units Tagged & Reserved',
          description: 'Barcoded units placed in cold chain ready for surgery incision.',
          status: 'upcoming'
        }
      ],
      reservedDonorIds: [],
      crossmatchStatus: 'Awaiting Samples',
      assignedBloodBank: 'Metro Boston Central Blood Bank'
    };

    const updated = [newPlan, ...plans];
    StorageService.saveSurgeryPlans(updated);
    setPlans(updated);
    setSelectedPlanId(newPlan.id);
    setIsCreatingPlan(false);
    confetti({ particleCount: 50, spread: 60 });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#14213D] via-slate-900 to-[#1e293b] text-white shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
              <Scissors className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Advance Surgery Preparation
                </span>
                <span className="text-xs text-slate-400">Zero-Day Blood Shortage Prevention</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight mt-0.5">
                BloodPlan™ Surgical Coordination Timelines
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                Pre-arranging voluntary donor matching and crossmatch confirmation 3 to 7 days before high-risk elective and emergency operations.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreatingPlan(true)}
            className="px-5 py-3 rounded-2xl bg-[#E11D48] text-white text-xs font-bold hover:bg-[#BE123C] transition shadow-md flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Surgery BloodPlan</span>
          </button>
        </div>
      </div>

      {/* Main Split: Left Selector, Right Detailed Milestone View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Surgery Plan List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Scheduled Surgical Cases ({plans.length})
            </h3>
          </div>

          <div className="space-y-2.5">
            {plans.map((p) => {
              const isSelected = p.id === activePlan?.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-400/30 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-[#BE123C] text-white text-xs font-black flex items-center justify-center shrink-0">
                        {p.bloodGroup}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{p.patientName}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">{p.patientIdMasked}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Step {p.currentMilestone} of 5
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 mt-2 line-clamp-1">
                    {p.procedureName}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-rose-500" />
                      <span>{p.scheduledDate}</span>
                    </div>
                    <span className="font-semibold text-slate-700">
                      {p.estimatedUnitsRBC} RBC Units
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Surgery BloodPlan Milestone Timeline */}
        {activePlan && (
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-sm space-y-6">
            {/* Surgery Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 text-[#BE123C]">
                    {activePlan.surgicalSpecialty} Surgery
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Patient ID: <strong className="font-mono text-slate-800">{activePlan.patientIdMasked}</strong>
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {activePlan.procedureName}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1.5">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Patient: {activePlan.patientName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {activePlan.hospitalName}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-slate-600">
                    Lead Surgeon: {activePlan.leadSurgeon}
                  </span>
                </div>
              </div>

              {/* Blood Requisition Unit Badge */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-50 via-white to-amber-50/50 border border-rose-200 text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Reserve</span>
                <div className="flex items-baseline justify-end gap-1.5 font-black text-slate-900 mt-0.5">
                  <span className="text-xl text-[#BE123C]">{activePlan.estimatedUnitsRBC} Units RBC</span>
                  <span className="text-xs text-slate-500">({activePlan.bloodGroup})</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  +{activePlan.estimatedUnitsFFP} FFP • +{activePlan.estimatedUnitsPlatelets} Platelets
                </div>
              </div>
            </div>

            {/* Crossmatch Status Bar */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <span className="font-bold text-slate-800 block">Immunohematology Crossmatch Status:</span>
                  <span className="text-slate-600">
                    Assigned Blood Hub: <strong>{activePlan.assignedBloodBank}</strong>
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full font-bold self-start sm:self-auto ${
                activePlan.crossmatchStatus === 'Crossmatched & Compatible'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {activePlan.crossmatchStatus}
              </span>
            </div>

            {/* 5-Step Milestone Timeline */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Pre-Operative Blood Supply Milestone Journey
                </h4>
                {activePlan.currentMilestone < 5 && (
                  <button
                    onClick={() => handleAdvanceMilestone(activePlan.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Advance Next Milestone</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-4 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
                {activePlan.milestones.map((m) => {
                  const isDone = m.status === 'completed';
                  const isCurr = m.status === 'in_progress';

                  return (
                    <div key={m.step} className="flex items-start gap-4 relative z-10">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 transition-all shadow-xs ${
                          isDone
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                            : isCurr
                            ? 'bg-[#E11D48] text-white ring-4 ring-rose-100 animate-pulse'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {isDone ? <Check className="w-5 h-5 stroke-[3]" /> : m.step}
                      </div>

                      <div className="flex-1 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h5 className={`text-sm font-bold ${isCurr ? 'text-[#BE123C]' : 'text-slate-900'}`}>
                            {m.title}
                          </h5>
                          {m.completedAt && (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                              Completed: {m.completedAt}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {m.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Scheduled Operation Reminder */}
            <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#BE123C]">
                <Clock className="w-4 h-4 shrink-0" />
                <span>
                  Surgery scheduled for <strong>{activePlan.scheduledDate} at {activePlan.scheduledTime}</strong>. Blood units must be in OR refrigerator 4 hours prior.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Surgery Plan Modal */}
      {isCreatingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center">
                  <Scissors className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Create Advance Surgery BloodPlan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Proactive voluntary donor reservation prior to operating day.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreatingPlan(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateSurgeryPlan} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Patient Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Surgical Procedure Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Minimally Invasive Mitral Valve Replacement"
                  value={procedureName}
                  onChange={(e) => setProcedureName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Surgical Specialty
                  </label>
                  <select
                    value={surgicalSpecialty}
                    onChange={(e) => setSurgicalSpecialty(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-none font-semibold"
                  >
                    <option value="Cardiothoracic">Cardiothoracic</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Neurosurgery">Neurosurgery</option>
                    <option value="Obstetrics">High-Risk Obstetrics</option>
                    <option value="Oncology">Surgical Oncology</option>
                    <option value="Transplant">Organ Transplant</option>
                    <option value="Trauma">Trauma Reconstruction</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Patient Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold text-rose-600"
                  >
                    {(['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as BloodGroup[]).map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Scheduled Surgery Date
                  </label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Operating Start Time
                  </label>
                  <input
                    type="text"
                    placeholder="07:30 AM"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">RBC Units</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={estimatedUnitsRBC}
                    onChange={(e) => setEstimatedUnitsRBC(Number(e.target.value))}
                    className="w-full p-2 text-center font-bold bg-white rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">FFP Units</label>
                  <input
                    type="number"
                    min="0"
                    max="8"
                    value={estimatedUnitsFFP}
                    onChange={(e) => setEstimatedUnitsFFP(Number(e.target.value))}
                    className="w-full p-2 text-center font-bold bg-white rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Platelet Units</label>
                  <input
                    type="number"
                    min="0"
                    max="4"
                    value={estimatedUnitsPlatelets}
                    onChange={(e) => setEstimatedUnitsPlatelets(Number(e.target.value))}
                    className="w-full p-2 text-center font-bold bg-white rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreatingPlan(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E11D48] text-white font-bold hover:bg-[#BE123C] transition shadow-md"
                >
                  Create & Begin Donor Matching
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
