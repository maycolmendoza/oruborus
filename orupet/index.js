 // === Configura tu número y mensaje base ===
  const PHONE_NUMBER = "+51929407899"; // 51 + número en Perú (sin + ni espacios)
  const DEFAULT_MSG = "Hola, quiero más información 👍 ";

  (function initWA(){
    const a = document.getElementById("wa-float");
    const page = (document.title || "").trim();
    const url  = location.href;
    const text = `${DEFAULT_MSG}Sobre: "${page}". Enlace: ${url}`;
    a.href = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
  })();


    (() => {
        const nav = document.getElementById("ob-nav");
        const track = document.getElementById("ob-nav-track");
        const btns = [...document.querySelectorAll(".ob-nav__btn")];

        // --- Encoger la cápsula en scroll
        let ticking = false;
        const onScroll = () => {
          if (ticking) return;
          ticking = true;
          requestAnimationFrame(() => {
            const shrink = window.scrollY > 12;
            nav.classList.toggle("ob-nav--shrink", shrink);
            ticking = false;
          });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll(); // estado inicial

        // --- Scroll a secciones con offset por altura de la cápsula
        const goto = (id) => {
          const el = document.getElementById(id);
          if (!el) return;
          const rect = el.getBoundingClientRect();
          const offset = window.scrollY + rect.top - (nav.offsetHeight + 8);
          window.scrollTo({ top: offset, behavior: "smooth" });
        };

        // Click en botones
        track.addEventListener("click", (e) => {
          const b = e.target.closest(".ob-nav__btn");
          if (!b) return;
          const id = b.dataset.goto;
          if (!id) return;

          // centra el botón seleccionado en móvil
          if (window.matchMedia("(max-width: 768px)").matches) {
            b.scrollIntoView({
              behavior: "smooth",
              inline: "center",
              block: "nearest",
            });
          }
          goto(id);
        });

        // --- Activar estado "is-active" con IntersectionObserver
        const sections = btns
          .map((b) => document.getElementById(b.dataset.goto))
          .filter(Boolean);

        const setActive = (id) => {
          btns.forEach((b) =>
            b.classList.toggle("is-active", b.dataset.goto === id)
          );
        };

        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((ent) => {
              if (!ent.isIntersecting) return;
              setActive(ent.target.id);
            });
          },
          { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
        );

        sections.forEach((s) => io.observe(s));
      })();