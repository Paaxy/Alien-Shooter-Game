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
fullscreenButton.textContent = 'Fullscreen';
fullscreenButton.style.position = 'absolute';
fullscreenButton.style.bottom = '10px';
fullscreenButton.style.right = '10px';
fullscreenButton.style.padding = '10px 20px';
fullscreenButton.style.background = '#333';
fullscreenButton.style.color = '#fff';
fullscreenButton.style.border = 'none';
fullscreenButton.style.borderRadius = '5px';
fullscreenButton.style.cursor = 'pointer';
fullscreenButton.style.zIndex = '1000'; // Ensure it appears above the canvas
document.body.appendChild(fullscreenButton);

// Add fullscreen toggle to button
fullscreenButton.addEventListener('click', toggleFullscreen);

// Keyboard support for fullscreen (desktop only)
window.addEventListener('keydown', (e) => {
  if (e.key === 'f' || e.key === 'F') {
    toggleFullscreen();
  }
});

