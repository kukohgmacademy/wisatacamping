/* ============================================================
   WISATA KEMPING BATU MALANG — UNIFIED ANIMATION ENGINE
   Auto-applies scroll-reveal, hero FX, and micro-interactions
   across ALL pages with ZERO HTML changes required.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─────────────────────────────────────────────────────────
    // UTILITY: Respect prefers-reduced-motion
    // ─────────────────────────────────────────────────────────
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ─────────────────────────────────────────────────────────
    // 1. NAVBAR — scroll shrink & shadow
    // ─────────────────────────────────────────────────────────
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const onScroll = () => {
            const past = window.scrollY > 50;
            navbar.classList.toggle('scrolled', past);
            navbar.classList.toggle('shadow-sm', past);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ─────────────────────────────────────────────────────────
    // 2. BLOG READING PROGRESS BAR
    // ─────────────────────────────────────────────────────────
    const progressBar = document.querySelector('.blog-progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const h = document.documentElement;
            progressBar.style.width = ((h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100) + '%';
        }, { passive: true });
    }

    // ─────────────────────────────────────────────────────────
    // 3. BLOG TOC GENERATOR + SCROLL SPY
    // ─────────────────────────────────────────────────────────
    const articleBody = document.querySelector('.blog-article-body');
    const tocLists = document.querySelectorAll('.table-of-contents-list');
    if (articleBody && tocLists.length) {
        const headers = articleBody.querySelectorAll('h2, h3');
        headers.forEach((h, i) => {
            h.id = 'section-' + i;
            tocLists.forEach(list => {
                const li = document.createElement('li');
                if (h.tagName === 'H3') li.style.paddingLeft = '15px';
                li.innerHTML = `<a href="#section-${i}" class="toc-link">${h.textContent}</a>`;
                list.appendChild(li);
            });
        });
        const tocLinks = document.querySelectorAll('.toc-link');
        window.addEventListener('scroll', () => {
            let cur = '';
            headers.forEach(h => { if (pageYOffset >= h.offsetTop - 150) cur = h.id; });
            tocLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
        }, { passive: true });
    }

    // ─────────────────────────────────────────────────────────
    // 4. SCROLL-TO-TOP BUTTON
    // ─────────────────────────────────────────────────────────
    const btnTop = document.getElementById('btnTop');
    if (btnTop) {
        window.addEventListener('scroll', () => {
            btnTop.style.display = document.documentElement.scrollTop > 300 ? 'flex' : 'none';
        }, { passive: true });
        btnTop.addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }

    // ─────────────────────────────────────────────────────────
    // 5. HERO PARTICLES
    // ─────────────────────────────────────────────────────────
    if (!reduced) {
        const hero = document.querySelector('.hero-section');
        if (hero) {
            const pc = document.createElement('div');
            pc.className = 'hero-particles';
            hero.appendChild(pc);
            for (let i = 0; i < 20; i++) {
                const s = document.createElement('span');
                const sz = Math.random() * 10 + 4;
                s.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random() * 100}%;bottom:-${sz}px;` +
                    `animation-duration:${Math.random() * 12 + 8}s;animation-delay:${Math.random() * 10}s;` +
                    `opacity:${Math.random() * 0.4 + 0.1};`;
                pc.appendChild(s);
            }
        }
    }

    // ─────────────────────────────────────────────────────────
    // 6. HERO SCROLL INDICATOR (beranda only)
    // ─────────────────────────────────────────────────────────
    const heroEl = document.querySelector('.hero-section');
    if (heroEl && !reduced) {
        const ind = document.createElement('div');
        ind.className = 'hero-scroll-indicator';
        ind.innerHTML = '<span></span><p>Scroll</p>';
        heroEl.appendChild(ind);
        window.addEventListener('scroll', () => {
            ind.style.opacity = window.scrollY > 80 ? '0' : '';
        }, { passive: true });
    }

    // ─────────────────────────────────────────────────────────
    // 7. AUTO SCROLL-REVEAL ENGINE
    //    Maps CSS selectors → animation type + duration
    //    Works on EVERY page automatically
    // ─────────────────────────────────────────────────────────
    const rules = [
        // ── Headings & titles ──
        { sel: '.section-title h2', anim: 'fade-up', dur: 700, base: 0 },
        { sel: '.section-title p', anim: 'fade-up', dur: 600, base: 100 },
        { sel: '.hero-mini h1', anim: 'fade-up', dur: 700, base: 0 },
        { sel: '.hero-mini p.lead', anim: 'fade-up', dur: 600, base: 150 },
        { sel: '.blog-header-section h1', anim: 'fade-up', dur: 700, base: 0 },
        { sel: '.blog-meta-enhanced', anim: 'fade-up', dur: 600, base: 200 },
        { sel: '.reading-tag', anim: 'fade-down', dur: 500, base: 0 },
        { sel: 'h3.mb-4', anim: 'fade-up', dur: 700, base: 0 },
        { sel: '.display-5, .display-6', anim: 'fade-up', dur: 700, base: 0 },
        { sel: '.badge', anim: 'zoom-in', dur: 500, base: 0 },

        // ── Cards ──
        { sel: '.custom-card', anim: 'zoom-in-up', dur: 700, base: 0, stagger: 130 },
        { sel: '.package-card', anim: 'zoom-in-up', dur: 700, base: 0, stagger: 180 },
        { sel: '.package-detail-card', anim: 'fade-up', dur: 800, base: 0, stagger: 150 },
        // NOTE: .sidebar-card intentionally EXCLUDED — position:sticky breaks when transform is applied
        { sel: '.accordion-item', anim: 'fade-up', dur: 600, base: 0, stagger: 100 },

        // ── Images ──
        { sel: '.img-fluid.rounded', anim: 'fade-right', dur: 900, base: 0 },
        { sel: '.blog-featured-img', anim: 'zoom-in', dur: 900, base: 0 },
        { sel: '.related-img-wrapper', anim: 'zoom-in', dur: 600, base: 0, stagger: 100 },
        { sel: '.gallery-img, .custom-card img', anim: 'zoom-in', dur: 700, base: 0 },

        // ── Text blocks ──
        { sel: '.lead', anim: 'fade-up', dur: 700, base: 100 },
        { sel: 'blockquote', anim: 'fade-left', dur: 800, base: 0 },
        { sel: '.article-callout', anim: 'fade-up', dur: 700, base: 0 },
        { sel: '.blog-article-body p', anim: 'fade-up', dur: 600, base: 0, stagger: 60 },
        { sel: '.blog-article-body h2', anim: 'fade-up', dur: 650, base: 0 },
        { sel: '.blog-article-body h3', anim: 'fade-up', dur: 600, base: 0 },
        { sel: '.blog-article-body ul', anim: 'fade-up', dur: 600, base: 0 },

        // ── CTAs & promos ──
        { sel: '.promo-section-cta', anim: 'fade-up', dur: 800, base: 0 },
        { sel: '.promo-badge', anim: 'zoom-in', dur: 500, base: 0 },
        { sel: '.promo-section-cta h3', anim: 'fade-up', dur: 700, base: 100 },
        { sel: '.promo-section-cta p', anim: 'fade-up', dur: 700, base: 200 },
        { sel: '.promo-section-cta a', anim: 'zoom-in-up', dur: 700, base: 300 },
        { sel: '.section-cta', anim: 'fade-up', dur: 600, base: 0 },
        // NOTE: Hero buttons (.btn-cta inside .hero-section) have their own CSS animation,
        // we only animate buttons outside the hero section via the exclusion check below.

        // ── About page specifics ──
        { sel: '.d-flex.mt-4 .text-center', anim: 'zoom-in-up', dur: 600, base: 0, stagger: 150 },
        { sel: '.border-top.mt-5 img', anim: 'fade-left', dur: 900, base: 0 },
        { sel: '.author-profile', anim: 'fade-up', dur: 700, base: 0 },

        // ── Blog list page ──
        { sel: '.baca-juga', anim: 'fade-up', dur: 700, base: 0 },
        { sel: '.related-item', anim: 'zoom-in-up', dur: 600, base: 0, stagger: 120 },

        // ── Gallery ──
        { sel: '.row.g-4 .col-md-4', anim: 'zoom-in-up', dur: 650, base: 0, stagger: 80 },

        // ── Packages page ──
        { sel: '.capacity-box', anim: 'zoom-in', dur: 600, base: 0, stagger: 100 },

        // ── Footer ──
        { sel: 'footer .footer-logo', anim: 'fade-up', dur: 600, base: 0 },
        { sel: 'footer p', anim: 'fade-up', dur: 600, base: 100 },
        { sel: 'footer h5', anim: 'fade-up', dur: 600, base: 0, stagger: 100 },
        { sel: 'footer ul.list-unstyled', anim: 'fade-up', dur: 600, base: 100, stagger: 80 },
        { sel: '.footer-bottom', anim: 'fade-up', dur: 600, base: 0 },
    ];

    // Parent-level elements to handle at group level (avoid double-animating children)
    const groupParents = new Set([
        '.col-lg-6', '.col-lg-4', '.col-md-4', '.col-md-6', '.col-12'
    ]);

    // Track already-marked elements
    const marked = new WeakSet();

    // Apply animation rules
    rules.forEach(({ sel, anim, dur, base, stagger }) => {
        const els = document.querySelectorAll(sel);
        els.forEach((el, i) => {
            // Skip if element is inside hero (already animated via CSS keyframes)
            if (el.closest('.hero-section') || el.closest('.navbar')) return;
            // Skip if already marked
            if (marked.has(el)) return;
            // Skip if already has data-animate
            if (el.hasAttribute('data-animate')) return;

            marked.add(el);

            el.setAttribute('data-animate', anim);
            el.setAttribute('data-duration', dur);

            const delay = base + (stagger ? i * stagger : 0);
            if (delay > 0 && delay <= 800) el.setAttribute('data-delay', delay);
        });
    });

    // ─────────────────────────────────────────────────────────
    // 8. INTERSECTION OBSERVER — triggers reveal
    // ─────────────────────────────────────────────────────────
    if (!reduced) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Small extra delay to feel snappier visually
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        const observe = () => {
            document.querySelectorAll('[data-animate]:not(.is-visible)').forEach(el => io.observe(el));
        };
        observe();
        // Re-scan after short delay for any late rendered elements
        setTimeout(observe, 400);
    } else {
        // Reduced motion: make everything immediately visible
        document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('is-visible'));
    }

    // ─────────────────────────────────────────────────────────
    // 9. COUNTER ANIMATION (About page stats)
    // ─────────────────────────────────────────────────────────
    function animCount(el, target, suffix, decimal) {
        if (reduced) { el.textContent = target + suffix; return; }
        let start = null;
        const dur = 1800;
        const step = ts => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            const val = decimal ? (ease * target).toFixed(1) : Math.round(ease * target);
            el.textContent = val + suffix;
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    const counterObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const raw = el.textContent.trim();
            const match = raw.match(/^([\d.]+)(.*)$/);
            if (match) {
                const num = parseFloat(match[1]);
                const suffix = match[2];
                const decimal = match[1].includes('.');
                animCount(el, num, suffix, decimal);
            }
            counterObs.unobserve(el);
        });
    }, { threshold: 0.7 });

    // Target stat numbers inside about sections
    document.querySelectorAll('.brand-font[style*="sunset-orange"]').forEach(el => counterObs.observe(el));
    document.querySelectorAll('.d-flex.mt-4 h2').forEach(el => counterObs.observe(el));

    // ─────────────────────────────────────────────────────────
    // 10. IMAGE REVEAL WRAPPER (add .img-reveal class to all content images)
    // ─────────────────────────────────────────────────────────
    document.querySelectorAll(
        'section .img-fluid:not(.img-reveal img), section .rounded:not(.img-reveal img)'
    ).forEach(img => {
        const parent = img.parentElement;
        if (parent && !parent.classList.contains('img-reveal') && !parent.classList.contains('custom-card') && !parent.classList.contains('navbar-brand')) {
            parent.classList.add('img-reveal');
        }
    });

    // ─────────────────────────────────────────────────────────
    // 11. BLOG ARTICLE STAGGER (run after IO triggered)
    // ─────────────────────────────────────────────────────────
    // The rules above handle blog-article-body p/h2/h3 already.
    // This ensures items that haven't had data-animate set get revealed immediately.
    const blogBody2 = document.querySelector('.blog-article-body');
    if (blogBody2 && !reduced) {
        const bObs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                blogBody2.querySelectorAll('[data-animate]').forEach((el, i) => {
                    setTimeout(() => el.classList.add('is-visible'), i * 55);
                });
                bObs.unobserve(entry.target);
            });
        }, { threshold: 0.05 });
        bObs.observe(blogBody2);
    }

    // ─────────────────────────────────────────────────────────
    // 12. SIDEBAR IMAGE — wraps in img-reveal for hover zoom
    // ─────────────────────────────────────────────────────────
    document.querySelectorAll('.sidebar-card img').forEach(img => {
        if (!img.parentElement.classList.contains('img-reveal')) {
            const wrap = document.createElement('div');
            wrap.className = 'img-reveal';
            img.parentNode.insertBefore(wrap, img);
            wrap.appendChild(img);
        }
    });

    // ─────────────────────────────────────────────────────────
    // 13. FOOTER LIST ITEMS — stagger hover via class
    // ─────────────────────────────────────────────────────────
    document.querySelectorAll('footer ul.list-unstyled li').forEach((li, i) => {
        if (!reduced) {
            li.style.transitionDelay = (i * 0.05) + 's';
        }
    });

    // ─────────────────────────────────────────────────────────
    // 14. SMOOTH row/col section wrappers (about, packages)
    //     Left column → fade-right, Right column → fade-left
    //     SKIP columns that contain .blog-sidebar (position:sticky)
    // ─────────────────────────────────────────────────────────
    document.querySelectorAll('section .row.align-items-center').forEach(row => {
        if (row.closest('.hero-section') || row.closest('.navbar')) return;
        const cols = row.querySelectorAll(':scope > [class*="col-lg-"]');
        cols.forEach((col, i) => {
            // Skip sidebar column — position:sticky breaks with transform
            if (col.querySelector('.blog-sidebar') || col.closest('.blog-sidebar')) return;
            if (!col.hasAttribute('data-animate')) {
                col.setAttribute('data-animate', i % 2 === 0 ? 'fade-right' : 'fade-left');
                col.setAttribute('data-duration', '900');
                if (i > 0) col.setAttribute('data-delay', '200');
            }
        });
    });

    // Final re-observe sweep for anything added late
    if (!reduced) {
        setTimeout(() => {
            const io2 = new IntersectionObserver(entries => {
                entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io2.unobserve(e.target); } });
            }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
            document.querySelectorAll('[data-animate]:not(.is-visible)').forEach(el => io2.observe(el));
        }, 600);
    }

});
