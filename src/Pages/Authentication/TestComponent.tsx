const TestComponent = () => {
  return <div>
    {/* SVG LOGO START */}
    <svg width="1200" height="360"
      viewBox="0 0 1200 360" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img" aria-label="Logo Ma Fête Facile">

      <defs>
        <linearGradient id="gPink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FF5DA2" />
          <stop offset="100%" stop-color="#FF87C8" />
        </linearGradient>
        <linearGradient id="gPurple" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#7B61FF" />
          <stop offset="100%" stop-color="#A88BFF" />
        </linearGradient>
        <linearGradient id="gTeal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#2EC5CE" />
          <stop offset="100%" stop-color="#5ADADF" />
        </linearGradient>
        <linearGradient id="gYellow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FFC542" />
          <stop offset="100%" stop-color="#FFE08A" />
        </linearGradient>

        <symbol id="spark" viewBox="0 0 24 24">
          <path d="M12 0 L14.4 6.8 L21 9 L14.4 11.2 L12 18 L9.6 11.2 L3 9 L9.6 6.8 L12 0 z" fill="CurrentColor" />
        </symbol>
      </defs>

      <g transform="translate(70,40)">

        <ellipse cx="90" cy="110" rx="55" ry="70" fill="url(#gPink)" />

        <ellipse cx="70" cy="90" rx="16" ry="22" fill="#FFFFFF" opacity="0.35" />

        <path d="M90 178 c10 -6 10 -16 0 -20 c-10 4 -10 14 0 20" fill="#E23E85" />

        <path d="M90 178 C80 198, 110 210, 95 230 C82 248, 110 255, 100 275"
          stroke="#6A4DFF" stroke-width="3" fill="none" stroke-linecap="round" />

        <rect x="10" y="35" width="10" height="10" rx="2" fill="url(#gTeal)" transform="rotate(-15 15 40)" />

        <rect x="155" y="40" width="8" height="8" rx="2" fill="url(#gYellow)" transform="rotate(20 159 44)" />

        <use href="#spark" x="145" y="5" width="16" height="16" style={{ color: '#FFC542' }} />

        <use href="#spark" x="35" y="10" width="14" height="14" style={{ color: '#2EC5CE' }} />
      </g>

      <g font-family="Poppins, Montserrat, Arial, sans-serif">
        <text x="230" y="150" font-size="72" font-weight="700" fill="#1F2A44" letter-spacing="0.5">
          Ma Fête Facile
        </text>

        <text x="230" y="195" font-size="26" font-weight="500" fill="#5C6B8A">
          Organisateur d’anniversaires pour enfants — par l'IA
        </text>

        <circle cx="220" cy="125" r="5" fill="url(#gYellow)" />
        <circle cx="430" cy="92" r="4" fill="url(#gTeal)" />
        <circle cx="670" cy="95" r="5" fill="url(#gPink)" />
      </g>

      <g transform="translate(925,112)">
        <rect x="0" y="0" width="120" height="56" rx="28" fill="url(#gPurple)" />
        <text x="60" y="38" text-anchor="middle" font-size="28" font-weight="800"
          font-family="Poppins, Montserrat, Arial, sans-serif" fill="#FFFFFF">IA</text>
      </g>
    </svg>

  </div>;
};

export default TestComponent;
