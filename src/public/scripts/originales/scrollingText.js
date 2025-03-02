document.addEventListener('DOMContentLoaded', function() {
    const scrollingText = document.querySelector('.scrolling-text');

    // Set the default speed (in seconds)
    const defaultSpeed = 15; // Lower values mean faster scrolling

    function updateAnimationSpeed(speed) {
        scrollingText.style.animationDuration = `${speed}s`;
    }

    // Initialize with default speed
    updateAnimationSpeed(defaultSpeed);
});
