document.addEventListener('DOMContentLoaded', () => {

    const style = document.createElement('style');
    style.textContent = `

        /* — HIGHLIGHT REVEAL — */
        span.highlight-reveal {
            position: relative;
            display: inline;
            background: none !important;
            background-clip: unset !important;
            -webkit-background-clip: unset !important;
            color: #B5FF00;
            clip-path: inset(0 100% 0 0);
        }

        span.highlight-reveal::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.6);
            transform: scaleX(0);
            transform-origin: left;
            border-radius: 3px;
        }

        span.highlight-reveal.revealed::before {
            animation: barSweep 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        span.highlight-reveal.revealed {
            animation: textUnveil 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.9s forwards;
        }

        @keyframes barSweep {
            0%   { transform: scaleX(0); transform-origin: left; }
            40%  { transform: scaleX(1); transform-origin: left; }
            41%  { transform: scaleX(1); transform-origin: right; }
            100% { transform: scaleX(0); transform-origin: right; }
        }

        @keyframes textUnveil {
            from { clip-path: inset(0 100% 0 0); }
            to   { clip-path: inset(0 0% 0 0); }
        }

        /* — DROP IN — */
        .drop-reveal {
            opacity: 0;
            transform: translateY(-30px);
            transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                        transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .drop-reveal.revealed {
            opacity: 1;
            transform: translateY(0);
        }

        /* — SLIDE FROM RIGHT — */
        .slide-right {
            opacity: 0;
            transform: translateX(150px);
            transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                        transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .slide-right.revealed {
            opacity: 1;
            transform: translateX(0);
        }

        /* — SLIDE FROM LEFT — */
        .slide-left {
        opacity: 0;
        transform: translateX(-150px);
        transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .slide-left.revealed {
        opacity: 1;
        transform: translateX(0);
        }

        .slide-up {
        opacity: 0;
        transform: translateY(80px);
        transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .slide-up.revealed {
        opacity: 1;
        transform: translateY(0);
        }

    `;
    document.head.appendChild(style);

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('span.highlight-reveal:not(.revealed)').forEach((el, i) => {
                    setTimeout(() => el.classList.add('revealed'), i * 300);
                });
                entry.target.querySelectorAll('.drop-reveal:not(.revealed)').forEach((el, i) => {
                    setTimeout(() => el.classList.add('revealed'), 2000 + i * 200);
                });
                entry.target.querySelectorAll('.slide-right:not(.revealed)').forEach((el, i) => {
                    setTimeout(() => el.classList.add('revealed'), 600 + i * 200);;
                });
                entry.target.querySelectorAll('.slide-left:not(.revealed)').forEach((el, i) => {
                    setTimeout(() => el.classList.add('revealed'), 600 + i * 200);
                });
                entry.target.querySelectorAll('.slide-up:not(.revealed)').forEach((el, i) => {
                    setTimeout(() => el.classList.add('revealed'), 400 + i * 150);
                });
            } else {
                entry.target.querySelectorAll('span.highlight-reveal').forEach(el => {
                    el.classList.remove('revealed');
                });
                entry.target.querySelectorAll('.drop-reveal').forEach(el => {
                    el.classList.remove('revealed');
                });
                entry.target.querySelectorAll('.slide-right').forEach(el => {
                    el.classList.remove('revealed');
                });
                entry.target.querySelectorAll('.slide-left').forEach(el => {
                    el.classList.remove('revealed');
                });
                entry.target.querySelectorAll('.slide-up').forEach(el => {
                    el.classList.remove('revealed');
                });
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('section, footer').forEach(section => {
        sectionObserver.observe(section);
    });

    // Slide-up logo footer sur mobile uniquement
        if (window.innerWidth <= 768) {
            const footerLogo = document.querySelector('.footer__bg-logo');
            if (footerLogo) footerLogo.classList.add('slide-up');
        }

        if (window.innerWidth <= 768) {
        const footerLogo = document.querySelector('.footer__bg-logo');
        if (footerLogo) {
            footerLogo.classList.add('slide-up');
            
            const logoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => footerLogo.classList.add('revealed'), 400);
                    } else {
                        footerLogo.classList.remove('revealed');
                    }
                });
            }, { threshold: 0.5 });

            logoObserver.observe(footerLogo);
        }
    }    

});