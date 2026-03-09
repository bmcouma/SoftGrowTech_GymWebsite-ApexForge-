/* ── Custom Cursor ─────────────────────────────── */
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});
(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a, button, .facility-card, .trainer-card, .tab-btn, .testi-btn, .toggle-switch, .unit-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '16px';
    cursor.style.height = '16px';
    cursorRing.style.width = '52px';
    cursorRing.style.height = '52px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    cursorRing.style.width = '36px';
    cursorRing.style.height = '36px';
  });
});

/* ── Navbar scroll ─────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── Mobile menu ───────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
function closeMobile() {
  mobileMenu.classList.remove('open');
  hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}

/* ── Hero canvas particles ─────────────────────── */
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() {
  if (!canvas) return;
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -(Math.random() * 0.4 + 0.1),
    alpha: Math.random() * 0.5 + 0.1,
    life: 0,
    maxLife: Math.random() * 300 + 150
  };
}
function initParticles() {
  particles = Array.from({ length: 120 }, createParticle);
}
function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy; p.life++;
    const progress = p.life / p.maxLife;
    const alpha = p.alpha * (1 - progress);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(245,196,50,${alpha})`;
    ctx.fill();
    if (p.life >= p.maxLife || p.y < 0) particles[i] = createParticle();
  });
  requestAnimationFrame(drawParticles);
}
if (canvas) {
  resizeCanvas(); initParticles(); drawParticles();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
}

/* ── Reveal on scroll ──────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

/* ── Animated counters ─────────────────────────── */
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val = Math.round(ease * target);
    el.textContent = val >= 1000 ? val.toLocaleString() : val;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = parseInt(e.target.dataset.target);
      animateCounter(e.target, target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

/* ── Schedule tabs ─────────────────────────────── */
function switchDay(day, btn) {
  document.querySelectorAll('.schedule-content').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('schedule-' + day).classList.add('active');
  btn.classList.add('active');
}

/* ── Billing toggle ────────────────────────────── */
const prices = {
  monthly:  { starter: '2,500', elite: '4,800', forge: '8,500' },
  annual:   { starter: '2,000', elite: '3,840', forge: '6,800' }
};
let isAnnual = false;
function toggleBilling() {
  isAnnual = !isAnnual;
  const tgl = document.getElementById('billingToggle');
  tgl.classList.toggle('on', isAnnual);
  const set = isAnnual ? prices.annual : prices.monthly;
  document.getElementById('price-starter').textContent = set.starter;
  document.getElementById('price-elite').textContent   = set.elite;
  document.getElementById('price-forge').textContent   = set.forge;
  document.getElementById('monthly-label').classList.toggle('active', !isAnnual);
  document.getElementById('annual-label').classList.toggle('active', isAnnual);
}

/* ── BMI Calculator ────────────────────────────── */
let unit = 'metric';
function setUnit(u, btn) {
  unit = u;
  document.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const wt = document.getElementById('weight');
  const ht = document.getElementById('height');
  if (u === 'metric') {
    document.getElementById('weight-label').textContent = 'Weight (kg)';
    document.getElementById('height-label').textContent = 'Height (cm)';
    wt.min = 30; wt.max = 200; wt.value = 75;
    ht.min = 120; ht.max = 230; ht.value = 175;
  } else {
    document.getElementById('weight-label').textContent = 'Weight (lbs)';
    document.getElementById('height-label').textContent = 'Height (in)';
    wt.min = 66; wt.max = 440; wt.value = 165;
    ht.min = 47; ht.max = 90; ht.value = 69;
  }
  updateBMI();
}
function updateBMI() {
  const age = parseInt(document.getElementById('age').value);
  let wt  = parseFloat(document.getElementById('weight').value);
  let ht  = parseFloat(document.getElementById('height').value);
  document.getElementById('age-val').textContent    = age;
  document.getElementById('weight-val').textContent = wt;
  document.getElementById('height-val').textContent = ht;
  let bmi;
  if (unit === 'metric') {
    bmi = wt / ((ht / 100) ** 2);
  } else {
    bmi = (wt / (ht ** 2)) * 703;
  }
  bmi = Math.round(bmi * 10) / 10;
  document.getElementById('bmiNum').textContent = bmi;

  let cat, msg, color, markerPos;
  if (bmi < 18.5)       { cat = 'Underweight'; msg = 'Your BMI is below the healthy range. Consider speaking with a nutritionist to build a plan that supports healthy weight gain and strength development.'; color = '#4a9eff'; markerPos = (bmi / 18.5) * 25; }
  else if (bmi < 25)    { cat = 'Normal Weight'; msg = 'You are within a healthy weight range. Keep up the great work and focus on maintaining your fitness level through balanced training and nutrition.'; color = '#4ddb8a'; markerPos = 25 + ((bmi - 18.5) / 6.5) * 25; }
  else if (bmi < 30)    { cat = 'Overweight'; msg = 'Your BMI is slightly above the healthy range. A combination of strength training and cardio, paired with a calorie-managed diet, can help bring this into balance.'; color = '#f5c432'; markerPos = 50 + ((bmi - 25) / 5) * 25; }
  else                  { cat = 'High BMI Range'; msg = 'Your BMI indicates a higher risk for certain health conditions. We recommend booking a free consultation with one of our certified trainers to design a sustainable programme for you.'; color = '#c94f1a'; markerPos = Math.min(75 + ((bmi - 30) / 10) * 25, 96); }

  document.getElementById('bmiCategory').textContent = cat;
  document.getElementById('bmiCategory').style.color = color;
  document.getElementById('bmiMessage').textContent = msg;
  document.getElementById('bmiMarker').style.left = Math.min(markerPos, 96) + '%';
  document.getElementById('resultRing').style.borderColor = color + '33';
}
updateBMI();

/* ── Testimonials slider ───────────────────────── */
let testiIndex = 0;
const getVisibleCount = () => window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1;
const testiCards = document.querySelectorAll('.testimonial-card');
const testiTotal = testiCards.length;

function updateTesti() {
  const visible = getVisibleCount();
  const maxIdx = testiTotal - visible;
  testiIndex = Math.max(0, Math.min(testiIndex, maxIdx));
  const cardW = testiCards[0].offsetWidth + 24;
  document.getElementById('testiTrack').style.transform = `translateX(-${testiIndex * cardW}px)`;
  document.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === testiIndex));
}

// Build dots
const dotsContainer = document.getElementById('testiDots');
if (dotsContainer) {
  const visible = getVisibleCount();
  for (let i = 0; i <= (testiTotal - visible); i++) {
    const dot = document.createElement('div');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => { testiIndex = i; updateTesti(); };
    dotsContainer.appendChild(dot);
  }
}

function slideTesti(dir) {
  const visible = getVisibleCount();
  const maxIdx = testiTotal - visible;
  testiIndex = Math.max(0, Math.min(testiIndex + dir, maxIdx));
  updateTesti();
}

// Auto-advance
setInterval(() => {
  const visible = getVisibleCount();
  const maxIdx = testiTotal - visible;
  testiIndex = testiIndex >= maxIdx ? 0 : testiIndex + 1;
  updateTesti();
}, 5500);
window.addEventListener('resize', updateTesti);

/* ── Form validation ───────────────────────────── */
function submitForm() {
  let valid = true;
  const fields = [
    { id: 'fname',   err: 'fname-err',  check: v => v.trim().length > 0 },
    { id: 'lname',   err: 'lname-err',  check: v => v.trim().length > 0 },
    { id: 'femail',  err: 'femail-err', check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { id: 'fplan',   err: 'fplan-err',  check: v => v !== '' }
  ];
  fields.forEach(({ id, err, check }) => {
    const el = document.getElementById(id);
    const errEl = document.getElementById(err);
    if (!check(el.value)) {
      el.classList.add('error');
      errEl.style.display = 'block';
      valid = false;
    } else {
      el.classList.remove('error');
      errEl.style.display = 'none';
    }
  });
  if (valid) {
    document.getElementById('formSuccess').style.display = 'block';
    document.querySelectorAll('#contactForm .form-input, #contactForm .form-select, #contactForm .form-textarea').forEach(el => { el.value = ''; el.classList.remove('error'); });
    setTimeout(() => { document.getElementById('formSuccess').style.display = 'none'; }, 7000);
  }
}

// Clear errors on input
document.querySelectorAll('.form-input, .form-select').forEach(el => {
  el.addEventListener('input', () => { el.classList.remove('error'); });
});
