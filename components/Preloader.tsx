/** Preloader: a real paintbrush paints the canvas. Paint appears exactly under the bristles:
 *  blue wash → orange swoosh → yellow swirl → wine-glass outline → red wine painted into the glass →
 *  the brush signs "KaRe-Arte". Web Animations API from an inline script; once per session. */
export const preloaderScript = `;(function(){try{var d=document.documentElement;if(sessionStorage.getItem('ka-pl')||matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('pl-skip')}else{sessionStorage.setItem('ka-pl','1')}}catch(e){document.documentElement.classList.add('pl-skip')}})();`;

const run = `;(function(){
var H=document.documentElement;if(H.classList.contains('pl-skip'))return;
var root=document.getElementById('preloader');if(!root)return;
var svg=root.querySelector('svg'),brush=svg.querySelector('#pl-brush'),tip=svg.querySelector('#pl-tip');
var wipe=svg.querySelector('#pl-wipe-r'),name=svg.querySelector('.pl-name'),mark=root.querySelector('.pl-final-logo');
var specs=[
  ['#pl-blue',320,520,'#26408b'],
  ['#pl-orange',980,430,'#e8742a'],
  ['#pl-swirl',1540,350,'#f0a92a'],
  ['#pl-glass',2020,580,'#1e1b2e'],
  ['#pl-wine',2730,450,'#9b1c31']
];
var strokes=specs.map(function(s){var p=svg.querySelector(s[0]),l=p.getTotalLength();p.style.strokeDasharray=l+' '+l;p.style.strokeDashoffset=l;return{path:p,start:s[1],duration:s[2],color:s[3],length:l}});
var points=strokes.map(function(s){return{start:s.path.getPointAtLength(0),end:s.path.getPointAtLength(s.length)}});
var signStart=3310,signDuration=610,end=3920,began=performance.now(),finished=false;
function clamp(x){return Math.max(0,Math.min(1,x))}
function smooth(x){return x*x*(3-2*x)}
function position(x,y){brush.style.transform='translate('+x+'px,'+y+'px)'}
function travel(a,b,t){var p=smooth(clamp(t));position(a.x+(b.x-a.x)*p,a.y+(b.y-a.y)*p)}
function frame(now){
  var t=now-began,current=-1;
  for(var i=0;i<strokes.length;i++){
    var s=strokes[i],v=clamp((t-s.start)/s.duration);
    s.path.style.strokeDashoffset=String(s.length*(1-v));
    if(t>=s.start&&t<=s.start+s.duration){var at=s.path.getPointAtLength(s.length*v);position(at.x,at.y);current=i;tip.style.fill=s.color}
  }
  if(current<0){
    if(t<320){travel({x:420,y:60},points[0].start,t/320);brush.style.opacity=String(clamp(t/180))}
    else if(t<980){travel(points[0].end,points[1].start,(t-840)/140)}
    else if(t<1540){travel(points[1].end,points[2].start,(t-1410)/130)}
    else if(t<2020){travel(points[2].end,points[3].start,(t-1890)/130)}
    else if(t<2730){travel(points[3].end,points[4].start,(t-2600)/130)}
    else if(t<signStart){travel(points[4].end,{x:60,y:300},(t-3180)/130)}
  }
  if(t>=signStart){
    var v=clamp((t-signStart)/signDuration);
    wipe.setAttribute('width',String(250*v));
    if(t<=end){position(60+250*v,300);tip.style.fill='#c8361c'}
    else brush.style.opacity=String(1-clamp((t-end)/160));
  }
  if(t>=end&&!finished){finished=true;finish()}
  if(!finished)requestAnimationFrame(frame);
}
function finish(){
  name.animate([{transform:'scale(1)',opacity:1},{transform:'scale(1.12)',opacity:1},{transform:'scale(1)',opacity:0}],{duration:480,fill:'forwards',easing:'ease-in-out'});
  mark.animate([{opacity:0,transform:'translateX(-50%) scale(.78)'},{opacity:1,transform:'translateX(-50%) scale(1.12)'},{opacity:1,transform:'translateX(-50%) scale(1)'}],{duration:480,fill:'forwards',easing:'ease-out'});
  setTimeout(function(){
    var target=document.querySelector('.header-logo');
    if(!target){H.classList.add('pl-done');setTimeout(function(){H.classList.add('pl-gone')},800);return}
    var from=mark.getBoundingClientRect(),to=target.getBoundingClientRect();
    var flying=mark.cloneNode(true);flying.className='pl-flying-logo';
    flying.style.cssText='position:fixed;left:'+from.left+'px;top:'+from.top+'px;width:'+from.width+'px;height:'+from.height+'px;z-index:1002;transform-origin:top left;';
    document.body.appendChild(flying);mark.style.visibility='hidden';H.classList.add('pl-moving');
    var dx=to.left-from.left,dy=to.top-from.top,sx=to.width/from.width,sy=to.height/from.height;
    var flight=flying.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:'translate('+dx+'px,'+dy+'px) scale('+sx+','+sy+')',opacity:1}],{duration:760,fill:'forwards',easing:'cubic-bezier(.65,0,.2,1)'});
    flight.onfinish=function(){H.classList.add('pl-done');flying.remove();setTimeout(function(){H.classList.add('pl-gone')},100)};
  },500);
}
requestAnimationFrame(frame);
})();`;

