/*!
 * ORÚBOROS Loader v2 – robusto con timeouts y evento manual
 * - Se muestra al iniciar (DOMContentLoaded)
 * - Se oculta al: window 'load' + fuentes + imágenes
 * - O al disparar 'oruboros:ready'
 * - O por timeouts de seguridad (6s y 12s)
 */

(function () {
  const MARKUP = `
    <div class="oru-loader-overlay" role="status" aria-live="polite">
      <div class="oru-loader-core">
        <div class="oru-loader-ring">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <linearGradient id="oru-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#7dd3fc"/>
                <stop offset="50%" stop-color="#f472b6"/>
                <stop offset="100%" stop-color="#a78bfa"/>
              </linearGradient>
            </defs>
            <circle class="oru-loader-aura" cx="50" cy="50" r="44"></circle>
            <circle class="oru-loader-coreline" cx="50" cy="50" r="28"></circle>
          </svg>
        </div>
        <h1 class="oru-loader-title"><span>Oruboros <span></span></h1>
        <p class="oru-loader-sub">Inicializando módulos…</p>
        <p class="oru-loader-online"><span class="oru-loader-dot"></span>online • Hecho en Nuevo Chimbote
      </div>
    </div>
  `;

  let overlay, hidden = false, safety1, safety2;

  function mount() {
    if (overlay) return overlay;
    const wrap = document.createElement('div');
    wrap.innerHTML = MARKUP.trim();
    overlay = wrap.firstElementChild;
    document.body.appendChild(overlay);
    return overlay;
  }

  function show(msg) {
    const el = mount();
    const sub = el.querySelector('.oru-loader-sub');
    if (msg && sub) sub.textContent = msg;
    el.setAttribute('aria-hidden', 'false');
  }

  function hide() {
    if (hidden) return;
    hidden = true;
    clearTimeout(safety1); clearTimeout(safety2);
    overlay && overlay.setAttribute('aria-hidden', 'true');
  }

  // Espera imágenes presentes en DOM en el momento de llamar
  function waitImages() {
    try {
      const imgs = Array.from(document.images || []);
      if (!imgs.length) return Promise.resolve();
      const ps = imgs.map(img => {
        if (img.complete && img.naturalWidth) return Promise.resolve();
        return new Promise(res => {
          const done = () => res();
          img.addEventListener('load', done, { once: true });
          img.addEventListener('error', done, { once: true });
        });
      });
      return Promise.all(ps);
    } catch { return Promise.resolve(); }
  }

  // Espera fuentes si existe API
  function waitFonts() {
    try {
      if (document.fonts && document.fonts.ready) return document.fonts.ready.catch(()=>{});
      return Promise.resolve();
    } catch { return Promise.resolve(); }
  }

  function onReady(fn){
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else { fn(); }
  }

  onReady(() => {
    // Mostrar
    show('Cargando…');

    // Timeouts de seguridad
    safety1 = setTimeout(hide, 6000);   // si algo se cuelga, oculta a los 6s
    safety2 = setTimeout(hide, 12000);  // último recurso a los 12s

    // Opción: tiempo mínimo visible (para sensación de “vida”)
    const script = document.currentScript || Array.from(document.scripts).find(s => /oru-loader\.js/i.test(s.src));
    const minDur = Number((script && script.dataset.minduration) || window.ORU_LOADER_MIN || 500);
    const t0 = performance.now();

    // Promesas de carga “reales”
    const waitWindowLoad = new Promise(res => window.addEventListener('load', res, { once: true }));

    Promise.race([
      // Si la app (SPA) avisa que terminó:
      new Promise(res => window.addEventListener('oruboros:ready', res, { once: true })),
      // O esperamos a todo:
      Promise.all([waitWindowLoad, waitFonts(), waitImages()])
    ])
    .catch(() => {}) // ante cualquier error, seguimos
    .then(() => {
      const elapsed = performance.now() - t0;
      const remain = Math.max(0, minDur - elapsed);
      setTimeout(hide, remain);
    });
  });

  // API pública por si la necesitas en otras vistas
  window.OruLoader = {
    show,
    hide,
    done: hide // alias
  };
})();
