const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = { x: canvas.width / 2, y: canvas.height - 50, width: 50, height: 50, speed: 5, lives: 3 };
const bullets = [];
const alienBullets = [];
const aliens = [];
let shooting = false;
let keys = { up: false, down: false, left: false, right: false };
let isPaused = false;

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

// Alien creation
function createAliens() {
  setInterval(() => {
    if (!isPaused) {
      const alien = { 
        x: Math.random() * canvas.width, 
        y: 0, 
        width: 50, 
        height: 50, 
        speed: 1 + Math.random() * 3 
      };
      aliens.push(alien);
    }
  }, 1000);
}

// Alien movement
function moveAliens() {
  if (!isPaused) {
    aliens.forEach(alien => {
      if (alien.y < canvas.height - alien.height) {
        alien.y += alien.speed;
      }
      if (alien.x < player.x) alien.x += alien.speed;
      if (alien.x > player.x) alien.x -= alien.speed;
    });
  }
}

// Shooting functionality
function shoot() {
  if (shooting && bullets.length < 3) {  // Limit to 3 bullets on screen at once
    const bullet = { 
      x: player.x + player.width / 2 - 2.5, 
      y: player.y - 10, 
      width: 5, 
      height: 15, 
      speed: 10
    };
    bullets.push(bullet);
  }
}

// Handle bullet collision and alien removal
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

  // Draw lives
  document.getElementById('livesBar').textContent = `Lives: ${player.lives}`;
}

// Fullscreen functionality
document.getElementById('fullscreenBtn').addEventListener('click', () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
});

// Pause functionality
document.getElementById('pauseBtn').addEventListener('click', () => {
  isPaused = !isPaused;
});

// Mobile button controls
function setupMobileControls() {
  const upButton = document.getElementById('up');
  const downButton = document.getElementById('down');
  const leftButton = document.getElementById('left');
  const rightButton = document.getElementById('right');
  const shootButton = document.getElementById('shootBtn');

  function handleButtonPress(key) {
    keys[key] = true;
  }

  function handleButtonRelease(key) {
    keys[key] = false;
  }

  upButton.addEventListener('touchstart', () => handleButtonPress('up'));
  upButton.addEventListener('touchend', () => handleButtonRelease('up'));

  downButton.addEventListener('touchstart', () => handleButtonPress('down'));
  downButton.addEventListener('touchend', () => handleButtonRelease('down'));

  leftButton.addEventListener('touchstart', () => handleButtonPress('left'));
  leftButton.addEventListener('touchend', () => handleButtonRelease('left'));

  rightButton.addEventListener('touchstart', () => handleButtonPress('right'));
  rightButton.addEventListener('touchend', () => handleButtonRelease('right'));

  shootButton.addEventListener('touchstart', () => (shooting = true));
  shootButton.addEventListener('touchend', () => (shooting = false));
}

// Keyboard controls
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') keys.up = true;
  if (e.key === 'ArrowDown') keys.down = true;
  if (e.key === 'ArrowLeft') keys.left = true;
  if (e.key === 'ArrowRight') keys.right = true;
  if (e.key === ' ') shooting = true;
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp') keys.up = false;
  if (e.key === 'ArrowDown') keys.down = false;
  if (e.key === 'ArrowLeft') keys.left = false;
  if (e.key === 'ArrowRight') keys.right = false;
  if (e.key === ' ') shooting = false;
});

// Initialize game
setupMobileControls();
createAliens();
gameLoop();
