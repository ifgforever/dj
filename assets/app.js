// ═══════════════════════════════════════════════════════════
//  DJ MARIO — REFINED EFFECTS
// ═══════════════════════════════════════════════════════════

// Active navigation link
(function initNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });
})();

// ═══════════════════════════════════════════════════════════
//  PARTICLE SYSTEM — Subtle, elegant floating particles
// ═══════════════════════════════════════════════════════════

const canvas = document.getElementById('fx-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, dpr = 1;
  let animationId = null;
  let effectsEnabled = true;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = window.innerWidth * dpr;
    H = canvas.height = window.innerHeight * dpr;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
  }
  
  window.addEventListener('resize', resize);
  resize();

  // Particle configuration
  const PARTICLE_COUNT = 80;
  const particles = [];
  
  // Colors — warm amber and cool teal
  const colors = [
    { r: 232, g: 169, b: 70 },   // Accent amber
    { r: 78, g: 205, b: 196 },   // Electric teal
    { r: 250, g: 250, b: 250 },  // White
  ];

  function createParticle() {
    const colorIndex = Math.random() < 0.6 ? 0 : (Math.random() < 0.5 ? 1 : 2);
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3 * dpr,
      vy: (Math.random() - 0.5) * 0.3 * dpr,
      radius: (Math.random() * 1.5 + 0.5) * dpr,
      color: colors[colorIndex],
      alpha: Math.random() * 0.5 + 0.2,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    };
  }

  // Initialize particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }

  // Mouse interaction
  let mouse = { x: null, y: null };
  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX * dpr;
    mouse.y = e.clientY * dpr;
  });

  function draw() {
    if (!effectsEnabled) {
      animationId = requestAnimationFrame(draw);
      return;
    }

    ctx.clearRect(0, 0, W, H);

    // Draw and update particles
    for (const p of particles) {
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      p.phase += p.pulseSpeed;

      // Wrap around edges
      if (p.x < -50) p.x = W + 50;
      if (p.x > W + 50) p.x = -50;
      if (p.y < -50) p.y = H + 50;
      if (p.y > H + 50) p.y = -50;

      // Mouse repulsion (subtle)
      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 * dpr) {
          const force = (150 * dpr - dist) / (150 * dpr) * 0.5;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      // Dampen velocity
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Pulse alpha
      const pulse = 0.7 + 0.3 * Math.sin(p.phase);
      const alpha = p.alpha * pulse;

      // Draw particle with glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * (0.8 + 0.2 * pulse), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
      ctx.fill();

      // Subtle glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha * 0.1})`;
      ctx.fill();
    }

    // Draw subtle connection lines between nearby particles
    ctx.strokeStyle = 'rgba(232, 169, 70, 0.04)';
    ctx.lineWidth = 1 * dpr;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 * dpr) {
          ctx.globalAlpha = (1 - dist / (120 * dpr)) * 0.3;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    animationId = requestAnimationFrame(draw);
  }

  draw();

  // Toggle effects
  window.toggleEffects = function(enabled) {
    effectsEnabled = enabled;
    canvas.style.opacity = enabled ? '0.6' : '0';
  };
}

// ═══════════════════════════════════════════════════════════
//  CONTROLS — Club Mode & Strobe
// ═══════════════════════════════════════════════════════════

const clubToggle = document.getElementById('club-toggle');
const strobeToggle = document.getElementById('strobe-toggle');
const strobeOverlay = document.querySelector('.strobe-overlay');

let clubMode = true;
let strobeActive = false;

if (clubToggle) {
  clubToggle.addEventListener('click', () => {
    clubMode = !clubMode;
    clubToggle.classList.toggle('active', clubMode);
    clubToggle.querySelector('.status').textContent = clubMode ? 'ON' : 'OFF';
    
    if (window.toggleEffects) {
      window.toggleEffects(clubMode);
    }
    
    document.body.classList.toggle('effects-off', !clubMode);
  });
}

if (strobeToggle && strobeOverlay) {
  strobeToggle.addEventListener('click', () => {
    strobeActive = !strobeActive;
    strobeToggle.classList.toggle('active', strobeActive);
    strobeToggle.querySelector('.status').textContent = strobeActive ? 'ON' : 'OFF';
    strobeOverlay.classList.toggle('active', strobeActive);
  });
}

// ═══════════════════════════════════════════════════════════
//  SMOOTH SCROLL
// ═══════════════════════════════════════════════════════════

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ═══════════════════════════════════════════════════════════
//  INTERSECTION OBSERVER FOR ANIMATIONS
// ═══════════════════════════════════════════════════════════

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeInObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.card, .stat-card, .info-card, .panel').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fadeInObserver.observe(el);
});

// Add visible class styles
const style = document.createElement('style');
style.textContent = `
  .card.visible, .stat-card.visible, .info-card.visible, .panel.visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);

// ═══════════════════════════════════════════════════════════
//  YEAR IN FOOTER
// ═══════════════════════════════════════════════════════════

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ═══════════════════════════════════════════════════════════
//  FORM HANDLING (Demo)
// ═══════════════════════════════════════════════════════════

const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Demo form — connect to Formspree, Netlify Forms, or your backend to receive inquiries.');
  });
}
