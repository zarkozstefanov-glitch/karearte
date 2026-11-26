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
          <radialGradient id="moon-shade" cx="78%" cy="80%" r="75%">
            <stop offset="0" stopColor="#3b4f8f" stopOpacity=".55" />
            <stop offset=".55" stopColor="#3b4f8f" stopOpacity=".12" />
            <stop offset="1" stopColor="#3b4f8f" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="moon-halo">
            <stop offset=".6" stopColor="#c9d8ff" stopOpacity=".7" />
            <stop offset="1" stopColor="#7f9cff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle r="58" fill="url(#moon-halo)" />
        <circle r="40" fill="url(#moon-core)" />
        <circle cx="16" cy="-14" r="7" fill="#a9b9e4" opacity=".75" />
        <circle cx="17.8" cy="-12.2" r="5.5" fill="#c3d0f2" opacity=".85" />
        <path d="M9.7 -15.4A7 7 0 0 1 17.4 -20.6" stroke="#8597cc" strokeWidth=".9" fill="none" opacity=".7" />
        <circle cx="-20" cy="18" r="5.5" fill="#a9b9e4" opacity=".75" />
        <circle cx="-18.6" cy="19.4" r="4.3" fill="#c3d0f2" opacity=".85" />
        <path d="M-24.9 16.9A5.5 5.5 0 0 1 -18.9 12.8" stroke="#8597cc" strokeWidth=".9" fill="none" opacity=".7" />
        <circle cx="22" cy="20" r="3.6" fill="#a9b9e4" opacity=".75" />
        <circle cx="22.9" cy="20.9" r="2.8" fill="#c3d0f2" opacity=".85" />
        <path d="M18.8 19.3A3.6 3.6 0 0 1 22.7 16.6" stroke="#8597cc" strokeWidth=".9" fill="none" opacity=".7" />
        <circle cx="-8" cy="-24" r="3" fill="#a9b9e4" opacity=".75" />
        <circle cx="-7.2" cy="-23.2" r="2.3" fill="#c3d0f2" opacity=".85" />
        <path d="M-10.7 -24.6A3 3 0 0 1 -7.4 -26.9" stroke="#8597cc" strokeWidth=".9" fill="none" opacity=".7" />
        <circle cx="-24" cy="-6" r="4" fill="#a9b9e4" opacity=".75" />
        <circle cx="-23.0" cy="-5.0" r="3.1" fill="#c3d0f2" opacity=".85" />
        <path d="M-27.6 -6.8A4 4 0 0 1 -23.2 -9.8" stroke="#8597cc" strokeWidth=".9" fill="none" opacity=".7" />
        <circle cx="4" cy="6" r="2.6" fill="#a9b9e4" opacity=".75" />
        <circle cx="4.7" cy="6.7" r="2.0" fill="#c3d0f2" opacity=".85" />
        <path d="M1.7 5.5A2.6 2.6 0 0 1 4.5 3.5" stroke="#8597cc" strokeWidth=".9" fill="none" opacity=".7" />
        <circle cx="-6" cy="28" r="3.2" fill="#a9b9e4" opacity=".75" />
        <circle cx="-5.2" cy="28.8" r="2.5" fill="#c3d0f2" opacity=".85" />
        <path d="M-8.9 27.4A3.2 3.2 0 0 1 -5.4 25.0" stroke="#8597cc" strokeWidth=".9" fill="none" opacity=".7" />
        <circle cx="28" cy="2" r="2.4" fill="#a9b9e4" opacity=".75" />
        <circle cx="28.6" cy="2.6" r="1.9" fill="#c3d0f2" opacity=".85" />
        <path d="M25.8 1.5A2.4 2.4 0 0 1 28.5 -0.3" stroke="#8597cc" strokeWidth=".9" fill="none" opacity=".7" />
        <circle cx="10" cy="-30" r="2" fill="#a9b9e4" opacity=".75" />
        <circle cx="10.5" cy="-29.5" r="1.6" fill="#c3d0f2" opacity=".85" />
        <path d="M8.2 -30.4A2 2 0 0 1 10.4 -31.9" stroke="#8597cc" strokeWidth=".9" fill="none" opacity=".7" />
        <circle cx="-30" cy="8" r="2.2" fill="#a9b9e4" opacity=".75" />
        <circle cx="-29.4" cy="8.6" r="1.7" fill="#c3d0f2" opacity=".85" />
        <path d="M-32.0 7.6A2.2 2.2 0 0 1 -29.6 5.9" stroke="#8597cc" strokeWidth=".9" fill="none" opacity=".7" />
        <circle cx="12" cy="30" r="2.4" fill="#a9b9e4" opacity=".75" />
        <circle cx="12.6" cy="30.6" r="1.9" fill="#c3d0f2" opacity=".85" />
        <path d="M9.8 29.5A2.4 2.4 0 0 1 12.5 27.7" stroke="#8597cc" strokeWidth=".9" fill="none" opacity=".7" />
        <circle cx="-14" cy="-10" r="1.8" fill="#a9b9e4" opacity=".75" />
        <circle cx="-13.6" cy="-9.6" r="1.4" fill="#c3d0f2" opacity=".85" />
        <path d="M-15.6 -10.4A1.8 1.8 0 0 1 -13.6 -11.7" stroke="#8597cc" strokeWidth=".9" fill="none" opacity=".7" />
        <circle cx="30" cy="-14" r="1.8" fill="#a9b9e4" opacity=".75" />
        <circle cx="30.4" cy="-13.6" r="1.4" fill="#c3d0f2" opacity=".85" />
        <path d="M28.4 -14.4A1.8 1.8 0 0 1 30.4 -15.7" stroke="#8597cc" strokeWidth=".9" fill="none" opacity=".7" />
        <circle r="40" fill="url(#moon-shade)" />
      </svg>
      <span className="orb-mark">
        <span className="logo-kare">kare</span>
        <span className="logo-arte">ARTE</span>
      </span>
    </span>
  );
}
