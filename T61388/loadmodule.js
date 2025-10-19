
(function () {
  // Si tienes un header fijo, detecta su alto
  const header = document.querySelector('.legal-cap') || document.querySelector('header');
  const getOffset = () => {
    const varCap = getComputedStyle(document.documentElement).getPropertyValue('--cap-h');
    const fromVar = parseInt(varCap) || 0;
    const fromEl  = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
    return Math.max(fromVar, fromEl, 0) + 12; // +aire
  };

  const goTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - getOffset();
    history.replaceState(null, '', '#'+id);  // actualiza hash
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  // Delegación para todos los botones con data-goto
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-goto]');
    if (!btn) return;
    e.preventDefault();
    goTo(btn.dataset.goto);
  });

  // Si llegan con hash (ej: /#contacto) al cargar
  window.addEventListener('load', () => {
    if (location.hash) {
      const id = location.hash.slice(1);
      setTimeout(() => goTo(id), 0);
    }
  });
})();

