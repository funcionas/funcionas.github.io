(function () {
    function initModal(modalId, openTriggers) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const closeEls = modal.querySelectorAll('[data-modal-close]');

        function openModal() {
            document.querySelectorAll('.modal.is-open').forEach(function (m) {
                m.classList.remove('is-open');
                m.setAttribute('aria-hidden', 'true');
            });
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
        }

        function closeModal() {
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            if (!document.querySelector('.modal.is-open')) {
                document.body.classList.remove('modal-open');
            }
        }

        openTriggers.forEach(function (trigger) {
            trigger.addEventListener('click', function (e) {
                e.preventDefault();
                openModal();
            });
        });

        closeEls.forEach(function (el) {
            el.addEventListener('click', closeModal);
        });

        return { closeModal: closeModal };
    }

    initModal('demo-modal', [document.getElementById('open-demo')]);

    // Card "Aprendé cómo" links — open demo modal at a specific slide
    document.querySelectorAll('.card-demo-link').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var slideIndex = parseInt(link.dataset.slide, 10) || 0;
            // Store target slide so the slider can pick it up on open
            document.getElementById('demo-modal').dataset.targetSlide = slideIndex;
            // Re-use the existing open-demo trigger flow
            document.getElementById('open-demo').click();
        });
    });

    initModal('contact-modal', document.querySelectorAll('.open-contact'));

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.is-open').forEach(function (modal) {
                modal.classList.remove('is-open');
                modal.setAttribute('aria-hidden', 'true');
            });
            document.body.classList.remove('modal-open');
        }
    });

    const contactModal = document.getElementById('contact-modal');
    const contactForm = document.getElementById('contact-form');
    const contactFormWrap = document.getElementById('contact-form-wrap');
    const contactSuccess = document.getElementById('contact-success');
    const submitBtn = contactForm.querySelector('.btn-submit');

    function resetContactForm() {
        contactFormWrap.hidden = false;
        contactSuccess.hidden = true;
        contactForm.reset();
    }

    document.querySelectorAll('.open-contact').forEach(function (trigger) {
        trigger.addEventListener('click', resetContactForm);
    });

    contactModal.querySelectorAll('[data-modal-close]').forEach(function (el) {
        el.addEventListener('click', resetContactForm);
    });

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
        })
        .then(function (res) {
            if (!res.ok) throw new Error();
            contactFormWrap.hidden = true;
            contactSuccess.hidden = false;
            contactForm.reset();
        })
        .catch(function () {
            alert('No pudimos enviar el formulario. Escribinos a hola@funcionas.com.ar');
        })
        .finally(function () {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Enviar solicitud <span class="material-icons">send</span>';
        });
    });

    // Mobile hamburger menu / drawer
    const hamburger = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const drawerBackdrop = document.getElementById('mobile-drawer-backdrop');
    const drawerClose = document.getElementById('mobile-drawer-close');

    function openMobileMenu() {
        mobileMenu.classList.add('is-open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.querySelector('.material-icons').textContent = 'close';
        document.body.classList.add('modal-open');
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('is-open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.querySelector('.material-icons').textContent = 'menu';
        document.body.classList.remove('modal-open');
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function () {
            mobileMenu.classList.contains('is-open') ? closeMobileMenu() : openMobileMenu();
        });

        if (drawerClose) drawerClose.addEventListener('click', closeMobileMenu);
        if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMobileMenu);

        // Close when a nav link is clicked
        mobileMenu.querySelectorAll('.mobile-menu-link').forEach(function (link) {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
                closeMobileMenu();
            }
        });
    }

    // Sticky Header Scroll Listener
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Back to Top Button Listener
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    // Demo Slider
    (function () {
        const track = document.getElementById('demo-slider-track');
        const dotsContainer = document.getElementById('demo-dots');
        const caption = document.getElementById('demo-caption');
        const prevBtn = document.getElementById('demo-prev');
        const nextBtn = document.getElementById('demo-next');

        if (!track) return;

        const slides = Array.from(track.querySelectorAll('.demo-slide'));
        const total = slides.length;
        let current = 0;

        // Build dots
        slides.forEach(function (slide, i) {
            const dot = document.createElement('button');
            dot.className = 'demo-dot' + (i === 0 ? ' is-active' : '');
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', 'Slide ' + (i + 1));
            dot.addEventListener('click', function () { goTo(i); });
            dotsContainer.appendChild(dot);
        });

        function getDots() {
            return Array.from(dotsContainer.querySelectorAll('.demo-dot'));
        }

        function goTo(index) {
            current = index;
            track.style.transform = 'translateX(-' + (current * 100) + '%)';

            getDots().forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === current);
            });

            caption.textContent = slides[current].dataset.caption || '';

            prevBtn.disabled = current === 0;
            nextBtn.disabled = current === total - 1;
        }

        prevBtn.addEventListener('click', function () { if (current > 0) goTo(current - 1); });
        nextBtn.addEventListener('click', function () { if (current < total - 1) goTo(current + 1); });

        // Touch / swipe support
        var touchStartX = 0;
        var touchDeltaX = 0;
        var isDragging = false;

        track.addEventListener('touchstart', function (e) {
            touchStartX = e.touches[0].clientX;
            touchDeltaX = 0;
            isDragging = true;
            // Pause transition while dragging for live-follow feel
            track.style.transition = 'none';
        }, { passive: true });

        track.addEventListener('touchmove', function (e) {
            if (!isDragging) return;
            touchDeltaX = e.touches[0].clientX - touchStartX;
            var base = -(current * 100);
            var offset = (touchDeltaX / track.offsetWidth) * 100;
            // Add resistance at the edges
            if ((current === 0 && touchDeltaX > 0) || (current === total - 1 && touchDeltaX < 0)) {
                offset = offset * 0.25;
            }
            track.style.transform = 'translateX(' + (base + offset) + '%)';
        }, { passive: true });

        track.addEventListener('touchend', function () {
            if (!isDragging) return;
            isDragging = false;
            track.style.transition = '';

            var threshold = track.offsetWidth * 0.2; // 20% of width to trigger slide
            if (touchDeltaX < -threshold && current < total - 1) {
                goTo(current + 1);
            } else if (touchDeltaX > threshold && current > 0) {
                goTo(current - 1);
            } else {
                goTo(current); // snap back
            }
        });

        // Reset / jump to target slide when modal opens
        const demoModal = document.getElementById('demo-modal');
        if (demoModal) {
            new MutationObserver(function () {
                if (demoModal.classList.contains('is-open')) {
                    var target = parseInt(demoModal.dataset.targetSlide, 10);
                    goTo(isNaN(target) ? 0 : target);
                    delete demoModal.dataset.targetSlide;
                }
            }).observe(demoModal, { attributes: true, attributeFilter: ['class'] });
        }

        goTo(0);
    }());

})();
