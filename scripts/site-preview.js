/**
 * ================================================
 *   SITE LINK PREVIEW — Image suit le curseur
 *   Au survol d'un lien .site-link, une image
 *   d'aperçu apparaît et suit le curseur
 * ================================================
 */

(function () {

    const style = document.createElement('style');
    style.textContent = `

        /* ── Liste de liens ── */
        .sites-links {
            display: flex;
            flex-direction: column;
            margin-top: 3rem;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .site-link {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 2rem 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            color: var(--color-text);
            font-size: 2.4rem;
            font-weight: 900;
            text-decoration: none;
            letter-spacing: 0.05em;
            transition: color 0.3s ease, padding-left 0.3s ease;
            cursor: none;
        }

        .site-link:hover {
            color: var(--color-accent);
            padding-left: 1rem;
        }

        .site-link i {
            font-size: 2rem;
            transition: transform 0.3s ease;
        }

        .site-link:hover i {
            transform: translateX(8px);
        }

        /* ── Image preview ── */
        .site-preview {
            position: fixed;
            top: 0;
            left: 0;
            width: 320px;
            height: 220px;
            border-radius: 1.5rem;
            overflow: hidden;
            pointer-events: none;
            z-index: 99998;
            opacity: 0;
            transform: scale(0.85) rotate(-2deg);
            transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
                        transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: none;
            background: transparent;
        }

        .site-preview.visible {
            opacity: 1;
            transform: scale(1) rotate(0deg);
        }

        .site-preview img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            transform: scale(0.8);
            display: block;
        }

        /* Placeholder si pas d'image */
        .site-preview .preview-placeholder {
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-accent);
            font-size: 1.4rem;
            font-weight: 900;
            letter-spacing: 0.1em;
        }
    `;
    document.head.appendChild(style);

    document.addEventListener('DOMContentLoaded', () => {

        const preview = document.querySelector('.site-preview');
        if (!preview) return;

        let currentImg = null;
        let mouseX = 0;
        let mouseY = 0;
        let previewX = 0;
        let previewY = 0;
        let rafId = null;
        const OFFSET_X = 24;
        const OFFSET_Y = -40;
        const LERP = 0.12; // fluidité du suivi (0 = figé, 1 = instantané)

        // Suivi fluide du curseur
        function lerp(a, b, t) {
            return a + (b - a) * t;
        }

        function animatePreview() {
            previewX = lerp(previewX, mouseX + OFFSET_X, LERP);
            previewY = lerp(previewY, mouseY + OFFSET_Y, LERP);
            preview.style.transform = `translate(${previewX}px, ${previewY}px) scale(${preview.classList.contains('visible') ? 1 : 0.85}) rotate(${preview.classList.contains('visible') ? 0 : -2}deg)`;
            rafId = requestAnimationFrame(animatePreview);
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Gérer chaque lien
        document.querySelectorAll('.site-link').forEach(link => {
            const imgSrc = link.dataset.img;

            link.addEventListener('mouseenter', () => {
                // Vider et remplir le preview
                preview.innerHTML = '';
                if (imgSrc) {
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = link.querySelector('span')?.textContent || '';
                    preview.appendChild(img);
                } else {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'preview-placeholder';
                    placeholder.textContent = link.querySelector('span')?.textContent?.toUpperCase() || 'APERÇU';
                    preview.appendChild(placeholder);
                }

                // Positionner immédiatement avant d'afficher
                previewX = mouseX + OFFSET_X;
                previewY = mouseY + OFFSET_Y;
                preview.style.transform = `translate(${previewX}px, ${previewY}px) scale(0.85) rotate(-2deg)`;

                preview.classList.add('visible');

                if (!rafId) rafId = requestAnimationFrame(animatePreview);
            });

            link.addEventListener('mouseleave', () => {
                preview.classList.remove('visible');
            });
        });

        // Stopper l'animation quand plus aucun lien survolé
        document.addEventListener('mouseleave', () => {
            preview.classList.remove('visible');
        });
    });

})();
