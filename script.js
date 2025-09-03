/**
 * Main JavaScript file for the portfolio website.
 * Handles animations and interactive elements.
 */

// ==================================================
// 1. Preloader Logic
// Hides the preloader once the entire page (including images) is fully loaded.
// ==================================================
const preloader = document.getElementById('preloader');
window.addEventListener('load', () => {
    if (preloader) {
        preloader.classList.add('hidden');
    }
});

// ==================================================
// 2. Back to Top Button Logic
// Shows the button when the user scrolls down 300px from the top.
// ==================================================
const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if (backToTopBtn) {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
});


// ==================================================
// 3. Main Logic After DOM Content is Loaded
// This runs after the initial HTML document has been completely loaded and parsed.
// ==================================================
document.addEventListener('DOMContentLoaded', function () {

    // --- Hamburger Menu & Dropdown Logic ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    const dropdown = document.querySelector('.dropdown');
    const connectLink = document.querySelector('.connect-link');
    const dropdownContent = document.querySelector('.dropdown-content');

    // Hamburger Menu Toggle
    if (hamburger && navLinks) {
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

    // Clickable Dropdown Menu ("Follow Me")
    if (dropdown && connectLink && dropdownContent) {
        connectLink.addEventListener('click', function (event) {
            event.preventDefault();
            dropdownContent.classList.toggle('active');
        });

        // Close dropdown if clicking outside of it (for desktop)
        window.addEventListener('click', function (event) {
            if (!dropdown.contains(event.target)) {
                dropdownContent.classList.remove('active');
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
    const sections = document.querySelectorAll('section[id]');
    const navLi = document.querySelectorAll('nav .nav-links li a');
    const observerOptions = { rootMargin: '-50% 0px -50% 0px' };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLi.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(sec => {
        sectionObserver.observe(sec);
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