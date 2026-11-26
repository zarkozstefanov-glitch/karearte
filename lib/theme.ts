export type Theme = "day" | "night";
export const THEME_KEY = "ka-theme";

/** Runs inline in <head> before paint: explicit choice, else day 07–18 Sofia time, else night. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');if(t!=='day'&&t!=='night'){var h=+new Intl.DateTimeFormat('en-GB',{hour:'numeric',hour12:false,timeZone:'Europe/Sofia'}).format(new Date());t=(h>=7&&h<18)?'day':'night';}document.documentElement.dataset.theme=t;var m=document.querySelector('meta[name=theme-color]');if(m)m.content=t==='day'?'#F6EFE2':'#0E1430';}catch(e){document.documentElement.dataset.theme='night';}})();`;

export function setTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch {}
  const m = document.querySelector<HTMLMetaElement>("meta[name=theme-color]");
  if (m) m.content = t === "day" ? "#F6EFE2" : "#0E1430";
  window.dispatchEvent(new CustomEvent("ka-theme", { detail: t }));
}

export function currentTheme(): Theme {
  return (document.documentElement.dataset.theme as Theme) || "night";
}
