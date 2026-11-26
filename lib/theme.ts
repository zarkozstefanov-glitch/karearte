export type Theme = "day" | "night";
export const THEME_KEY = "ka-theme";

/** Runs inline in <head> before paint: explicit choice, else day 07–18 Sofia time, else night. */
export const themeInitScript = `(function(){try{var t=sessionStorage.getItem('${THEME_KEY}');if(t!=='day'&&t!=='night'){t='night';/* TODO restore Sofia time: var h=+new Intl.DateTimeFormat('en-GB',{hour:'numeric',hour12:false,timeZone:'Europe/Sofia'}).format(new Date());t=(h>=7&&h<18)?'day':'night'; */}document.documentElement.dataset.theme=t;var p=location.pathname,home=p==='/'||p==='/en'||p==='/en/';var m=document.querySelector('meta[name=theme-color]');if(m)m.content=home?(t==='day'?'#F5EACE':'#202338'):(t==='day'?'#FFF3D1':'#0E1430');}catch(e){document.documentElement.dataset.theme='night';}})();`;

export function setTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  try {
    sessionStorage.setItem(THEME_KEY, t);
  } catch {}
  syncBarColor();
  window.dispatchEvent(new CustomEvent("ka-theme", { detail: t }));
}

export function currentTheme(): Theme {
  return (document.documentElement.dataset.theme as Theme) || "night";
}

/** Colour of what is at the very top of the screen: the hero photo's top edge while the home page is
 *  at the top, the page background otherwise. Phones tint the status-bar area with it (theme-color),
 *  so nothing different shows above the (transparent) header. */
const BAR = { top: { day: "#F5EACE", night: "#202338" }, bg: { day: "#FFF3D1", night: "#0E1430" } };
export function syncBarColor() {
  const m = document.querySelector<HTMLMetaElement>("meta[name=theme-color]");
  if (!m) return;
  const t = currentTheme();
  const atHero = !!document.querySelector(".hero") && window.scrollY < 24;
  const c = atHero ? BAR.top[t] : BAR.bg[t];
  if (m.content !== c) m.content = c;
}
