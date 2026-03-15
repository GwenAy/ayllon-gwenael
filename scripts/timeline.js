// ===== TIMELINE EXPÉRIENCES — Scroll animations =====

(function() {
    const items = document.querySelectorAll('.timeline-item');
    const line  = document.querySelector('.timeline-line-fill');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    items.forEach(item => observer.observe(item));

    // Ligne de progression au scroll
    function updateLine() {
        if (!line) return;
        const section = document.querySelector('.expériences');
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const winH = window.innerHeight;
        const progress = Math.min(1, Math.max(0, (winH - rect.top) / (rect.height + winH * 0.3)));
        line.style.height = (progress * 100) + '%';
    }

    window.addEventListener('scroll', updateLine, { passive: true });
    updateLine();
})();
