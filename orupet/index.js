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