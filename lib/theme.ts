export type Theme = "day" | "night";
export const THEME_KEY = "ka-theme";

/** Day theme between these hours, Sofia time (Europe/Sofia, DST included); night otherwise. */
export const DAY_FROM = 7;
export const DAY_TO = 18;

/** Runs inline in <head> before paint: the visitor's own choice (this session), else day/night by the time in Sofia. */
export const themeInitScript = `(function(){var d=document.documentElement,t;try{t=sessionStorage.getItem('${THEME_KEY}')}catch(e){}if(t!=='day'&&t!=='night'){try{var h=+new Intl.DateTimeFormat('en-GB',{hour:'numeric',hourCycle:'h23',timeZone:'Europe/Sofia'}).format(new Date());t=(h>=${DAY_FROM}&&h<${DAY_TO})?'day':'night'}catch(e){t='night'}}d.dataset.theme=t;try{var p=location.pathname,home=p==='/'||p==='/en'||p==='/en/';var m=document.querySelector('meta[name=theme-color]');if(m)m.content=home?(t==='day'?'#F5EACE':'#202338'):(t==='day'?'#FFF3D1':'#0E1430')}catch(e){}})();`;

/** The theme the clock says right now in Sofia. */
export function sofiaTheme(now = new Date()): Theme {
  const h = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Europe/Sofia" }).format(now));
  return h >= DAY_FROM && h < DAY_TO ? "day" : "night";
}

/** True when the visitor picked a theme with the toggle in this session (then the clock no longer decides). */
export function hasOwnChoice(): boolean {
  try {
    const t = sessionStorage.getItem(THEME_KEY);
    return t === "day" || t === "night";
  } catch {
    return false;
  }
}

/** remember=false for the automatic clock switch, so it doesn't count as the visitor's own choice. */
export function setTheme(t: Theme, remember = true) {
  document.documentElement.dataset.theme = t;
  if (remember) {
    try {
      sessionStorage.setItem(THEME_KEY, t);
    } catch {}
  }
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
