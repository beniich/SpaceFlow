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
      aria-label="Logo spider"
      className="block focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg transition-transform hover:scale-105 active:scale-95"
      style={{ width: size, height: size }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 400"
        className={`w-full h-full ${red ? 'head-red' : ''}`}
      >
        <defs>
          <style>{`
            .head-fill { fill: var(--head); transition: fill .35s ease; }
            .head-edge { stroke: var(--head); transition: stroke .35s ease; }
            .eyes { fill: var(--bg); transition: fill .35s ease; }
            svg { --bg:#05070a; --web:#10222b; --body:#00dbe7; --body-dark:#0e8a99; --leg:#00dbe7; --leg-dark:#0b6570; --head:#00dbe7; }
            svg.head-red { --head:#ff2b2b; }
            svg.head-red .eyes { fill: #ffd6d6; }
          `}</style>
        </defs>

        <rect x="0" y="0" width="400" height="400" fill="var(--bg)"/>

        <g stroke="var(--web)" strokeWidth="1.5" fill="none" opacity="0.9">
          <line x1="200" y1="200" x2="200" y2="10"/>
          <line x1="200" y1="200" x2="340" y2="60"/>
          <line x1="200" y1="200" x2="390" y2="200"/>
          <line x1="200" y1="200" x2="340" y2="340"/>
          <line x1="200" y1="200" x2="200" y2="390"/>
          <line x1="200" y1="200" x2="60" y2="340"/>
          <line x1="200" y1="200" x2="10" y2="200"/>
          <line x1="200" y1="200" x2="60" y2="60"/>
          <polygon points="200,90 300,120 330,200 300,280 200,315 100,280 70,200 100,120"/>
          <polygon points="200,150 255,168 275,200 255,235 200,255 145,235 125,200 145,168"/>
          <polygon points="200,30 355,80 375,200 355,325 200,370 45,325 25,200 45,80"/>
        </g>

        <g stroke="var(--leg)" strokeWidth="10" strokeLinecap="square" strokeLinejoin="miter" fill="none">
          <path d="M175,175 L110,140 L55,90 L35,35"/>
          <path d="M170,195 L95,190 L35,205 L15,255"/>
          <path d="M170,215 L100,235 L55,285 L45,340"/>
          <path d="M180,230 L140,270 L120,320 L120,375"/>
          <path d="M225,175 L290,140 L345,90 L365,35"/>
          <path d="M230,195 L305,190 L365,205 L385,255"/>
          <path d="M230,215 L300,235 L345,285 L355,340"/>
          <path d="M220,230 L260,270 L280,320 L280,375"/>
        </g>

        <g fill="var(--leg-dark)">
          <circle cx="110" cy="140" r="5"/>
          <circle cx="55" cy="90" r="5"/>
          <circle cx="95" cy="190" r="5"/>
          <circle cx="35" cy="205" r="5"/>
          <circle cx="100" cy="235" r="5"/>
          <circle cx="55" cy="285" r="5"/>
          <circle cx="140" cy="270" r="5"/>
          <circle cx="120" cy="320" r="5"/>
          <circle cx="290" cy="140" r="5"/>
          <circle cx="345" cy="90" r="5"/>
          <circle cx="305" cy="190" r="5"/>
          <circle cx="365" cy="205" r="5"/>
          <circle cx="300" cy="235" r="5"/>
          <circle cx="345" cy="285" r="5"/>
          <circle cx="260" cy="270" r="5"/>
          <circle cx="280" cy="320" r="5"/>
        </g>

        <polygon points="200,205 250,260 200,375 150,260" fill="var(--body)"/>
        <polygon points="200,205 250,260 200,375 150,260" fill="none" stroke="var(--body-dark)" strokeWidth="3"/>
        <polygon points="200,205 200,375 150,260" fill="var(--body-dark)" opacity="0.35"/>

        <polygon className="head-fill" points="200,120 235,175 200,215 165,175"/>
        <polygon className="head-edge" points="200,120 235,175 200,215 165,175" fill="none" strokeWidth="3"/>

        <g className="eyes">
          <circle cx="188" cy="165" r="3.5"/>
          <circle cx="212" cy="165" r="3.5"/>
          <circle cx="196" cy="180" r="2.5"/>
          <circle cx="204" cy="180" r="2.5"/>
        </g>
      </svg>
    </button>
  );
}
