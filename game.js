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
  bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    if (bullet.y < 0) bullets.splice(index, 1);
  });

  alienBullets.forEach((bullet, index) => {
    bullet.y += bullet.speed;
    if (bullet.y > canvas.height) alienBullets.splice(index, 1);
  });
}

// Spawn aliens
function createAliens() {
  setInterval(() => {
    if (!isPaused) {
      const alien = {
        x: Math.random() * (canvas.width - 50),
        y: -50,
        width: 50,
        height: 50,
        speed: 2 + Math.random() * 2,
        shootCooldown: Math.random() * 2000 + 1000, // Random shoot cooldown
      };
      aliens.push(alien);
    }
  }, 1000);
}

// Alien shooting bullets
function alienShoot() {
  aliens.forEach((alien) => {
    if (Math.random() < 0.01) {
      alienBullets.push({
        x: alien.x + alien.width / 2 - 2.5,
        y: alien.y + alien.height,
        width: 5,
        height: 15,
        speed: 5,
      });
    }
  });
}

// Move aliens
function moveAliens() {
  aliens.forEach((alien, index) => {
    alien.y += alien.speed;
    if (alien.y > canvas.height) aliens.splice(index, 1);
  });
}

// Shooting bullets
function shoot() {
  if (shooting && bullets.length < 3) {
    bullets.push({
      x: player.x + player.width / 2 - 2.5,
      y: player.y,
      width: 5,
      height: 15,
      speed: 10,
    });
  }
}

// Check collision
function checkCollision() {
  bullets.forEach((bullet, bIndex) => {
    aliens.forEach((alien, aIndex) => {
      if (
        bullet.x < alien.x + alien.width &&
        bullet.x + bullet.width > alien.x &&
        bullet.y < alien.y + alien.height &&
        bullet.y + bullet.height > alien.y
      ) {
        aliens.splice(aIndex, 1);
        bullets.splice(bIndex, 1);
      }
    });
  });

  alienBullets.forEach((bullet, bIndex) => {
    if (
      bullet.x < player.x + player.width &&
      bullet.x + bullet.width > player.x &&
      bullet.y < player.y + player.height &&
      bullet.y + bullet.height > player.y
    ) {
      player.lives--;
      alienBullets.splice(bIndex, 1);
      if (player.lives <= 0) {
        alert('Game Over!');
        window.location.reload();
      }
    }
  });
}

// Draw game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = 'white';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw bullets
  bullets.forEach((bullet) => {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // Draw alien bullets
  alienBullets.forEach((bullet) => {
    ctx.fillStyle = 'red';
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // Draw aliens
  aliens.forEach((alien) => {
    ctx.fillStyle = 'green';
    ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
  });

  // Update lives
  document.getElementById('livesBar').textContent = `Lives: ${player.lives}`;
}

// Fullscreen functionality
document.getElementById('fullscreenBtn').addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.getElementById('game-container').requestFullscreen().catch((err) => {
      console.error(`Error attempting fullscreen: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
});

// Pause functionality
document.getElementById('pauseBtn').addEventListener('click', () => {
  isPaused = !isPaused;
});

// Mobile controls
function setupMobileControls() {
  const mobileButtons = {
    up: document.getElementById('up'),
    down: document.getElementById('down'),
    left: document.getElementById('left'),
    right: document.getElementById('right'),
    shoot: document.getElementById('shootBtn'),
  };

  Object.entries(mobileButtons).forEach(([key, button]) => {
    button.addEventListener('touchstart', () => {
      if (key === 'shoot') {
        shooting = true;
      } else {
        keys[key] = true;
      }
    });

    button.addEventListener('touchend', () => {
      if (key === 'shoot') {
        shooting = false;
      } else {
        keys[key] = false;
      }
    });
  });
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

// Main game loop
function gameLoop() {
  if (!isPaused) {
    movePlayer();
    moveBullets();
    moveAliens();
    shoot();
    alienShoot();
    checkCollision();
    draw();
  }
  requestAnimationFrame(gameLoop);
}

// Initialize game
setupMobileControls();
createAliens();
gameLoop();
