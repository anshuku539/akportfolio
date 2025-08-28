// ==================================================
//               1. Preloader Logic
// ==================================================
const preloader = document.getElementById('preloader');
window.addEventListener('load', () => {
    preloader.classList.add('hidden');
});

// ==================================================
//             2. Back to Top Button Logic
// ==================================================
const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        if(backToTopBtn) backToTopBtn.classList.add('visible');
    } else {
        if(backToTopBtn) backToTopBtn.classList.remove('visible');
    }
});


// ==================================================
//     3. Main Logic After DOM Content is Loaded
// ==================================================
document.addEventListener('DOMContentLoaded', function() {

    // --- Fade-in on Scroll ---
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };
    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);
    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- Typing Animation ---
    const typingTextElement = document.getElementById('typing-text');
    if (typingTextElement) {
        const phrases = ["Hi, I'm Anshu", "I'm a Web Developer"];
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
        setTimeout(typeEffect, 1500);
    }

    // --- Spotlight & Shine Effect for Credentials ---
    document.querySelectorAll('.credential-item').forEach(item => {
        item.addEventListener('mousemove', e => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            item.style.setProperty('--mouse-x', `${x}px`);
            item.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- Hamburger Menu Toggle ---
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    if(hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- Functional Contact Form ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
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

});