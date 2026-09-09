import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'badge' | 'icon';
  color?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = 'w-8 h-8',
  variant = 'badge',
  color = '#0F766E',
}) => {
  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 512 512"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Single Main Circle */}
        <circle cx="256" cy="256" r="198" stroke={color} strokeWidth="36" />
        {/* Center Target Ring */}
        <circle cx="256" cy="256" r="58" stroke={color} strokeWidth="36" />
        {/* 4 Outer Crosshair Ticks Crossing the Outer Circle */}
        <path
          d="M256 12V106M256 406V500M12 256H106M406 256H500"
          stroke={color}
          strokeWidth="36"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="128" fill={color} />
      {/* Outer Single Main Circle */}
      <circle cx="256" cy="256" r="150" stroke="white" strokeWidth="30" />
      {/* Center Target Ring */}
      <circle cx="256" cy="256" r="44" stroke="white" strokeWidth="30" />
      {/* 4 Outer Crosshair Ticks Crossing the Outer Circle */}
      <path
        d="M256 40V136M256 376V472M40 256H136M376 256H472"
        stroke="white"
        strokeWidth="30"
        strokeLinecap="round"
      />
    </svg>
  );
};


