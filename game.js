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
    up: document.getElementById('up'),
    down: document.getElementById('down'),
    left: document.getElementById('left'),
    right: document.getElementById('right'),
    shoot: document.getElementById('shootBtn'),
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

// Update alien positions
function updateAliens() {
  aliens.forEach(alien => {
    alien.y += alien.speed;
    if (alien.y > canvas.height) {
      alien.y = 0; // Reset to top
      alien.x = Math.random() * (canvas.width - alien.width); // Random x position
    }
  });
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Update player position
  updatePlayer();
  updateAliens();

  // Draw player
  ctx.fillStyle = 'blue'; // Player color
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw aliens
  ctx.fillStyle = 'red'; // Alien color
  aliens.forEach(alien => {
    ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
  });

  // Handle shooting logic (placeholder)
  if (shooting) {
    // Implement shooting logic here
    console.log('Shooting!');
  }

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
