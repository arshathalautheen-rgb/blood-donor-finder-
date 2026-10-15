import React, { useState } from 'react';
import { BloodLinkLogo } from './BloodLinkLogo';
import { Download, Palette, Sparkles, Check, Copy } from 'lucide-react';

export const BrandIdentityShowcase: React.FC = () => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const colors = [
    { name: 'Primary Crimson', hex: '#E11D48', usage: 'Primary action buttons, brand accents, life links' },
    { name: 'Deep Red', hex: '#BE123C', usage: 'High-urgency trauma alerts, primary drop gradient, emphasis' },
    { name: 'Midnight Navy', hex: '#14213D', usage: 'Institutional trust headers, high-contrast typography, hero cards' },
    { name: 'Restrained Gold', hex: '#D4A72C', usage: 'Honor certificates, golden plasma badge, verification star' },
    { name: 'Soft Blush', hex: '#FFF1F2', usage: 'Background tints, healthcare focus areas, subtle card borders' },
    { name: 'Clean White', hex: '#FFFFFF', usage: 'Card surfaces, high-contrast text on dark, negative space' }
  ];

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1800);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 md:p-8 space-y-8">
      {/* Brand Identity Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Palette className="w-5 h-5 text-[#E11D48]" />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Original BLOODLINK Brand Identity & Design System
          </h2>
        </div>
        <p className="text-xs text-slate-500 max-w-2xl">
          Visual architecture uniting patient safety, institutional verification, and voluntary altruism.
        </p>
      </div>

      {/* Official Tagline Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#14213D] via-[#0f172a] to-[#14213D] text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4A72C]">
            Official Brand Tagline
          </span>
          <h3 className="text-2xl font-black italic tracking-wide text-rose-50 mt-1">
            "Every Drop Connects. Every Donor Saves."
          </h3>
        </div>
        <BloodLinkLogo variant="dark" size="md" />
      </div>

      {/* Logo Variants Grid */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Original Logo Formats & Renders
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Horizontal Light */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-3 min-h-[140px]">
            <BloodLinkLogo variant="horizontal" size="md" showTagline />
            <span className="text-[10px] font-semibold text-slate-400 mt-2">Primary Horizontal (Light)</span>
          </div>

          {/* Dark Background Variant */}
          <div className="p-5 rounded-2xl bg-[#14213D] border border-slate-800 flex flex-col items-center justify-center gap-3 min-h-[140px]">
            <BloodLinkLogo variant="dark" size="md" showTagline />
            <span className="text-[10px] font-semibold text-rose-300/70 mt-2">White/Inverted (Dark Mode)</span>
          </div>

          {/* Compact Icon Only */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-3 min-h-[140px]">
            <BloodLinkLogo variant="icon" size="lg" />
            <span className="text-[10px] font-semibold text-slate-400 mt-2">App Icon / Favicon (38px/48px)</span>
          </div>

          {/* Official Verification Badge */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center gap-3 min-h-[140px]">
            <BloodLinkLogo variant="badge" size="sm" />
            <span className="text-[10px] font-semibold text-slate-400 mt-2">Certificate Stamp / Seal</span>
          </div>
        </div>
      </div>

      {/* Palette Swatches */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Healthcare Color Palette
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {colors.map((c) => (
            <div
              key={c.hex}
              onClick={() => handleCopyHex(c.hex)}
              className="p-3 rounded-2xl border border-slate-200 hover:border-slate-300 cursor-pointer transition group"
            >
              <div
                className="w-full h-14 rounded-xl shadow-xs mb-2 flex items-center justify-center group-hover:scale-105 transition"
                style={{ backgroundColor: c.hex }}
              >
                {copiedColor === c.hex && (
                  <span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" /> Copied
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-slate-800 block truncate">{c.name}</span>
              <span className="font-mono text-[11px] text-slate-500 flex items-center justify-between">
                <span>{c.hex}</span>
                <Copy className="w-3 h-3 text-slate-300 group-hover:text-slate-600" />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Design Philosophy */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2 leading-relaxed">
        <h5 className="font-bold text-slate-900">Brand Motif & Symbolism:</h5>
        <p>
          The BLOODLINK logo intertwines the archetypal <strong>blood drop</strong> with an organic <strong>heart silhouette</strong> and dual <strong>interlocking golden life rings</strong>. This visual metaphor directly illustrates the transition from selfless voluntary donation to life-restoring clinical transfusion.
        </p>
      </div>
    </div>
  );
};
