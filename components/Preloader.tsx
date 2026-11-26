/** Preloader (~3.3 s, once per session): a real paintbrush paints the canvas — the paint appears
 *  exactly under the bristles. Blue wash → orange swoosh → yellow swirl → the wine glass drawn
 *  bottom-up (base, stem, bowl) → the brush signs "KaRe-Arte" → draws a wine bottle → the bottle
 *  tilts and pours red wine into the glass → the name pops and the canvas fades away. */
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
  brush.animate(pts(path,40),{duration:dur,delay:start,fill:F,easing:ease});
  setTimeout(function(){tip.style.fill=color},start);
}
function write(guide,clip,w,start,dur,color){
  brush.animate(pts(q(guide),36),{duration:dur,delay:start,fill:F,easing:'linear'});
  q(clip).animate([{width:'0px'},{width:w+'px'}],{duration:dur,delay:start,fill:F,easing:'linear'});
  setTimeout(function(){tip.style.fill=color},start);
}
function hop(a,b,start,dur){brush.animate([{transform:'translate('+a+')'},{transform:'translate('+b+')'}],{duration:dur,delay:start,fill:F,easing:'ease-in-out'})}
brush.animate([{opacity:0,transform:'translate(420px,40px)'},{opacity:1,transform:'translate(46px,150px)'}],{duration:220,fill:F,easing:'ease-out'});
paint('#pl-blue',220,380,'#26408b');      hop('326px,160px','58px,222px',600,50);
paint('#pl-orange',650,280,'#e8742a');    hop('306px,222px','78px,78px',930,40);
paint('#pl-swirl',970,160,'#f0a92a');     hop('92px,82px','150px,232px',1130,50);
paint('#pl-base',1180,120,'#1e1b2e');     hop('210px,232px','180px,229px',1300,20);
paint('#pl-stem',1320,120,'#1e1b2e');
paint('#pl-bowl-line',1460,400,'#1e1b2e');hop('180px,174px','132px,262px',1860,60);
/* the logo, like in the header: the box, then "kare", then the brushed "ARTE" */
paint('#pl-box',1920,380,'#1e1b2e');      hop('132px,262px','140px,286px',2300,40);
write('#pl-g1','#pl-c1',96,2340,280,'#1e1b2e'); hop('220px,286px','116px,334px',2620,40);
write('#pl-g2','#pl-c2',140,2660,400,'#1e1b2e'); hop('246px,334px','268px,76px',3060,70);
/* the bottle */
paint('#pl-bottle-line',3130,370,'#1e1b2e');
q('#pl-bottle-fill').animate([{opacity:0},{opacity:1}],{duration:160,delay:3480,fill:F});
brush.animate([{opacity:1,transform:'translate(268px,76px)'},{opacity:0,transform:'translate(450px,30px) rotate(30deg)'}],{duration:200,delay:3500,fill:F,easing:'ease-in'});
q('#pl-bottle').animate([{transform:'none'},{transform:'translate(0px,-133px) rotate(-120deg)',offset:.35},{transform:'translate(0px,-133px) rotate(-120deg)',offset:.75},{transform:'none'}],{duration:900,delay:3540,fill:F,easing:'cubic-bezier(.45,0,.35,1)'});
var st=q('#pl-stream'),SL=st.getTotalLength();st.style.strokeDasharray=SL+' '+SL;st.style.strokeDashoffset=SL;
st.animate([{strokeDashoffset:SL},{strokeDashoffset:0,offset:.25},{strokeDashoffset:0,offset:.7},{strokeDashoffset:-SL}],{duration:470,delay:3830,fill:F,easing:'linear'});
q('#pl-wine').animate([{transform:'translateY(80px)'},{transform:'translateY(0px)'}],{duration:430,delay:3870,fill:F,easing:'cubic-bezier(.2,.7,.3,1)'});
q('#pl-logo').animate([{transform:'scale(1)'},{transform:'scale(1.14)'},{transform:'scale(1.05)'}],{duration:300,delay:4440,fill:F,easing:'ease-out'});
q('.pl-tag').animate([{opacity:0},{opacity:1}],{duration:250,delay:3100,fill:F});
setTimeout(function(){H.classList.add('pl-done');setTimeout(function(){H.classList.add('pl-gone')},650)},4750);
})();`;

const GLASS_BOWL = "M148 78C146 134 161 170 180 174C199 170 214 134 212 78Z";
const BOTTLE = "M262 76H274V102C274 110 290 116 290 130V226Q290 232 284 232H252Q246 232 246 226V130C246 116 262 110 262 102Z";

export function Preloader() {
  return (
    <>
      <div id="preloader" aria-hidden="true">
        <div className="pl-bg" />
        <div className="pl-stage">
          <svg viewBox="0 0 360 360" width="360" height="360" className="pl-svg">
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

            <defs>
              <clipPath id="pl-k1"><rect id="pl-c1" x="132" y="258" width="0" height="46" /></clipPath>
              <clipPath id="pl-k2"><rect id="pl-c2" x="110" y="300" width="0" height="56" /></clipPath>
            </defs>
            <g id="pl-logo" style={{ transformOrigin: "180px 300px" }}>
              <path id="pl-box" d="M132 262H228V300H132Z" className="pl-ink" />
              <text x="180" y="290" textAnchor="middle" className="pl-kare" clipPath="url(#pl-k1)">
                kare
              </text>
              <text x="180" y="344" textAnchor="middle" className="pl-arte" clipPath="url(#pl-k2)">
                ARTE
              </text>
            </g>
            <path id="pl-g1" d="M140 286L220 284" fill="none" stroke="none" />
            <path id="pl-g2" d="M116 334C140 326 160 340 186 330S228 326 246 332" fill="none" stroke="none" />

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
          </svg>
          
          <p className="pl-tag">бар-галерия · bar-gallery</p>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: run }} />
    </>
  );
}
