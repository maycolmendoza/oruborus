// contact-form.js
(() => {
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbzmFVza-Y_1GR-jzb3wxZ-jnaeOgF9ZqhR2E_pgv0toR3WVtA_i3SYxVdIRachY7gXc/exec'; // <- tu Web App /exec
  const form = document.getElementById('oruContactForm');
  const btn  = document.getElementById('oruContactSubmit');
  const toast= document.getElementById('ocfToast');

  if (!form) return;

  const showToast = (msg, ok = true) => {
    toast.textContent = msg;
    toast.className = `ocf-toast ocf-toast--show ${ok ? 'ocf-toast--ok' : 'ocf-toast--err'}`;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toast.classList.remove('ocf-toast--show');
    }, 3800);
  };

  const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(v);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim().toLowerCase();
    const message = (data.get('message') || '').toString().trim();

    if (!name || !email || !message) {
      showToast('Completa todos los campos.', false);
      return;
    }
    if (!validEmail(email)) {
      showToast('Revisa tu correo.', false);
      return;
    }

    btn.classList.add('ocf-btn-busy');
    const original = btn.textContent;
    btn.textContent = 'Enviando…';

    try {
      const payload = {
        type: 'contact',
        name,
        email,
        message,
        source: location.origin + location.pathname
      };

      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const json = await res.json().catch(() => ({}));

      if (json.status === 'ok') {
        showToast('¡Gracias! Te contactaremos pronto 🐾', true);
        form.reset();
      } else {
        showToast('No se pudo enviar. Intenta de nuevo.', false);
      }
    } catch (err) {
      showToast('Error de red. Intenta más tarde.', false);
    } finally {
      btn.classList.remove('ocf-btn-busy');
      btn.textContent = original;
    }
  });
})();
