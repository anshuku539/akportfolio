
// 1. Preloader Logic
// Hides the preloader once the entire page is fully loaded.

const preloader = document.getElementById('preloader');
window.addEventListener('load', () => {
    if (preloader) {
        preloader.classList.add('hidden');
    }
});

// 2. Main Logic After DOM Content is Loaded
// This runs after the initial HTML document has been completely loaded and parsed.
document.addEventListener('DOMContentLoaded', function () {

    // --- Header Navigation Logic (Hamburger & Dropdown) ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    // This block now handles all menu-related logic safely.
    if (hamburger && navLinks) {
        // Hamburger icon click to toggle mobile menu
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when a regular link is clicked
        const allNavLinks = navLinks.querySelectorAll('a');
        allNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (!link.classList.contains('connect-link')) {
                    navLinks.classList.remove('active');
                }
            });
        });

        // Close mobile menu when clicking outside of it
        document.addEventListener('click', function (event) {
            const isClickInsideMenu = navLinks.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            if (navLinks.classList.contains('active') && !isClickInsideMenu && !isClickOnHamburger) {
                navLinks.classList.remove('active');
            }
        });
    }

    // --- Typing Animation (Hero Section) ---
    const typingTextElement = document.getElementById('typing-text');
    if (typingTextElement) {
        const phrases = ["Fullstack Developer", "Tech Enthusiast"];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                }
            } else {
                typingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === currentPhrase.length) {
                    isDeleting = true;
                    setTimeout(typeEffect, 2000);
                    return;
                }
            }
            const typingSpeed = isDeleting ? 100 : 100;
            setTimeout(typeEffect, typingSpeed);
        }

        isDeleting = true;
        charIndex = phrases[0].length;
        setTimeout(typeEffect, 2000);
    }

    // --- Fade-in on Scroll (for sections) ---
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };
    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);
    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- Active Nav Link Highlighting on Scroll ---
    const allNavLinks = document.querySelectorAll('nav .nav-links li a');
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    allNavLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active-link');
        }
    });

    // --- Functional Contact Form ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const form = e.target;
            const data = new FormData(form);

            fetch(form.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    formStatus.innerHTML = "Thanks for your message! I'll get back to you soon.";
                    formStatus.style.color = 'var(--primary-color)';
                    form.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            formStatus.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            formStatus.innerHTML = "Oops! There was a problem submitting your form.";
                        }
                        formStatus.style.color = 'red';
                    })
                }
            }).catch(error => {
                formStatus.innerHTML = "Oops! There was a problem submitting your form.";
                formStatus.style.color = 'red';
            });
        });
    }
});