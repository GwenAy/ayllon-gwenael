const dot = document.querySelector('.cursor');

const circle = document.createElement('div');
circle.classList.add('cursor-circle');
document.body.appendChild(circle);

let mouseX = 0, mouseY = 0;
let circleX = 0, circleY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.set(dot, { x: mouseX, y: mouseY });
});

function animateCircle() {
    circleX += (mouseX - circleX) * 0.12;
    circleY += (mouseY - circleY) * 0.12;
    gsap.set(circle, { x: circleX, y: circleY });
    requestAnimationFrame(animateCircle);
}
animateCircle();

// Effet hover sur les éléments cliquables
document.querySelectorAll('a, button, input[type="submit"], .service-box').forEach(el => {
    el.addEventListener('mouseenter', () => {
        circle.classList.add('cursor-circle--hover');
        dot.classList.add('cursor--hover');
    });
    el.addEventListener('mouseleave', () => {
        circle.classList.remove('cursor-circle--hover');
        dot.classList.remove('cursor--hover');
    });
});