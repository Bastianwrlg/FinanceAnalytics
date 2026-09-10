import React, { useState } from 'react';
import { useLogoConfig } from '../utils/logoStorage';

interface PodaLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtext?: boolean;
}

export const PodaLogo: React.FC<PodaLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  showSubtext = true,
}) => {
  const [imageError, setImageError] = useState(false);
  const logoConfig = useLogoConfig();

  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
  };

  const bgClasses = {
    black: 'bg-black border-neutral-800 shadow-black/30',
    dark: 'bg-slate-900 border-slate-800 shadow-slate-950/30',
    white: 'bg-white border-slate-200 shadow-slate-300/50',
    transparent: 'bg-transparent border-transparent shadow-none',
  };

  const paddingClasses = [
    'p-0',
    'p-0.5',
    'p-1 sm:p-1.5',
    'p-2 sm:p-2.5',
    'p-3 sm:p-3.5',
  ];

  const currentPaddingClass = paddingClasses[Math.min(logoConfig.padding, 4)] || 'p-0.5 sm:p-1';
  const currentBgClass = bgClasses[logoConfig.bgColor] || bgClasses.black;

  // Custom logo rendering
  if (logoConfig.mode === 'custom' && logoConfig.customLogoUrl && !imageError) {
    if (variant === 'icon') {
      return (
        <div
          className={`inline-flex items-center justify-center rounded-xl border shadow-md shrink-0 select-none overflow-hidden ${currentBgClass} ${currentPaddingClass} ${className}`}
          style={{ aspectRatio: '1/1' }}
        >
          <img
            src={logoConfig.customLogoUrl}
            alt="PODA Logo Icon"
            className="w-full h-full object-contain rounded-lg"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        </div>
      );
    }

    return (
      <div
        className={`inline-flex items-center justify-center rounded-xl border shadow-md shrink-0 select-none overflow-hidden ${heightClasses[size]} ${currentBgClass} ${currentPaddingClass} ${className}`}
      >
        <img
          src={logoConfig.customLogoUrl}
          alt="PODA E-Liquid Company Logo"
          className="h-full w-auto object-contain rounded-lg max-w-full"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Official Logo rendering
  if (variant === 'icon') {
    return (
      <div
        className={`inline-flex items-center justify-center bg-black rounded-xl p-0.5 border border-neutral-800 shadow-md shrink-0 select-none overflow-hidden ${className}`}
        style={{ aspectRatio: '1/1' }}
      >
        {!imageError ? (
          <img
            src="/poda-icon.svg"
            alt="PODA Logo Icon"
            className="w-full h-full object-cover rounded-lg"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="400" height="400" rx="48" fill="#000000" />
            <g transform="translate(24, 60) scale(1.02)">
              <path
                d="M 46,28 L 152,28 C 196,28 230,58 230,110 C 230,154 200,185 154,185 L 114,185 L 114,242 L 46,242 Z"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.5"
                strokeLinejoin="round"
                opacity="0.9"
              />
              <circle cx="236" cy="118" r="88" fill="none" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.9" />

              <g fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="16" strokeLinejoin="round">
                <path d="M 52,34 L 148,34 C 192,34 224,64 224,112 C 224,156 194,182 148,182 L 110,182 L 110,236 L 52,236 Z" />
                <circle cx="236" cy="118" r="82" />
              </g>
              <g fill="#000000" stroke="#000000" strokeWidth="8" strokeLinejoin="round">
                <path d="M 52,34 L 148,34 C 192,34 224,64 224,112 C 224,156 194,182 148,182 L 110,182 L 110,236 L 52,236 Z" />
                <circle cx="236" cy="118" r="82" />
              </g>
              <circle cx="236" cy="118" r="78" fill="#000000" stroke="#FFFFFF" strokeWidth="7" />
              <circle cx="236" cy="118" r="42" fill="#000000" />
              <path
                d="M 236,88 C 236,88 214,116 214,132 C 214,144 224,152 236,152 C 248,152 258,144 258,132 C 258,116 236,88 236,88 Z"
                fill="#FFFFFF"
              />
              <path
                d="M 54,36 L 142,36 C 188,36 216,66 216,112 C 216,156 188,180 142,180 L 105,180 L 105,234 L 54,234 Z"
                fill="#E11D24"
                stroke="#FFFFFF"
                strokeWidth="7"
                strokeLinejoin="round"
              />
              <path
                d="M 160,54 C 198,70 214,96 214,112 C 214,148 192,170 165,178 C 186,164 198,138 198,112 C 198,86 182,64 160,54 Z"
                fill="#5B0609"
                opacity="0.6"
              />
              <path
                d="M 105,74 L 138,74 C 160,74 174,88 174,112 C 174,136 160,148 138,148 L 105,148 Z"
                fill="#000000"
                stroke="#000000"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        )}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center bg-black rounded-xl p-0.5 sm:p-1 border border-neutral-800 shadow-md shadow-black/25 shrink-0 select-none overflow-hidden ${heightClasses[size]} ${className}`}
    >
      {!imageError ? (
        <img
          src="/poda-brand-logo.svg"
          alt="PODA E-Liquid Company"
          className="h-full w-auto object-contain rounded-lg max-w-full"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
        />
      ) : (
        <svg
          viewBox="0 0 800 400"
          className="h-full w-auto max-w-full"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="PODA E-LIQUID COMPANY"
        >
          <defs>
            <linearGradient id="fallback-d-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="78%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#D1D5DB" />
            </linearGradient>
            <linearGradient id="fallback-d-facet" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E5E7EB" />
              <stop offset="100%" stopColor="#B0B4BC" />
            </linearGradient>
          </defs>

          <rect width="800" height="400" fill="#000000" />

          {/* Outer hairline wireframe outline */}
          <path
            d="
              M 144,74
              L 265,74
              C 300,74 326,83 348,100
              C 364,88 385,80 408,80
              C 430,80 450,87 466,98
              C 486,83 512,74 542,74
              L 620,74
              C 646,74 670,86 686,106
              L 714,148
              L 788,296
              C 792,304 788,314 778,314
              L 720,314
              C 712,314 705,309 702,301
              L 688,256
              L 660,256
              L 646,301
              C 643,309 636,314 628,314
              L 528,314
              C 495,314 468,304 446,287
              C 428,301 406,310 382,310
              C 358,310 336,301 318,287
              C 304,296 288,302 270,306
              L 214,306
              L 214,312
              C 214,316 210,320 206,320
              L 144,320
              C 138,320 134,316 134,310
              L 134,84
              C 134,78 138,74 144,74 Z
            "
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinejoin="round"
            opacity="0.95"
          />

          {/* Wordmark PODA */}
          <g transform="translate(40, 24)">
            {/* White casing */}
            <g fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="16" strokeLinejoin="round" strokeLinecap="round">
              <path d="M 115,62 L 222,62 C 274,62 308,94 308,144 C 308,194 274,226 222,226 L 175,226 L 175,268 L 115,268 Z" />
              <circle cx="346" cy="162" r="98" />
              <path d="M 405,62 L 485,62 C 555,62 598,104 598,162 C 598,220 555,262 485,262 L 405,262 Z" />
              <polygon points="575,268 655,62 735,268 680,268 668,220 642,220 630,268" />
            </g>

            {/* Black defining contour */}
            <g fill="#000000" stroke="#000000" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round">
              <path d="M 115,62 L 222,62 C 274,62 308,94 308,144 C 308,194 274,226 222,226 L 175,226 L 175,268 L 115,268 Z" />
              <circle cx="346" cy="162" r="98" />
              <path d="M 405,62 L 485,62 C 555,62 598,104 598,162 C 598,220 555,262 485,262 L 405,262 Z" />
              <polygon points="575,268 655,62 735,268 680,268 668,220 642,220 630,268" />
            </g>

            {/* Letter A */}
            <polygon
              points="580,265 655,65 730,265 682,265 667,218 643,218 628,265"
              fill="#000000"
              stroke="#FFFFFF"
              strokeWidth="7"
              strokeLinejoin="round"
            />
            <polygon
              points="655,122 672,192 638,192"
              fill="#000000"
              stroke="#FFFFFF"
              strokeWidth="6"
              strokeLinejoin="round"
            />

            {/* Letter D */}
            <path
              d="M 400,65 L 482,65 C 550,65 592,106 592,162 C 592,218 550,259 482,259 L 400,259 Z"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M 542,212 C 570,188 592,162 592,162 C 592,218 550,259 482,259 L 478,259 L 492,212 Z"
              fill="url(#fallback-d-facet)"
              opacity="0.9"
            />
            <path
              d="M 445,106 L 476,106 C 514,106 536,128 536,162 C 536,196 514,218 476,218 L 445,218 Z"
              fill="#000000"
              stroke="#000000"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Letter O */}
            <circle cx="346" cy="162" r="95" fill="#000000" stroke="#FFFFFF" strokeWidth="8" />
            <circle cx="346" cy="162" r="50" fill="#000000" />
            <path
              d="M 346,124 C 346,124 322,160 322,178 C 322,192 332,203 346,203 C 360,203 370,192 370,178 C 370,160 346,124 346,124 Z"
              fill="#FFFFFF"
            />

            {/* Letter P */}
            <path
              d="M 120,65 L 220,65 C 274,65 306,96 306,144 C 306,192 274,222 220,222 L 175,222 L 175,265 L 120,265 Z"
              fill="#E11D24"
              stroke="#FFFFFF"
              strokeWidth="8"
              strokeLinejoin="round"
            />
            <path
              d="M 240,82 C 285,98 304,128 304,144 C 304,184 282,210 248,218 C 270,202 284,175 284,144 C 284,116 266,93 240,82 Z"
              fill="#5B0609"
              opacity="0.6"
            />
            <path
              d="M 175,105 L 214,105 C 240,105 255,120 255,144 C 255,168 240,182 214,182 L 175,182 Z"
              fill="#000000"
              stroke="#000000"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </g>

          {/* Subtext: E-LIQUID COMPANY */}
          {showSubtext && (
            <g fill="#FFFFFF" transform="translate(400, 332)">
              <g transform="translate(-254, 0)">
                <path d="M 0,-24 L 20,-24 C 23,-24 25,-22 25,-19 L 25,-18 L 6,-18 L 6,-14 L 21,-14 L 21,-10 L 6,-10 L 6,-6 L 25,-6 L 25,-5 C 25,-2 23,0 20,0 L 0,0 C -3,0 -5,-2 -5,-5 L -5,-19 C -5,-22 -3,-24 0,-24 Z" />
                <rect x="33" y="-14" width="12" height="4" rx="2" />
                <path d="M 53,-24 L 59,-24 L 59,-6 L 75,-6 C 77,-6 78,-4 78,-2 L 78,0 L 53,0 C 50,0 48,-2 48,-5 L 48,-19 C 48,-22 50,-24 53,-24 Z" />
                <rect x="86" y="-24" width="6" height="24" rx="1.5" />
                <path d="M 104,-24 L 120,-24 C 124,-24 126,-22 126,-18 L 126,-6 C 126,-2 124,0 120,0 L 104,0 C 100,0 98,-2 98,-6 L 98,-18 C 98,-22 100,-24 104,-24 Z M 104,-19 C 103,-19 103,-18 103,-17 L 103,-7 C 103,-6 103,-5 104,-5 L 120,-5 C 121,-5 121,-6 121,-7 L 121,-17 C 121,-18 121,-19 120,-19 Z" />
                <polygon points="116,-9 128,4 122,5 113,-6" />
                <path d="M 136,-24 L 142,-24 L 142,-6 C 142,-5 143,-5 144,-5 L 156,-5 C 157,-5 158,-5 158,-6 L 158,-24 L 164,-24 L 164,-6 C 164,-2 161,0 157,0 L 143,0 C 139,0 136,-2 136,-6 Z" />
                <rect x="172" y="-24" width="6" height="24" rx="1.5" />
                <path d="M 186,-24 L 202,-24 C 209,-24 213,-20 213,-12 C 213,-4 209,0 202,0 L 186,0 C 183,0 181,-2 181,-5 L 181,-19 C 181,-22 183,-24 186,-24 Z M 187,-19 L 187,-5 L 201,-5 C 205,-5 207,-8 207,-12 C 207,-16 205,-19 201,-19 Z" />
                <path d="M 252,-24 L 270,-24 C 273,-24 275,-22 275,-19 L 275,-17 L 269,-17 L 269,-19 L 253,-19 C 252,-19 251,-18 251,-17 L 251,-7 C 251,-6 252,-5 253,-5 L 269,-5 L 269,-7 L 275,-7 L 275,-5 C 275,-2 273,0 270,0 L 252,0 C 248,0 245,-3 245,-7 L 245,-17 C 245,-21 248,-24 252,-24 Z" />
                <path d="M 288,-24 L 305,-24 C 309,-24 312,-21 312,-17 L 312,-7 C 312,-3 309,0 305,0 L 288,0 C 284,0 281,-3 281,-7 L 281,-17 C 281,-21 284,-24 288,-24 Z M 288,-19 C 287,-19 287,-18 287,-17 L 287,-7 C 287,-6 287,-5 288,-5 L 305,-5 C 306,-5 306,-6 306,-7 L 306,-17 C 306,-18 306,-19 305,-19 Z" />
                <path d="M 321,-24 L 327,-24 L 334,-10 L 341,-24 L 347,-24 L 347,0 L 341,0 L 341,-14 L 336,-4 L 332,-4 L 327,-14 L 327,0 L 321,0 Z" />
                <path d="M 356,-24 L 372,-24 C 376,-24 379,-21 379,-17 L 379,-11 C 379,-7 376,-4 372,-4 L 362,-4 L 362,0 L 356,0 Z M 362,-19 L 362,-9 L 371,-9 C 372,-9 373,-10 373,-11 L 373,-17 C 373,-18 372,-19 371,-19 Z" />
                <path d="M 394,-24 L 401,-24 L 413,0 L 406,0 L 403,-6 L 392,-6 L 389,0 L 382,0 Z M 394,-11 L 401,-11 L 397,-19 Z" />
                <path d="M 421,-24 L 427,-24 L 439,-6 L 439,-24 L 445,-24 L 445,0 L 439,0 L 427,-18 L 427,0 L 421,0 Z" />
                <path d="M 453,-24 L 460,-24 L 467,-13 L 474,-24 L 481,-24 L 470,-7 L 470,0 L 464,0 L 464,-7 Z" />
              </g>
            </g>
          )}
        </svg>
      )}
    </div>
  );
};
