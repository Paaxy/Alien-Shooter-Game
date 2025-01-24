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

// Event listeners for fullscreen toggle
window.addEventListener('keydown', (e) => {
  if (e.key === 'f' || e.key === 'F') { // Press 'F' to toggle fullscreen
    toggleFullscreen();
  }
});

canvas.addEventListener('dblclick', toggleFullscreen); // Double-click canvas to toggle fullscreen

// Create fullscreen button for mobile
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
document.body.appendChild(fullscreenButton);

// Add fullscreen toggle to button
fullscreenButton.addEventListener('click', toggleFullscreen);
