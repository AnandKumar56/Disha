import React from 'react';

const DishaLogo = () => {
  return (
    <div className="flex items-center gap-2">
      {/* ICON */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-orange-500 transition-transform duration-300 hover:scale-105"
      >
        {/* Compass Circle */}
        <circle
          cx="32"
          cy="32"
          r="26"
          stroke="currentColor"
          strokeWidth="4"
        />

        {/* Compass Points */}
        <polygon points="32,4 36,12 28,12" fill="currentColor" />
        <polygon points="32,60 36,52 28,52" fill="currentColor" />
        <polygon points="4,32 12,28 12,36" fill="currentColor" />
        <polygon points="60,32 52,28 52,36" fill="currentColor" />

        {/* People (3 dots) */}
        <circle cx="24" cy="26" r="2.5" fill="currentColor" />
        <circle cx="32" cy="22" r="2.5" fill="currentColor" />
        <circle cx="40" cy="26" r="2.5" fill="currentColor" />

        {/* Ballot Box */}
        <rect
          x="22"
          y="30"
          width="20"
          height="16"
          rx="2"
          fill="currentColor"
        />

        {/* Checkmark */}
        <path
          d="M26 38 L30 42 L38 34"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* TEXT */}
      <span className="text-xl font-semibold text-gray-900">
        Disha
      </span>
    </div>
  );
};

export default DishaLogo;
