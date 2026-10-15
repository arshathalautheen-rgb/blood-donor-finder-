import React, { useState } from 'react';
import { BloodRequest, BloodGroup, BloodComponent, RequestUrgency } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  AlertTriangle, 
  Flame, 
  Radio, 
  Send, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Building2, 
  User, 
  ShieldCheck, 
  Plus, 
  HeartHandshake,
  Activity,
  Droplet
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const EmergencyCoordination: React.FC = () => {
  const [requests, setRequests] = useState<BloodRequest[]>(() => StorageService.getRequests());
  const [isCreatingSOS, setIsCreatingSOS] = useState(false);
  const [activeTab, setActiveTab] = useState<'active_sos' | 'broadcast_log'>('active_sos');
  const [broadcastingId, setBroadcastingId] = useState<string | null>(null);

  // New SOS Request Form State
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number>(32);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [component, setComponent] = useState<BloodComponent>('Red Blood Cells');
  const [unitsNeeded, setUnitsNeeded] = useState<number>(3);
  const [hospitalName, setHospitalName] = useState('Massachusetts General Hospital');
  const [hospitalDepartment, setHospitalDepartment] = useState('Emergency Trauma ICU');
  const [hospitalAddress, setHospitalAddress] = useState('55 Fruit St, Boston, MA 02114');
  const [hospitalCity, setHospitalCity] = useState('Boston, MA');
  const [attendingPhysician, setAttendingPhysician] = useState('Dr. Gregory Sterling, MD');
  const [urgency, setUrgency] = useState<RequestUrgency>('Immediate (Within 2 Hours)');
  const [notes, setNotes] = useState('');
  const [repName, setRepName] = useState('Trauma Coordinator On-Duty');
  const [sosSuccessBanner, setSosSuccessBanner] = useState(false);

  const emergencyRequests = requests.filter(r => r.isEmergencySOS);

  const handleCreateSOS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !hospitalName) return;

    const newReq = StorageService.addRequest({
      patientName,
      patientAge,
      patientGender,
      bloodGroup,
      component,
      unitsNeeded,
      unitsFulfilled: 0,
      hospitalName,
      hospitalDepartment,
      hospitalAddress,
      hospitalCity,
      attendingPhysician,
      urgency,
      neededBy: new Date(Date.now() + 2 * 3600000).toISOString(),
      status: 'Active Broadcast',
      contactRepresentative: {
        relationship: repName,
        contactMasked: '+1 (617) •••-2000'
      },
      notes: notes || 'Acute clinical emergency blood requirement under hospital medical direction.',
      isEmergencySOS: true
    });

    setRequests(StorageService.getRequests());
    setIsCreatingSOS(false);
    setSosSuccessBanner(true);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.5 } });

    // Reset fields
    setPatientName('');
    setNotes('');
    setTimeout(() => setSosSuccessBanner(false), 5000);
  };

  const handleSimulateDonorResponse = (reqId: string) => {
    StorageService.respondToRequest(reqId, 'Voluntary Registered Donor');
    setRequests(StorageService.getRequests());
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleTriggerBroadcast = (id: string) => {
    setBroadcastingId(id);
    setTimeout(() => {
      setBroadcastingId(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Alert Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#BE123C] via-[#E11D48] to-[#9F1239] text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
              <Flame className="w-8 h-8 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/25 text-rose-100">
                  Critical Response Network
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              </div>
              <h2 className="text-2xl font-black tracking-tight mt-1">
                Emergency Blood Coordination Hub
              </h2>
              <p className="text-xs text-rose-100/90 mt-0.5 max-w-xl">
                Rapid donor mobilization for trauma surgery, acute hemorrhage, and ICU red-cell shortages.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreatingSOS(true)}
            className="px-5 py-3 rounded-2xl bg-white text-[#BE123C] text-xs font-black tracking-wide uppercase hover:bg-rose-50 transition shadow-md flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Broadcast Emergency SOS</span>
          </button>
        </div>
      </div>

      {sosSuccessBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Emergency SOS Dispatched!</strong> Matching voluntary donors within a 25 km radius have been alerted via push notifications and encrypted SMS.
            </span>
          </div>
          <button onClick={() => setSosSuccessBanner(false)} className="text-emerald-700 font-bold">×</button>
        </div>
      )}

      {/* SOS List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#BE123C] animate-pulse" />
            <h3 className="text-base font-bold text-slate-900">
              Active Urgent Transfusion Requests ({emergencyRequests.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Real-time multi-hospital coordination stream
          </span>
        </div>

        {emergencyRequests.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No Open Emergency SOS Requests</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              All regional trauma and surgical emergencies currently have adequate blood reserves.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {emergencyRequests.map((req) => {
              const isFulfilled = req.unitsFulfilled >= req.unitsNeeded;
              const isBroadcasting = broadcastingId === req.id;

              return (
                <div
                  key={req.id}
                  className={`bg-white rounded-3xl p-6 border transition-all ${
                    isFulfilled
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-rose-200/90 shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Top Bar: Urgency badge & Status */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E11D48] to-[#9F1239] text-white flex flex-col items-center justify-center font-black shadow-xs shrink-0">
                        <span className="text-xl leading-none">{req.bloodGroup}</span>
                        <span className="text-[9px] opacity-80 uppercase mt-0.5">{req.component.slice(0, 3)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 text-[#BE123C]">
                            {req.urgency}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {req.status}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-1">
                          {req.patientName} ({req.patientAge}y {req.patientGender})
                        </h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-medium">Units Target</span>
                      <div className="flex items-baseline justify-end gap-1 font-black">
                        <span className="text-xl text-[#BE123C]">{req.unitsFulfilled}</span>
                        <span className="text-xs text-slate-400">/ {req.unitsNeeded} units</span>
                      </div>
                    </div>
                  </div>

                  {/* Hospital & Location */}
                  <div className="space-y-1.5 py-3 border-y border-slate-100 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.hospitalName} — <span className="text-slate-500 font-normal">{req.hospitalDepartment}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.hospitalAddress}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Attending: <strong>{req.attendingPhysician}</strong></span>
                    </div>
                  </div>

                  {/* Notes / Case Description */}
                  <div className="my-3 p-3 rounded-xl bg-slate-50 text-xs text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900 block mb-0.5">Clinical Situation:</span>
                    {req.notes}
                  </div>

                  {/* Matching & Response Metrics */}
                  <div className="flex items-center justify-between text-xs py-2 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-rose-500" />
                      <span>Matched Donors: <strong>{req.matchedDonorsCount}</strong></span>
                    </div>
                    <div>
                      <span>Responded Volunteers: <strong className="text-emerald-700">{req.respondedDonorsCount}</strong></span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleTriggerBroadcast(req.id)}
                      disabled={isBroadcasting}
                      className="py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50/50 text-[#BE123C] text-xs font-bold hover:bg-rose-100 transition flex items-center justify-center gap-1.5"
                    >
                      <Radio className={`w-3.5 h-3.5 ${isBroadcasting ? 'animate-spin' : ''}`} />
                      <span>{isBroadcasting ? 'Broadcasting...' : 'Re-Broadcast Radius'}</span>
                    </button>

                    {!isFulfilled ? (
                      <button
                        onClick={() => handleSimulateDonorResponse(req.id)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#E11D48] text-white text-xs font-bold hover:bg-[#BE123C] transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <HeartHandshake className="w-3.5 h-3.5" />
                        <span>I Am Available To Donate (SOS Accept)</span>
                      </button>
                    ) : (
                      <div className="flex-1 py-2 px-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Target Units Secured & Reserved</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Emergency SOS Request Modal */}
      {isCreatingSOS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Create Urgent Blood SOS Broadcast
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dispatches high-urgency notifications to verified voluntary donors.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreatingSOS(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateSOS} className="space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-[#BE123C] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  All emergency blood requests must be authenticated under registered hospital clinical oversight. Misuse is strictly audited.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Patient Name / Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jennings (ICU Bed 4)"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Patient Age
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="115"
                    value={patientAge}
                    onChange={(e) => setPatientAge(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Gender
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Blood Group Needed
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
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Component Required
                  </label>
                  <select
                    value={component}
                    onChange={(e) => setComponent(e.target.value as BloodComponent)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-none font-semibold"
                  >
                    <option value="Red Blood Cells">Red Blood Cells (PRBC)</option>
                    <option value="Platelets">Single-Donor Platelets (SDP)</option>
                    <option value="Fresh Frozen Plasma">Fresh Frozen Plasma (FFP)</option>
                    <option value="Whole Blood">Whole Blood</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Units Needed
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={unitsNeeded}
                    onChange={(e) => setUnitsNeeded(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Hospital Name
                  </label>
                  <input
                    type="text"
                    required
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Attending Physician / Surgeon
                  </label>
                  <input
                    type="text"
                    value={attendingPhysician}
                    onChange={(e) => setAttendingPhysician(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Urgency Level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    'Immediate (Within 2 Hours)',
                    'Critical (Within 6 Hours)',
                    'Urgent (Within 24 Hours)'
                  ].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setUrgency(level as RequestUrgency)}
                      className={`p-2.5 rounded-xl border text-center font-bold transition ${
                        urgency === level
                          ? 'border-[#E11D48] bg-rose-50 text-[#BE123C]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Clinical Notes / Blood Loss Details
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain acute situation (e.g. Ruptured aortic aneurysm, trauma with hypovolemic shock, post-partum hemorrhage)..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreatingSOS(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#BE123C] text-white font-bold hover:bg-[#9F1239] transition flex items-center gap-2 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Alert Immediately</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
