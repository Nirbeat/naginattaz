document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinksUl = document.querySelector('.nav__links ul');
    const navButtons = document.querySelector('.nav__buttons');

    hamburger.addEventListener('click', () => {
        navLinksUl.classList.toggle('show');
        navButtons.classList.toggle('show');
    });

    let slideIndex = 1;
    showSlides(slideIndex);

    function showSlides(n) {
        let i;
        let slides = document.getElementsByClassName("mySlides");
        let dots = document.querySelectorAll(".dot-container .dot");
        if (n > slides.length) {slideIndex = 1}
        if (n < 1) {slideIndex = slides.length}
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[slideIndex-1].style.display = "block";
        dots[slideIndex-1].className += " active";
    }

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

    const dots = document.querySelectorAll(".dot-container .dot");
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide(index + 1);
        });
    });

    setInterval(() => {
        plusSlides(1);
    }, 6000); // Change image every 6 seconds


});
