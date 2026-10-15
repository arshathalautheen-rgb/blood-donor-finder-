import React, { useState } from 'react';
import { UserRole } from '../../types';
import { BloodLinkLogo } from '../brand/BloodLinkLogo';
import { 
  Flame, 
  Bell, 
  UserCheck, 
  ShieldCheck, 
  Hospital, 
  Building2, 
  Users, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onTriggerSOS: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeSection,
  onSectionChange,
  onTriggerSOS
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const roleLabels: Record<UserRole, { title: string; subtitle: string; icon: any }> = {
    donor: { title: 'Voluntary Donor', subtitle: 'Marcus Vance (O-)', icon: UserCheck },
    patient: { title: 'Patient / Rep', subtitle: 'Family of Robert Vance', icon: Users },
    hospital: { title: 'Surgical Team', subtitle: 'Mass General Surgery', icon: Hospital },
    blood_bank: { title: 'Blood Bank Hub', subtitle: 'Metro Central Hub', icon: Building2 },
    admin: { title: 'Auditor / Admin', subtitle: 'Safety Compliance', icon: ShieldCheck }
  };

  const navItems = [
    { id: 'network', label: 'Network & 3D' },
    { id: 'donors', label: 'Find Donors' },
    { id: 'screening', label: 'Screening Test' },
    { id: 'emergency', label: 'Emergency SOS', alert: true },
    { id: 'surgery', label: 'Surgery BloodPlan' },
    { id: 'inventory', label: 'Blood Inventory' },
    { id: 'certificates', label: 'Certificates & Badges' },
    { id: 'brand', label: 'Brand Identity' }
  ];

  const currentRoleConfig = roleLabels[currentRole];
  const CurrentRoleIcon = currentRoleConfig.icon;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onSectionChange('network')}
              className="text-left focus:outline-none"
            >
              <BloodLinkLogo variant="horizontal" size="md" showTagline />
            </button>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-bold text-slate-600">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-rose-50 text-[#BE123C] font-black'
                      : 'hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.alert && <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Role Switcher, SOS, Notifications */}
          <div className="flex items-center gap-2.5">
            {/* Quick Emergency SOS CTA */}
            <button
              onClick={onTriggerSOS}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white text-xs font-black uppercase tracking-wider hover:opacity-95 shadow-sm transition transform active:scale-95"
            >
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              <span>SOS Request</span>
            </button>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 transition text-left"
              >
                <div className="w-6 h-6 rounded-lg bg-rose-100 text-[#BE123C] flex items-center justify-center">
                  <CurrentRoleIcon className="w-3.5 h-3.5" />
                </div>
                <div className="hidden md:block leading-tight">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Role</span>
                  <span className="text-xs font-black text-slate-800">{currentRoleConfig.title}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Dropdown */}
              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <span className="text-[10px] font-black uppercase text-slate-400">Switch Perspective</span>
                    <p className="text-[11px] text-slate-500">Test multi-stakeholder workflows</p>
                  </div>

                  {(Object.keys(roleLabels) as UserRole[]).map((r) => {
                    const cfg = roleLabels[r];
                    const Icon = cfg.icon;
                    const isSelected = currentRole === r;

                    return (
                      <button
                        key={r}
                        onClick={() => {
                          onRoleChange(r);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition ${
                          isSelected
                            ? 'bg-rose-50 text-[#BE123C] font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#BE123C] text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-xs">{cfg.title}</div>
                          <div className="text-[10px] text-slate-400">{cfg.subtitle}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notifications Trigger */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 relative transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 z-50 text-xs space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900">Urgent Notifications</span>
                    <span className="text-[10px] text-rose-600 font-bold">2 Unread</span>
                  </div>
                  <div className="p-2 rounded-xl bg-rose-50 border border-rose-100 text-[#BE123C] space-y-0.5">
                    <span className="font-bold block">Trauma Alert Broadcast: Mass General</span>
                    <p className="text-[11px] text-slate-600">O- Negative Red Cells needed within 2 hours.</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 space-y-0.5">
                    <span className="font-bold block">BloodPlan Crossmatch Approved</span>
                    <p className="text-[11px] text-slate-500">CABG Surgery units reserved at Brigham Hospital.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSectionChange(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full py-2.5 px-3 rounded-xl text-left text-xs font-bold transition flex items-center justify-between ${
                activeSection === item.id
                  ? 'bg-rose-50 text-[#BE123C]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{item.label}</span>
              {item.alert && <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-[#BE123C]">SOS</span>}
            </button>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                onTriggerSOS();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-[#BE123C] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs"
            >
              <Flame className="w-4 h-4" />
              <span>Broadcast Emergency SOS</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
