// ===== AUTO-SCROLL SLIDER — Services =====
// Défilement automatique infini, pause au hover

(function () {
    const track = document.querySelector('.services-container');
    if (!track) return;

    // Clone les cards pour l'effet infini
    const cards = Array.from(track.children);
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    });

    let speed = 0.5;       // px par frame — ajuste si trop rapide/lent
    let pos = 0;
    let paused = false;
    let raf;

    // Largeur d'un "set" original (la moitié du track après clonage)
    function getSetWidth() {
        return track.scrollWidth / 2;
    }

    function tick() {
        if (!paused) {
            pos += speed;
            // Reset fluide quand on a scrollé d'un set complet
            if (pos >= getSetWidth()) {
                pos -= getSetWidth();
            }
            track.style.transform = `translateX(-${pos}px)`;
        }
        raf = requestAnimationFrame(tick);
    }

    // Pause au hover
    track.addEventListener('mouseenter', () => { paused = true; });
    track.addEventListener('mouseleave', () => { paused = false; });

    // Pause au touch (mobile)
    track.addEventListener('touchstart', () => { paused = true; }, { passive: true });
    track.addEventListener('touchend',   () => { paused = false; }, { passive: true });

    raf = requestAnimationFrame(tick);
})();
