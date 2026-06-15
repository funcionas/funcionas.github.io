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
})();
