// Alien Shooter Game
// A 2D game where players shoot down aliens. 
// The game is web-based and compatible with both mobile and desktop.

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

// Assets and variables
const player = { x: 400, y: 500, width: 50, height: 50, color: 'blue', speed: 5, bullets: [] };
const aliens = [];
const bullets = [];
const keys = {};
let score = 0;
let gameRunning = true;

// Utility functions
function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createAlien() {
  aliens.push({
    x: random(0, canvas.width - 50),
    y: -50,
    width: 50,
    height: 50,
    color: 'green',
    speed: random(1, 3),
  });
}

function drawRect(obj) {
  ctx.fillStyle = obj.color;
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

// Event listeners
window.addEventListener('keydown', (e) => (keys[e.key] = true));
window.addEventListener('keyup', (e) => (keys[e.key] = false));
canvas.addEventListener('touchstart', (e) => {
  player.bullets.push({ x: player.x + player.width / 2 - 5, y: player.y, width: 10, height: 20, color: 'red', speed: 5 });
});

// Main game functions
function update() {
  if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
  if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed;
  if (keys[' '] || keys['Space']) {
    if (!player.shooting) {
      player.bullets.push({ x: player.x + player.width / 2 - 5, y: player.y, width: 10, height: 20, color: 'red', speed: 5 });
      player.shooting = true;
    }
  } else {
    player.shooting = false;
  }

  // Update bullets
  player.bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    if (bullet.y + bullet.height < 0) player.bullets.splice(index, 1);
  });

  // Update aliens
  aliens.forEach((alien, index) => {
    alien.y += alien.speed;
    if (alien.y > canvas.height) aliens.splice(index, 1);

    // Check collision with bullets
    player.bullets.forEach((bullet, bIndex) => {
      if (
        bullet.x < alien.x + alien.width &&
        bullet.x + bullet.width > alien.x &&
        bullet.y < alien.y + alien.height &&
        bullet.y + bullet.height > alien.y
      ) {
        aliens.splice(index, 1);
        player.bullets.splice(bIndex, 1);
        score++;
      }
    });
  });

  // Spawn aliens
  if (Math.random() < 0.02) createAlien();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  drawRect(player);

  // Draw bullets
  player.bullets.forEach((bullet) => drawRect(bullet));

  // Draw aliens
  aliens.forEach((alien) => drawRect(alien));

  // Draw score
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 20);
}

function gameLoop() {
  if (!gameRunning) return;

  update();
  draw();

  requestAnimationFrame(gameLoop);
}

// Start the game
function startGame() {
  gameLoop();
}

startGame();
