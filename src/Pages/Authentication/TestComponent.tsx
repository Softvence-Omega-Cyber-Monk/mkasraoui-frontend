const TestComponent = () => {
  return (
    <div>
      {/* SVG LOGO START */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" role="img" aria-label="Logo Ma Fête Facile IA" fill="none">
        <title>Ma Fête Facile IA</title>
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feOffset dy="4" in="SourceAlpha" />
            <feGaussianBlur stdDeviation="6" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .20 0" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Replace CSS class usage with inline styles or external CSS if needed */}
        {/* Manually fix path data, className issues, and remove in-SVG <style> */}

        <g filter="url(#shadow)">
          <circle cx="196" cy="358" r="10" fill="#F5C94E" />
          <circle cx="262" cy="614" r="12" fill="#F7B6B2" />
          <circle cx="312" cy="724" r="11" fill="#9BCBE2" />
          <circle cx="380" cy="810" r="12" fill="#F5C94E" />
          <circle cx="836" cy="520" r="12" fill="#F5C94E" />
          <circle cx="596" cy="300" r="12" fill="#9BCBE2" />
          <circle cx="486" cy="740" r="14" fill="#F7B6B2" />
        </g>

        <g stroke="#1F3E66" strokeWidth="14" filter="url(#shadow)" strokeLinecap="round" strokeLinejoin="round">
          <path d="M140 370 C 240 350, 340 300, 420 250" fill="none" />
          <path d="M210 405 L250 355 L290 405 Z" fill="#9BCBE2" stroke="none" />
          <path d="M300 395 L340 340 L380 395 Z" fill="#BFDCE7" stroke="none" />
        </g>

        <g filter="url(#shadow)">
          <polygon points="470,170 495,210 540,218 508,250 515,295 470,272 425,295 432,250 400,218 445,210" fill="#F6C23E" />

          <path
            d="M430 220 L520 350 C515 380 470 405 420 405 C370 405 330 380 335 355 Z"
            fill="#F6C23E"
          />

          <path
            d="M410 285 C455 270 475 300 505 335"
            stroke="#E8AE35"
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M395 335 C445 320 470 350 495 375"
            stroke="#E8AE35"
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        <g filter="url(#shadow)">
          <ellipse cx="740" cy="300" rx="110" ry="120" fill="#F8BDC8" />
          <path
            d="M736 410 C 740 455,760 490, 780 520"
            stroke="#1F3E66"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <rect x="725" y="390" width="30" height="22" rx="6" fill="#F8BDC8" />

          <path
            d="M792 252 C802 220 799 200 792 182"
            stroke="#233A64"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity=".25"
          />
          <circle cx="812" cy="210" r="8" fill="#F8BDC8" />
        </g>

        <g filter="url(#shadow)">
          <text
            x="512"
            y="520"
            textAnchor="middle"
            fontSize="150"
            fontWeight="800"
            fill="#233A64"
            fontFamily="'Baloo 2','Poppins','Nunito','Arial Rounded MT Bold',system-ui,sans-serif"
          >
            Ma Fête
          </text>
          <text
            x="512"
            y="680"
            textAnchor="middle"
            fontSize="160"
            fontWeight="800"
            fill="#233A64"
            fontFamily="'Baloo 2','Poppins','Nunito','Arial Rounded MT Bold',system-ui,sans-serif"
          >
            Facile
          </text>
        </g>

        <g stroke="#233A64" strokeWidth="16" filter="url(#shadow)" strokeLinecap="round" strokeLinejoin="round">
          <path d="M340 780 C 410 845, 515 848, 590 820" fill="none" />
          <path d="M590 820 C 618 812, 635 812, 662 820" fill="none" />
          <path d="M660 820 L 618 842 L 630 796 Z" fill="#233A64" stroke="none" />
        </g>

        <g transform="rotate(12 720 760)" filter="url(#shadow)">
          <rect x="640" y="720" rx="40" ry="40" width="220" height="170" fill="#BFDCCF" />
          <text
            x="750"
            y="835"
            textAnchor="middle"
            fontSize="140"
            fontWeight="900"
            fill="#2E5A86"
            fontFamily="'Baloo 2','Poppins','Nunito','Arial Rounded MT Bold',system-ui,sans-serif"
          >
            IA
          </text>

          <g stroke="#F6C23E" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round">
            <path d="M885 725 L 905 705" />
            <path d="M905 790 L 933 780" />
            <path d="M870 870 L 895 890" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default TestComponent;
