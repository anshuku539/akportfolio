
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
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    // ========== Navigation Menu Logic ==========
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

    // ========== Scroll to Top Button ==========
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========== Theme Toggle ==========
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'light') {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        });
    }

    // ========== Stats Counter Animation ==========
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 20);
    }

    // ========== Skill Bar Animation ==========
    const skillBars = document.querySelectorAll('.skill-progress-fill');
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                entry.target.style.width = progress + '%';
                entry.target.classList.add('animate');
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillsObserver.observe(bar));

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
    // --- Functional Contact Form (JSON Fix) ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const form = e.target;
            
            // 1. Data ko FormData se nikaal kar JSON Object banao
            const data = new FormData(form);
            const object = Object.fromEntries(data);
            const json = JSON.stringify(object);

            formStatus.innerHTML = "Sending...";
            formStatus.style.color = 'var(--text-color)';

            fetch(form.action, {
                method: 'POST',
                // 2. Ab hum JSON string bhej rahe hain
                body: json, 
                headers: { 
                    'Content-Type': 'application/json', // Server ko batao ye JSON hai
                    'Accept': 'application/json' 
                }
            })
            .then(response => {
                if (response.ok) {
                    formStatus.innerHTML = "Thanks! Message sent successfully.";
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
                    });
                }
            })
            .catch(error => {
                console.error("Error:", error);
                formStatus.innerHTML = "Oops! Connection failed. Check internet.";
                formStatus.style.color = 'red';
            });
        });
    }
});