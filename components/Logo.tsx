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
