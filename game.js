// Game variables
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let keys = {};
let shooting = false;
let lives = 3;

// Setup event listeners
function setupControls() {
  // Keyboard controls
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

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Game logic here
  if (keys.up) {
    // Move up
  }
  if (keys.down) {
    // Move down
  }
  if (keys.left) {
    // Move left
  }
  if (keys.right) {
    // Move right
  }
  if (shooting) {
    // Handle shooting
  }

  // Update lives display
  document.getElementById('livesBar').innerText = `Lives: ${lives}`;

  requestAnimationFrame(gameLoop);
}

// Initialize the game
function init() {
  setupControls();
  setupMobileControls();
  gameLoop();
}

// Start the game
init();
