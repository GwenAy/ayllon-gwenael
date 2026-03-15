const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const overlay = document.querySelector('.navbar-overlay');
const logo = document.querySelector('.logo');
const body = document.body;

let scrollPosition = 0;

// Fonction pour fermer le menu
const closeMenu = () => {
    navbar.classList.remove('active');
    overlay.classList.remove('active');
    menuIcon.classList.remove('bx-x');
    body.classList.remove('no-scroll');
    body.style.top = '';
    window.scrollTo(0, scrollPosition);
};

// Toggle menu au clic sur l'icon
menuIcon.addEventListener('click', () => {
    if (!navbar.classList.contains('active')) {
        scrollPosition = window.pageYOffset;
        body.style.top = `-${scrollPosition}px`;
        body.classList.add('no-scroll');
    } else {
        closeMenu();
        return;
    }

    navbar.classList.toggle('active');
    overlay.classList.toggle('active');
    menuIcon.classList.toggle('bx-x');
});

// Fermer le menu en cliquant sur l'overlay
overlay.addEventListener('click', closeMenu);

// Fermer le menu quand on clique sur un lien de la navbar
navbar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Fermer le menu quand on clique sur le logo
logo.addEventListener('click', closeMenu);
