import React, { useState } from 'react';
import { Donor, BloodGroup } from '../../types';
import { StorageService } from '../../services/storage';
import { Search, Filter, ShieldCheck, MapPin, Phone, Lock, Heart, Clock, Award, CheckCircle2, AlertTriangle, Send } from 'lucide-react';

interface DonorDiscoveryProps {
  onSelectDonorForSurgery?: (donor: Donor) => void;
  onRequestEmergencyConsent?: (donor: Donor) => void;
}

export const DonorDiscovery: React.FC<DonorDiscoveryProps> = ({
  onSelectDonorForSurgery,
  onRequestEmergencyConsent
}) => {
  const [donors, setDonors] = useState<Donor[]>(() => StorageService.getDonors());
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxDistance, setMaxDistance] = useState<number>(50);
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(true);

  // Consent modal state
  const [selectedDonorForHandshake, setSelectedDonorForHandshake] = useState<Donor | null>(null);
  const [handshakeMessage, setHandshakeMessage] = useState('');
  const [patientContext, setPatientContext] = useState('');
  const [handshakeHospital, setHandshakeHospital] = useState('Massachusetts General Hospital');
  const [handshakeSentSuccess, setHandshakeSentSuccess] = useState(false);

  const filteredDonors = donors.filter(d => {
    if (selectedGroup !== 'all' && d.bloodGroup !== selectedGroup) return false;
    if (emergencyOnly && !d.isEmergencyReady) return false;
    if (availableOnly && !d.isAvailable) return false;
    if (d.distanceKm > maxDistance) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = d.name.toLowerCase().includes(q);
      const matchCity = d.city.toLowerCase().includes(q);
      const matchCenter = d.preferredDonationCenter.toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchCenter) return false;
    }
    return true;
  });

  const handleSendConsentHandshake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDonorForHandshake) return;

    setHandshakeSentSuccess(true);
    setTimeout(() => {
      setHandshakeSentSuccess(false);
      setSelectedDonorForHandshake(null);
      setHandshakeMessage('');
      setPatientContext('');
    }, 2400);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Privacy Guarantee */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#14213D] to-slate-900 text-white shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Privacy-First Voluntary Donor Discovery</h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Zero Direct Leakage
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Contact information is strictly masked until two-party mutual consent is established. No direct solicitations or data harvesting.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-stretch md:self-auto text-xs bg-slate-800/80 px-3.5 py-2 rounded-2xl border border-slate-700 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Verified Voluntary Pool: <strong className="text-white">{donors.length} donors</strong></span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by city (e.g. Boston, Cambridge), donor name, or hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500 transition"
            />
          </div>

          {/* Blood Group Filter Pill Group */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setSelectedGroup('all')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedGroup === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Types
            </button>
            {(['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as BloodGroup[]).map((bg) => (
              <button
                key={bg}
                onClick={() => setSelectedGroup(bg)}
                className={`px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap transition ${
                  selectedGroup === bg
                    ? 'bg-[#E11D48] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders & Checkboxes */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-semibold">Max Distance:</span>
              <input
                type="range"
                min="2"
                max="50"
                step="2"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="accent-rose-600 cursor-pointer w-28"
              />
              <span className="font-bold text-slate-800">{maxDistance} km</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={emergencyOnly}
                onChange={(e) => setEmergencyOnly(e.target.checked)}
                className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <span>Emergency SOS Ready Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
              />
              <span>Eligible & Available Now</span>
            </label>
          </div>

          <div className="text-slate-400 font-medium">
            Showing <strong className="text-slate-800">{filteredDonors.length}</strong> matching verified donors
          </div>
        </div>
      </div>

      {/* Donors Cards Grid */}
      {filteredDonors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
          <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No matching donors in this criteria</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Try expanding your distance radius slider or clearing specific blood group filters to view more voluntary contributors.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDonors.map((donor) => {
            const isOminus = donor.bloodGroup === 'O-';
            return (
              <div
                key={donor.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-rose-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top row: Blood Group Badge & Status */}
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-rose-500 to-[#BE123C] text-white flex flex-col items-center justify-center font-black shadow-sm shrink-0">
                        <span className="text-lg leading-none">{donor.bloodGroup}</span>
                        <span className="text-[9px] font-semibold opacity-85 uppercase mt-0.5">Donor</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#BE123C] transition">
                            {donor.name}
                          </h3>
                          {donor.verifiedDonor && (
                            <span title="Institutionally Verified Donor">
                              <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{donor.city}, {donor.state} ({donor.distanceKm} km away)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {donor.isEmergencyReady && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-[#BE123C]">
                          SOS Ready
                        </span>
                      )}
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        donor.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {donor.isAvailable ? 'Eligible' : 'Interval Wait'}
                      </span>
                    </div>
                  </div>

                  {/* Highlights & Badges */}
                  <div className="space-y-2 py-2.5 my-2 border-y border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Total Lifetime Donations:</span>
                      <strong className="text-slate-800">{donor.totalDonations} donations (~{donor.livesSavedEstimate} lives impacted)</strong>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Preferred Center:</span>
                      <span className="font-medium text-slate-700 truncate max-w-[190px]" title={donor.preferredDonationCenter}>
                        {donor.preferredDonationCenter}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Next Safe Window:</span>
                      <span className="font-semibold text-emerald-700">Eligible Now</span>
                    </div>
                  </div>

                  {/* Privacy Masked Coordinates */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-4 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Direct Phone: <span className="font-mono font-medium text-slate-700">{donor.phoneMasked}</span></span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                      Consent Required
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setSelectedDonorForHandshake(donor)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#E11D48] text-white text-xs font-bold hover:bg-[#BE123C] transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Request Consent Handshake</span>
                  </button>
                  {onSelectDonorForSurgery && (
                    <button
                      onClick={() => onSelectDonorForSurgery(donor)}
                      className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition text-xs font-semibold"
                      title="Reserve for Scheduled Surgery BloodPlan"
                    >
                      Plan
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Consent Handshake Modal */}
      {selectedDonorForHandshake && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative">
            {handshakeSentSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Consent Handshake Transmitted!</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  A high-priority encrypted notification was dispatched to <strong>{selectedDonorForHandshake.name}</strong>. Once approved via the donor dashboard, communication coordinates will unlock under hospital transfusion supervision.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendConsentHandshake} className="space-y-4">
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white font-black flex items-center justify-center">
                      {selectedDonorForHandshake.bloodGroup}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Initiate Consent Handshake
                      </h3>
                      <p className="text-xs text-slate-500">
                        Requesting voluntary donor: {selectedDonorForHandshake.name}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedDonorForHandshake(null)}
                    className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
                  >
                    ×
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs text-[#BE123C] flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    In accordance with patient and donor safety regulations, your request will be delivered to the donor's registered secure portal. No spam or commercial solicitations are permitted.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Supervising Hospital / Transfusion Facility
                  </label>
                  <select
                    value={handshakeHospital}
                    onChange={(e) => setHandshakeHospital(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500/40 focus:outline-none"
                  >
                    <option value="Massachusetts General Hospital">Massachusetts General Hospital (Boston)</option>
                    <option value="Brigham and Women’s Hospital">Brigham and Women’s Hospital</option>
                    <option value="Boston Children’s Hospital">Boston Children’s Hospital</option>
                    <option value="Mount Auburn Regional Blood Center">Mount Auburn Regional Blood Center</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Patient Case Brief / Clinical Reason
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Scheduled Orthopedic Surgery / Acute ICU Platelet Requirement"
                    value={patientContext}
                    onChange={(e) => setPatientContext(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500/40 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Authorized Message to Donor
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide a courteous explanation. The hospital blood coordinator will verify matching upon donor response."
                    value={handshakeMessage}
                    onChange={(e) => setHandshakeMessage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500/40 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedDonorForHandshake(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#E11D48] text-white text-xs font-bold hover:bg-[#BE123C] transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Verified Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
