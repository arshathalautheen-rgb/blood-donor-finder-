import React from 'react';
import { BloodLinkLogo } from '../brand/BloodLinkLogo';
import { ShieldCheck, PhoneCall, Heart, Lock, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#14213D] text-white border-t border-slate-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <BloodLinkLogo variant="dark" size="lg" showTagline />
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              BLOODLINK is a privacy-first blood coordination and prepared surgery support platform connecting voluntary donors, patients, authorized representatives, hospitals, and authorized blood banks through transparent, consent-based workflows.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="p-2.5 rounded-2xl bg-white/10 text-rose-300 border border-white/10 flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Commercialization • 100% Voluntary Altruism</span>
              </div>
            </div>
          </div>

          {/* Emergency Hotline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Emergency Transfusion Line
            </h4>
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-900/60 space-y-2">
              <div className="flex items-center gap-2 text-rose-200">
                <PhoneCall className="w-4 h-4 text-rose-400" />
                <span className="font-mono font-bold text-sm">1-800-BLOOD-LINK</span>
              </div>
              <p className="text-[11px] text-rose-200/80 leading-normal">
                24/7 Clinical Emergency Coordinator on duty for acute ICU and trauma surgical requisitions.
              </p>
            </div>
          </div>

          {/* Clinical Standards */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Safety & Regulatory Standards
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>AABB Transfusion Standards</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>FDA Title 21 CFR 606 & 610</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>WHO Safe Blood Protocols</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>HIPAA Privacy & Masked Coordinates</span>
              </li>
            </ul>
          </div>

          {/* Quick Platform Access */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Platform Features
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>Donor Discovery & Distance Filter</li>
              <li>Clinical Health Pre-Screening</li>
              <li>Advance Surgery BloodPlan™</li>
              <li>Hospital Cold-Chain Inventory</li>
              <li>Personalized Honor Certificates</li>
              <li>Donor Appreciation Recognition</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>© 2026 BLOODLINK Platform. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-300">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Two-Party Mutual Consent Protected</span>
            </span>
            <span className="text-slate-600">•</span>
            <span>English Interface Only</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
