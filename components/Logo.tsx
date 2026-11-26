/** Wordmark after the real logo: boxed lowercase “kare” over a brushed “ARTE”. */
export function Logo({ className, title = "KaRe-Arte" }: { className?: string; title?: string }) {
  return (
    <span className={`logo ${className ?? ""}`} role="img" aria-label={title}>
      <span className="logo-kare">kare</span>
      <span className="logo-arte">ARTE</span>
    </span>
  );
}

/** Round badge like the Instagram avatar: brushed red→yellow disc. */
export function LogoDisc({ className }: { className?: string }) {
  return (
    <span className={`logo-disc ${className ?? ""}`} aria-hidden="true">
      <Logo />
    </span>
  );
}

/** Header emblem: the round "kare ARTE" badge as a glowing sun (day) or moon (night). */
export function LogoOrb() {
  const rays = Array.from({ length: 14 }, (_, i) => i * (360 / 14));
  return (
    <span className="logo-orb" role="img" aria-label="KaRe-Arte">
      <svg className="orb-sun" viewBox="-60 -60 120 120" aria-hidden="true">
        <defs>
          <radialGradient id="sun-core" cx="40%" cy="38%">
            <stop offset="0" stopColor="#fffdf2" />
            <stop offset=".45" stopColor="#ffe98f" />
            <stop offset="1" stopColor="#f6b52e" />
          </radialGradient>
          <radialGradient id="sun-halo">
            <stop offset=".55" stopColor="#fff1b0" stopOpacity=".9" />
            <stop offset="1" stopColor="#ffd36e" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle r="58" fill="url(#sun-halo)" />
        <g className="orb-rays">
          {rays.map((a) => (
            <path key={a} d="M-5 -40L0 -55L5 -40Z" fill="#ffcf4a" transform={`rotate(${a})`} />
          ))}
        </g>
        <circle r="38" fill="url(#sun-core)" />
      </svg>
      <svg className="orb-moon" viewBox="-60 -60 120 120" aria-hidden="true">
        <defs>
          <radialGradient id="moon-core" cx="38%" cy="35%">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".55" stopColor="#e3ebff" />
            <stop offset="1" stopColor="#9fb3e6" />
          </radialGradient>
          <radialGradient id="moon-halo">
            <stop offset=".6" stopColor="#c9d8ff" stopOpacity=".7" />
            <stop offset="1" stopColor="#7f9cff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle r="58" fill="url(#moon-halo)" />
        <circle r="40" fill="url(#moon-core)" />
        <circle cx="16" cy="-14" r="6" fill="#b9c7ec" opacity=".7" />
        <circle cx="-20" cy="18" r="4.5" fill="#b9c7ec" opacity=".6" />
        <circle cx="22" cy="20" r="3" fill="#b9c7ec" opacity=".6" />
        <circle cx="-8" cy="-24" r="2.4" fill="#b9c7ec" opacity=".55" />
      </svg>
      <span className="orb-mark">
        <span className="logo-kare">kare</span>
        <span className="logo-arte">ARTE</span>
      </span>
    </span>
  );
}
