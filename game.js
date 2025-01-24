// Game variables
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let keys = {};
let shooting = false;
let lives = 3;

// Player object
let player = {
  x: canvas.width / 2,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  speed: 5,
};

// Bullet array
let bullets = [];

// Alien object
let aliens = [];
const alienCount = 5;

// Create aliens
function createAliens() {
  for (let i = 0; i < alienCount; i++) {
    aliens.push({
      x: Math.random() * (canvas.width - 50),
      y: Math.random() * (canvas.height / 2),
      width: 50,
      height: 50,
      speed: Math.random() * 2 + 1,
      shootCooldown: Math.random() * 2000 + 1000, // Random cooldown between 1-3 seconds
      lastShot: 0,
    });
  }
}

// Setup event listeners for keyboard controls
function setupControls() {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') keys.up = true;
    if (e.key === 'ArrowDown') keys.down = true;
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
    if (e.key === ' ') shooting = true; // Space to shoot
  });

  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') keys.up = false;
    if (e.key === 'ArrowDown') keys.down = false;
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === ' ') shooting = false; // Stop shooting
  });
}

// Setup mobile controls
function setupMobileControls() {
  const mobileButtons = {
    up: document.getElementById('↑'),
    down: document.getElementById('↓'),
    left: document.getElementById('←'),
    right: document.getElementById('→'),
    shoot: document.getElementById('Shoot'),
  };

  Object.entries(mobileButtons).forEach(([key, button]) => {
    button.addEventListener('touchstart', (e) => {
      e.preventDefault(); // Prevent touch scrolling
      if (key === 'shoot') {
        shooting = true;
      } else {
        keys[key] = true;
      }
    });

    button.addEventListener('touchend', (e) => {
      e.preventDefault(); // Prevent touch scrolling
      if (key === 'shoot') {
        shooting = false;
      } else {
        keys[key] = false;
      }
    });
  });
}

// Update player position
function updatePlayer() {
  if (keys.up && player.y > 0) player.y -= player.speed;
  if (keys.down && player.y < canvas.height - player.height) player.y += player.speed;
  if (keys.left && player.x > 0) player.x -= player.speed;
  if (keys.right && player.x < canvas.width - player.width) player.x += player.speed;
}

// Fire bullets
function fireBullet() {
  bullets.push({
    x: player.x + player.width / 2 - 5,
    y: player.y,
    width: 10,
    height: 20,
    speed: 5,
  });
}

// Update bullets
function updateBullets() {
  bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    // Remove bullet if it goes off-screen
    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });
}

// Update alien positions and shooting
function updateAliens() {
  aliens.forEach(alien => {
    alien.y += alien.speed;
    if (alien.y > canvas.height) {
      alien.y = 0; // Reset to top
      alien.x = Math.random() * (canvas.width - alien.width); // Random x position
    }

    // Alien shooting logic
    const currentTime = Date.now();
    if (currentTime - alien.lastShot > alien.shootCooldown) {
      fireAlienBullet(alien);
      alien.lastShot = currentTime;
    }
  });
}

// Fire alien bullets
function fireAlienBullet(alien) {
  // Create bullet object
  const bullet = {
    x: alien.x + alien.width / 2 - 5,
    y: alien.y + alien.height,
    width: 10,
    height: 20,
    speed: 3,
  };
  bullets.push(bullet); // Add to bullets array
}

// Update alien bullets
function updateAlienBullets() {
  bullets.forEach((bullet, index) => {
    if (bullet.y > canvas.height) {
      bullets.splice(index, 1); // Remove bullet if it goes off-screen
    }
  });
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Update player and bullets
  updatePlayer();
  updateBullets();
  updateAliens();

  // Draw player
  ctx.fillStyle = 'blue'; // Player color
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw bullets
  ctx.fillStyle = 'yellow'; // Bullet color
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // Draw aliens
  ctx.fillStyle = 'red'; // Alien color
  aliens.forEach(alien => {
    ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
  });

  // Update lives display
  document.getElementById('livesBar').innerText = `Lives: ${lives}`;

  requestAnimationFrame(gameLoop);
}

// Initialize the game
function init() {
  createAliens();
  setupControls();
  setupMobileControls();
  gameLoop();
}

// Start the game
init();
