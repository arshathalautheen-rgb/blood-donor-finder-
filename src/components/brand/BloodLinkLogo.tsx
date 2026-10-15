import React from 'react';

interface BloodLinkLogoProps {
  variant?: 'horizontal' | 'icon' | 'dark' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const BloodLinkLogo: React.FC<BloodLinkLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  showTagline = false,
  className = ''
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-lg', subtext: 'text-[9px]' },
    md: { icon: 38, text: 'text-2xl', subtext: 'text-xs' },
    lg: { icon: 48, text: 'text-3xl', subtext: 'text-sm' },
    xl: { icon: 64, text: 'text-4xl', subtext: 'text-base' }
  };

  const currentSize = sizeMap[size];
  const isDark = variant === 'dark';

  // Original BLOODLINK Brand Icon: Blood drop + Heart + Intertwined Link motif
  const BrandIcon = (
    <svg
      width={currentSize.icon}
      height={currentSize.icon}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform hover:scale-105 duration-300 drop-shadow-sm"
    >
      <defs>
        {/* Primary Crimson to Deep Red Gradient */}
        <linearGradient id="blDropGrad" x1="20" y1="10" x2="80" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="35%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#BE123C" />
        </linearGradient>

        {/* Golden Touch of Trust Gradient */}
        <linearGradient id="blGoldGrad" x1="40" y1="30" x2="70" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#D4A72C" />
        </linearGradient>

        {/* Ambient Glow */}
        <filter id="blGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#BE123C" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Main Outer Blood Drop Silhouette */}
      <path
        d="M50 8 C50 8 18 46 18 68 C18 85.67 32.33 100 50 100 C67.67 100 82 85.67 82 68 C82 46 50 8 50 8 Z"
        fill="url(#blDropGrad)"
        filter="url(#blGlow)"
      />

      {/* Internal Interconnected Heart & Life Link Motif */}
      <path
        d="M50 36 C42 27 28 32 28 44 C28 54 39 63 50 74 C61 63 72 54 72 44 C72 32 58 27 50 36 Z"
        fill="#FFFFFF"
        fillOpacity="0.22"
      />

      {/* Distinctive Dual-Ring Linking Rings (Donor to Recipient Interlink) */}
      <path
        d="M42 52 C38 48 38 42 42 38 C46 34 52 34 56 38"
        stroke="#FFFFFF"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M44 60 C48 64 54 64 58 60 C62 56 62 50 58 46"
        stroke="url(#blGoldGrad)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Central Spark of Life dot */}
      <circle cx="50" cy="49" r="3.2" fill="#FFFFFF" />

      {/* Subtle Specular Highlight */}
      <path
        d="M32 44 C30 49 30 56 33 63"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeOpacity="0.6"
      />
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{BrandIcon}</div>;
  }

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-50 via-white to-amber-50/40 border border-rose-200/80 shadow-sm ${className}`}>
        {BrandIcon}
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-tight text-slate-900 text-lg">BLOOD<span className="text-[#E11D48]">LINK</span></span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-[#BE123C] uppercase tracking-wider">Verified</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Healthcare Safety Network</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {BrandIcon}
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight">
          <span className={`font-black uppercase tracking-tighter ${currentSize.text} ${isDark ? 'text-white' : 'text-[#14213D]'}`}>
            BLOOD
          </span>
          <span className={`font-black uppercase tracking-tighter ${currentSize.text} text-[#E11D48]`}>
            LINK
          </span>
          <div className="ml-1 w-2 h-2 rounded-full bg-[#D4A72C] self-start mt-1.5 shadow-sm" />
        </div>
        {showTagline && (
          <span className={`font-semibold tracking-wide uppercase ${currentSize.subtext} ${isDark ? 'text-rose-200/80' : 'text-slate-500'}`}>
            Every Drop Connects. Every Donor Saves.
          </span>
        )}
      </div>
    </div>
  );
};
