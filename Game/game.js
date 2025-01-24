// Create the canvas for the game
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

// Fullscreen functionality
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch(err => {
      console.error(`Failed to enable fullscreen: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
};

// Create fullscreen button
const fullscreenButton = document.createElement('button');
fullscreenButton.id = 'fullscreen';
fullscreenButton.textContent = 'Fullscreen';
document.body.appendChild(fullscreenButton);
fullscreenButton.addEventListener('click', toggleFullscreen);

// Create shoot button
const shootButton = document.createElement('button');
shootButton.id = 'shoot';
shootButton.textContent = 'Shoot';
document.body.appendChild(shootButton);

// Create mobile movement buttons (left and right)
const leftButton = document.createElement('button');
leftButton.id = 'left';
leftButton.textContent = '←';
document.body.appendChild(leftButton);

const rightButton = document.createElement('button');
rightButton.id = 'right';
rightButton.textContent = '→';
document.body.appendChild(rightButton);

// Ensure buttons are visible in fullscreen mode
const positionButtons = () => {
  const scale = window.innerWidth / canvas.width;

  fullscreenButton.style.transform = `scale(${scale})`;
  fullscreenButton.style.right = `${10 * scale}px`;
  fullscreenButton.style.bottom = `${10 * scale}px`;

  leftButton.style.transform = `scale(${scale})`;
  leftButton.style.left = `${10 * scale}px`;
  leftButton.style.bottom = `${80 * scale}px`;

  rightButton.style.transform = `scale(${scale})`;
  rightButton.style.left = `${100 * scale}px`;
  rightButton.style.bottom = `${80 * scale}px`;

  shootButton.style.transform = `scale(${scale})`;
  shootButton.style.left = `${10 * scale}px`;
  shootButton.style.bottom = `${10 * scale}px`;
};

window.addEventListener('resize', positionButtons);
positionButtons();

// Game Variables
const player = { x: 375, y: 500, width: 50, height: 50, color: 'blue', speed: 5, bullets: [] };
const aliens = [];
const keys = {};
let score = 0;
let isPaused = false;

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

// Handle keyboard input
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;

  // Shoot when the spacebar is pressed
  if (e.key === ' ') {
    player.bullets.push({
      x: player.x + player.width / 2 - 5,
      y: player.y,
      width: 10,
      height: 20,
      color: 'red',
      speed: 5,
    });
  }

  // Pause the game when 'P' is pressed
  if (e.key.toLowerCase() === 'p') {
    isPaused = !isPaused;
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Handle mobile button presses
let leftPressed = false, rightPressed = false;
leftButton.addEventListener('mousedown', () => (leftPressed = true));
leftButton.addEventListener('mouseup', () => (leftPressed = false));
rightButton.addEventListener('mousedown', () => (rightPressed = true));
rightButton.addEventListener('mouseup', () => (rightPressed = false));
shootButton.addEventListener('click', () => {
  player.bullets.push({
    x: player.x + player.width / 2 - 5,
    y: player.y,
    width: 10,
    height: 20,
    color: 'red',
    speed: 5,
  });
});

// Add touch event listeners for mobile compatibility
leftButton.addEventListener('touchstart', () => (leftPressed = true));
leftButton.addEventListener('touchend', () => (leftPressed = false));
rightButton.addEventListener('touchstart', () => (rightPressed = true));
rightButton.addEventListener('touchend', () => (rightPressed = false));
shootButton.addEventListener('touchstart', () => {
  player.bullets.push({
    x: player.x + player.width / 2 - 5,
    y: player.y,
    width: 10,
    height: 20,
    color: 'red',
    speed: 5,
  });
});

// Main game functions
function update() {
  if (isPaused) return;

  // Player movement
  if ((keys['ArrowLeft'] || leftPressed) && player.x > 0) player.x -= player.speed;
  if ((keys['ArrowRight'] || rightPressed) && player.x < canvas.width - player.width) player.x += player.speed;

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

  // Spawn aliens with a chance of 5%
  if (Math.random() < 0.05) createAlien();
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

  // Draw pause message
  if (isPaused) {
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.fillText('PAUSED', canvas.width / 2 - 60, canvas.height / 2);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
