// ----- Page active link -----
(function setActiveNav(){
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a=>{
    const href = a.getAttribute("href");
    if(href === path) a.classList.add("active");
  });
})();

// ----- FX Canvas (particles + laser sweeps) -----
const canvas = document.getElementById("fx");
const ctx = canvas.getContext("2d", { alpha: true });

let W=0, H=0, DPR=1;
function resize(){
  DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  W = canvas.width  = Math.floor(window.innerWidth * DPR);
  H = canvas.height = Math.floor(window.innerHeight * DPR);
  canvas.style.width  = "100%";
  canvas.style.height = "100%";
}
window.addEventListener("resize", resize);
resize();

const rand = (a,b)=> a + Math.random()*(b-a);

const particles = Array.from({length: 140}, ()=>({
  x: rand(0,W), y: rand(0,H),
  r: rand(0.8, 2.2)*DPR,
  vx: rand(-0.20, 0.20)*DPR,
  vy: rand(-0.25, 0.25)*DPR,
  phase: rand(0, Math.PI*2)
}));

let t = 0;
let clubMode = true;

function draw(){
  t += 0.016;

  ctx.clearRect(0,0,W,H);

  // Soft vignette
  ctx.save();
  const grad = ctx.createRadialGradient(W*0.35, H*0.20, 0, W*0.5, H*0.5, Math.max(W,H)*0.65);
  grad.addColorStop(0, "rgba(0,255,255,0.07)");
  grad.addColorStop(0.35, "rgba(255,0,255,0.05)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,W,H);
  ctx.restore();

  // Laser sweeps
  const sweeps = clubMode ? 5 : 3;
  for(let i=0;i<sweeps;i++){
    const y = (H*(0.15 + i*0.16)) + Math.sin(t*0.9 + i)*H*0.03;
    const xOff = Math.sin(t*0.7 + i)*W*0.12;

    ctx.save();
    ctx.globalAlpha = clubMode ? 0.16 : 0.10;
    ctx.lineWidth = (clubMode ? 2.2 : 1.6) * DPR;

    // Color oscillation
    const hue = (t*60 + i*90) % 360;
    ctx.strokeStyle = `hsla(${hue}, 100%, 60%, 1)`;

    ctx.beginPath();
    ctx.moveTo(-W*0.1 + xOff, y);
    ctx.lineTo(W*1.1 + xOff, y + Math.sin(t*1.2 + i)*H*0.06);
    ctx.stroke();
    ctx.restore();
  }

  // Particles
  ctx.save();
  ctx.globalAlpha = clubMode ? 0.85 : 0.65;
  for(const p of particles){
    p.phase += 0.02;
    p.x += p.vx;
    p.y += p.vy;

    if(p.x < -20) p.x = W+20;
    if(p.x > W+20) p.x = -20;
    if(p.y < -20) p.y = H+20;
    if(p.y > H+20) p.y = -20;

    const pulse = 0.7 + 0.3*Math.sin(p.phase + t*2.0);
    const hue = (t*40 + (p.x/W)*240) % 360;

    ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${0.75*pulse})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r*(0.9 + 0.4*pulse), 0, Math.PI*2);
    ctx.fill();
  }
  ctx.restore();

  requestAnimationFrame(draw);
}
draw();

// ----- Club Mode controls -----
const strobeEl = document.querySelector(".strobe");
const clubBtn = document.getElementById("clubToggle");
const strobeBtn = document.getElementById("strobeToggle");

function setClub(on){
  clubMode = !!on;
  if(clubBtn){
    clubBtn.textContent = clubMode ? "Club Mode: ON" : "Club Mode: OFF";
    clubBtn.setAttribute("aria-pressed", String(clubMode));
  }
}
function setStrobe(on){
  if(!strobeEl) return;
  if(on) strobeEl.classList.add("on");
  else strobeEl.classList.remove("on");
  if(strobeBtn){
    strobeBtn.textContent = on ? "Strobe: ON" : "Strobe: OFF";
    strobeBtn.setAttribute("aria-pressed", String(!!on));
  }
}

if(clubBtn){
  clubBtn.addEventListener("click", ()=> setClub(!clubMode));
  setClub(true);
}
if(strobeBtn){
  strobeBtn.addEventListener("click", ()=>{
    const on = !strobeEl.classList.contains("on");
    setStrobe(on);
  });
  setStrobe(false);
}

