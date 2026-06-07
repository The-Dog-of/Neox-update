/* =============================================
   NeoX Studio — main.js
   Extra interactions: tilt, particle burst,
   GSAP scroll animations, nav shrink, etc.
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ── Ambient background shapes ──────────────────
    ['bg-shape-1','bg-shape-2','bg-shape-3'].forEach(cls => {
        const el = document.createElement('div');
        el.className = 'bg-shape ' + cls;
        document.body.appendChild(el);
    });

    // ── Scanlines overlay ──────────────────────────
    const scanlines = document.createElement('div');
    scanlines.className = 'scanlines';
    document.body.appendChild(scanlines);

    // ── Nav shrink on scroll ───────────────────────
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            nav.style.padding = '0.6rem 2rem';
            nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
        } else {
            nav.style.padding = '0.9rem 2rem';
            nav.style.boxShadow = 'none';
        }
    }, { passive: true });

    // ── Active nav link on scroll ──────────────────
    const sections = document.querySelectorAll('section[id], #home');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(a => {
                    a.style.color = a.getAttribute('href') === '#'+id
                        ? '#fff'
                        : '';
                });
            }
        });
    }, { threshold: 0.4 });
    sections.forEach(s => observer.observe(s));

    // ── Particle burst on click ────────────────────
    document.addEventListener('click', e => {
        const colors = ['#00e5ff', '#ff0055', '#ffe600', '#fff'];
        for (let i = 0; i < 8; i++) {
            const p = document.createElement('div');
            p.className = 'particle-burst';
            const angle = (Math.PI * 2 / 8) * i;
            const dist = 30 + Math.random() * 30;
            const tx = `translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px)`;
            p.style.setProperty('--tx', tx);
            p.style.left = e.clientX + 'px';
            p.style.top = e.clientY + 'px';
            p.style.background = colors[i % colors.length];
            p.style.boxShadow = `0 0 6px ${colors[i % colors.length]}`;
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 700);
        }
    });

    // ── 3D Card Tilt ───────────────────────────────
    function initTilt(selector) {
        document.querySelectorAll(selector).forEach(card => {
            card.classList.add('tilt-active');
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width  - 0.5;
                const y = (e.clientY - r.top)  / r.height - 0.5;
                card.style.transform = `
                    perspective(600px)
                    rotateY(${x * 10}deg)
                    rotateX(${-y * 10}deg)
                    translateY(-6px)
                `;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
    initTilt('.game-card');
    initTilt('.stat-card');
    initTilt('.team-card');

    // ── GSAP scroll animations ─────────────────────
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // hero text stagger
        gsap.from('.hero-title', {
            duration: 1.1,
            y: 50,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.3
        });
        gsap.from('.hero-subtitle', {
            duration: 1,
            y: 30,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.55
        });
        gsap.from('.hero-btns', {
            duration: 0.9,
            y: 20,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.8
        });
        gsap.from('.hero-badge', {
            duration: 0.8,
            scale: 0.8,
            opacity: 0,
            ease: 'back.out(2)',
            delay: 0.2
        });

        // stat cards
        gsap.from('.stat-card', {
            scrollTrigger: {
                trigger: '.stats-section',
                start: 'top 80%',
            },
            duration: 0.7,
            y: 40,
            opacity: 0,
            stagger: 0.15,
            ease: 'power3.out'
        });

        // game cards
        ScrollTrigger.create({
            trigger: '#games',
            start: 'top 75%',
            onEnter: () => {
                gsap.from('.game-card', {
                    duration: 0.7,
                    y: 50,
                    opacity: 0,
                    stagger: 0.12,
                    ease: 'power3.out'
                });
            }
        });

        // about section
        gsap.from('.about-text', {
            scrollTrigger: {
                trigger: '#about',
                start: 'top 70%',
            },
            duration: 1,
            x: 50,
            opacity: 0,
            ease: 'power3.out'
        });
        gsap.from('.about-grid-mosaic', {
            scrollTrigger: {
                trigger: '#about',
                start: 'top 70%',
            },
            duration: 1,
            x: -50,
            opacity: 0,
            ease: 'power3.out'
        });

        // section titles parallax
        gsap.utils.toArray('.section-title').forEach(el => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                },
                duration: 0.9,
                y: 30,
                opacity: 0,
                ease: 'power3.out'
            });
        });
    }

    // ── Mosaic block random flicker ────────────────
    const mosaicBlocks = document.querySelectorAll('.mosaic-block:not(.mosaic-center)');
    function flickerBlock() {
        if (!mosaicBlocks.length) return;
        const b = mosaicBlocks[Math.floor(Math.random() * mosaicBlocks.length)];
        b.style.background = 'rgba(0,229,255,0.2)';
        b.style.borderColor = 'rgba(0,229,255,0.5)';
        setTimeout(() => {
            b.style.background = '';
            b.style.borderColor = '';
        }, 200 + Math.random() * 300);
        setTimeout(flickerBlock, 300 + Math.random() * 700);
    }
    setTimeout(flickerBlock, 1500);

    // ── Smooth anchor scroll ───────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href').slice(1);
            const target = document.getElementById(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ── Glitch logo on hover ───────────────────────
    const logoText = document.querySelector('.nav-logo span');
    if (logoText) {
        logoText.addEventListener('mouseenter', () => {
            let iter = 0;
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
            const orig = 'NeoX';
            const interval = setInterval(() => {
                logoText.textContent = orig.split('').map((c, i) => {
                    if (i < iter) return c;
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('');
                if (iter >= orig.length) { clearInterval(interval); logoText.textContent = orig; }
                iter += 0.4;
            }, 40);
        });
    }

    // ── Carousel auto-advance keyboard ────────────
    document.addEventListener('keydown', e => {
        if (document.getElementById('admin-panel-modal').classList.contains('open')) return;
        if (e.key === 'ArrowLeft') document.getElementById('car-prev')?.click();
        if (e.key === 'ArrowRight') document.getElementById('car-next')?.click();
    });

    // ── Holo border on game cards ──────────────────
    document.querySelectorAll('.game-card').forEach(c => c.classList.add('holo-border'));

    // ── Neon pulse on hero primary btn ────────────
    document.querySelector('.btn-primary')?.classList.add('neon-pulse');

    // ── Team drag scroll ───────────────────────────
    const teamTrack = document.getElementById('team-track');
    if (teamTrack) {
        let isDragging = false, startX = 0, scrollStart = 0;
        teamTrack.addEventListener('mousedown', e => {
            isDragging = true;
            startX = e.pageX;
            scrollStart = teamTrack.scrollLeft;
            teamTrack.style.cursor = 'grabbing';
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            if (teamTrack) teamTrack.style.cursor = '';
        });
        teamTrack.addEventListener('mousemove', e => {
            if (!isDragging) return;
            teamTrack.scrollLeft = scrollStart - (e.pageX - startX);
        });
    }

    // ── Re-init tilt when admin closes / content updates ──
    document.getElementById('admin-panel-modal').addEventListener('transitionend', () => {
        if (!document.getElementById('admin-panel-modal').classList.contains('open')) {
            initTilt('.game-card');
            initTilt('.team-card');
        }
    });

    // ── Form enhanced UX ───────────────────────────
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
        field.setAttribute('placeholder', ' ');
    });

    // ── Page visibility: pause videos ─────────────
    document.addEventListener('visibilitychange', () => {
        document.querySelectorAll('video[autoplay]').forEach(v => {
            document.hidden ? v.pause() : v.play().catch(() => {});
        });
    });

    console.log('%c NeoX Studio %c v2.0 ', 
        'background:#00e5ff;color:#000;font-weight:bold;padding:4px 8px;border-radius:4px 0 0 4px',
        'background:#ff0055;color:#fff;font-weight:bold;padding:4px 8px;border-radius:0 4px 4px 0'
    );
});
