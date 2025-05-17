const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
let particles = [];
let exploding = false;
const PARTICLE_COUNT = 100;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('click', () => {
  if (!exploding) {
    explode();
  }
});

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = 3;
    this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
    this.vx = 0;
    this.vy = 0;
  }

  update() {
    if (!exploding) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      let force = Math.min(5, 100 / (dist + 1));
      this.vx += (dx / dist) * force;
      this.vy += (dy / dist) * force;
    }

    this.vx *= 0.9;
    this.vy *= 0.9;

    this.x += this.vx;
    this.y += this.vy;
  }

  explode() {
    this.vx = (Math.random() - 0.5) * 20;
    this.vy = (Math.random() - 0.5) * 20;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function createParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }
}

function explode() {
  exploding = true;
  particles.forEach(p => p.explode());

  setTimeout(() => {
    exploding = false;
  }, 2000);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}

createParticles();
animate();
