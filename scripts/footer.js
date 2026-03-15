// ================================================
//   FOOTER — Parallax + rotation logo au scroll
//   Colle ce bloc dans ton fichier JS principal
// ================================================

(function () {
    const bgLogo = document.querySelector('.footer__bg-logo');
    if (!bgLogo) return;

    let ticking = false;

    function updateFooterParallax() {
        const footer = document.querySelector('.footer');
        if (!footer) return;

        const rect = footer.getBoundingClientRect();
        const winH  = window.innerHeight;

        // --- Parallax ---
        const progress = 1 - rect.bottom / (winH + rect.height);
        const p        = Math.max(0, Math.min(1, progress));
        bgLogo.style.transform = bgLogo.classList.contains('is-rotated')
            ? `rotate(-90deg) translateY(${p * -80}px)`
            : `translateY(${p * -80}px)`;

        // --- Footer visible : rotation ---
        if (rect.top < winH * 0.85) {
            bgLogo.classList.add('is-rotated');
        }

        // --- Footer hors viewport (on remonte) : on reset ---
        if (rect.top > winH) {
            bgLogo.classList.remove('is-rotated');
        }

        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(updateFooterParallax);
            ticking = true;
        }
    }, { passive: true });

    updateFooterParallax();
})();