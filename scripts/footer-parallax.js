(function () {
    const footer = document.querySelector('.footer');
    if (!footer) return;

    function update() {
        const rect    = footer.getBoundingClientRect();
        const winH    = window.innerHeight;
        const footerH = footer.offsetHeight;

        const progress = Math.min(Math.max((winH - rect.top) / footerH, 0), 1);

        footer.style.opacity = progress;
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
})();