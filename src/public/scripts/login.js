const loginButton = document.getElementById('slash-button');
loginButton.addEventListener('click', slashImage);

function slashImage() {
    const image = document.querySelector('.image');
    const container = document.querySelector('.container');
    const body = document.body;
    const gifBackground = document.getElementById('gifBackground');

    // Change the clip-path for a diagonal reveal
    image.style.clipPath = 'polygon(0 0, 100% 0, 0 100%)';

    // Flash background color
    body.style.background = 'white';
    setTimeout(() => {

        body.style.backgroundColor = '#8EC5FC';
        body.style.backgroundImage = 'linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)';

        
    }, 300); // Flash duration

    // Show the GIF background
    gifBackground.style.opacity = 1;

    setTimeout(() => {
        gifBackground.style.opacity = 0;
    }, 200); // Duration to keep the GIF visible

    // Add shake animation
    container.style.animation = 'shake 0.5s ease';
    container.style.background = 'black';

    setTimeout(() => {
        container.style.animation = 'none'; // Reset the animation
    }, 500); // Match duration of shake animation
};