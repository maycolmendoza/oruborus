/*!
 * ORÚBOROS Loader
 * Crear, mostrar y ocultar un loader 3D aislado.
 * window.OruLoader.show() / window.OruLoader.hide()
 */
(function () {
  const markup = `
    <div class="oru-loader-overlay" aria-hidden="false" role="status" aria-live="polite">
      <div class="oru-loader-core">
        <div class="oru-loader-ring" aria-hidden="true">
          <svg viewBox="0 0 100 100">
            <defs>
              <linearGradient id="oru-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#7dd3fc"/>
                <stop offset="50%" stop-color="#f472b6"/>
                <stop offset="100%" stop-color="#a78bfa"/>
              </linearGradient>
            </defs>
            <!-- aura exterior -->
            <circle class="oru-loader-aura" cx="50" cy="50" r="44" />
            <!-- círculo interior -->
            <circle class="oru-loader-coreline" cx="50" cy="50" r="28" />
          </svg>
        </div>

        <div class="oru-loader-3d" aria-label="ORÚBOROS Technology cargando">
          <h1 class="oru-loader-title">
            <span>ORÚBOROS</span> <span>Technology</span>
          </h1>
        </div>

        <p class="oru-loader-sub">Preparando módulos…</p>

        <p class="oru-loader-online">
          <span class="oru-loader-dot"></span> online • tiempo real
        </p>
      </div>
    </div>
  `;

  let overlay;

  function ensureMounted() {
    if (overlay) return overlay;
    const wrap = document.createElement('div');
    wrap.innerHTML = markup.trim();
    overlay = wrap.firstElementChild;
    document.body.appendChild(overlay);
    return overlay;
  }

  function show(message) {
    const el = ensureMounted();
    if (message) {
      const sub = el.querySelector('.oru-loader-sub');
      if (sub) sub.textContent = message;
    }
    el.setAttribute('aria-hidden', 'false');
  }

  function hide() {
    if (!overlay) return;
    overlay.setAttribute('aria-hidden', 'true');
  }

  // Auto: mostrar muy breve al cargar la página, luego ocultar
  window.addEventListener('load', () => {
    // si alguien ya lo mostró antes, respeta
    if (!overlay) return;
    setTimeout(hide, 400);
  });

  // Exponer API global
  window.OruLoader = { show, hide };
})();
