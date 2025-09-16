const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const bubbles = [];
const particles = [];

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = Math.random() * 2 + 1;
    this.speedX = Math.random() * 6 - 3;
    this.speedY = Math.random() * 6 - 3;
    this.life = 1;
    this.decay = 0.02;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= this.decay;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class Bubble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 20 + 10;
    this.originalRadius = this.radius;
    this.targetRadius = this.radius;
    this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    this.speedY = Math.random() * 3 + 1;
  }

  update() {
    this.y -= this.speedY;
    this.radius += (this.targetRadius - this.radius) * 0.1;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function createBubble() {
  bubbles.push(new Bubble(mouseX, mouseY));
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    createBubble();
  }
});

window.addEventListener('mousedown', (e) => {
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const bubble = bubbles[i];
    const distance = Math.hypot(e.clientX - bubble.x, e.clientY - bubble.y);
    if (distance < bubble.radius) {
      for (let j = 0; j < 8; j++) {
        particles.push(new Particle(bubble.x, bubble.y, bubble.color));
      }
      bubbles.splice(i, 1);
    }
  }
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const bubble = bubbles[i];

    const distance = Math.hypot(mouseX - bubble.x, mouseY - bubble.y);
    if (distance < bubble.radius) {
      bubble.targetRadius = bubble.originalRadius * 1.2;
    } else {
      bubble.targetRadius = bubble.originalRadius;
    }

    bubble.update();
    bubble.draw();
    if (bubble.y + bubble.radius < 0) {
      bubbles.splice(i, 1);
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    particle.update();
    particle.draw();
    if (particle.life <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

animate();
