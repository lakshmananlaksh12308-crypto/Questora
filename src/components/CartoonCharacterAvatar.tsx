import React from 'react';

export type CartoonMood = 'excited' | 'teaching' | 'thinking' | 'mindblown' | 'cheering';

export interface CartoonCharacterAvatarProps {
  characterName: string;
  mood?: CartoonMood;
  isSpeaking?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CartoonCharacterAvatar: React.FC<CartoonCharacterAvatarProps> = ({
  characterName = 'Professor Paws',
  mood = 'teaching',
  isSpeaking = false,
  size = 'md',
  className = '',
}) => {
  const isPaws = characterName.toLowerCase().includes('paws') || characterName.toLowerCase().includes('cat') || characterName.toLowerCase().includes('akira');
  const isSpark = characterName.toLowerCase().includes('spark') || characterName.toLowerCase().includes('robot') || characterName.toLowerCase().includes('ren');
  const isLuna = characterName.toLowerCase().includes('luna') || characterName.toLowerCase().includes('owl');
  const isKit = characterName.toLowerCase().includes('kit') || characterName.toLowerCase().includes('fox');
  const isRex = characterName.toLowerCase().includes('rex') || characterName.toLowerCase().includes('dino');

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48 sm:w-56 sm:h-56',
  }[size];

