import React from 'react';

interface QuestoraLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  animated?: boolean;
}

export const QuestoraLogo: React.FC<QuestoraLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  showTagline = true,
  animated = false,
}) => {
  // Dimension mappings
  const dimensionMap = {
    xs: { emblem: 32, textClass: 'text-sm', taglineClass: 'text-[8px]' },
    sm: { emblem: 44, textClass: 'text-lg', taglineClass: 'text-[9px]' },
    md: { emblem: 56, textClass: 'text-2xl', taglineClass: 'text-[10px]' },
    lg: { emblem: 84, textClass: 'text-3xl', taglineClass: 'text-xs' },
    xl: { emblem: 120, textClass: 'text-4xl', taglineClass: 'text-sm' },
  };

  const dim = dimensionMap[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* SVG Emblem matching the uploaded logo */}
      <div
        className={`relative shrink-0 ${animated ? 'hover:scale-105 transition-transform' : ''}`}
        style={{ width: dim.emblem, height: dim.emblem }}
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Defs for gradients and filters */}
          <defs>
            {/* Outer Ring Gradient */}
            <linearGradient id="q-outer-ring" x1="50" y1="50" x2="350" y2="350" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* Flame Torch Gradient */}
            <linearGradient id="q-flame" x1="200" y1="30" x2="200" y2="130" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>

            {/* Gamepad Controller Gradient */}
            <linearGradient id="q-gamepad" x1="120" y1="140" x2="280" y2="240" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>

            {/* Shield Gradient */}
            <linearGradient id="q-shield" x1="200" y1="100" x2="200" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Ribbon Gradient */}
            <linearGradient id="q-ribbon" x1="80" y1="210" x2="320" y2="250" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            {/* Book Spine Gradient */}
            <linearGradient id="q-book" x1="150" y1="200" x2="250" y2="260" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>

          {/* 1. Outer Circular Base Plate */}
          <circle cx="200" cy="200" r="185" fill="#0b1329" stroke="#1d4ed8" strokeWidth="8" />
          <circle cx="200" cy="200" r="172" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeDasharray="4 6" opacity="0.6" />
          <circle cx="200" cy="200" r="162" fill="#0f172a" stroke="#2563eb" strokeWidth="4" />

          {/* Orbit Star Dots */}
          <circle cx="100" cy="90" r="4" fill="#38bdf8" />
          <circle cx="300" cy="90" r="4" fill="#38bdf8" />
          <circle cx="70" cy="200" r="5" fill="#f97316" />
          <circle cx="330" cy="200" r="5" fill="#f97316" />
          <circle cx="110" cy="300" r="4" fill="#38bdf8" />
          <circle cx="290" cy="300" r="4" fill="#38bdf8" />

          {/* 2. Heraldic Shield Background */}
          <path
            d="M200 95 L275 125 V210 Q275 270 200 300 Q125 270 125 210 V125 Z"
            fill="url(#q-shield)"
            stroke="#ffffff"
            strokeWidth="7"
          />
          <path
            d="M200 108 L263 133 V205 Q263 256 200 284 Q137 256 137 205 V133 Z"
            fill="#09142e"
            stroke="#38bdf8"
            strokeWidth="2.5"
          />

          {/* 3. Golden Ribbon Banners Behind Book */}
          <path
            d="M80 215 Q115 195 150 225 L145 250 Q110 230 75 245 Z"
            fill="url(#q-ribbon)"
            stroke="#c2410c"
            strokeWidth="3"
          />
          <path
            d="M320 215 Q285 195 250 225 L255 250 Q290 230 325 245 Z"
            fill="url(#q-ribbon)"
            stroke="#c2410c"
            strokeWidth="3"
          />

          {/* 4. Flame Torch on Top */}
          {/* Torch Bowl */}
          <path d="M175 110 L225 110 L218 126 L182 126 Z" fill="#38bdf8" stroke="#ffffff" strokeWidth="3" />
          <rect x="180" y="126" width="40" height="8" rx="2" fill="#0284c7" />

          {/* Torch Flame Plumes */}
          <path
            d="M200 35 Q225 70 235 95 Q230 112 200 112 Q170 112 165 95 Q175 70 200 35 Z"
            fill="url(#q-flame)"
          />
          <path
            d="M200 52 Q216 75 220 95 Q212 105 200 105 Q188 105 180 95 Q184 75 200 52 Z"
            fill="#fef08a"
          />
          <path
            d="M200 68 Q208 82 210 96 Q205 101 200 101 Q195 101 190 96 Q192 82 200 68 Z"
            fill="#ffffff"
          />

          {/* 5. Gamepad Controller (Centerpiece) */}
          {/* Main Controller Shell */}
          <path
            d="M142 145 C170 138 230 138 258 145 C285 152 295 185 285 225 C280 242 262 250 248 238 L232 220 C215 225 185 225 168 220 L152 238 C138 250 120 242 115 225 C105 185 115 152 142 145 Z"
            fill="url(#q-gamepad)"
            stroke="#0f172a"
            strokeWidth="5"
          />

          {/* Left D-Pad */}
          <g fill="#0f172a">
            <rect x="144" y="172" width="10" height="24" rx="2" />
            <rect x="137" y="179" width="24" height="10" rx="2" />
          </g>

          {/* Right Action Buttons */}
          <circle cx="245" cy="172" r="5" fill="#facc15" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="258" cy="183" r="5" fill="#38bdf8" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="232" cy="183" r="5" fill="#4ade80" stroke="#0f172a" strokeWidth="1.5" />
          <circle cx="245" cy="195" r="5" fill="#f43f5e" stroke="#0f172a" strokeWidth="1.5" />

          {/* Center Star Emblem on Controller */}
          <path
            d="M200 162 L203 170 L212 170 L205 175 L207 183 L200 178 L193 183 L195 175 L188 170 L197 170 Z"
            fill="#facc15"
            stroke="#0f172a"
            strokeWidth="1.5"
          />

          {/* Analog Sticks */}
          <circle cx="170" cy="205" r="11" fill="#0f172a" />
          <circle cx="170" cy="205" r="8" fill="#38bdf8" />
          <circle cx="230" cy="205" r="11" fill="#0f172a" />
          <circle cx="230" cy="205" r="8" fill="#38bdf8" />

          {/* 6. Open Study Book at the Base */}
          <g transform="translate(0, 10)">
            {/* Book Pages */}
            <path
              d="M200 220 C180 216 155 216 135 224 V270 C155 262 180 262 200 266 C220 262 245 262 265 270 V224 C245 216 220 216 200 220 Z"
              fill="#ffffff"
              stroke="#0f172a"
              strokeWidth="4"
            />
            {/* Book Spine Center Line */}
            <line x1="200" y1="220" x2="200" y2="266" stroke="#0284c7" strokeWidth="3" />

            {/* Book Cover Edge */}
            <path
              d="M133 270 C155 264 180 264 200 268 C220 264 245 264 267 270 L269 275 C247 268 221 268 200 272 C179 268 153 268 131 275 Z"
              fill="#0369a1"
            />

            {/* Left Page: Star Badge */}
            <path
              d="M165 236 L167 241 L172 241 L168 244 L170 249 L165 246 L160 249 L162 244 L158 241 L163 241 Z"
              fill="#f59e0b"
            />
            <line x1="148" y1="254" x2="182" y2="254" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
            <line x1="152" y1="259" x2="178" y2="259" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />

            {/* Right Page: Diploma / Gear Icon */}
            <circle cx="235" cy="242" r="6" fill="#0284c7" />
            <circle cx="235" cy="242" r="3" fill="#ffffff" />
            <line x1="218" y1="254" x2="252" y2="254" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
            <line x1="222" y1="259" x2="248" y2="259" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* Typography: QUESTORA + LEARN. CHALLENGE. MASTER. */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span
              className={`font-black tracking-tight text-slate-900 dark:text-white ${dim.textClass} flex items-center`}
              style={{ fontFamily: "'Montserrat', 'Inter', sans-serif" }}
            >
              <span className="relative inline-flex items-center justify-center">
                Q
                <span className="absolute text-[35%] text-amber-500 font-bold top-[32%] left-[30%] pointer-events-none">
                  ★
                </span>
              </span>
              UESTORA
            </span>
            <span className="text-[10px] uppercase font-extrabold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 ml-1">
              AI
            </span>
          </div>

          {showTagline && (
            <span
              className={`font-extrabold tracking-[0.22em] uppercase text-indigo-600 dark:text-cyan-400 ${dim.taglineClass}`}
            >
              LEARN. CHALLENGE. MASTER.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
