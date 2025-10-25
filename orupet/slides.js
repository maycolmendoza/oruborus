(() => {
  const root = document.querySelector('#intro-orupets');
  const track = document.querySelector('#track');
  const slides = Array.from(track.children);
  const prev = document.querySelector('#prev');
  const next = document.querySelector('#next');
  const dotsC = document.querySelector('#dots');
  const badge = document.querySelector('#badge');
  const h1 = document.querySelector('#h1');
  const h2 = document.querySelector('#h2');

  let i = 0, startX = 0, currX = 0, dragging = false, auto;

  // construir dots
  slides.forEach((_, idx) => {
    const b = document.createElement('button');
    b.className = 'h-2.5 w-2.5 rounded-full bg-black/15 aria-[current=true]:bg-emerald-500 transition';
    b.setAttribute('aria-label', `Ir al slide ${idx+1}`);
    b.addEventListener('click', () => go(idx));
    dotsC.appendChild(b);
  });

  function apply(i){
    const s = slides[i];
    // fondo
    root.style.setProperty('--hero-bg', s.dataset.bg || '#f6f6f6');
    // textos
    badge.textContent = s.dataset.badge || '';
    h1.textContent = s.dataset.h1 || '';
    h2.textContent = s.dataset.h2 || '';
    // mover track
    track.style.transform = `translateX(${-i*100}%)`;
    // dots
    dotsC.querySelectorAll('button').forEach((d, idx)=> d.setAttribute('aria-current', idx===i ? 'true':'false'));
  }

  function go(n){
    i = (n + slides.length) % slides.length;
    apply(i);
    restartAuto();
  }

  function nextFn(){ go(i+1); }
  function prevFn(){ go(i-1); }

  prev.addEventListener('click', prevFn);
  next.addEventListener('click', nextFn);

  // swipe táctil
  track.addEventListener('pointerdown', e => { dragging=true; startX=e.clientX; track.setPointerCapture(e.pointerId); });
  track.addEventListener('pointermove', e => {
    if(!dragging) return;
    currX = e.clientX - startX;
    track.style.transform = `translateX(calc(${-i*100}% + ${currX}px))`;
  });
  track.addEventListener('pointerup', e => {
    dragging=false;
    const threshold = track.clientWidth * 0.15;
    if (currX > threshold) prevFn();
    else if (currX < -threshold) nextFn();
    else apply(i);
    currX = 0;
  });

  // auto-rotación solo cuando está en viewport
  const io = new IntersectionObserver(([entry])=>{
    if (entry.isIntersecting) restartAuto();
    else stopAuto();
  }, {threshold: .4});
  io.observe(root);

  function restartAuto(){
    stopAuto();
    auto = setInterval(nextFn, 6000);
  }
  function stopAuto(){ clearInterval(auto); }

  // teclado
  root.addEventListener('keydown', (e)=>{
    if(e.key==='ArrowRight') nextFn();
    if(e.key==='ArrowLeft') prevFn();
  });

  // init
  apply(i);
})();