export function Preloader() {
  return (
    <>
      <div id="preloader" aria-hidden="true">
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
                <path d="M148 78C146 134 161 170 180 174C199 170 214 134 212 78Z" />
              </clipPath>
              <clipPath id="pl-wipe">
                <rect id="pl-wipe-r" x="60" y="250" width="0" height="80" />
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
            </defs>

            <path id="pl-blue" d="M46 150C92 108 140 196 196 146S300 118 326 160" className="pl-stroke" stroke="#26408b" strokeWidth="50" filter="url(#pl-bristle)" />
            <path id="pl-orange" d="M58 222C118 252 206 186 306 222" className="pl-stroke" stroke="#e8742a" strokeWidth="34" filter="url(#pl-bristle)" />
            <path id="pl-swirl" d="M78 78c12-18 40-12 38 8c-2 16-26 16-26 2c0-8 10-10 14-4" className="pl-stroke" stroke="#f0a92a" strokeWidth="9" filter="url(#pl-rough)" />
            <g clipPath="url(#pl-bowl)">
              <path id="pl-wine" d="M156 98H206L152 112H210L154 126H208L156 140H206L160 154H200L168 166H194" className="pl-stroke" stroke="#9b1c31" strokeWidth="18" strokeLinejoin="round" />
            </g>
            <path id="pl-glass" d="M148 78C146 134 161 170 180 174C199 170 214 134 212 78L148 78M180 174L180 228M150 232Q180 222 210 232" className="pl-line" />

            <text x="180" y="306" textAnchor="middle" className="pl-name" clipPath="url(#pl-wipe)">
              KaRe-Arte
            </text>
            <path id="pl-sig" d="M66 300C96 290 110 308 140 298S190 290 220 300S270 292 304 300" fill="none" stroke="none" />

            <g id="pl-brush" style={{ opacity: 0 }}>
              <g transform="rotate(-36) scale(1.15)">
                <path d="M-4.5 -58L-6 -150Q0 -158 6 -150L4.5 -58Z" fill="url(#pl-wood)" />
                <path d="M-1.2 -62L-2 -146" stroke="#f6d39a" strokeWidth="1.2" strokeLinecap="round" opacity=".7" />
                <path d="M-7 -36L-6.5 -60H6.5L7 -36Z" fill="url(#pl-metal)" />
                <path d="M-6.8 -52H6.8M-6.9 -48H6.9" stroke="#7b7b84" strokeWidth=".9" />
                <path d="M-7 -36C-8 -22 -5 -9 0 0C5 -9 8 -22 7 -36Z" fill="url(#pl-hair)" />
                <path d="M-4 -34C-4 -22 -2 -10 0 -2M0 -35V-3M4 -34C4 -22 2 -10 0 -2M-6 -30C-5 -20 -3 -12 -1 -5M6 -30C5 -20 3 -12 1 -5" stroke="#a88c5c" strokeWidth=".6" fill="none" opacity=".8" />
                <path id="pl-tip" d="M-5.6 -20C-5 -11 -2.6 -4.5 0 0C2.6 -4.5 5 -11 5.6 -20C2 -17 -2 -17 -5.6 -20Z" fill="#26408b" />
                <ellipse cx="-1.6" cy="-11" rx="1" ry="3.2" fill="#fff" opacity=".35" />
              </g>
            </g>
          </svg>
          <div className="pl-final-logo" aria-hidden="true"><span className="pl-logo-kare">kare</span><span className="pl-logo-arte">ARTE</span></div>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: run }} />
    </>
  );
}
