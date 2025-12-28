// Active nav
(function(){
  const file = (location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".nav-links a").forEach(a=>{
    if(a.getAttribute("href") === file) a.classList.add("active");
  });
})();

// Footer year
const y = document.getElementById("year");
if(y) y.textContent = new Date().getFullYear();

// --------- Canvas FX (particles) ----------
const fx = document.getElementById("fx-canvas");
const laser = document.getElementById("laser-canvas");
const fxCtx = fx.getContext("2d", { alpha:true });
const lzCtx = laser.getContext("2d", { alpha:true });

let W=0,H=0,DPR=1;
function resize(){
  DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  W = fx.width = laser.width = Math.floor(innerWidth * DPR);
  H = fx.height = laser.height = Math.floor(innerHeight * DPR);
  fx.style.width = laser.style.width = "100%";
  fx.style.height = laser.style.height = "100%";
}
addEventListener("resize", resize);
resize();

const rand=(a,b)=>a+Math.random()*(b-a);

// Particles
const particles = Array.from({length: 170}, ()=>({
  x: rand(0,W), y: rand(0,H),
  r: rand(0.8, 2.2)*DPR,
  vx: rand(-0.25, 0.25)*DPR,
  vy: rand(-0.28, 0.28)*DPR,
  phase: rand(0, Math.PI*2)
}));

let t=0;
let clubMode = true;

// Laser “beams”
function drawLasers(){
  lzCtx.clearRect(0,0,W,H);
  const beams = clubMode ? 7 : 4;

  for(let i=0;i<beams;i++){
    const y = (H*(0.12 + i*0.12)) + Math.sin(t*0.9 + i)*H*0.03;
    const xOff = Math.sin(t*0.7 + i)*W*0.15;
    const hue = (t*55 + i*85) % 360;

    lzCtx.save();
    lzCtx.globalAlpha = clubMode ? 0.18 : 0.10;
    lzCtx.lineWidth = (clubMode ? 2.2 : 1.4) * DPR;
    lzCtx.strokeStyle = `hsla(${hue}, 100%, 60%, 1)`;
    lzCtx.shadowBlur = 18*DPR;
    lzCtx.shadowColor = `hsla(${hue}, 100%, 60%, .8)`;

    lzCtx.beginPath();
    lzCtx.moveTo(-W*0.1 + xOff, y);
    lzCtx.lineTo(W*1.1 + xOff, y + Math.sin(t*1.2 + i)*H*0.06);
    lzCtx.stroke();
    lzCtx.restore();
  }
}

// Particle layer
function drawParticles(){
  fxCtx.clearRect(0,0,W,H);

  // subtle vignette wash
  fxCtx.save();
  const g = fxCtx.createRadialGradient(W*0.35, H*0.20, 0, W*0.5, H*0.5, Math.max(W,H)*0.70);
  g.addColorStop(0, "rgba(0,255,255,0.06)");
  g.addColorStop(0.35, "rgba(255,0,255,0.05)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  fxCtx.fillStyle = g;
  fxCtx.fillRect(0,0,W,H);
  fxCtx.restore();

  fxCtx.save();
  fxCtx.globalAlpha = clubMode ? 0.90 : 0.70;

  for(const p of particles){
    p.phase += 0.02;
    p.x += p.vx;
    p.y += p.vy;

    if(p.x < -20) p.x = W+20;
    if(p.x > W+20) p.x = -20;
    if(p.y < -20) p.y = H+20;
    if(p.y > H+20) p.y = -20;

    const pulse = 0.7 + 0.3*Math.sin(p.phase + t*2.2);
    const hue = (t*42 + (p.x/W)*240) % 360;

    fxCtx.fillStyle = `hsla(${hue}, 100%, 60%, ${0.7*pulse})`;
    fxCtx.beginPath();
    fxCtx.arc(p.x, p.y, p.r*(0.9 + 0.45*pulse), 0, Math.PI*2);
    fxCtx.fill();
  }

  fxCtx.restore();
}

function loop(){
  t += 0.016;
  drawParticles();
  drawLasers();
  requestAnimationFrame(loop);
}
loop();

// --------- Toggles (your IDs) ----------
const strobe = document.querySelector(".strobe");
const clubBtn = document.getElementById("club-toggle");
const strobeBtn = document.getElementById("strobe-toggle");

function setClub(on){
  clubMode = !!on;
  if(clubBtn){
    clubBtn.classList.toggle("active", clubMode);
    clubBtn.querySelector(".status").textContent = clubMode ? "ON" : "OFF";
  }
}
function setStrobe(on){
  if(!strobe) return;
  strobe.classList.toggle("on", !!on);
  if(strobeBtn){
    strobeBtn.classList.toggle("active", !!on);
    strobeBtn.querySelector(".status").textContent = on ? "ON" : "OFF";
  }
}

if(clubBtn){
  clubBtn.addEventListener("click", ()=> setClub(!clubMode));
  setClub(true);
}
if(strobeBtn){
  strobeBtn.addEventListener("click", ()=> setStrobe(!strobe.classList.contains("on")));
  setStrobe(false);
}

// --------- Vinyl click pause/play ----------
const vinyl = document.querySelector(".vinyl");
if(vinyl){
  vinyl.addEventListener("click", ()=>{
    vinyl.classList.toggle("paused");
  });
}
