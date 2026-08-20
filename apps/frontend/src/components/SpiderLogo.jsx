import { useState } from 'react';

export default function SpiderLogo({ size = 64, onClick, defaultRed = false }) {
  const [red, setRed] = useState(defaultRed);

  const handleClick = () => {
    setRed((v) => !v);
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Logo BeeCarbonit"
      className="block focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg transition-transform hover:scale-105 active:scale-95 overflow-hidden"
      style={{ width: size, height: size }}
    >
      <img
        src="/logo.png"
        alt="BeeCarbonit Logo"
        className="w-full h-full object-contain"
      />
    </button>
  );
}
