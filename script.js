// Game variables
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let keys = {};
let shooting = false;
let lives = 3;
let paused = false;

// Player object
let player = {
    x: canvas.width / 2,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5,
};

// Bullet arrays
let playerBullets = [];
let alienBullets = [];

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
        up: document.getElementById('up'),
        down: document.getElementById('down'),
        left: document.getElementById('left'),
        right: document.getElementById('right'),
        shoot: document.getElementById('shootBtn'),
        pause: document.getElementById('pauseBtn'),
        fullscreen: document.getElementById('fullscreenBtn'),
    };

    Object.entries(mobileButtons).forEach(([key, button]) => {
        button.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent touch scrolling
            if (key === 'shoot') {
                shooting = true;
            } else if (key === 'pause') {
                togglePause();
            } else if (key === 'fullscreen') {
                toggleFullscreen();
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

// Fire player bullets
function firePlayerBullet() {
    playerBullets.push({
        x: player.x + player.width / 2 - 5,
        y: player.y,
        width: 10,
        height: 20,
        speed: 5,
    });
}

// Update player bullets
function updatePlayerBullets() {
    playerBullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed; // Player bullets move upwards
        // Remove bullet if it goes off-screen
        if (bullet.y < 0) {
            playerBullets.splice(index, 1);
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

// Fire alien bullets (downwards)
function fireAlienBullet(alien) {
    // Create bullet object
    const bullet = {
        x: alien.x + alien.width / 2 - 5,
        y: alien.y + alien.height,
        width: 10,
        height: 20,
        speed: 3,
    };
    alienBullets.push(bullet); // Add to alien bullets array
}

// Update alien bullets
function updateAlienBullets() {
    alienBullets.forEach((bullet, index) => {
        bullet.y += bullet.speed; // Alien bullets move downwards
        // Remove bullet if it goes off-screen
        if (bullet.y > canvas.height) {
            alienBullets.splice(index, 1);
        }
    });
}

// Check for collisions
function checkCollisions() {
    // Check for player bullet collisions with aliens
    playerBullets.forEach((bullet, bulletIndex) => {
        aliens.forEach((alien, alienIndex) => {
            if (
                bullet.x < alien.x + alien.width &&
                bullet.x + bullet.width > alien.x &&
                bullet.y < alien.y + alien.height &&
                bullet.y + bullet.height > alien.y
            ) {
                // Remove the bullet and the alien on collision
                playerBullets.splice(bulletIndex, 1);
                aliens.splice(alienIndex, 1);
            }
        });
    });

    // Check for alien bullet collisions with player
    alienBullets.forEach((bullet, bulletIndex) => {
        if (
            bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y
        ) {
            // Remove the bullet and decrease lives
            alienBullets.splice(bulletIndex, 1);
            lives -= 1;
            if (lives <= 0) {
                alert('Game Over!');
                // Reset the game or reload the page
                location.reload();
            }
        }
    });
}

// Toggle pause
function togglePause() {
    paused = !paused;
    if (paused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '40px Arial';
        ctx.fillText('Paused', canvas.width / 2 - 80, canvas.height / 2);
    }
}

// Toggle fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Game loop
function gameLoop() {
    if (paused) return; // Stop the game loop if paused

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update player and bullets
    updatePlayer();
    updatePlayerBullets();
    updateAliens();
    updateAlienBullets();
    checkCollisions();

    // Draw player
    ctx.fillStyle = 'blue'; // Player color
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw player bullets
    ctx.fillStyle = 'yellow'; // Player bullet color
    playerBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw aliens
    ctx.fillStyle = 'red'; // Alien color
    aliens.forEach(alien => {
        ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
    });

    // Draw alien bullets
    ctx.fillStyle = 'green'; // Alien bullet color
    alienBullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
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
