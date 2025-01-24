// Create the canvas for the game
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

// Responsive canvas sizing
const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Fullscreen functionality
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch((err) => {
      console.error(`Failed to enable fullscreen: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
};

// Create buttons
const createButton = (id, text, styles, onClick) => {
  const button = document.createElement('button');
  button.id = id;
  button.textContent = text;
  Object.assign(button.style, styles);
  button.addEventListener('click', onClick);
  document.body.appendChild(button);
  return button;
};

const fullscreenButton = createButton(
  'fullscreen',
  'Fullscreen',
  { position: 'fixed', bottom: '10px', right: '10px', zIndex: 1000 },
  toggleFullscreen
);

const leftButton = createButton(
  'left',
  '←',
  { position: 'fixed', bottom: '80px', left: '10px', zIndex: 1000 },
  () => (leftPressed = true)
);

const rightButton = createButton(
  'right',
  '→',
  { position: 'fixed', bottom: '80px', left: '100px', zIndex: 1000 },
  () => (rightPressed = true)
);

const shootButton = createButton(
  'shoot',
  'Shoot',
  { position: 'fixed', bottom: '10px', left: '10px', zIndex: 1000 },
  () => {
    shootSound.play();
    player.bullets.push({
      x: player.x + player.width / 2 - 5,
      y: player.y,
      width: 10,
      height: 20,
      color: 'red',
      speed: 5,
    });
  }
);

// Game variables
const player = { x: 375, y: 500, width: 50, height: 50, color: 'blue', speed: 5, bullets: [] };
const aliens = [];
const keys = {};
let score = 0;
let lives = 3;
let alienSpeedMultiplier = 1;
let isPaused = false;

// Sound effects
const shootSound = new Audio('shoot.mp3');
const explosionSound = new Audio('explosion.mp3');

// Utility functions
const random = (min, max) => Math.random() * (max - min) + min;

const createAlien = () => {
  aliens.push({
    x: random(0, canvas.width - 50),
    y: -50,
    width: 50,
    height: 50,
    color: 'green',
    speed: random(1, 3) * alienSpeedMultiplier,
  });
};

const drawRect = (obj) => {
  ctx.fillStyle = obj.color;
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
};

// Event listeners
window.addEventListener('keydown', (e) => {
  if (e.key === 'p') isPaused = !isPaused; // Pause functionality
  keys[e.key] = true;
});
window.addEventListener('keyup', (e) => (keys[e.key] = false));

// Handle mobile buttons
let leftPressed = false,
  rightPressed = false;
leftButton.addEventListener('mousedown', () => (leftPressed = true));
leftButton.addEventListener('mouseup', () => (leftPressed = false));
rightButton.addEventListener('mousedown', () => (rightPressed = true));
rightButton.addEventListener('mouseup', () => (rightPressed = false));
leftButton.addEventListener('touchstart', () => (leftPressed = true));
leftButton.addEventListener('touchend', () => (leftPressed = false));
rightButton.addEventListener('touchstart', () => (rightPressed = true));
rightButton.addEventListener('touchend', () => (rightPressed = false));

// Update alien speed periodically
setInterval(() => {
  alienSpeedMultiplier += 0.01;
}, 10000); // Increase every 10 seconds

// Main game functions
const update = () => {
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
    if (alien.y > canvas.height) {
      aliens.splice(index, 1);
      lives--;
      if (lives <= 0) {
        alert(`Game Over! Your Score: ${score}`);
        document.location.reload();
      }
    }

    // Check collision with bullets
    player.bullets.forEach((bullet, bIndex) => {
      if (
        bullet.x < alien.x + alien.width &&
        bullet.x + bullet.width > alien.x &&
        bullet.y < alien.y + alien.height &&
        bullet.y + bullet.height > alien.y
      ) {
        explosionSound.play();
        aliens.splice(index, 1);
        player.bullets.splice(bIndex, 1);
        score++;
      }
    });
  });

  // Spawn aliens
  if (Math.random() < 0.02) createAlien();
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  drawRect(player);

  // Draw bullets
  player.bullets.forEach((bullet) => drawRect(bullet));

  // Draw aliens
  aliens.forEach((alien) => drawRect(alien));

  // Draw score and lives
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 20);
  ctx.fillText(`Lives: ${lives}`, 10, 50);
};

const gameLoop = () => {
  if (!isPaused) {
    update();
    draw();
  }
  requestAnimationFrame(gameLoop);
};

gameLoop();
