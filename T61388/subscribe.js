/* subscribe.js  —  ORÚBOROS */
/* Requiere un input#email y un form#subscribeForm (ver ejemplo al final) */

(() => {
  const FORM_ID = "subscribeForm";
  const INPUT_ID = "email";
  const ENDPOINT = "YOUR_APPS_SCRIPT_WEB_APP_URL"; // <- Pega aquí tu URL de Apps Script

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  const $ = (sel) => document.querySelector(sel);

  // --- Mini toast
  const makeToast = (msg, type = "ok") => {
    let toast = document.createElement("div");
    toast.className = `oru-toast ${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  };

  // --- Confetti sutil (sin librerías)
  const confetti = () => {
    const n = 18;
    for (let i = 0; i < n; i++) {
      const el = document.createElement("i");
      el.className = "oru-confetti";
      el.style.left = Math.random() * 100 + "vw";
      el.style.setProperty("--dx", (Math.random() * 2 - 1).toFixed(2));
      el.style.setProperty("--rot", (Math.random() * 360).toFixed(0) + "deg");
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1800);
    }
  };

  const form = $("#" + FORM_ID);
  const input = $("#" + INPUT_ID);

  if (!form || !input) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = (input.value || "").trim();
    if (!emailRegex.test(email)) {
      input.classList.add("is-invalid");
      makeToast("Revisa tu correo, por favor.", "err");
      return;
    }
    input.classList.remove("is-invalid");

    // Botón en modo cargando
    const btn = form.querySelector("button[type=submit]") || form.querySelector("button");
    const btnOriginal = btn ? btn.innerHTML : "";
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spin"></span> Uniendo…`;
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: location.origin + location.pathname,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.status !== "ok") {
        throw new Error(data.message || "No se pudo suscribir");
      }

      // Éxito
      form.reset();
      confetti();
      makeToast(
        data.duplicate
          ? "Ya estabas suscrit@. ¡Gracias por seguir aquí!"
          : "¡Listo! Te suscribimos a las novedades 🎉",
        "ok"
      );

      // Estado visual del botón
      if (btn) {
        btn.innerHTML = `Suscrito ✔`;
        btn.classList.add("is-done");
        setTimeout(() => {
          btn.classList.remove("is-done");
          btn.innerHTML = btnOriginal || "Unirme";
          btn.disabled = false;
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = btnOriginal || "Unirme";
      }
      makeToast("Ups, hubo un problema. Intenta de nuevo.", "err");
    }
  });
})();
