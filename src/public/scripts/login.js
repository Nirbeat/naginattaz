
const loginButton = document.getElementById('slash-button');

function slashImage() {
    const image = document.querySelector('.main-img');
    const container = document.querySelector('.container');
    const body = document.body;
    const gifBackground = document.getElementById('gifBackground');

    image.style.clipPath = 'polygon(0 0, 100% 0, 0 100%)';

    body.style.background = 'white';
    setTimeout(() => {

        body.style.backgroundColor = '#430e53';
        body.style.backgroundImage = 'linear-gradient(0.25turn, #111111, #26152e, #430e53, #382142, #0f0f0f);';

        
    }, 300);

    gifBackground.style.opacity = 1;

    setTimeout(() => {
        gifBackground.style.opacity = 0;
    }, 200);

    container.style.animation = 'shake 0.5s ease';
    container.style.background = 'black';

    setTimeout(() => {
        container.style.animation = 'none';
    }, 500);
};

loginButton.addEventListener('click', slashImage);
