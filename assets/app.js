// ═══════════════════════════════════════════════════════════
//  DJ MARIO — ENHANCED VISUAL EFFECTS
// ═══════════════════════════════════════════════════════════

// Active nav link
(function() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
})();

// ═══════════════════════════════════════════════════════════
//  PARTICLE SYSTEM
// ═══════════════════════════════════════════════════════════

const particleCanvas = document.getElementById('fx-canvas');
if (particleCanvas) {
  const ctx = particleCanvas.getContext('2d');
  let W, H, dpr;
  let particles = [];
  let enabled = true;

  const colors = [
    { r: 255, g: 107, b: 53 },   // Orange
    { r: 0, g: 240, b: 255 },    // Cyan
    { r: 168, g: 85, b: 247 },   // Purple
    { r: 255, g: 255, b: 255 },  // White
  ];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = particleCanvas.width = window.innerWidth * dpr;
    H = particleCanvas.height = window.innerHeight * dpr;
    particleCanvas.style.width = '100%';
    particleCanvas.style.height = '100%';
  }

  function createParticle() {
    const c = colors[Math.floor(Math.random() * colors.length)];
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5 * dpr,
      vy: (Math.random() - 0.5) * 0.5 * dpr,
      r: (Math.random() * 2 + 0.5) * dpr,
      color: c,
      alpha: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
    };
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < 100; i++) particles.push(createParticle());
  }

  let mouse = { x: null, y: null };
  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX * dpr;
    mouse.y = e.clientY * dpr;
  });

  function animate() {
    if (!enabled) {
      ctx.clearRect(0, 0, W, H);
      requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      p.phase += 0.02;
      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;

      // Mouse repel
      if (mouse.x) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 * dpr) {
          const force = (120 * dpr - dist) / (120 * dpr) * 0.4;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      p.vx *= 0.99;
      p.vy *= 0.99;

      const pulse = 0.6 + 0.4 * Math.sin(p.phase);

      // Glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${p.alpha * pulse * 0.15})`;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${p.alpha * pulse})`;
      ctx.fill();
    }

    // Connection lines
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 * dpr) {
          ctx.strokeStyle = `rgba(255,107,53,${(1 - dist / (100 * dpr)) * 0.08})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  init();
  animate();

  window.toggleParticles = function(on) {
    enabled = on;
    particleCanvas.style.opacity = on ? '0.9' : '0';
  };
}

// ═══════════════════════════════════════════════════════════
//  LASER BEAMS
// ═══════════════════════════════════════════════════════════

const laserCanvas = document.getElementById('laser-canvas');
if (laserCanvas) {
  const ctx = laserCanvas.getContext('2d');
  let W, H, dpr;
  let t = 0;
  let enabled = true;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = laserCanvas.width = window.innerWidth * dpr;
    H = laserCanvas.height = window.innerHeight * dpr;
    laserCanvas.style.width = '100%';
    laserCanvas.style.height = '100%';
  }

  const lasers = [
    { color: 'rgba(255,107,53,0.4)', speed: 0.8, offset: 0 },
    { color: 'rgba(0,240,255,0.35)', speed: 1.1, offset: 2 },
    { color: 'rgba(168,85,247,0.35)', speed: 0.9, offset: 4 },
    { color: 'rgba(255,107,53,0.3)', speed: 1.3, offset: 1 },
    { color: 'rgba(0,240,255,0.3)', speed: 0.7, offset: 3 },
  ];

  function draw() {
    if (!enabled) {
      ctx.clearRect(0, 0, W, H);
      requestAnimationFrame(draw);
      return;
    }

    ctx.clearRect(0, 0, W, H);
    t += 0.016;

    for (let i = 0; i < lasers.length; i++) {
      const l = lasers[i];
      const angle = Math.sin(t * l.speed + l.offset) * 0.3;
      const y = H * (0.2 + i * 0.15) + Math.sin(t * 0.5 + i) * H * 0.05;

      ctx.save();
      ctx.translate(W * 0.5, y);
      ctx.rotate(angle);

      // Beam
      const grad = ctx.createLinearGradient(-W, 0, W, 0);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.3, l.color);
      grad.addColorStop(0.7, l.color);
      grad.addColorStop(1, 'transparent');

      ctx.strokeStyle = grad;
      ctx.lineWidth = (3 + Math.sin(t * 2 + i) * 1.5) * dpr;
      ctx.beginPath();
      ctx.moveTo(-W, 0);
      ctx.lineTo(W, 0);
      ctx.stroke();

      // Glow
      ctx.lineWidth = 20 * dpr;
      ctx.globalAlpha = 0.15;
      ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.restore();
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();

  window.toggleLasers = function(on) {
    enabled = on;
    laserCanvas.style.opacity = on ? '0.7' : '0';
  };
}

// ═══════════════════════════════════════════════════════════
//  CONTROLS
// ═══════════════════════════════════════════════════════════

const clubToggle = document.getElementById('club-toggle');
const strobeToggle = document.getElementById('strobe-toggle');
const strobeEl = document.querySelector('.strobe');

let clubMode = true;
let strobeOn = false;

if (clubToggle) {
  clubToggle.addEventListener('click', () => {
    clubMode = !clubMode;
    clubToggle.classList.toggle('active', clubMode);
    const statusEl = clubToggle.querySelector('.status');
    if (statusEl) statusEl.textContent = clubMode ? 'ON' : 'OFF';
    
    if (window.toggleParticles) window.toggleParticles(clubMode);
    if (window.toggleLasers) window.toggleLasers(clubMode);
    
    document.querySelectorAll('.orb').forEach(orb => {
      orb.style.opacity = clubMode ? '0.35' : '0';
    });
  });
}

if (strobeToggle && strobeEl) {
  strobeToggle.addEventListener('click', () => {
    strobeOn = !strobeOn;
    strobeToggle.classList.toggle('active', strobeOn);
    const statusEl = strobeToggle.querySelector('.status');
    if (statusEl) statusEl.textContent = strobeOn ? 'ON' : 'OFF';
    strobeEl.classList.toggle('active', strobeOn);
  });
}

// ═══════════════════════════════════════════════════════════
//  VINYL INTERACTION
// ═══════════════════════════════════════════════════════════

document.querySelectorAll('.vinyl').forEach(vinyl => {
  vinyl.addEventListener('click', () => {
    vinyl.classList.toggle('paused');
  });
});

// ═══════════════════════════════════════════════════════════
//  SCROLL ANIMATIONS
// ═══════════════════════════════════════════════════════════

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.card, .stat-card, .info-card, .panel').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

const style = document.createElement('style');
style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);

// ═══════════════════════════════════════════════════════════
//  YEAR
// ═══════════════════════════════════════════════════════════

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ═══════════════════════════════════════════════════════════
//  FORM
// ═══════════════════════════════════════════════════════════

const form = document.getElementById('booking-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    alert('Demo form — connect to Formspree or your backend to receive inquiries.');
  });
}
