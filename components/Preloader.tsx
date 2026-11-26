/** Preloader (~5.5 s, once per session): a real paintbrush paints the canvas — the paint appears
 *  exactly under the bristles. Blue wash → orange swoosh → yellow swirl → the wine glass drawn
 *  bottom-up (base, stem, bowl) → draws a wine bottle → the bottle
 *  tilts and pours red wine into the glass → the canvas fades away. */
export const preloaderScript = `;(function(){try{var d=document.documentElement;if(sessionStorage.getItem('ka-pl')||matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('pl-skip')}else{sessionStorage.setItem('ka-pl','1')}}catch(e){document.documentElement.classList.add('pl-skip')}})();`;

const run = `;(function(){
var H=document.documentElement;if(H.classList.contains('pl-skip'))return;
var root=document.getElementById('preloader');if(!root)return;
var stage=root.querySelector('.pl-stage');
var fit=function(){stage.style.setProperty('--s',(Math.min(innerWidth*.8,innerHeight*.62,500)/360).toFixed(3))};fit();addEventListener('resize',fit);
var svg=root.querySelector('svg'),brush=svg.querySelector('#pl-brush'),tip=svg.querySelector('#pl-tip');
var q=function(s){return root.querySelector(s)},F='forwards';
function pts(path,n){var L=path.getTotalLength(),k=[];for(var i=0;i<=n;i++){var p=path.getPointAtLength(L*i/n);k.push({transform:'translate('+p.x.toFixed(1)+'px,'+p.y.toFixed(1)+'px)'})}return k}
function paint(sel,start,dur,color,ease){
  var path=q(sel);ease=ease||'cubic-bezier(.4,0,.3,1)';
  var L=path.getTotalLength();path.style.strokeDasharray=L+' '+L;path.style.strokeDashoffset=L;
  path.animate([{strokeDashoffset:L},{strokeDashoffset:0}],{duration:dur,delay:start,fill:F,easing:ease});
  brush.animate(pts(path,80),{duration:dur,delay:start,fill:F,easing:ease});
  setTimeout(function(){tip.style.fill=color},start);
}
function hop(a,b,start,dur){brush.animate([{transform:'translate('+a+')'},{transform:'translate('+b+')'}],{duration:dur,delay:start,fill:F,easing:'cubic-bezier(.45,0,.55,1)'})}
/* one timeline: every step starts where the previous ended; S scales the whole thing */
var S=.6,t=0,ms=function(x){return Math.round(x*S)};
function P(sel,d,c){d=ms(d);paint(sel,t,d,c);t+=d}
function J(a,b,d){d=ms(d);hop(a,b,t,d);t+=d}
brush.animate([{opacity:0,transform:'translate(420px,40px)'},{opacity:1,transform:'translate(46px,150px)'}],{duration:ms(600),fill:F,easing:'cubic-bezier(.2,.7,.3,1)'});t=ms(600);
P('#pl-blue',760,'#26408b');      J('326px,160px','58px,222px',260);
P('#pl-orange',560,'#e8742a');    J('306px,222px','78px,78px',300);
P('#pl-swirl',460,'#f0a92a');     J('92px,82px','150px,232px',300);
P('#pl-base',300,'#1e1b2e');      J('210px,232px','180px,229px',130);
P('#pl-stem',280,'#1e1b2e');
P('#pl-bowl-line',800,'#1e1b2e'); J('180px,174px','268px,76px',420);
P('#pl-bottle-line',700,'#1e1b2e');
q('#pl-bottle-fill').animate([{opacity:0},{opacity:1}],{duration:ms(380),delay:t,fill:F,easing:'ease-out'});
brush.animate([{opacity:1,transform:'translate(268px,76px)'},{opacity:0,transform:'translate(450px,30px) rotate(30deg)'}],{duration:ms(560),delay:t+ms(40),fill:F,easing:'cubic-bezier(.5,0,.75,0)'});
var b0=t+ms(160),bd=ms(1500);
q('#pl-bottle').animate([{transform:'none'},{transform:'translate(0px,-133px) rotate(-120deg)',offset:.35},{transform:'translate(0px,-133px) rotate(-120deg)',offset:.75},{transform:'none'}],{duration:bd,delay:b0,fill:F,easing:'cubic-bezier(.45,0,.35,1)'});
var st=q('#pl-stream'),SL=st.getTotalLength();st.style.strokeDasharray=SL+' '+SL;st.style.strokeDashoffset=SL;
var s0=b0+Math.round(bd*.3);
st.animate([{strokeDashoffset:SL},{strokeDashoffset:0,offset:.25},{strokeDashoffset:0,offset:.7},{strokeDashoffset:-SL}],{duration:ms(820),delay:s0,fill:F,easing:'linear'});
q('#pl-wine').animate([{transform:'translateY(80px)'},{transform:'translateY(0px)'}],{duration:ms(800),delay:s0+ms(60),fill:F,easing:'cubic-bezier(.2,.7,.3,1)'});
t=b0+bd+ms(80);
t+=ms(700);
setTimeout(function(){H.classList.add('pl-done');setTimeout(function(){H.classList.add('pl-gone')},950)},t);
})();`;

