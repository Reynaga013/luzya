/* Compartido entre apps; sincronizar con sync-mobile-ui.py. Sin red ni datos personales. */
(() => {
  'use strict';
  const script = document.currentScript;
  const app = script?.dataset.app || '';
  const native = script?.dataset.startup === 'native';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (app === 'pulso' && window.visualViewport) {
    const fitViewport = () => {
      if (window.visualViewport.scale > 1.01) return;
      document.documentElement.style.setProperty('--app-visible-height', window.visualViewport.height + 'px');
    };
    window.visualViewport.addEventListener('resize', fitViewport);
    window.addEventListener('orientationchange', fitViewport);
    fitViewport();
  }

  // Safari ignora user-scalable en algunos modos. Pan de un dedo sigue disponible.
  ['gesturestart', 'gesturechange', 'gestureend'].forEach(type => document.addEventListener(type, e => e.preventDefault(), { passive: false }));
  document.addEventListener('touchmove', e => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
  document.addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
  let lastTap = null;
  document.addEventListener('touchend', e => {
    const t = e.changedTouches[0];
    if (!t || e.touches.length || e.target.closest('button,a,input,textarea,select,[contenteditable],label,[role=button]') || !window.getSelection()?.isCollapsed) { lastTap = null; return; }
    const now = performance.now();
    if (lastTap && now - lastTap.time < 300 && Math.hypot(t.clientX-lastTap.x,t.clientY-lastTap.y) < 24) { e.preventDefault(); lastTap = null; }
    else lastTap = { time: now, x: t.clientX, y: t.clientY };
  }, { passive: false });

  const shapes = {
    pulso: '<path d="M6 56h24l12-23 15 46 12-23h37"/>',
    radar: '<circle cx="56" cy="56" r="40"/><circle cx="56" cy="56" r="24" opacity=".4"/><path class="launch-sweep" d="M56 56 84 28"/><circle cx="72" cy="43" r="4" fill="currentColor" stroke="none"/>',
    neto: '<circle cx="56" cy="56" r="40"/><path d="M40 74V38l32 36V38"/>',
    celaje: '<rect x="22" y="27" width="68" height="63" rx="17"/><path d="M38 20v18m36-18v18M23 47h66"/><path class="launch-check" d="m40 68 11 11 22-22"/>',
    calendario: '<rect x="22" y="27" width="68" height="63" rx="17"/><path d="M38 20v18m36-18v18M23 47h66"/><path class="launch-check" d="M36 61h3m14 0h3m14 0h3M36 75h3m14 0h3"/><rect x="66" y="69" width="15" height="14" rx="4" fill="currentColor" stroke="none"/>',
    gasoya: '<path d="M27 87V34a9 9 0 0 1 9-9h23a9 9 0 0 1 9 9v53M23 87h49M37 37h20v19H37z"/><path class="launch-route" d="m69 39 12 12v25a6 6 0 0 0 12 0V47l-12-12"/>',
    luzya: '<circle cx="56" cy="56" r="21"/><g class="launch-rays"><path d="M56 11v12m0 66v12M11 56h12m66 0h12M24 24l9 9m46 46 9 9M24 88l9-9m46-46 9-9"/></g>',
    panel: '<rect class="launch-bar" x="24" y="53" width="15" height="35" rx="5" fill="currentColor" stroke="none"/><rect class="launch-bar" x="49" y="25" width="15" height="63" rx="5" fill="currentColor" stroke="none"/><rect class="launch-bar" x="74" y="40" width="15" height="48" rx="5" fill="currentColor" stroke="none"/>',
    ayudaya: '<path d="M35 84V34a12 12 0 0 1 12-12h32v62H35Zm0-33H23v33h12M48 38h17m-17 14h17m-17 14h17"/><path class="launch-spark" d="m83 22 3-10 3 10 10 3-10 3-3 10-3-10-10-3Z"/>',
    typefy: '<path d="m40 30-25 26 25 26m32-52 25 26-25 26M64 22 48 90"/>',
    investa: '<path d="M23 86V54m22 32V41m22 45V25m22 61V16M16 94h82"/>',
  };
  const brands = { pulso:['pulso','#6de5b7','#0c1319'], radar:['radar','#5487f4','#121923'], neto:['Neto','#ffc24b','#141416'], celaje:['Celaje','#bd9aef','#14101c'], calendario:['Calendario de Trabajo','#f487aa','#18141b'], gasoya:['GasoYa','#65ca9b','#101b17'], luzya:['LuzYa','#ffd15e','#1a1811'], panel:['Panel de control','#ffc24b','#131318'], ayudaya:['AyudaYa','#67d4ac','#12241c'], typefy:['Typefy','#a491ff','#181427'], investa:['Investa','#63d7b5','#10241e'] };

  function start() {
    if (native || reduced.matches || !brands[app] || !shapes[app]) return;
    // Navegación multipágina: no repetir la presentación en cada sección.
    try {
      const key = 'app-launch-' + app;
      const previous = Number(sessionStorage.getItem(key));
      if (previous && Date.now()-previous < 20000) return;
      sessionStorage.setItem(key, String(Date.now()));
    } catch { /* También funciona sin almacenamiento. */ }
    const [name,accent,bg] = brands[app];
    const appearance = getComputedStyle(document.body);
    const pageBackground = appearance.getPropertyValue('--bg').trim() || (appearance.backgroundColor !== 'rgba(0, 0, 0, 0)' ? appearance.backgroundColor : bg);
    const splash = document.createElement('div');
    splash.className = 'app-launch launch-' + app;
    splash.setAttribute('aria-hidden','true');
    splash.style.setProperty('--launch-bg',pageBackground);
    splash.style.setProperty('--launch-ink',appearance.color);
    splash.style.setProperty('--launch-accent',accent);
    // Solo nombres y SVG estáticos de esta tabla, nunca contenido de usuarios.
    splash.innerHTML = `<div class="app-launch-symbol"><svg viewBox="0 0 112 112" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${shapes[app]}</svg></div><div class="app-launch-name">${name}<span>.</span></div>`;
    document.body.appendChild(splash);
    const remove = () => { splash.classList.add('is-leaving'); setTimeout(() => splash.remove(),230); };
    setTimeout(remove,850);
    setTimeout(() => splash.remove(),1400); // La red o un fallo de la app nunca retienen la portada.
    reduced.addEventListener('change', e => { if (e.matches) splash.remove(); }, { once:true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
