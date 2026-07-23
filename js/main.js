/* ═══════════════════════════════════════════════════════════════
   MAIN.JS — Vanilla ES6+
   Parallax, Tabs, Scroll Reveal, Navbar
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Navbar scroll shadow ── */
    const nav = document.getElementById('mainNav');
    const onScroll = () => {
        nav.classList.toggle('c-nav--scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ── Smooth anchor links ── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const id = anchor.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                /* close mobile menu if open */
                const toggle = document.getElementById('navToggle');
                if (toggle) toggle.checked = false;
            }
        });
    });

    /* ── Hero Tabs — Interactive Color Change + Atmosphere ── */
    const tabs = document.querySelectorAll('.hero__tab');
    const indicator = document.getElementById('tabsIndicator');
    const heroAccent = document.getElementById('heroAccent');
    const root = document.documentElement;

    function moveIndicator(tab) {
        if (!indicator || !tab) return;
        const track = tab.parentElement;
        const trackRect = track.getBoundingClientRect();
        const tabRect = tab.getBoundingClientRect();
        indicator.style.width = tabRect.width + 'px';
        indicator.style.transform = `translateX(${tabRect.left - trackRect.left - 5}px)`;
    }

    function activateTab(tab) {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const color = tab.dataset.color;
        const label = tab.dataset.label;

        root.style.setProperty('--accent', color);
        if (heroAccent) heroAccent.textContent = label;

        /* Atmosphere: background, blobs, showcase glow, ring */
        root.style.setProperty('--hero-bg', tab.dataset.bg);
        root.style.setProperty('--hero-blob-1', tab.dataset.blob1);
        root.style.setProperty('--hero-blob-2', tab.dataset.blob2);
        root.style.setProperty('--hero-blob-3', tab.dataset.blob3);
        root.style.setProperty('--hero-blob-4', tab.dataset.blob4);
        root.style.setProperty('--hero-glow', tab.dataset.glow);
        root.style.setProperty('--hero-ring-1', tab.dataset.ring1);
        root.style.setProperty('--hero-ring-2', tab.dataset.ring2);

        moveIndicator(tab);
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => activateTab(tab));
    });

    /* Initialize indicator position + default atmosphere */
    requestAnimationFrame(() => {
        const activeTab = document.querySelector('.hero__tab.active');
        if (activeTab) {
            moveIndicator(activeTab);
            /* Apply initial atmosphere from default tab */
            root.style.setProperty('--hero-bg', activeTab.dataset.bg);
            root.style.setProperty('--hero-blob-1', activeTab.dataset.blob1);
            root.style.setProperty('--hero-blob-2', activeTab.dataset.blob2);
            root.style.setProperty('--hero-blob-3', activeTab.dataset.blob3);
            root.style.setProperty('--hero-blob-4', activeTab.dataset.blob4);
            root.style.setProperty('--hero-glow', activeTab.dataset.glow);
            root.style.setProperty('--hero-ring-1', activeTab.dataset.ring1);
            root.style.setProperty('--hero-ring-2', activeTab.dataset.ring2);
        }
    });

    /* Recalc on resize */
    window.addEventListener('resize', () => {
        const activeTab = document.querySelector('.hero__tab.active');
        if (activeTab) moveIndicator(activeTab);
    });

    /* ── Hero Parallax / Mouse Tilt (throttled with rAF) ── */
    const showcase = document.getElementById('heroShowcase');

    if (showcase) {
        const heroSection = document.getElementById('hero');
        let ticking = false;

        heroSection.addEventListener('mousemove', e => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const rect = heroSection.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                const tiltX = y * -8;
                const tiltY = x * 8;
                const moveX = x * -12;
                const moveY = y * -12;

                showcase.style.transform =
                    `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate(${moveX}px, ${moveY}px)`;
                ticking = false;
            });
        });

        heroSection.addEventListener('mouseleave', () => {
            showcase.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translate(0, 0)';
            showcase.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)';
            setTimeout(() => { showcase.style.transition = 'transform .15s ease-out'; }, 500);
        });
    }

    /* ── Scroll Reveal — IntersectionObserver ── */
    const revealElements = document.querySelectorAll('.anim-reveal, .anim-scroll');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, Number(delay) * 120);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ── Hero entrance animation ── */
    const heroRevealEls = document.querySelectorAll('.hero .anim-reveal');
    heroRevealEls.forEach(el => {
        const delay = el.dataset.delay || 0;
        setTimeout(() => {
            el.classList.add('revealed');
        }, 150 + Number(delay) * 140);
    });

});
