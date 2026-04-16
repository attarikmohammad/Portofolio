/* ============================================
   script.js — Attarik Mohammad Portfolio
   ============================================ */

// ==================
// Particles Canvas
// ==================
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 1.5 + 0.5;
            this.alpha = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(102, 126, 234, ${this.alpha})`;
            ctx.fill();
        }
    }

    function createParticles(count = 80) {
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(102, 126, 234, ${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        animationId = requestAnimationFrame(animate);
    }

    resize();
    createParticles();
    animate();
    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        resize();
        animate();
    });
})();


// ==================
// Navbar Scroll
// ==================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active nav link highlight
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
    const scrollY = window.scrollY;
    sections.forEach(section => {
        const top = section.offsetTop - 100;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
            if (scrollY >= top && scrollY < bottom) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}
window.addEventListener('scroll', highlightNav);


// ==================
// Mobile Menu
// ==================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const navOverlay = document.getElementById('nav-overlay');

function toggleMenu() {
    mobileMenu.classList.toggle('open');
    navOverlay.classList.toggle('open');
}
hamburger.addEventListener('click', toggleMenu);
navOverlay.addEventListener('click', toggleMenu);
document.querySelectorAll('.mobile-menu a').forEach(a => {
    a.addEventListener('click', toggleMenu);
});


// ==================
// Animated Stats Counter
// ==================
function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
        start += step;
        if (start >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(start);
        }
    }, 16);
}

function initCounters() {
    const counters = document.querySelectorAll('.stat-num[data-target]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        animateCounter(counter, target);
    });
}

// Trigger counters when hero section is visible
const heroSection = document.querySelector('.hero');
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            initCounters();
            heroObserver.disconnect();
        }
    });
}, { threshold: 0.5 });
if (heroSection) heroObserver.observe(heroSection);


// ==================
// Animate on Scroll
// ==================
const animatables = document.querySelectorAll('.animate-on-scroll');
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Staggered delay based on index within parent
            const siblings = [...entry.target.parentElement.querySelectorAll('.animate-on-scroll')];
            const delay = siblings.indexOf(entry.target) * 100;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
            scrollObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
animatables.forEach(el => scrollObserver.observe(el));


// ==================
// Skill Bars Animation
// ==================
const skillBarFills = document.querySelectorAll('.skill-bar-fill');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fills = entry.target.querySelectorAll('.skill-bar-fill');
            fills.forEach(fill => {
                const width = fill.getAttribute('data-width');
                setTimeout(() => { fill.style.width = width + '%'; }, 200);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });
const skillBarsContainer = document.querySelector('.skill-bars-container');
if (skillBarsContainer) skillObserver.observe(skillBarsContainer);


// ==================
// Project Result Bars Animation
// ==================
const projectResultObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fills = entry.target.querySelectorAll('.p-result-fill');
            fills.forEach((fill, i) => {
                const width = fill.getAttribute('data-width');
                setTimeout(() => {
                    fill.style.width = width + '%';
                }, i * 150 + 200);
            });
            projectResultObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const projectCard = document.getElementById('project-paper-all');
if (projectCard) projectResultObserver.observe(projectCard);


// ==================
// Avatar Fallback
// ==================
const avatarImg = document.getElementById('avatar-img');
if (avatarImg) {
    avatarImg.onerror = () => {
        avatarImg.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=Attarik&hairColor=2c1b18&skinColor=ae5d29&backgroundColor=b6e3f4`;
    };
}
const cvPhoto = document.querySelector('.cv-photo');
if (cvPhoto) {
    cvPhoto.onerror = () => {
        cvPhoto.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=Attarik&hairColor=2c1b18&skinColor=ae5d29&backgroundColor=b6e3f4`;
    };
}


// ==================
// Print / Save PDF
// ==================
document.getElementById('btn-print')?.addEventListener('click', () => {
    window.print();
});


// ==================
// Smooth scroll for all anchor links
// ==================
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


// ==================
// Typing Effect for Hero Subtitle
// ==================
(function typeEffect() {
    const roles = [
        "Data Analyst",
        "Machine Learning Enthusiast",
        "Math Graduate"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const staticText = "Fresh Graduate Matematika · ";

    function type() {
        const currentRole = roles[roleIndex];
        const displayText = isDeleting
            ? currentRole.substring(0, charIndex - 1)
            : currentRole.substring(0, charIndex + 1);

        subtitle.innerHTML = `${staticText}<strong>${displayText}</strong>`;
        charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

        let speed = isDeleting ? 60 : 90;

        if (!isDeleting && charIndex === currentRole.length) {
            speed = 1800;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 300;
        }
        setTimeout(type, speed);
    }
    setTimeout(type, 1200);
})();
