import React, { useState } from 'react';
import { UserRole } from './types';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { RoleDashboardBanner } from './components/dashboard/RoleDashboardBanner';
import { ThreeBloodScene } from './components/visuals/ThreeBloodScene';
import { BloodCompatibilityMatrix } from './components/visuals/BloodCompatibilityMatrix';
import { DonorDiscovery } from './components/donor/DonorDiscovery';
import { HealthScreeningQuiz } from './components/screening/HealthScreeningQuiz';
import { EmergencyCoordination } from './components/emergency/EmergencyCoordination';
import { SurgeryBloodPlanView } from './components/surgery/SurgeryBloodPlan';
import { BloodBankInventoryView } from './components/inventory/BloodBankInventory';
import { DonationHistoryCertificates } from './components/donor/DonationHistoryCertificates';
import { BrandIdentityShowcase } from './components/brand/BrandIdentityShowcase';
import { BloodLinkLogo } from './components/brand/BloodLinkLogo';
import { 
  Heart, 
  ShieldCheck, 
  Flame, 
  Droplets, 
  Calendar, 
  Users, 
  Building2, 
  ArrowRight, 
  Activity, 
  Radio, 
  Lock,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('donor');
  const [activeSection, setActiveSection] = useState<string>('network');
  const [sosModalOpen, setSosModalOpen] = useState(false);

  const handleTriggerSOS = () => {
    setActiveSection('emergency');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onTriggerSOS={handleTriggerSOS}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Contextual Role Dashboard Banner */}
        <RoleDashboardBanner
          currentRole={currentRole}
          onNavigate={setActiveSection}
          onTriggerSOS={handleTriggerSOS}
        />

        {/* Section 1: Network & 3D Visual Experience (Hero) */}
        {activeSection === 'network' && (
          <div className="space-y-10 animate-fadeIn">
            {/* Urgent Alert Broadcast Ribbon */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-rose-500/5 to-transparent border border-rose-200/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] animate-ping shrink-0" />
                <span className="font-bold text-[#BE123C] uppercase tracking-wider text-[11px]">
                  Emergency Live Ticker:
                </span>
                <span className="text-slate-700 font-medium">
                  Trauma ICU at Massachusetts General Hospital requested 4 units of O- Negative Red Blood Cells. 2 voluntary donors responded.
                </span>
              </div>
              <button
                onClick={() => setActiveSection('emergency')}
                className="font-bold text-[#BE123C] hover:underline shrink-0 text-xs flex items-center gap-1"
              >
                <span>Respond to SOS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Hero Main Presentation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 text-[#BE123C] text-xs font-bold border border-rose-200">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Privacy-First Voluntary Blood Coordination Platform</span>
                </div>

                <div className="space-y-2">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                    Every Drop Connects. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E11D48] via-[#BE123C] to-[#9F1239]">
                      Every Donor Saves.
                    </span>
                  </h1>
                  <p className="text-base text-slate-600 leading-relaxed max-w-xl pt-2">
                    BLOODLINK replaces chaotic social-media blood appeals with transparent, hospital-verified coordination. Connecting voluntary donors, surgical teams, and authorized blood banks through consent-controlled handshakes.
                  </p>
                </div>

                {/* Primary CTA Group */}
                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <button
                    onClick={() => setActiveSection('donors')}
                    className="px-6 py-3.5 rounded-2xl bg-[#E11D48] text-white text-xs font-bold hover:bg-[#BE123C] transition shadow-md flex items-center gap-2"
                  >
                    <Droplets className="w-4 h-4" />
                    <span>Find Compatible Voluntary Donors</span>
                  </button>

                  <button
                    onClick={() => setActiveSection('screening')}
                    className="px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-50 transition shadow-xs flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Check Donation Eligibility</span>
                  </button>

                  <button
                    onClick={() => setActiveSection('surgery')}
                    className="px-6 py-3.5 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shadow-xs flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-rose-400" />
                    <span>Plan Surgery Blood</span>
                  </button>
                </div>

                {/* Platform Guarantees */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/80 text-xs">
                  <div>
                    <strong className="text-slate-900 block text-lg font-black">Zero Leakage</strong>
                    <span className="text-slate-500 text-[11px]">Strict 2-party mutual consent</span>
                  </div>
                  <div>
                    <strong className="text-[#BE123C] block text-lg font-black">100% Verified</strong>
                    <span className="text-slate-500 text-[11px]">AABB & hospital accredited</span>
                  </div>
                  <div>
                    <strong className="text-slate-900 block text-lg font-black">Fast-Track</strong>
                    <span className="text-slate-500 text-[11px]">Pre-screened digital passes</span>
                  </div>
                </div>
              </div>

              {/* 3D Interactive Erythrocyte & Hemodynamic Canvas */}
              <div className="lg:col-span-5">
                <ThreeBloodScene activeBloodGroup={currentRole === 'donor' ? 'O-' : 'A+'} />
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#E11D48] flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">2,480+</span>
                  <span className="text-xs text-slate-500 font-medium">Verified Donors</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">18</span>
                  <span className="text-xs text-slate-500 font-medium">Partner Hospitals</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">99.4%</span>
                  <span className="text-xs text-slate-500 font-medium">Surgery Blood Readiness</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#BE123C] flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">7,150+</span>
                  <span className="text-xs text-slate-500 font-medium">Estimated Lives Saved</span>
                </div>
              </div>
            </div>

            {/* Interactive Transfusion Compatibility Matrix */}
            <div>
              <BloodCompatibilityMatrix />
            </div>
          </div>
        )}

        {/* Section 2: Donor Discovery */}
        {activeSection === 'donors' && (
          <div className="animate-fadeIn">
            <DonorDiscovery
              onSelectDonorForSurgery={(donor) => {
                setActiveSection('surgery');
              }}
              onRequestEmergencyConsent={(donor) => {
                setActiveSection('emergency');
              }}
            />
          </div>
        )}

        {/* Section 3: Clinical Health Screening Quiz */}
        {activeSection === 'screening' && (
          <div className="animate-fadeIn">
            <HealthScreeningQuiz />
          </div>
        )}

        {/* Section 4: Emergency SOS Blood Coordination */}
        {activeSection === 'emergency' && (
          <div className="animate-fadeIn">
            <EmergencyCoordination />
          </div>
        )}

        {/* Section 5: Advance Surgery BloodPlan */}
        {activeSection === 'surgery' && (
          <div className="animate-fadeIn">
            <SurgeryBloodPlanView />
          </div>
        )}

        {/* Section 6: Hospital & Blood Bank Cold-Chain Inventory */}
        {activeSection === 'inventory' && (
          <div className="animate-fadeIn">
            <BloodBankInventoryView />
          </div>
        )}

        {/* Section 7: Donation History, Certificates, Badges & Perks */}
        {activeSection === 'certificates' && (
          <div className="animate-fadeIn">
            <DonationHistoryCertificates
              donorName={currentRole === 'donor' ? 'Marcus Vance' : 'Robert Vance'}
              bloodGroup={currentRole === 'donor' ? 'O-' : 'A+'}
              totalDonations={14}
              livesSaved={42}
              lastDonationDate="2026-07-10"
            />
          </div>
        )}

        {/* Section 8: Brand Identity Showcase */}
        {activeSection === 'brand' && (
          <div className="animate-fadeIn">
            <BrandIdentityShowcase />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