const GLASS_BOWL = "M148 78C146 134 161 170 180 174C199 170 214 134 212 78Z";
const BOTTLE = "M262 76H274V102C274 110 290 116 290 130V226Q290 232 284 232H252Q246 232 246 226V130C246 116 262 110 262 102Z";

export function Preloader() {
  return (
    <>
      <div id="preloader" aria-hidden="true">
        <div className="pl-bg" />
        <div className="pl-stage">
          <svg viewBox="-90 -12 500 470" width="360" height="338" className="pl-svg">
            <defs>
              <filter id="pl-rough" x="-20%" y="-30%" width="140%" height="160%">
                <feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="3" seed="3" />
                <feDisplacementMap in="SourceGraphic" scale="7" />
              </filter>
              <filter id="pl-bristle" x="-10%" y="-30%" width="120%" height="160%">
                <feTurbulence type="fractalNoise" baseFrequency=".9 .04" numOctaves="2" seed="5" result="n" />
                <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 1.25" result="m" />
                <feComposite in="SourceGraphic" in2="m" operator="in" result="c" />
                <feDisplacementMap in="c" scale="6" />
              </filter>
              <clipPath id="pl-bowl">
                <path d={GLASS_BOWL} />
              </clipPath>
              <linearGradient id="pl-wood" x1="0" x2="1">
                <stop offset="0" stopColor="#4a2c12" />
                <stop offset=".35" stopColor="#c8873f" />
                <stop offset=".55" stopColor="#e1a560" />
                <stop offset="1" stopColor="#5e3a18" />
              </linearGradient>
              <linearGradient id="pl-metal" x1="0" x2="1">
                <stop offset="0" stopColor="#6f6f78" />
                <stop offset=".45" stopColor="#f6f6f8" />
                <stop offset="1" stopColor="#7d7d86" />
              </linearGradient>
              <linearGradient id="pl-hair" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#efe2c4" />
                <stop offset=".55" stopColor="#d8c39a" />
                <stop offset="1" stopColor="#bfa577" />
              </linearGradient>
              <linearGradient id="pl-green" x1="0" x2="1">
                <stop offset="0" stopColor="#1f3a24" />
                <stop offset=".3" stopColor="#3f6b45" />
                <stop offset=".45" stopColor="#6f9b70" />
                <stop offset="1" stopColor="#1c3220" />
              </linearGradient>
            </defs>

            <g className="pl-studio">
              <defs>
                <linearGradient id="pl-leg" x1="0" x2="1"><stop offset="0" stopColor="#5e3a18" /><stop offset=".45" stopColor="#c8873f" /><stop offset=".6" stopColor="#d9a05a" /><stop offset="1" stopColor="#6e451f" /></linearGradient>
                <radialGradient id="pl-floor"><stop offset="0" stopColor="#000" stopOpacity=".55" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
                <linearGradient id="pl-seat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d9a560" /><stop offset="1" stopColor="#9a6532" /></linearGradient>
              </defs>
              <ellipse cx="180" cy="454" rx="150" ry="14" fill="url(#pl-floor)" />
              <ellipse cx="-36" cy="454" rx="58" ry="9" fill="url(#pl-floor)" />
              <path d="M176 -6H184L186 452H174Z" fill="#5a3818" stroke="#3a210c" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M106 296L118 300L64 452H50Z" fill="url(#pl-leg)" stroke="#3a210c" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M242 300L254 296L310 452H296Z" fill="url(#pl-leg)" stroke="#3a210c" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M82 378H278V386H82Z" fill="url(#pl-leg)" stroke="#3a210c" strokeWidth="1.6" strokeLinejoin="round" />
              <rect x="158" y="-4" width="44" height="16" rx="3" fill="url(#pl-leg)" stroke="#3a210c" strokeWidth="1.6" strokeLinejoin="round" />
              <rect x="49" y="12" width="270" height="336" rx="2" fill="#cfc5b1" stroke="#9c927f" strokeWidth="1.2" />
              <rect x="45" y="8" width="270" height="336" rx="2" className="pl-canvas" />
              <rect x="51" y="14" width="258" height="324" fill="none" stroke="#e7e0d1" strokeWidth="2" />
              <path d="M45 8L51 14M315 8L309 14M45 344L51 338M315 344L309 338" stroke="#d6cdbb" strokeWidth="1.5" />
              <rect x="28" y="344" width="304" height="16" rx="4" fill="url(#pl-seat)" stroke="#3a210c" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M34 349H326" stroke="#f0c27c" strokeWidth="1.5" opacity=".7" />
              <g transform="translate(-36 0)">
                <path d="M-30 370L-44 452H-36L-20 372Z" fill="url(#pl-leg)" stroke="#3a210c" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M30 370L44 452H36L20 372Z" fill="url(#pl-leg)" stroke="#3a210c" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M-3 374L-5 452H3L3 374Z" fill="#5a3818" stroke="#3a210c" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M-34 416H34" stroke="#7a4d26" strokeWidth="5" strokeLinecap="round" />
                <ellipse cx="0" cy="372" rx="47" ry="13" fill="#7a4d26" stroke="#3a210c" strokeWidth="1.6" strokeLinejoin="round" />
                <ellipse cx="0" cy="367" rx="47" ry="13" fill="url(#pl-seat)" stroke="#3a210c" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M-36 365Q0 360 36 365M-30 370Q0 366 30 370" stroke="#a9733a" strokeWidth=".9" fill="none" />
                <path d="M-38 357C-40 349 -26 344 -12 346C2 347 8 352 4 357C1 361 -6 358 -9 361C-12 364 -16 365 -26 364C-34 363 -37 361 -38 357Z" fill="#e9dcc2" stroke="#9c8a68" strokeWidth="1.2" />
                <ellipse cx="-4" cy="354" rx="3" ry="2" fill="#9c8a68" />
                <circle cx="-30" cy="355" r="3.4" fill="#26408b" stroke="#1a2b63" strokeWidth=".8" />
                <circle cx="-20" cy="351" r="3" fill="#e8742a" stroke="#a24f16" strokeWidth=".8" />
                <circle cx="-11" cy="351" r="3" fill="#f0a92a" stroke="#a3700e" strokeWidth=".8" />
                <circle cx="-22" cy="359" r="2.8" fill="#9b1c31" stroke="#5f0f1d" strokeWidth=".8" />
                <path d="M14 328H31L30 360H15Z" fill="#cfe7ec" fillOpacity=".75" stroke="#7fa6ad" strokeWidth="1.2" />
                <path d="M17 332V356" stroke="#fff" strokeWidth="2" opacity=".7" strokeLinecap="round" />
                <path d="M18 330L12 294M23 330L24 288M27 330L35 298" stroke="#8a5a2e" strokeWidth="2.8" strokeLinecap="round" />
                <path d="M12 294l-2-7M24 288v-7M35 298l2-7" stroke="#26408b" strokeWidth="3.6" strokeLinecap="round" />
                <rect x="33" y="349" width="12" height="11" rx="2" fill="#e8742a" stroke="#a24f16" strokeWidth="1" />
                <rect x="-44" y="347" width="11" height="13" rx="2" fill="#26408b" stroke="#1a2b63" strokeWidth="1" />
              </g>
            </g>
            <g transform="translate(36 21) scale(.78)">
            <path id="pl-blue" d="M46 150C92 108 140 196 196 146S300 118 326 160" className="pl-paint" stroke="#26408b" strokeWidth="50" />
            <path id="pl-orange" d="M58 222C118 252 206 186 306 222" className="pl-paint" stroke="#e8742a" strokeWidth="34" />
            <path id="pl-swirl" d="M78 78c12-18 40-12 38 8c-2 16-26 16-26 2c0-8 10-10 14-4" className="pl-paint pl-swirl" stroke="#f0a92a" strokeWidth="9" />

            <g clipPath="url(#pl-bowl)">
              <g id="pl-wine" style={{ transform: "translateY(80px)" }}>
                <path d="M140 102q10-5 20 0t20 0t20 0t20 0V180H140Z" fill="#9b1c31" />
                <path d="M140 102q10-5 20 0t20 0t20 0t20 0" fill="none" stroke="#c9374d" strokeWidth="3" />
              </g>
            </g>
            <path id="pl-stream" d="M201 62C195 70 188 84 186 104L185 168" fill="none" stroke="#9b1c31" strokeWidth="5" strokeLinecap="round" />
            <path id="pl-base" d="M150 232Q180 222 210 232" className="pl-ink" />
            <path id="pl-stem" d="M180 229L180 174" className="pl-ink" />
            <path id="pl-bowl-line" d="M180 174C161 170 146 134 148 78L212 78C214 134 199 170 180 174" className="pl-ink" />

            <g id="pl-bottle">
              <g id="pl-bottle-fill" style={{ opacity: 0 }}>
                <path d={BOTTLE} fill="url(#pl-green)" />
                <rect x="250" y="158" width="36" height="40" rx="2" fill="#f3e6c8" />
                <rect x="254" y="164" width="28" height="7" fill="#c8361c" />
                <path d="M256 180h24M256 186h18" stroke="#1e1b2e" strokeWidth="1.6" />
                <rect x="261" y="72" width="14" height="10" rx="2" fill="#9b1c31" />
                <path d="M252 132V220" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity=".35" />
              </g>
              <path id="pl-bottle-line" d={BOTTLE} className="pl-ink" />
            </g>


            {/* the paintbrush (bristle tip at 0,0) */}
            <g id="pl-brush" style={{ opacity: 0 }}>
              <g transform="rotate(-36) scale(1.5)">
                <path d="M-4.5 -58L-6 -150Q0 -158 6 -150L4.5 -58Z" fill="url(#pl-wood)" stroke="#3a210c" strokeWidth=".6" />
                <path d="M-1.2 -62L-2 -146" stroke="#f6d39a" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
                <path d="M-7 -36L-6.5 -60H6.5L7 -36Z" fill="url(#pl-metal)" stroke="#55555c" strokeWidth=".5" />
                <path d="M-6.8 -52H6.8M-6.9 -48H6.9" stroke="#7b7b84" strokeWidth=".9" />
                <path d="M-7 -36C-8 -22 -5 -9 0 0C5 -9 8 -22 7 -36Z" fill="url(#pl-hair)" />
                <path d="M-4 -34C-4 -22 -2 -10 0 -2M0 -35V-3M4 -34C4 -22 2 -10 0 -2M-6 -30C-5 -20 -3 -12 -1 -5M6 -30C5 -20 3 -12 1 -5" stroke="#a88c5c" strokeWidth=".6" fill="none" opacity=".8" />
                <path id="pl-tip" d="M-5.6 -20C-5 -11 -2.6 -4.5 0 0C2.6 -4.5 5 -11 5.6 -20C2 -17 -2 -17 -5.6 -20Z" fill="#26408b" />
                <ellipse cx="-1.6" cy="-11" rx="1" ry="3.2" fill="#fff" opacity=".35" />
              </g>
            </g>
            </g>
          </svg>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: run }} />
    </>
  );
}
