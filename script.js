// ── HALDI INVITATION SCRIPT ──

// ── ENVELOPE ──
const envelopeScreen = document.getElementById('envelopeScreen');
const envFlap = document.getElementById('envFlap');
const envSeal = document.getElementById('envSeal');
const tapHint = document.getElementById('tapHint');
const cardScreen = document.getElementById('cardScreen');
let envelopeOpened = false;

document.getElementById('envelope').addEventListener('click', openEnvelope);
document.getElementById('tapHint').addEventListener('click', openEnvelope);

function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;
  tapHint.style.opacity = '0';
  envSeal.classList.add('hidden');
  envFlap.classList.add('open');
  setTimeout(() => {
    envelopeScreen.classList.add('gone');
    cardScreen.classList.remove('hidden');
    startPetals();
    initScrollAnimations();
    // Stagger header items
    document.querySelectorAll('.card-header .fade-up').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 200 + i * 150);
    });
  }, 900);
}

// ── PETALS ──
const canvas = document.getElementById('petalCanvas');
const ctx = canvas.getContext('2d');
let petals = [];
let animFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createPetal() {
  const colors = ['#F5C842','#E8A020','#F9E08A','#FFD060','#C47A1B'];
  return {
    x: Math.random() * canvas.width,
    y: -20,
    size: 8 + Math.random() * 12,
    speed: 1.2 + Math.random() * 2,
    drift: (Math.random() - 0.5) * 1.2,
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: 0.7 + Math.random() * 0.3,
    shape: Math.random() > 0.5 ? 'petal' : 'circle'
  };
}

function drawPetal(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate((p.rotation * Math.PI) / 180);
  ctx.globalAlpha = p.opacity;
  ctx.fillStyle = p.color;
  if (p.shape === 'petal') {
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size / 2, p.size, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function animatePetals() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (Math.random() < 0.15 && petals.length < 60) petals.push(createPetal());
  petals = petals.filter(p => p.y < canvas.height + 30);
  petals.forEach(p => {
    p.y += p.speed;
    p.x += p.drift + Math.sin(p.y * 0.02) * 0.8;
    p.rotation += p.rotSpeed;
    drawPetal(p);
  });
  animFrame = requestAnimationFrame(animatePetals);
}

function startPetals() {
  animatePetals();
}

// ── SCROLL ANIMATIONS ──
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-up:not(.card-header .fade-up)').forEach(el => {
    observer.observe(el);
  });
}

// ── MUSIC ──
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
let playing = false;

musicBtn.addEventListener('click', () => {
  if (playing) {
    bgMusic.pause();
    musicBtn.textContent = '♪';
    musicBtn.classList.remove('playing');
  } else {
    bgMusic.play().catch(() => {});
    musicBtn.textContent = '■';
    musicBtn.classList.add('playing');
  }
  playing = !playing;
});
