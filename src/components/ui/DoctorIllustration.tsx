export function DoctorIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Botanical wellness illustration"
    >
      <defs>
        <linearGradient id="ill-bg" x1="0" y1="0" x2="400" y2="500" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDF8F0" />
          <stop offset="1" stopColor="#F2E8D4" />
        </linearGradient>
        <radialGradient id="ill-inner" cx="45%" cy="38%" r="60%" gradientUnits="objectBoundingBox">
          <stop stopColor="#FAEBD4" />
          <stop offset="1" stopColor="#EED9C0" />
        </radialGradient>
        <linearGradient id="ill-leaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#9AB5A3" />
          <stop offset="1" stopColor="#6C8E7B" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="400" height="500" fill="url(#ill-bg)" />

      {/* Subtle diagonal texture lines */}
      <line x1="0" y1="80"  x2="80"  y2="0"   stroke="#E5E1DB" strokeWidth="0.5" opacity="0.35" />
      <line x1="0" y1="180" x2="180" y2="0"   stroke="#E5E1DB" strokeWidth="0.5" opacity="0.25" />
      <line x1="0" y1="280" x2="280" y2="0"   stroke="#E5E1DB" strokeWidth="0.5" opacity="0.2" />
      <line x1="0" y1="380" x2="380" y2="0"   stroke="#E5E1DB" strokeWidth="0.5" opacity="0.15" />
      <line x1="0" y1="500" x2="400" y2="100" stroke="#E5E1DB" strokeWidth="0.5" opacity="0.15" />
      <line x1="100" y1="500" x2="400" y2="200" stroke="#E5E1DB" strokeWidth="0.5" opacity="0.1" />
      <line x1="200" y1="500" x2="400" y2="300" stroke="#E5E1DB" strokeWidth="0.5" opacity="0.08" />

      {/* Background aura rings */}
      <circle cx="200" cy="242" r="188" fill="#D8EAE0" opacity="0.18" />
      <circle cx="200" cy="242" r="158" fill="#B8D5C4" opacity="0.13" />
      <circle cx="200" cy="242" r="128" stroke="#8FBD9F" strokeWidth="1.2" fill="none" opacity="0.18" />
      <circle cx="200" cy="242" r="98"  stroke="#7C9E8A" strokeWidth="0.8" fill="none" opacity="0.18" strokeDasharray="3 6" />

      {/* LARGE LEAF – top-right */}
      <path d="M 372 8 C 428 58 412 145 360 192 C 338 165 330 122 342 78 C 352 38 372 8 372 8 Z" fill="url(#ill-leaf)" opacity="0.72" />
      <path d="M 372 8 C 356 82 344 158 360 192" stroke="#5E8A70" strokeWidth="1.2" opacity="0.45" />
      <path d="M 345 5 C 398 48 388 115 342 156 C 328 130 326 93 338 56 C 341 30 345 5 345 5 Z" fill="#9AB5A3" opacity="0.5" />
      <path d="M 312 18 C 358 58 362 116 334 152" stroke="#8FBD9F" strokeWidth="0.8" fill="none" opacity="0.3" />

      {/* LARGE LEAF – top-left */}
      <path d="M 28 8 C -28 58 -12 145 40 192 C 62 165 70 122 58 78 C 48 38 28 8 28 8 Z" fill="url(#ill-leaf)" opacity="0.65" />
      <path d="M 28 8 C 44 82 56 158 40 192" stroke="#5E8A70" strokeWidth="1.2" opacity="0.4" />
      <path d="M 55 5 C 2 48 12 115 58 156 C 72 130 74 93 62 56 C 59 30 55 5 55 5 Z" fill="#9AB5A3" opacity="0.48" />

      {/* Central medallion */}
      <circle cx="200" cy="238" r="92" fill="url(#ill-inner)" />

      {/* Medical cross — vertical bar */}
      <rect x="192" y="187" width="16" height="102" rx="8" fill="#7C9E8A" opacity="0.72" />
      {/* Medical cross — horizontal bar */}
      <rect x="166" y="229" width="68" height="16" rx="8" fill="#7C9E8A" opacity="0.72" />
      {/* Centre circle */}
      <circle cx="200" cy="238" r="18" fill="#EEF5F0" />
      <circle cx="200" cy="238" r="9"  fill="#7C9E8A" opacity="0.58" />
      {/* Dashed orbit */}
      <circle cx="200" cy="238" r="28" stroke="#8FBD9F" strokeWidth="1.4" fill="none" opacity="0.38" strokeDasharray="2 5" />

      {/* Stethoscope arc hint */}
      <path d="M 228 215 Q 252 215 254 235 Q 256 258 238 264" stroke="#7C9E8A" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5" />
      <circle cx="235" cy="267" r="7" stroke="#7C9E8A" strokeWidth="1.8" fill="#EEF5F0" opacity="0.6" />

      {/* Mid-left botanical sprig */}
      <path d="M 62 248 C 30 215 20 172 48 148" stroke="#7C9E8A" strokeWidth="1.5" fill="none" opacity="0.38" />
      <ellipse cx="55"  cy="208" rx="18" ry="9" fill="#9AB5A3" opacity="0.42" transform="rotate(-35 55 208)" />
      <ellipse cx="42"  cy="228" rx="15" ry="7" fill="#7C9E8A" opacity="0.32" transform="rotate(-18 42 228)" />
      <ellipse cx="50"  cy="252" rx="14" ry="7" fill="#B8D5C4" opacity="0.38" transform="rotate(-48 50 252)" />

      {/* Mid-right botanical sprig */}
      <path d="M 338 248 C 370 215 380 172 352 148" stroke="#7C9E8A" strokeWidth="1.5" fill="none" opacity="0.35" />
      <ellipse cx="345" cy="208" rx="18" ry="9" fill="#9AB5A3" opacity="0.38" transform="rotate(35 345 208)" />
      <ellipse cx="358" cy="228" rx="15" ry="7" fill="#7C9E8A" opacity="0.28" transform="rotate(18 358 228)" />
      <ellipse cx="350" cy="252" rx="14" ry="7" fill="#B8D5C4" opacity="0.32" transform="rotate(48 350 252)" />

      {/* Berry cluster – left */}
      <circle cx="76"  cy="315" r="8"   fill="#D9896A" opacity="0.52" />
      <circle cx="60"  cy="300" r="6"   fill="#E8A87C" opacity="0.42" />
      <circle cx="90"  cy="302" r="5.5" fill="#D9896A" opacity="0.38" />
      <circle cx="68"  cy="328" r="4"   fill="#C4723A" opacity="0.32" />
      <path d="M 76 308 L 76 345"  stroke="#7C9E8A" strokeWidth="1.5" opacity="0.32" />
      <path d="M 60 294 L 68 330"  stroke="#7C9E8A" strokeWidth="1" opacity="0.28" />

      {/* Berry cluster – right */}
      <circle cx="324" cy="305" r="7.5" fill="#F2C4C4" opacity="0.58" />
      <circle cx="338" cy="292" r="5.5" fill="#E8AEAD" opacity="0.48" />
      <circle cx="312" cy="294" r="5"   fill="#F2C4C4" opacity="0.42" />
      <circle cx="330" cy="320" r="4"   fill="#D9896A" opacity="0.32" />
      <path d="M 324 298 L 324 338" stroke="#7C9E8A" strokeWidth="1.5" opacity="0.28" />

      {/* Bottom botanical – left sprig */}
      <path d="M 82 490 L 82 385" stroke="#7C9E8A" strokeWidth="2" opacity="0.32" />
      <ellipse cx="82" cy="405" rx="21" ry="9" fill="#7C9E8A" opacity="0.38" transform="rotate(-30 82 405)" />
      <ellipse cx="82" cy="428" rx="19" ry="8" fill="#9AB5A3" opacity="0.32" transform="rotate(25 82 428)" />
      <ellipse cx="82" cy="452" rx="17" ry="8" fill="#7C9E8A" opacity="0.28" transform="rotate(-20 82 452)" />
      <ellipse cx="82" cy="474" rx="14" ry="6" fill="#B8D5C4" opacity="0.28" transform="rotate(15 82 474)" />

      {/* Bottom botanical – right sprig */}
      <path d="M 318 490 L 318 385" stroke="#7C9E8A" strokeWidth="2" opacity="0.28" />
      <ellipse cx="318" cy="405" rx="21" ry="9" fill="#9AB5A3" opacity="0.32" transform="rotate(30 318 405)" />
      <ellipse cx="318" cy="428" rx="19" ry="8" fill="#7C9E8A" opacity="0.28" transform="rotate(-25 318 428)" />
      <ellipse cx="318" cy="452" rx="17" ry="8" fill="#B8D5C4" opacity="0.25" transform="rotate(20 318 452)" />
      <ellipse cx="318" cy="474" rx="14" ry="6" fill="#7C9E8A" opacity="0.22" transform="rotate(-15 318 474)" />

      {/* ECG / heartbeat line */}
      <path
        d="M 28 422 L 98 422 L 118 396 L 134 450 L 150 410 L 166 422 L 374 422"
        stroke="#D9896A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.48"
        fill="none"
      />

      {/* Micro floating dots */}
      <circle cx="140" cy="112" r="3.5" fill="#D9896A" opacity="0.48" />
      <circle cx="262" cy="118" r="3"   fill="#7C9E8A" opacity="0.42" />
      <circle cx="172" cy="92"  r="2.5" fill="#F2C4C4" opacity="0.52" />
      <circle cx="230" cy="88"  r="2.5" fill="#D9896A" opacity="0.38" />
      <circle cx="148" cy="362" r="3"   fill="#F2C4C4" opacity="0.38" />
      <circle cx="252" cy="358" r="3.5" fill="#D9896A" opacity="0.38" />
      <circle cx="200" cy="465" r="4"   fill="#7C9E8A" opacity="0.28" />
      <circle cx="174" cy="482" r="2.5" fill="#D9896A" opacity="0.28" />
      <circle cx="226" cy="480" r="2"   fill="#9AB5A3" opacity="0.32" />

      {/* Subtle bottom arc decoration */}
      <path d="M 0 500 Q 200 380 400 500" stroke="#CCC6BC" strokeWidth="0.7" fill="none" opacity="0.28" />
      <path d="M 0 500 Q 200 405 400 500" stroke="#CCC6BC" strokeWidth="0.5" fill="none" opacity="0.18" />
    </svg>
  )
}
