/**
 * ================================================
 *   PIXELATED WAVE TRANSITION — style OSMO
 *   Une bande diagonale de pixels qui traverse
 *   l'écran de gauche à droite. Ne couvre jamais
 *   tout l'écran. Scroll déclenché au passage.
 * ================================================
 */

(function () {

  // ── CONFIG ──────────────────────────────────────
  const PIXEL_SIZE     = 80;        // taille des pixels (gros carrés)
  const COLOR          = '#B5FF00'; // couleur des pixels — change selon ton design
  const WAVE_SPEED     = 1;       // vitesse de défilement
  const DIAGONAL_SLOPE = 0;       // pente de la diagonale
  const BAND_WIDTH     = 12;         // largeur de la bande en colonnes (avant + arrière)
  // ────────────────────────────────────────────────

  let canvas, ctx, raf;
  let cols, rows;
  let phase    = 'idle';
  let progress = 0;
  let midCalled   = false;
  let midCallback = null;

  const RGB = {
    r: parseInt(COLOR.slice(1,3), 16),
    g: parseInt(COLOR.slice(3,5), 16),
    b: parseInt(COLOR.slice(5,7), 16),
  };

  function setup() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.id = 'pixel-wave-overlay';
    Object.assign(canvas.style, {
      position:      'fixed',
      top:           '0',
      left:          '0',
      width:         '100%',
      height:        '100%',
      zIndex:        '99999',
      pointerEvents: 'none',
      display:       'none',
    });
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    sizeCanvas();
    window.addEventListener('resize', () => { if (phase === 'idle') sizeCanvas(); });
  }

  function sizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.ceil(canvas.width  / PIXEL_SIZE) + 2;
    rows = Math.ceil(canvas.height / PIXEL_SIZE) + 2;
  }

  /* ── Hash déterministe pour effet organique ── */
  function h(col, row) {
    return ((col * 61 + row * 43 + col * row * 7) % 29) / 29;
  }

  /* ── Alpha d'un pixel selon sa distance au front ──
     dist > 0  = en avant du front (arrivée)
     dist < 0  = derrière le front (sortie)
     La bande a ~BAND_WIDTH colonnes visibles de chaque côté
  ── */
  function getAlpha(dist) {
    // Avant du front : pixels qui arrivent
    if (dist > 0 && dist <= BAND_WIDTH) {
      // Décroît rapidement vers l'avant : pixels épars, très transparents
      const t = 1 - dist / BAND_WIDTH; // 1 au front, 0 au bord avant
      // Seulement certains pixels (effet parsemé)
      return t * t * 0.55;
    }
    // Juste derrière le front : pixels pleins qui disparaissent
    if (dist <= 0 && dist >= -BAND_WIDTH) {
      const t = 1 - (-dist) / BAND_WIDTH; // 1 au front, 0 au bord arrière
      return t * t * 0.85;
    }
    return 0;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < rows; row++) {
      // front de vague pour cette ligne
      const front = progress - row * DIAGONAL_SLOPE;

      for (let col = 0; col < cols; col++) {
        // distance entre ce pixel et le front (positif = en avance sur le front)
        const dist = front - col;

        let alpha = getAlpha(dist);

        // Rendre certains pixels plus transparents pour l'effet organique OSMO
        // (les pixels en bordure ne sont pas tous au même niveau d'opacité)
        if (alpha > 0) {
          const noise = h(col, row);
          // Pixels aléatoirement moins opaques sur les bords
          if (Math.abs(dist) > BAND_WIDTH * 0.5) {
            alpha *= (0.3 + noise * 0.7);
          }
          // Quelques pixels "sautent" complètement
          if (noise < 0.18) alpha *= 0.15;
        }

        if (alpha > 0.01) {
          ctx.fillStyle = `rgba(${RGB.r},${RGB.g},${RGB.b},${alpha.toFixed(3)})`;
          ctx.fillRect(col * PIXEL_SIZE, row * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        }
      }
    }
  }

  function tick() {
    progress += WAVE_SPEED;

    // Scroll déclenché quand le front de vague atteint le milieu de l'écran
    if (!midCalled && progress >= cols * 0.5) {
      midCalled = true;
      if (typeof midCallback === 'function') midCallback();
    }

    draw();

    // Terminé quand la bande est complètement sortie à droite
    const done = progress - rows * DIAGONAL_SLOPE > cols + BAND_WIDTH + 1;
    if (done) {
      phase = 'idle';
      canvas.style.display = 'none';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(raf);
      return;
    }

    raf = requestAnimationFrame(tick);
  }

  function runWave(callback) {
    if (phase !== 'idle') return;
    sizeCanvas();
    canvas.style.display = 'block';
    phase       = 'in';
    progress    = -BAND_WIDTH - 1; // démarre hors écran à gauche
    midCalled   = false;
    midCallback = callback;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
  }

  function bindLinks() {
    const selectors = [
      '.navbar a[href^="#"]',
      '.footer .list a[href^="#"]',
      'a.gradient-btn[href^="#"]',
    ].join(', ');

    document.addEventListener('click', function (e) {
      const link = e.target.closest(selectors);
      if (!link) return;
      const href   = link.getAttribute('href');
      const target = href && href.startsWith('#') && document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();

      // Ferme menu mobile
      const navbar     = document.querySelector('.navbar');
      const menuIcon   = document.getElementById('menu-icon');
      const navOverlay = document.querySelector('.navbar-overlay');
      if (navbar?.classList.contains('active')) {
        navbar.classList.remove('active');
        menuIcon?.classList.replace('bx-x', 'bx-menu');
        navOverlay?.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }

      target.scrollIntoView({ behavior: 'instant' });
      runWave();
    }, { capture: true });
  }

  function init() {
    setup();
    bindLinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Transition pour les liens vers d'autres pages
document.addEventListener('click', function(e) {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  // Ignorer ancres, liens externes, et liens déjà gérés
  if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.includes('contact')) return;
  runWave(() => { window.location.href = href; });
});

// Fondu à l'entrée sur la nouvelle page
document.documentElement.style.opacity = '0';
document.documentElement.style.transition = 'opacity 0.4s ease';
window.addEventListener('load', () => {
  requestAnimationFrame(() => {
      document.documentElement.style.opacity = '1';
  });
});

})();