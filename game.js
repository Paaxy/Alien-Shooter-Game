const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = { x: canvas.width / 2, y: canvas.height - 50, width: 50, height: 50, speed: 5 };
const bullets = [];
const aliens = [];
let shooting = false;

let keys = { up: false, down: false, left: false, right: false };

// Create aliens
function createAliens() {
  for (let i = 0; i < 5; i++) {
    aliens.push({ x: Math.random() * canvas.width, y: Math.random() * 100, width: 50, height: 50 });
  }
}

// Player movement
function movePlayer() {
  if (keys.up && player.y > 0) player.y -= player.speed;
  if (keys.down && player.y < canvas.height - player.height) player.y += player.speed;
  if (keys.left && player.x > 0) player.x -= player.speed;
  if (keys.right && player.x < canvas.width - player.width) player.x += player.speed;
}

// Bullet movement
function moveBullets() {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].y -= 10;
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
      i--;
    }
  }
}

// Alien shooting
function shootAliens() {
  aliens.forEach((alien, index) => {
    if (Math.random() < 0.01) {
      const bullet = { x: alien.x + alien.width / 2, y: alien.y + alien.height, width: 5, height: 15 };
      bullets.push(bullet);
    }
  });
}

// Bullet collision
function checkBulletCollision() {
  for (let i = 0; i < bullets.length; i++) {
    for (let j = 0; j < aliens.length; j++) {
      if (bullets[i].x < aliens[j].x + aliens[j].width &&
        bullets[i].x + bullets[i].width > aliens[j].x &&
        bullets[i].y < aliens[j].y + aliens[j].height &&
        bullets[i].y + bullets[i].height > aliens[j].y) {
        aliens.splice(j, 1);
        bullets.splice(i, 1);
        i--;
        break;
      }
    }
  }
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw player
  ctx.fillStyle = 'white';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  
  // Draw bullets
  bullets.forEach(bullet => {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
  
  // Draw aliens
  aliens.forEach(alien => {
    ctx.fillStyle = 'green';
    ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
  });
}

// Main game loop
function gameLoop() {
  movePlayer();
  moveBullets();
  shootAliens();
  checkBulletCollision();
  draw();
  requestAnimationFrame(gameLoop);
}

createAliens();
gameLoop();

// Handle keyboard input
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') keys.up = true;
  if (e.key === 'ArrowDown') keys.down = true;
  if (e.key === 'ArrowLeft') keys.left = true;
  if (e.key === 'ArrowRight') keys.right = true;
  if (e.key === ' ' || e.key === 'Enter') shooting = true;
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp') keys.up = false;
  if (e.key === 'ArrowDown') keys.down = false;
  if (e.key === 'ArrowLeft') keys.left = false;
  if (e.key === 'ArrowRight') keys.right = false;
  if (e.key === ' ' || e.key === 'Enter') shooting = false;
});

// Mobile controls
document.getElementById('up').addEventListener('touchstart', () => { keys.up = true; });
document.getElementById('down').addEventListener('touchstart', () => { keys.down = true; });
document.getElementById('left').addEventListener('touchstart', () => { keys.left = true; });
document.getElementById('right').addEventListener('touchstart', () => { keys.right = true; });
document.getElementById('shootBtn').addEventListener('touchstart', () => { shooting = true; });

document.getElementById('up').addEventListener('touchend', () => { keys.up = false; });
document.getElementById('down').addEventListener('touchend', () => { keys.down = false; });
document.getElementById('left').addEventListener('touchend', () => { keys.left = false; });
document.getElementById('right').addEventListener('touchend', () => { keys.right = false; });
document.getElementById('shootBtn').addEventListener('touchend', () => { shooting = false; });

// Fullscreen toggle
document.getElementById('fullscreenBtn').addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
});
