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

class Bubble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 20 + 10;
    this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    this.speedY = Math.random() * 3 + 1;
  }

  update() {
    this.y -= this.speedY;
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
      bubbles.splice(i, 1);
    }
  }
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const bubble = bubbles[i];
    bubble.update();
    bubble.draw();
    if (bubble.y + bubble.radius < 0) {
      bubbles.splice(i, 1);
    }
  }
  requestAnimationFrame(animate);
}

animate();