  // Dynamic mood badge
  const moodBadge = {
    excited: '⚡',
    teaching: '💡',
    thinking: '🤔',
    mindblown: '🤯',
    cheering: '✨',
  }[mood];

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeClasses} ${className}`}>
      {/* Mood floating emoji badge */}
      <span className="absolute -top-1 -right-1 z-30 text-base sm:text-xl animate-bounce drop-shadow-md">
        {moodBadge}
      </span>

      {/* SVG Vector Cartoon Character with pure CSS keyframes */}
      {isPaws && (
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-xl select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Animated Cat Ears */}
          <polygon
            points="22,40 38,10 52,36"
            fill="#f97316"
            stroke="#c2410c"
            strokeWidth="3"
            className="animate-pulse"
          />
          <polygon points="28,36 38,18 46,34" fill="#fed7aa" />
          <polygon
            points="98,40 82,10 68,36"
            fill="#f97316"
            stroke="#c2410c"
            strokeWidth="3"
            className="animate-pulse"
          />
          <polygon points="92,36 82,18 74,34" fill="#fed7aa" />

          {/* Cat Head Body */}
          <circle cx="60" cy="62" r="42" fill="#fb923c" stroke="#ea580c" strokeWidth="4" />
          {/* Cheeks */}
          <ellipse cx="40" cy="74" rx="7" ry="4" fill="#fda4af" opacity="0.7" />
          <ellipse cx="80" cy="74" rx="7" ry="4" fill="#fda4af" opacity="0.7" />

          {/* Scholar Hat */}
          <polygon points="60,14 18,28 60,38 102,28" fill="#1e1b4b" stroke="#312e81" strokeWidth="2" />
          <polygon points="54,29 66,29 64,36 56,36" fill="#312e81" />
          <circle cx="60" cy="26" r="3" fill="#fbbf24" />
          <line x1="60" y1="26" x2="88" y2="35" stroke="#fbbf24" strokeWidth="2" />
          <circle cx="88" cy="35" r="3" fill="#fbbf24" />

          {/* Glasses */}
          <circle cx="44" cy="56" r="13" fill="#ffffff" stroke="#0284c7" strokeWidth="3" opacity="0.95" />
          <circle cx="76" cy="56" r="13" fill="#ffffff" stroke="#0284c7" strokeWidth="3" opacity="0.95" />
          <line x1="57" y1="56" x2="63" y2="56" stroke="#0284c7" strokeWidth="3" />

          {/* Eyes (Animated Pupil) */}
          <circle
            cx={mood === 'excited' ? '46' : '44'}
            cy="56"
            r={mood === 'mindblown' ? '7' : '5'}
            fill="#0f172a"
          />
          <circle cx="42" cy="53" r="2" fill="#ffffff" />
          <circle
            cx={mood === 'excited' ? '78' : '76'}
            cy="56"
            r={mood === 'mindblown' ? '7' : '5'}
            fill="#0f172a"
          />
          <circle cx="74" cy="53" r="2" fill="#ffffff" />

          {/* Cute Cat Nose */}
          <polygon points="60,67 56,63 64,63" fill="#f43f5e" />

          {/* Whiskers */}
          <line x1="20" y1="65" x2="35" y2="67" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="73" x2="34" y2="72" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <line x1="100" y1="65" x2="85" y2="67" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
          <line x1="102" y1="73" x2="86" y2="72" stroke="#475569" strokeWidth="2" strokeLinecap="round" />

          {/* Animated Speaking / Smiling Mouth */}
          {isSpeaking ? (
            <ellipse
              cx="60"
              cy="76"
              rx="8"
              ry="7"
              fill="#991b1b"
              stroke="#ea580c"
              strokeWidth="2"
              className="animate-bounce"
            />
          ) : (
            <path
              d="M 52 72 Q 56 77 60 72 Q 64 77 68 72"
              fill="none"
              stroke="#991b1b"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}

          {/* White Chest Fur Collar */}
          <path d="M 40 98 Q 60 108 80 98 L 60 114 Z" fill="#ffffff" stroke="#ea580c" strokeWidth="2" />
        </svg>
      )}

      {isSpark && (
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-xl select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Glowing Robot Antenna */}
          <line x1="60" y1="12" x2="60" y2="28" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
          <circle cx="60" cy="10" r="7" fill="#38bdf8" className="animate-ping" opacity="0.75" />
          <circle cx="60" cy="10" r="6" fill="#0284c7" />

          {/* Robot Head Frame */}
          <rect
            x="20"
            y="28"
            width="80"
            height="70"
            rx="20"
            fill="#1e293b"
            stroke="#38bdf8"
            strokeWidth="4"
          />
          {/* Bolts */}
          <circle cx="28" cy="36" r="2.5" fill="#94a3b8" />
          <circle cx="92" cy="36" r="2.5" fill="#94a3b8" />
          <circle cx="28" cy="90" r="2.5" fill="#94a3b8" />
          <circle cx="92" cy="90" r="2.5" fill="#94a3b8" />

          {/* Screen Visor */}
          <rect
            x="28"
            y="38"
            width="64"
            height="50"
            rx="12"
            fill="#0f172a"
            stroke="#0284c7"
            strokeWidth="2"
          />

          {/* Digital Glowing LED Eyes */}
          <rect
            x="36"
            y="48"
            width="16"
            height={mood === 'excited' ? '18' : '12'}
            rx="4"
            fill="#38bdf8"
            className="animate-pulse"
          />
          <rect
            x="68"
            y="48"
            width="16"
            height={mood === 'excited' ? '18' : '12'}
            rx="4"
            fill="#38bdf8"
            className="animate-pulse"
          />

          {/* Speaking Audio Waveform Mouth */}
          {isSpeaking ? (
            <g className="animate-pulse">
              <line x1="42" y1="74" x2="42" y2="82" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
              <line x1="51" y1="70" x2="51" y2="86" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
              <line x1="60" y1="68" x2="60" y2="88" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
              <line x1="69" y1="70" x2="69" y2="86" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
              <line x1="78" y1="74" x2="78" y2="82" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
            </g>
          ) : (
            <line x1="44" y1="76" x2="76" y2="76" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          )}
        </svg>
      )}

      {isLuna && (
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-xl select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Owl Ear Tufts */}
          <polygon points="28,38 20,12 45,30" fill="#7c3aed" stroke="#5b21b6" strokeWidth="3" />
          <polygon points="92,38 100,12 75,30" fill="#7c3aed" stroke="#5b21b6" strokeWidth="3" />

          {/* Owl Head/Body */}
          <circle cx="60" cy="64" r="42" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="4" />
          <ellipse cx="60" cy="78" rx="26" ry="24" fill="#ede9fe" />

          {/* Star Feather Markings */}
          <polygon points="60,68 62,74 68,74 63,78 65,84 60,80 55,84 57,78 52,74 58,74" fill="#fbbf24" />

          {/* Big Big Glowing Eyes */}
          <circle cx="42" cy="52" r="16" fill="#ffffff" stroke="#4c1d95" strokeWidth="3" />
          <circle cx="78" cy="52" r="16" fill="#ffffff" stroke="#4c1d95" strokeWidth="3" />
          <circle cx="42" cy="52" r="9" fill="#f59e0b" />
          <circle cx="42" cy="52" r="5" fill="#0f172a" />
          <circle cx="40" cy="49" r="2.5" fill="#ffffff" />
          <circle cx="78" cy="52" r="9" fill="#f59e0b" />
          <circle cx="78" cy="52" r="5" fill="#0f172a" />
          <circle cx="76" cy="49" r="2.5" fill="#ffffff" />

          {/* Owl Beak */}
          <polygon points="60,58 54,68 66,68" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
        </svg>
      )}

      {isKit && (
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-xl select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Fox Big Ears */}
          <polygon points="20,44 14,8 48,34" fill="#ea580c" stroke="#9a3412" strokeWidth="3" />
          <polygon points="24,38 20,18 42,32" fill="#ffffff" />
          <polygon points="100,44 106,8 72,34" fill="#ea580c" stroke="#9a3412" strokeWidth="3" />
          <polygon points="96,38 100,18 78,32" fill="#ffffff" />

          {/* Fox Head */}
          <polygon points="60,98 16,48 104,48" fill="#f97316" stroke="#c2410c" strokeWidth="3" />
          <polygon points="60,98 28,60 92,60" fill="#ffffff" />

          {/* Eyes */}
          <ellipse cx="42" cy="52" rx="6" ry="7" fill="#0f172a" />
          <circle cx="40" cy="49" r="2" fill="#ffffff" />
          <ellipse cx="78" cy="52" rx="6" ry="7" fill="#0f172a" />
          <circle cx="76" cy="49" r="2" fill="#ffffff" />

          {/* Black Nose */}
          <circle cx="60" cy="92" r="6" fill="#0f172a" />
        </svg>
      )}

      {isRex && (
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-xl select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dino Spikes */}
          <polygon points="60,8 52,24 68,24" fill="#059669" />
          <polygon points="40,16 34,30 48,30" fill="#059669" />
          <polygon points="80,16 72,30 86,30" fill="#059669" />

          {/* Dino Head */}
          <rect x="22" y="24" width="76" height="74" rx="28" fill="#10b981" stroke="#047857" strokeWidth="4" />
          <ellipse cx="60" cy="80" rx="28" ry="14" fill="#6ee7b7" />

          {/* Cute Eyes */}
          <circle cx="42" cy="48" r="10" fill="#ffffff" stroke="#065f46" strokeWidth="2" />
          <circle cx="78" cy="48" r="10" fill="#ffffff" stroke="#065f46" strokeWidth="2" />
          <circle cx="44" cy="48" r="5" fill="#0f172a" />
          <circle cx="42" cy="46" r="2" fill="#ffffff" />
          <circle cx="80" cy="48" r="5" fill="#0f172a" />
          <circle cx="78" cy="46" r="2" fill="#ffffff" />

          {/* Red Bowtie */}
          <polygon points="60,98 48,90 48,106" fill="#ef4444" />
          <polygon points="60,98 72,90 72,106" fill="#ef4444" />
          <circle cx="60" cy="98" r="4" fill="#b91c1c" />
        </svg>
      )}
    </div>
  );
};
