// esta lógica debe pasarse al servidor para manejar el renderizado según la sesión

document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
    const loginButton = document.querySelector('.navbar10_menu-right .button.is-secondary');
    const subscriptionButton = document.querySelector('.navbar10_menu-right .button.is-cta');
    const userPicContainer = document.createElement('div');
    const logoutButton = document.createElement('button');

    if (isLoggedIn) {
        // Hide buttons
        loginButton.style.display = 'none';
        subscriptionButton.style.display = 'none';

        // Show user picture
        const userPic = document.createElement('img');
        userPic.src = sessionStorage.getItem('userPic');
        userPic.alt = 'User Picture';
        userPic.style.width = '40px'; // Adjust size as needed
        userPic.style.borderRadius = '50%'; // Optional: Make it circular

        // Create logout button
        logoutButton.textContent = 'Logout';
        logoutButton.classList.add('logout-button'); // Add class for styling
        logoutButton.onclick = () => {
            sessionStorage.clear(); // Clear session storage
            window.location.reload(); // Reload the page
        };

        // Append user picture and logout button to the container
        userPicContainer.appendChild(userPic);
        userPicContainer.appendChild(logoutButton);
        userPicContainer.style.display = 'flex'; // Adjust display style
        userPicContainer.style.alignItems = 'center'; // Center items vertically

        // Append to navbar
        const navbar = document.querySelector('.navbar10_menu-right');
        navbar.appendChild(userPicContainer);
    }
});

// ESTO A REVISAR QUE HACE
let slideIndex = 0;
showSlides();

function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
    setTimeout(showSlides, 3000); // Change image every 3 seconds
}

let slideIndexM = 0;
showSlidesM();

function showSlidesM() {
    let i;
    let slides = document.getElementsByClassName("mobileS");
    let dots = document.getElementsByClassName("mobd");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndexM++;
    if (slideIndexM > slides.length) { slideIndexM = 1 }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndexM - 1].style.display = "block";
    dots[slideIndexM - 1].className += " active";
    setTimeout(showSlidesM, 3000); // Change image every 3 seconds
}
console.log('aber')